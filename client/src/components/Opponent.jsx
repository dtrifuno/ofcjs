import React, { Component } from "react";
import { Subscribe } from "unstated";

import gameState from "../containers";
import Card from "./Card";

class Opponent extends Component {
  renderRow(gameState, rowId) {
    return (
      <div className="card-row">
        {gameState.state.opponent[rowId].map((x, i) => (
          <Card
            key={i}
            n={i}
            playerId="opponent"
            rowId={rowId}
            gameState={gameState}
          />
        ))}
      </div>
    );
  }

  render() {
    const { name, chips } = this.props.gameState.state.opponent;
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

class OpponentWrapper extends Component {
  render() {
    return (
      <Subscribe to={[gameState]}>
        {gameState => <Opponent gameState={gameState} />}
      </Subscribe>
    );
  }
}

export default OpponentWrapper;
