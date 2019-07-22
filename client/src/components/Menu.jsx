import React, { Component } from "react";

import handler from "../communicate";

class Menu extends Component {
  state = {
    name: ""
  };

  onJoin(e) {
    console.log("join");
    e.preventDefault();
    if (this.state.name === "") {
      alert("Must enter a name.");
      return;
    }
    this.props.sstate.showGameScreen();
    handler.joinGame(this.state.name.substring(0, 20));
  }

  updateName(event) {
    const name = event.target.value;
    this.setState(state => ({ ...state, name }));
  }

  render() {
    return (
      <div className="menu">
        <div className="logo">OFC.js</div>
        <div className="menu-body">
          <h3>Welcome!</h3>
          <p>
            Please enter your name and press "Join Game" to begin looking for an
            opponent.
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
              <div>
                <button className="dialog-button" onClick={e => this.onJoin(e)}>
                  Join Game
                </button>
              </div>
            </div>
          </form>
        </div>
        <footer>
          <br />
          <a href="https://github.com/dtrifuno/ofcjs">source code</a>
        </footer>
      </div>
    );
  }
}

export default Menu;
