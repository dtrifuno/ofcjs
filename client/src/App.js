import React, { Component } from "react";
import { Subscribe } from "unstated";
import "./App.css";
import PlayerWrapper from "./components/Player";
import OpponentWrapper from "./components/Opponent";

import gameState from "./containers";

class App extends Component {
  render() {
    return (
      <Subscribe to={[gameState]}>
        {counter => (
          <div className="App">
            <PlayerWrapper />
            <OpponentWrapper />
          </div>
        )}
      </Subscribe>
    );
  }
}

export default App;
