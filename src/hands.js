import { flush5, unique5, rest5, unique3, rest3 } from "./createHandRatings";
import { Card } from "./card";

class FastHandEvaluator {
  constructor() {
    this.flush5 = flush5;
    this.unique5 = unique5;
    this.rest5 = rest5;
    this.unique3 = unique3;
    this.rest3 = rest3;
  }

  score(handNums) {
    if (handNums.length === 5) return this.score5(handNums);
    if (handNums.length === 3) return this.score3(handNums);
    return undefined;
  }

  score5(handNums) {
    const isFlush = handNums.reduce((x, y) => x & y, 0xf000);
    const distinctQ = handNums.reduce((x, y) => x | y, 0) >> 16;
    if (isFlush) return this.flush5[distinctQ];
    const uniqueVal = this.unique5[distinctQ];
    if (uniqueVal) return uniqueVal;

    const multiplesQ = handNums.map(x => x & 0xff).reduce((x, y) => x * y);
    return this.rest5[multiplesQ];
  }

  score3(handNums) {
    const distinctQ = handNums.reduce((x, y) => x | y, 0) >> 16;
    const uniqueVal = this.unique3[distinctQ];
    if (uniqueVal) return uniqueVal;
    const multiplesQ = handNums.map(x => x & 0xff).reduce((x, y) => x * y);
    return this.rest3[multiplesQ];
  }
}

class HandEvaluator {
  constructor() {
    this.fhe = new FastHandEvaluator();
  }

  score(hand) {
    return this.fhe.score(hand.map(x => x.toNumber()));
  }
}

export default { HandEvaluator, FastHandEvaluator };

const he = new HandEvaluator();

const sflush = ["As", "Ts", "Ks", "Qs", "Js"];
console.log(
  "Straight Flush",
  sflush,
  he.score(sflush.map(x => Card.fromString(x)))
);

const flush = ["As", "5s", "3s", "Ts", "8s"];
console.log("Flush", flush, he.score(flush.map(x => Card.fromString(x))));

const twoPair = ["As", "Ac", "5s", "5h", "8s"];
console.log(
  "Two Pair",
  twoPair,
  he.score(twoPair.map(x => Card.fromString(x)))
);

const deuce = ["7s", "5c", "4s", "3h", "2s"];
console.log("Deuce-Seven", deuce, he.score(deuce.map(x => Card.fromString(x))));
