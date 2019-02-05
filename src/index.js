import "./card";

const socketToGameID = {};
const IDToGame = {};

`
const game = {
  player1: socket,
  player2: socket,
  player1_dealt: [cards],
  player2_dealt: [cards],
  button: player1 or player2,
  status: waiting or p1toact or p2toact
}
`;

class Game {
  constructor() {}
}

class Player {
  constructor() {
    this.front = [];
    this.middle = [];
    this.back = [];
    this.dealt = [];
  }

  getDealt(...xs) {
    for (let { index, card } of xs) {
      this.dealt[index] = card;
    }
  }

  set(...xs) {
    for (let { row, index, card } of xs) {
      if (this.dealt.filter(x => x.eq(card))) {
        this[row][index] = card;
        this.dealt.filter(x => !x.eq(card));
      } else {
        //TODO: Error
      }
    }
  }

  allRowsSet() {
    if (this.front.filter(x => x).length < 3) return false;
    if (this.middle.filter(x => x).length < 5) return false;
    if (this.back.filter(x => x).length < 5) return false;
    return true;
  }

  reset() {
    this.front = [];
    this.middle = [];
    this.back = [];
    this.dealt = [];
  }
}

[("createGame", "joinGame", "set", "continue")];
[("gameStart", "deal", "oppoSet", "reset", "gameEnd")];
