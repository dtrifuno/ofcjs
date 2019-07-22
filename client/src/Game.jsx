import React, { Component } from 'react';
import './Game.css';

export default class Game extends Component {
  render() {
    return (
      <div>
        <div className="card-row">
          <div className="card-container">
            <div className="card-outline" />
          </div>
          <div className="card-container">
            <div className="card-outline" />
          </div>
          <div className="card-container">
            <div className="card-outline" />
          </div>
        </div>
      </div>
    );
  }
}
