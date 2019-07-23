const PokerEvaluator = require("poker-evaluator");
const { ranks } = require("./card.js");

const rows = ["front", "middle", "back"];

const evalHand = hand => PokerEvaluator.evalHand(hand);

function eval3Fix(hand) {
  // poker-evaluator is buggy and ranks A23 as a straight,
  // this function overrides that behaviour
  const results = evalHand(hand);
  if (results.handType !== 5) {
    return results;
  }

  // same rank as A6432
  return { handType: 1, handRank: 785, value: 4881, handName: "high card" };
}

class StandardOFCScorer {
  scoreGame(player1, player2) {
    let score = 0;
    const table = {};
    table.front = {};
    table.middle = {};
    table.back = {};

    const player1royalties = this.royalties(player1);
    const player2royalties = this.royalties(player2);
    for (const row of rows) {
      table[row][player1.name] = player1royalties[row];
      table[row][player2.name] = player2royalties[row];
    }

    if (this.hasFouled(player1) && this.hasFouled(player2)) {
      rows.forEach(row => {
        table[row].winner = "";
      });
      table[player1.name] = 0;
      table[player2.name] = 0;
    } else if (this.hasFouled(player1)) {
      rows.forEach(row => {
        table[row].winner = player2.name;
      });
      score = -6 - this.sumRoyalties(player2royalties);
      table.scooped = player2.name;
    } else if (this.hasFouled(player2)) {
      rows.forEach(row => {
        table[row].winner = player1.name;
      });
      score = 6 + this.sumRoyalties(player1royalties);
      table.scooped = player1.name;
    } else {
      // find winner of each row
      for (const row of rows) {
        let diff;
        if (row === "front") {
          diff = eval3Fix(player1[row]).value - eval3Fix(player2[row]).value;
        } else {
          diff = evalHand(player1[row]).value - evalHand(player2[row]).value;
        }
        if (diff > 0) {
          table[row].winner = player1.name;
          score += 1;
        } else if (diff < 0) {
          table[row].winner = player2.name;
          score -= 1;
        } else {
          table[row].winner = "";
        }
      }

      // double score in case of scoop
      if (score === 3) {
        score = 6;
        table.scooped = player1.name;
      } else if (score === -3) {
        score = -6;
        table.scooped = player2.name;
      }
    }

    score +=
      this.sumRoyalties(player1royalties) - this.sumRoyalties(player2royalties);
    table[player1.name] = score;
    player1.chips += score;
    table[player2.name] = -score;
    player2.chips -= score;
    return table;
  }

  sumRoyalties(royalty) {
    return royalty.front[1] + royalty.middle[1] + royalty.back[1];
  }

  royalties(player) {
    if (this.hasFouled(player)) {
      return {
        front: ["Fouled", 0],
        middle: ["Fouled", 0],
        back: ["Fouled", 0]
      };
    }

    return {
      front: this.royaltiesFront(player.front),
      middle: this.royaltiesMiddle(player.middle),
      back: this.royaltiesBack(player.back)
    };
  }

  royaltiesFront(hand) {
    const handValue = eval3Fix(hand).value;

    // no front royalties for less than sixes
    if (handValue < evalHand(["6h", "6s", "2c"]).value) {
      return ["<66", 0];
    }

    // high value pairs (except AAx)
    const pairRoyalties = ["6", "7", "8", "9", "T", "J", "Q", "K"];
    for (const [i, r] of pairRoyalties.entries()) {
      if (
        handValue >= evalHand([`${r}s`, `${r}d`, "2c"]).value &&
        handValue <= evalHand([`${r}s`, `${r}d`, "Ac"]).value
      ) {
        return [r + r, i + 1];
      }
    }

    // AAx
    if (
      handValue >= evalHand(["As", "Ah", "2c"]).value &&
      handValue <= evalHand(["Ac", "Ah", "Kd"]).value
    ) {
      return ["AA", 9];
    }

    // sets
    for (const [i, rank] of ranks.entries()) {
      const set = ["s", "c", "h"].map(suit => rank + suit);
      const setValue = evalHand(set).value;
      if (handValue === setValue) {
        return [rank + rank + rank, 10 + i];
      }
    }
    return ["<66", 0];
  }

  royaltiesMiddle(hand) {
    const { handType, handRank } = evalHand(hand);

    // no royalties for two pairs or worse
    if (handType === 1) {
      return ["High Card", 0];
    }

    if (handType === 2) {
      return ["Pair", 0];
    }

    if (handType === 3) {
      return ["Two Pair", 0];
    }

    // Set:	2
    if (handType === 4) {
      return ["Set", 2];
    }

    // Straight: 4
    if (handType === 5) {
      return ["Straight", 4];
    }

    // Flush:	8
    if (handType === 6) {
      return ["Flush", 8];
    }

    // Full House: 12
    if (handType === 7) {
      return ["Full House", 12];
    }

    // Four of a kind: 20
    if (handType === 8) {
      return ["Quads", 20];
    }

    // Straight flush: 30
    if (handType === 9 && handRank < 10) {
      return ["Straight Flush", 30];
    }

    // Royal flush:	50
    if (handType === 9 && handRank === 10) {
      return ["Royal Flush", 50];
    }

    return ["Invalid Hand", 0];
  }

  royaltiesBack(hand) {
    // no royalties for sets
    if (evalHand(hand).handType === 4) {
      return ["Set", 0];
    }

    // otherwise, half of royalty it would have gotten in the middle
    const middleRoyalty = this.royaltiesMiddle(hand);
    middleRoyalty[1] *= 0.5;
    return middleRoyalty;
  }

  hasFouled(player) {
    const { front, middle, back } = player;
    return (
      eval3Fix(front).value >= evalHand(middle).value ||
      evalHand(middle).value >= evalHand(back).value
    );
  }
}

const scorer = new StandardOFCScorer();

module.exports = scorer;
