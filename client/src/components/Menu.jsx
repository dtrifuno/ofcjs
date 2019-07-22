import React, { Component } from "react";

import handler from "../communicate";

class Menu extends Component {
  state = {
    name: "",
    gameID: ""
  };

  onJoin(e) {
    console.log("join");
    e.preventDefault();
    if (this.state.name === "" || this.state.gameID === "") {
      alert("Must enter a name and game ID.");
      return;
    }
    this.props.sstate.showGameScreen();
    handler.joinGame(
      this.state.name.substring(0, 20),
      this.state.gameID.substring(0, 20)
    );
  }

  onStart(e) {
    e.preventDefault();
    if (this.state.name === "" || this.state.gameID === "") {
      alert("Must enter a name and game ID.");
      return;
    }
    this.props.sstate.showGameScreen();
    handler.createGame(
      this.state.name.substring(0, 20),
      this.state.gameID.substring(0, 20)
    );
  }

  updateName(event) {
    const name = event.target.value;
    this.setState(state => ({ ...state, name }));
  }

  updateGameID(event) {
    const gameID = event.target.value;
    this.setState(state => ({ ...state, gameID }));
  }

  render() {
    return (
      <div className="menu">
        <div className="logo">OFC.js</div>
        <div className="menu-body">
          <h3>Welcome!</h3>
          <p>
            If you wish to play against a human opponent, please start a new
            game or join an existing game using the game ID given to you by the
            host.
          </p>
          <form>
            <div className="form-container">
              <div className="input-row">
                <label>Player Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={e => this.updateName(e)}
                />
              </div>
              <div className="input-row">
                <label>Game ID</label>
                <input
                  type="text"
                  name="gameid"
                  onChange={e => this.updateGameID(e)}
                />
              </div>
              <div>
                <button className="dialog-button" onClick={e => this.onJoin(e)}>
                  Join Game
                </button>
                <button
                  className="dialog-button"
                  onClick={e => this.onStart(e)}
                >
                  Start Game
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Menu;
