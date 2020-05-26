import React, { Component } from "react";

class Card extends Component {
  render() {
    const playerState = this.props.playerState;
    const { selected } = playerState.state;
    const { rowId, n } = this.props;
    const card = playerState.state[rowId][n];

    const style = {};
    if (card) {
      style["backgroundImage"] = `url(${process.env.PUBLIC_URL}/cards/${card}.svg)`;
      style["backgroundSize"] = "cover";
    }

    let outlineClass = "card-outline";
    if (rowId === "dealt" && selected === n) {
      outlineClass += " card-outline-selected";
    }

    return (
      <div className={outlineClass} onClick={this.props.onClick}>
        <div className="card" style={style} />
      </div>
    );
  }
}

export default Card;
