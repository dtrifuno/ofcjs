import Card from "./card.js";

let rank = 7462;
const flush5 = Array(7809).fill(null);
const unique5 = Array(3968).fill(null);
const rest5 = {};

const unique3 = Array(7169).fill(null);
const rest3 = {};

export { flush5, unique5, rest5, unique3, rest3 };

function checkStraight(hand) {
  const xs = hand.sort((a, b) => a - b);
  if (
    xs[0] + 1 === xs[1] &&
    xs[1] + 1 === xs[2] &&
    xs[2] + 1 === xs[3] &&
    xs[3] + 1 === xs[4]
  ) {
    return true;
  }

  if (
    xs[0] === 0 &&
    xs[1] === 1 &&
    xs[2] === 2 &&
    xs[3] === 3 &&
    xs[4] === 12
  ) {
    return true;
  }

  return false;
}

function evaluateUniques(hand) {
  const numbers = hand.map(x => x.toNumber());
  return numbers.reduce((x, y) => x | y, 0) >> 16;
}

function evaluateDifferent(hand) {
  const numbers = hand.map(x => x.toNumber());
  return numbers.map(x => x & 0xff).reduce((x, y) => x * y, 1);
}

// Straight Flush (A to 6 high)
for (let i = 12; i >= 4; i--) {
  const hand = [i, i - 1, i - 2, i - 3, i - 4].map(x => new Card(x, 0));
  const val = evaluateUniques(hand);
  flush5[val] = rank--;
}

// Straight Flush (Steel Wheel)
{
  const hand = [12, 0, 2, 3, 4].map(x => new Card(x, 0));
  const val = evaluateUniques(hand);
  flush5[val] = rank--;
}

// Quads
for (let i = 12; i >= 0; i--) {
  for (let j = 12; j >= 0; j--) {
    if (i === j) continue;
    const hand = [i, i, i, i, j].map(x => new Card(x, 0));
    const val = evaluateDifferent(hand);
    rest5[val] = rank--;
  }
}

// Full Houses
for (let i = 12; i >= 0; i--) {
  for (let j = 12; j >= 0; j--) {
    if (i === j) continue;
    const hand = [i, i, i, j, j].map(x => new Card(x, 0));
    const val = evaluateDifferent(hand);
    rest5[val] = rank--;
  }
}

// Flushes
for (let i = 12; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    for (let k = j - 1; k >= 0; k--) {
      for (let l = k - 1; l >= 0; l--) {
        for (let z = l - 1; z >= 0; z--) {
          const arr = [i, j, k, l, z];
          if (checkStraight(arr)) continue;
          const hand = [i, j, k, l, z].map(x => new Card(x, 0));
          const val = evaluateUniques(hand);
          flush5[val] = rank--;
        }
      }
    }
  }
}

// Straights (A to 6 high)
for (let i = 12; i >= 4; i--) {
  const hand = [i, i - 1, i - 2, i - 3, i - 4].map(x => new Card(x, 0));
  const val = evaluateUniques(hand);
  unique5[val] = rank--;
}

// Straight (Wheel)
{
  const hand = [12, 0, 2, 3, 4].map(x => new Card(x, 0));
  const val = evaluateUniques(hand);
  unique5[val] = rank--;
}

// Three-of-a-Kind
for (let i = 12; i >= 0; i--) {
  for (let j = 12; j >= 0; j--) {
    if (i === j) continue;
    for (let k = j - 1; k >= 0; k--) {
      if (i === k) continue;
      const hand = [i, i, i, j, k].map(x => new Card(x, 0));
      const val = evaluateDifferent(hand);
      rest5[val] = rank--;
    }
  }
  const hand3 = [i, i, i].map(x => new Card(x, 0));
  const val = evaluateDifferent(hand3);
  rest3[val] = rank;
}

// Two Pairs
for (let i = 12; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    for (let k = 12; k >= 0; k--) {
      if (i === k || j === k) continue;
      const hand = [i, i, j, j, k].map(x => new Card(x, 0));
      const val = evaluateDifferent(hand);
      rest5[val] = rank--;
    }
  }
}

// Pairs
for (let i = 12; i >= 0; i--) {
  for (let j = 12; j >= 0; j--) {
    for (let k = j - 1; k >= 0; k--) {
      for (let l = k - 1; l >= 0; l--) {
        if (i === j || i === k || i === l) continue;
        const hand = [i, i, j, k, l].map(x => new Card(x, 0));
        const val = evaluateDifferent(hand);
        rest5[val] = rank--;
      }
    }
    const hand3 = [i, i, j].map(x => new Card(x, 0));
    const val = evaluateDifferent(hand3);
    rest3[val] = rank;
  }
}

// High Card
for (let i = 12; i >= 0; i--) {
  for (let j = i - 1; j >= 0; j--) {
    for (let k = j - 1; k >= 0; k--) {
      for (let l = k - 1; l >= 0; l--) {
        for (let z = l - 1; z >= 0; z--) {
          const arr = [i, j, k, l, z];
          if (checkStraight(arr)) continue;
          const hand = [i, j, k, l, z].map(x => new Card(x, 0));
          const val = evaluateUniques(hand);
          unique5[val] = rank--;
        }
      }
      const hand3 = [i, j, k].map(x => new Card(x, 0));
      const val = evaluateUniques(hand3);
      unique3[val] = rank;
    }
  }
}
