import React, { Component } from "react";
import "./App.css";
import Player from "./components/Player";
import Opponent from "./components/Opponent";
import Menu from "./components/Menu";
import Dialog from "./components/Dialog";

class App extends Component {
  render() {
    const { inGame, dialog } = this.props.sstate.state;
    const playerName = this.props.playerState.state.name;
    const playerChips = this.props.playerState.state.chips;
    const opponentName = this.props.opponentState.state.name;
    const opponentChips = this.props.opponentState.state.chips;

    const game = (
      <div className="game">
        <Player playerState={this.props.playerState} />
        <div className="spacer" />
        <Opponent playerState={this.props.opponentState} />
        {dialog ? (
          <Dialog
            playerName={playerName}
            playerChips={playerChips}
            opponentName={opponentName}
            opponentChips={opponentChips}
            sstate={this.props.sstate}
          />
        ) : (
          ""
        )}
      </div>
    );
    const menu = <Menu sstate={this.props.sstate} />;
    return inGame ? game : menu;
  }
}

export default App;
