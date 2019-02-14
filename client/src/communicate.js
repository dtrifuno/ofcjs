import io from "socket.io-client";

import Card from "./card";
import { playerState, opponentState, sstate } from "./containers";

class Handler {
  constructor() {
    this.player = playerState;
    this.opponent = opponentState;
    this.socket = null;
    this.gameID = null;
  }

  handle(data) {
    console.log("Handling...");
    console.log(data);
    if (data.msg === "gameStart") {
      const [playerChips, opponentName, opponentChips] = data.payload;
      this.handleGameStart(playerChips, opponentName, opponentChips);
    } else if (data.msg === "deal") {
      const xs = data.payload.map(([i, c]) => [i, Card.fromString(c)]);
      this.player.handleDeal(xs);
    } else if (data.msg === "oppoDeal") {
      const xs = data.payload.map(([i, c]) => [i, Card.fromString(c)]);
      this.opponent.handleDeal(xs);
    } else if (data.msg === "oppoSet") {
      const { payload } = data;
      payload[3] = Card.fromString(payload[3]);
      this.opponent.move(...data.payload);
    } else if (data.msg === "newGame") {
      this.handleNewGame();
    } else if (data.msg === "terminate") {
      const reason = data.payload;
      alert(reason);
    } else if (data.msg === "roundEnd") {
      const table = data.payload;
      this.player.setChips(table[this.player.state.name]);
      this.opponent.setChips(table[this.opponent.state.name]);
      sstate.setTable(data.payload);
      sstate.showEndOfRound();
    } else if (data.msg === "gameEnd") {
      alert("game end");
    } else {
      alert(`Unrecognized message:\n\n ${data}`);
    }
  }

  handleGameStart(playerChips, opponentName, opponentChips) {
    this.player.setChips(playerChips);
    this.opponent.setName(opponentName);
    this.opponent.setChips(opponentChips);
    this.handleNewGame();
  }

  handleNewGame() {
    this.player.resetCards();
    this.opponent.resetCards();
    sstate.showGameScreen();
  }

  set(fromIdx, toRow, toIdx) {
    this.socket.emit(this.gameID, {
      msg: "set",
      payload: [fromIdx, toRow, toIdx]
    });
  }

  joinGame(playerName, gameID) {
    this.connect();
    this.gameID = gameID;
    this.player.setName(playerName);
    this.socket.emit(this.gameID, {
      msg: "join",
      name: playerName
    });
  }

  createGame(playerName, gameID) {
    this.connect();
    this.gameID = gameID;
    this.socket.emit("createGame", { gameID, playerName });
    this.player.setName(playerName);
    this.opponent.setName("Waiting for opponent...");
  }

  connect() {
    this.socket = io.connect("localhost:3001");
    this.socket.on("reply", data => this.handle(data));
  }

  quit() {
    this.socket.emit(this.gameID, { msg: "quit" });
    this.socket.disconnect();
  }

  continue() {
    this.socket.emit(this.gameID, { msg: "continue" });
  }
}

const handler = new Handler();

export default handler;
