import io from "socket.io-client";

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
      const { yourChips, opponentName, opponentChips } = data.payload;
      this.handleGameStart(yourChips, opponentName, opponentChips);
    } else if (data.msg === "deal") {
      const xs = data.payload;
      this.player.handleDeal(xs);
    } else if (data.msg === "oppoDeal") {
      const xs = data.payload;
      this.opponent.handleDeal(xs);
    } else if (data.msg === "oppoSet") {
      this.opponent.move(...data.payload);
    } else if (data.msg === "newGame") {
      this.handleNewGame();
    } else if (data.msg === "terminate") {
      const reason = data.payload;
      alert(reason);
    } else if (data.msg === "roundEnd") {
      const table = data.payload;
      this.player.changeChips(table[this.player.state.name]);
      this.opponent.changeChips(table[this.opponent.state.name]);
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
      playerName
    });
  }

  createGame(playerName, gameID) {
    this.connect();
    this.gameID = gameID;
    this.socket.emit("joinGame", { gameID, playerName });
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
