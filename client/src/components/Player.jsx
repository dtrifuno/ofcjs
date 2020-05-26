import React, { Component } from "react";
import Card from "./Card";

import handler from "../communicate";

class Player extends Component {
  state = {};

  clickDealt(n) {
    const player = this.props.playerState;

    // clicked on empty slot, do nothing
    if (player.state.dealt[n] === null) {
      return;
    }

    // clicked on selected card, deselect
    if (player.state.selected === n) {
      player.setState(state => ({
        ...state,
        selected: null
      }));
      return;
    }

    // else, select this card
    player.setState(state => ({
      ...state,
      selected: n
    }));
  }

  clickFixed(rowId, n) {
    const { playerState } = this.props;
    const filled = playerState.state[rowId][n] !== null;
    const selected = playerState.state.selected !== null;

    if (!filled && selected) {
      const fromIdx = playerState.state.selected;
      const card = playerState.state.dealt[fromIdx];
      playerState.move(fromIdx, rowId, n, card);
      handler.set(fromIdx, rowId, n);
    }
  }

  renderRow(playerState, rowId, onClick) {
    const cards = playerState.state[rowId];
    return (
      <div className="card-row">
        {cards.map((_, i) => (
          <Card
            key={i}
            n={i}
            rowId={rowId}
            onClick={() => onClick(i)}
            playerState={playerState}
          />
        ))}
      </div>
    );
  }

  render() {
    const playerState = this.props.playerState;
    const { name, chips } = playerState.state;

    return (
      <div className="player">
        <div className="rows-container">
          {this.renderRow(playerState, "front", i =>
            this.clickFixed("front", i)
          )}
          {this.renderRow(playerState, "middle", i =>
            this.clickFixed("middle", i)
          )}
          {this.renderRow(playerState, "back", i => this.clickFixed("back", i))}
        </div>
        <div className="bottom">
          <div className="nameplate-container">
            <div className="nameplate">
              <div className="name">{name}</div>
              <div className="chips">{chips}</div>
            </div>
          </div>
          <div className="backrow-container">
            {this.renderRow(playerState, "dealt", i => this.clickDealt(i))}
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
