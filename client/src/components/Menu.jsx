import React, { Component } from "react";

import handler from "../communicate";

class Menu extends Component {
  state = {
    name: ""
  };

  onJoin(e) {
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
        <div className="logo">OFCjs</div>
        <div className="menu-body">
          <h3>Welcome!</h3>
          <p>
            OFCjs lets you plan <a href="https://en.wikipedia.org/wiki/Open-face_Chinese_poker">open-face Chinese poker</a> online.
          </p>
          <p>
            Please enter your name and press "Start Game" to begin looking for an
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
                  Start Game
                </button>
              </div>
            </div>
          </form>
        </div>
        <footer>
          <div>© 2019–2020 Copyright: <a href="https://trifunovski.me/">Darko Trifunovski</a></div>
          <div>source code: <a href="https://github.com/dtrifuno/ofcjs">github.com/dtrifuno/ofcjs</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Menu;
