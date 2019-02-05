import React, { Component } from "react";

class Card extends Component {
  state = { filled: false };

  clickDealt(n) {
    const gameState = this.props.gameState;
    const player = gameState.state.player;

    // clicked on empty slot, do nothing
    if (player.dealt[n] === null) {
      return;
    }

    // clicked on selected card, deselect
    if (gameState.state.selected === n) {
      gameState.setState(state => ({
        ...state,
        selected: null
      }));
      return;
      // TODO
    }

    // already have a card selected, switch to new one

    // select this card
    this.setState({ selected: true });
    gameState.setState(state => ({
      ...state,
      selected: n
    }));
  }

  clickFixed(rowId, n) {
    const { gameState } = this.props;
    const filled = gameState.state.player[rowId][n];

    if (filled || gameState.state.selected === null) {
      return;
    }
    gameState.setState(state => {
      const newRow = state.player[rowId].slice();
      const newDealt = state.player.dealt.slice();
      newRow[n] = newDealt[state.selected];
      newDealt[state.selected] = null;
      const newPlayer = state.player;
      newPlayer[rowId] = newRow;
      newPlayer.dealt = newDealt;

      return {
        ...state,
        player: newPlayer,
        selected: null
      };
    });
  }

  render() {
    const gameState = this.props.gameState;
    const { selected } = gameState.state;
    const { rowId, playerId, n } = this.props;
    const card = gameState.state[playerId][rowId][n];

    const style = {};
    if (card) {
      style["background"] = "url(/cards/" + card.toString() + ".png)";
      style["backgroundSize"] = "cover";
    }

    let outlineClass = "card-outline";
    let clickHandler = () => null;
    if (playerId === "player" && rowId === "dealt") {
      clickHandler = () => this.clickDealt(n);
      if (selected === n) {
        outlineClass += " card-outline-selected";
      }
    } else if (playerId === "player" && !this.state.filled) {
      clickHandler = () => this.clickFixed(rowId, n);
    }

    return (
      <div className={outlineClass} onClick={clickHandler}>
        <div className="card" style={style} />
      </div>
    );
  }
}

export default Card;
