import { Card, Deck } from "./card";
import { scorer } from "./standardRanker";
import io from "socket.io";

const runningGames = [];

class Player {
  constructor() {
    this.name = null;
    this.chips = 0;
    this.front = [];
    this.middle = [];
    this.back = [];
    this.dealt = [];
  }

  setName(name) {
    this.name = name;
  }

  setChips(chips) {
    this.chips = chips;
  }

  getDealt(xs) {
    this.dealt = [];
    for (let [index, card] of xs) {
      this.dealt[index] = card;
    }
  }

  set(fromIdx, toRow, toIdx) {
    if (!this.dealt[fromIdx] || this[toRow][toIdx]) {
      return false;
    }

    this[toRow][toIdx] = this.dealt[fromIdx];
    this.dealt[fromIdx] === null;
    return true;
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

  hasDealt() {
    return this.dealt.filter(x => x).length > 0;
  }
}

[("createGame", "joinGame", "set", "continue")];
[("gameStart", "deal", "oppoSet", "reset", "gameEnd")];

class GameHandler {
  constructor(socket, playerName, gameID) {
    this.gameID = gameID;

    this.player1 = new Player();
    this.player1.setName(playerName);
    this.player1.socket = socket;
    this.idToPlayer = {};
    this.idToPlayer[socket.id] = this.player1;
    this.idToOpponent = {};

    this.status = "wait";
    this.deck = new Deck();
  }

  handle(socket, data) {
    console.log(
      `Handler for ${this.gameID} needs to handle ${JSON.stringify(data)}.`
    );

    if (data.msg === "join") {
      this.handleJoin(socket, data);
    } else if (data.msg === "set") {
      this.handleSet(socket, data);
    }
  }

  gameStart() {
    console.log(
      `Sending gameStarts to ${this.player1.socket.id} and ${
        this.player2.socket.id
      }.`
    );

    this.player1.socket.emit("reply", {
      msg: "gameStart",
      payload: [0, this.player2.name, 0]
    });

    this.player2.socket.emit("reply", {
      msg: "gameStart",
      payload: [0, this.player1.name, 0]
    });

    // select a button
    const button = [this.player1, this.player2][Math.round(Math.random())];
    this.status = { playerToAct: button, moves: 5, action: "buttonDeal" };
    this.deal(button, 5);
  }

  handleJoin(socket, data) {
    console.log(`Handling join from ${socket.id}.`);
    // is game waiting for another player?
    if (this.status !== "wait") {
      console.log("Game already in progress.");
      this.terminate(
        socket,
        "You are attempting to join a game that is already in progress."
      );
      return;
    }

    // is player2's name different from player1?
    if (this.player1.name === data.name) {
      console.log(`Name ${data.name} is already taken.`);
      this.terminate(socket, "Name is already taken.");
      return;
    }

    console.log(Object.keys(this.idToPlayer));
    this.player2 = new Player();
    this.player2.setName(data.name);
    this.player2.socket = socket;
    this.idToPlayer[socket.id] = this.player2;
    console.log(Object.keys(this.idToPlayer));

    this.idToOpponent[socket.id] = this.player1;
    this.idToOpponent[this.player1.socket.id] = this.player2;

    this.gameStart();
  }

  handleSet(socket, data) {
    // check if waiting for card from player
    const player = this.idToPlayer[socket.id];
    const opponent = this.idToOpponent[socket.id];
    console.log(Object.keys(this.idToPlayer));
    console.log(this.status.playerToAct.socket.id);
    console.log(player.socket.id);
    if (this.status.playerToAct !== player) {
      this.terminate(
        socket,
        "A player made a move when it was not their turn."
      );
      return;
    }

    const [idxFrom, rowTo, idxTo] = data.payload;
    if (player.set(idxFrom, rowTo, idxTo)) {
      const card = player[rowTo][idxTo];
      opponent.socket.emit("reply", {
        msg: "oppoSet",
        payload: [idxFrom, rowTo, idxTo, card.toString()]
      });
      this.status.moves -= 1;
      this.next();
    } else {
      this.terminate(
        socket,
        "A player tried to set a card they weren't dealt."
      );
    }
  }

  handleGameEnd() {
    const table = scorer.scoreGame(this.player1, this.player2);

    this.player1.socket.emit("reply", {
      msg: "roundEnd",
      payload: table
    });

    this.player2.socket.emit("reply", {
      msg: "roundEnd",
      payload: table
    });
  }

  deal(player, n) {
    const cards = this.deck.draw(n).map((c, i) => [i, c]);
    const opponent = this.idToOpponent[player.socket.id];
    player.getDealt(cards);

    player.socket.emit("reply", {
      msg: "deal",
      payload: cards.map(([i, c]) => [i, c.toString()])
    });

    opponent.socket.emit("reply", {
      msg: "oppoDeal",
      payload: cards.map(([i, c]) => [i, c.toString()])
    });
  }

  //
  pineappleDeal(player, n) {}

  next() {
    const status = this.status;
    const currentID = status.playerToAct.socket.id;

    // check if player has more actions due
    if (status.moves > 0) {
      return;
    }

    // check if game is over
    if (this.player1.allRowsSet() && this.player2.allRowsSet()) {
      this.handleGameEnd();
      return;
    }

    const opponent = this.idToOpponent[currentID];
    if (status.action === "buttonDeal") {
      this.status = {
        playerToAct: opponent,
        action: "deal",
        moves: 5
      };
      this.deal(opponent, 5);
    } else if (status.action === "deal" || status.action === "set") {
      this.status = {
        playerToAct: opponent,
        action: "set",
        moves: 1
      };
      this.deal(opponent, 1);
    } else if (status.action === "pineappleSet") {
      return;
      // TODO
    }
  }

  terminate(socket, message) {
    socket.emit("reply", {
      msg: "terminate",
      payload: message
    });
  }
}

const wss = io(3001);

function handleCreateGame(socket, payload) {
  let { gameID, playerName } = payload;
  console.log(`got a create game from ${socket.id}: ${[playerName, gameID]}`);
  console.log(`HCG: ${socket.id}`);

  // check if both name and game ID are present
  if (!gameID || !playerName) {
    socket.emit("reply", {
      msg: "terminate",
      payload: "Invalid name or game ID."
    });
    return null;
  }

  // trim name and game ID
  playerName = playerName.substring(0, 20);
  gameID = gameID.substring(0, 20);

  // check if game ID is available
  // TODO

  const handler = new GameHandler(socket, playerName, gameID);
  console.log(`registering new handler for ${gameID}`);
  return handler;
}

wss.on("connection", socket => {
  console.log("connection!");

  for (let handler of runningGames) {
    socket.on(handler.gameID, data => handler.handle(socket, data));
  }

  socket.on("createGame", payload => {
    const handler = handleCreateGame(socket, payload);
    if (handler) {
      runningGames.push(handler);
      socket.on(handler.gameID, data => handler.handle(socket, data));
    }
  });
});
