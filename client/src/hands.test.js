import { FastHandEvaluator } from "./hands";
import { Card } from "../../src/card";

const stringToNum = x => Card.fromString(x).toNumber();

const fhe = new FastHandEvaluator();

test("AAK", () => {
  const hand = ["As", "Ac", "Kh"].map(stringToNum);
  expect(fhe.rank3(hand)).toBe(4082);
});

test("AAA", () => {
  const hand = ["As", "Ad", "Ah"].map(stringToNum);
  expect(fhe.rank3(hand)).toBe(4082);
});

test("542", () => {
  const hand = ["5s", "4s", "2h"].map(stringToNum);
  expect(fhe.rank3(hand)).toBe(4082);
});
