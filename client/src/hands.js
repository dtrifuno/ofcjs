import { flush5, unique5, rest5, unique3, rest3 } from "./createHandRatings";
import Card from "./card";

class FastHandEvaluator {
  constructor() {
    this.flush5 = flush5;
    this.unique5 = unique5;
    this.rest5 = rest5;
    this.unique3 = unique3;
    this.rest3 = rest3;
  }

  rank(handNums) {
    if (handNums.length === 5) return this.rank5(handNums);
    if (handNums.length === 3) return this.rank3(handNums);
    return undefined;
  }

  rank5(handNums) {
    const isFlush = handNums.reduce((x, y) => x & y, 0xf000);
    const distinctQ = handNums.reduce((x, y) => x | y, 0) >> 16;
    if (isFlush) return this.flush5[distinctQ];
    const uniqueVal = this.unique5[distinctQ];
    if (uniqueVal) return uniqueVal;

    const multiplesQ = handNums.map(x => x & 0xff).reduce((x, y) => x * y, 1);
    return this.rest5[multiplesQ];
  }

  rank3(handNums) {
    console.log(handNums);
    console.log(handNums.map(x => Card.fromNumber(x)));

    const distinctQ = handNums.reduce((x, y) => x | y, 0) >> 16;
    const uniqueVal = this.unique3[distinctQ];
    if (uniqueVal) return uniqueVal;

    const multiplesQ = handNums.map(x => x & 0xff).reduce((x, y) => x * y, 1);
    console.log(multiplesQ);
    return this.rest3[multiplesQ];
  }

  rank3FromString(string) {
    return this.rank3(
      string.split("").map(x => Card.fromString(x + "s").toNumber())
    );
  }

  rank5FromString(string, { suited = false } = {}) {
    if (suited) {
      return this.rank5(
        string.split("").map(x => Card.fromString(x + "s").toNumber())
      );
    } else {
      const cardStrings = string.split().map(x => x + "s");
      cardStrings[0] = cardStrings[0][0] + "h";
      this.rank5(cardStrings.map(x => Card.fromString(x).toNumber()));
    }
  }
}

class HandEvaluator {
  constructor() {
    this.fhe = new FastHandEvaluator();
  }

  rank(hand) {
    return this.fhe.rank(hand.map(x => x.toNumber()));
  }
}

export { HandEvaluator, FastHandEvaluator };

const he = new HandEvaluator();

const sflush = ["As", "Ts", "Ks", "Qs", "Js"];
console.log(
  "Straight Flush",
  sflush,
  he.rank(sflush.map(x => Card.fromString(x)))
);

const flush = ["As", "5s", "3s", "Ts", "8s"];
console.log("Flush", flush, he.rank(flush.map(x => Card.fromString(x))));

const twoPair = ["As", "Ac", "5s", "5h", "8s"];
console.log("Two Pair", twoPair, he.rank(twoPair.map(x => Card.fromString(x))));

const deuce = ["7s", "5c", "4s", "3h", "2s"];
console.log("Deuce-Seven", deuce, he.rank(deuce.map(x => Card.fromString(x))));
