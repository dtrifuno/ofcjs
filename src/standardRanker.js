import { Card } from "./card";
import PokerEvaluator from "poker-evaluator";

const evalHand = hand => PokerEvaluator.evalHand(hand);

const rows = ["front", "middle", "back"];

class StandardOFCScorer {
  scoreGame(player1, player2) {
    let score = 0;
    const table = {};
    table.front = {};
    table.middle = {};
    table.back = {};

    const player1royalties = this.royalties(player1);
    const player2royalties = this.royalties(player2);
    for (let row of rows) {
      table[row][player1.name] = player1royalties[row];
      table[row][player2.name] = player2royalties[row];
    }

    if (this.hasFouled(player1) && this.hasFouled(player2)) {
      rows.forEach(row => (table[row].winner = ""));
      table[player1.name] = 0;
      table[player2.name] = 0;
    } else if (this.hasFouled(player1)) {
      rows.forEach(row => (table[row].winner = player2.name));
      score = -6 - this.sumRoyalties(player2royalties);
      table.scooped = player2.name;
    } else if (this.hasFouled(player2)) {
      rows.forEach(row => (table[row].winner = player1.name));
      score = 6 + this.sumRoyalties(player1royalties);
      table.scooped = player1.name;
    } else {
      // find winner of each row
      for (let row of rows) {
        const diff =
          evalHand(player1[row].map(x => x.toString())).value -
          evalHand(player2[row].map(x => x.toString())).value;
        if (diff > 0) {
          table[row].winner = player1.name;
          score += 1;
        } else if (diff < 0) {
          table[row].winner = player1.name;
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
      this.sumRoyalties(player1royalties) + this.sumRoyalties(player2royalties);
    table[player1.name] = score;
    table[player2.name] = -score;
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
    const handRank = evalHand(hand.map(x => x.toString())).handRank;

    // no front royalties for less than sixes
    if (handRank > evalHand(["6h", "6s", "2c"]).handRank) {
      return ["<66x", 0];
    }

    // high value pairs (except AAx)
    const pairRoyalties = ["6", "7", "8", "9", "T", "J", "Q", "K"];
    for (let i = 0; i < pairRoyalties.length; i += 1) {
      const c = pairRoyalties[i];
      if (
        handRank <= evalHand([c + "s", c + "d", "2c"]).handRank &&
        handRank >= evalHand([c + "s", c + "d", "Ac"]).handRank
      ) {
        return [c + c + "x", 1 + i];
      }
    }

    // AAx
    if (
      handRank <= evalHand(["As", "Ah", "2c"]).handRank &&
      handRank >= evalHand(["Ac", "Ah", "Kd"]).handRank
    ) {
      return ["AAx", 9];
    }

    // sets
    for (let r = 0; r < 13; r += 1) {
      const [card1, card2, card3] = [
        new Card(r, 0),
        new Card(r, 1),
        new Card(r, 2)
      ];
      const setStrength = evalHand([card1, card2, card3].map(x => x.toString()))
        .handRank;
      if (handRank === setStrength) {
        const char = card1.toString()[0];
        return [char + char + char, 10 + r];
      }
    }
    return ["<66x", 0];
  }

  royaltiesMiddle(hand) {
    const { handType, handRank } = evalHand(hand.map(x => x.toString()));

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
  }

  royaltiesBack(hand) {
    const handType = evalHand(hand.map(x => x.toString())).handType;

    // no royalties for sets
    if (handType === 4) {
      return ["Set", 0];
    }

    // otherwise, half of royalty it would have gotten in the middle
    const middleRoyalty = this.royaltiesMiddle(hand);
    middleRoyalty[1] *= 0.5;
    return middleRoyalty;
  }

  hasFouled(player) {
    const front = player.front.map(x => x.toString());
    const middle = player.middle.map(x => x.toString());
    const back = player.back.map(x => x.toString());
    return (
      evalHand(front).value >= evalHand(middle).value ||
      evalHand(middle).value >= evalHand(back).value
    );
  }
}

const scorer = new StandardOFCScorer();
export { scorer };
