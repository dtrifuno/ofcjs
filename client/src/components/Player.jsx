import React, { Component } from "react";
import { Subscribe } from "unstated";

import gameState from "../containers";
import Card from "./Card";

class Player extends Component {
  state = {};

  onClickFixed(playerId, rowId, n) {}

  renderRow(gameState, rowId) {
    return (
      <div className="card-row">
        {gameState.state.player[rowId].map((_, i) => (
          <Card
            key={i}
            n={i}
            playerId="player"
            rowId={rowId}
            gameState={gameState}
          />
        ))}
      </div>
    );
  }

  render() {
    const { name, chips } = this.props.gameState.state.player;
    return (
      <div className="player">
        <div className="rows-container">
          {this.renderRow(gameState, "front")}
          {this.renderRow(gameState, "middle")}
          {this.renderRow(gameState, "bottom")}
        </div>
        <div className="nameplate-container">
          <div className="nameplate">
            <div className="name">{name}</div>
            <div className="chips">{chips}</div>
          </div>
        </div>
        <div className="backrow-container">
          {this.renderRow(gameState, "dealt")}
        </div>
      </div>
    );
  }
}

class PlayerWrapper extends Component {
  render() {
    return (
      <Subscribe to={[gameState]}>
        {gameState => (
          <Player gameState={gameState} playerId={this.props.playerId} />
        )}
      </Subscribe>
    );
  }
}

export default PlayerWrapper;

//export default Player;
