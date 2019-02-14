class Card {
  constructor(rankNum, suitNum) {
    // 0 = Deuce, 1 = Three, ..., 11 = King, 12 = Ace
    this.rankNum = rankNum;
    // 0 = Spades, 1 = Hearts, 2 = Diamonds, 3 = Clubs
    this.suitNum = suitNum;
  }

  eq(otherCard) {
    return (
      this.rankNum === otherCard.rankNum && this.suitNum === otherCard.suitNum
    );
  }

  toNumber() {
    const prime = Card.prototype.toRankPrime[this.rankNum];
    return (
      (1 << (16 + this.rankNum)) +
      (1 << (12 + this.suitNum)) +
      (this.rankNum << 8) +
      prime
    );
  }

  toString() {
    return (
      Card.prototype.fromRankNum[this.rankNum] +
      Card.prototype.fromSuitNum[this.suitNum]
    );
  }

  static fromNumber(num) {
    const rank = (num >> 8) & 0xf;
    // eslint-disable-next-line no-bitwise
    const suit = Card.prototype.toSuitNum.get((num >> 12) & 0xf);
    return new Card(rank, suit);
  }

  static fromString(string) {
    if (!string) return null;
    const [rankChar, suitChar] = string;
    let rankNum, suitNum;
    switch (rankChar) {
      case "A":
        rankNum = 12;
        break;
      case "K":
        rankNum = 11;
        break;
      case "Q":
        rankNum = 10;
        break;
      case "J":
        rankNum = 9;
        break;
      case "T":
        rankNum = 8;
        break;
      default:
        if (rankChar > "1" && rankChar <= "9") {
          rankNum = rankChar.codePointAt(0) - "2".codePointAt(0);
        }
    }

    switch (suitChar) {
      case "s":
        suitNum = 0;
        break;
      case "h":
        suitNum = 1;
        break;
      case "d":
        suitNum = 2;
        break;
      case "c":
        suitNum = 3;
        break;
      default:
        break;
    }

    return new Card(rankNum, suitNum);
  }
}

Card.prototype.toRankPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41];

Card.prototype.fromRankNum = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A"
];

Card.prototype.toSuitNum = new Map([
  [0b1000, 3],
  [0b0100, 2],
  [0b0010, 1],
  [0b0001, 0]
]);

Card.prototype.fromSuitNum = ["s", "h", "d", "c"];

class Deck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  draw(n = 1) {
    return this.cards.splice(0, n);
  }

  shuffle() {
    const n = this.cards.length;
    for (let i = 0; i < n - 1; i++) {
      const j = Math.floor(Math.random() * (n - i)) + i;
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  reset() {
    this.cards = [];
    for (const suitNum of Array.from(Array(4).keys())) {
      this.cards = this.cards.concat(
        Array.from(Array(13).keys()).map(r => new Card(r, suitNum))
      );
    }
    this.shuffle();
  }
}

let c = new Card(10, 3);
console.log(c.toNumber());
console.log(Card.fromNumber(c.toNumber()).toString());
console.log(Card.fromString("As").toString());
console.log(JSON.stringify(Card.fromString("As")));
let d = new Deck();

export { Card, Deck };
