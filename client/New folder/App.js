import React, { Component } from "react";
//import "./App.css";

import Dialog from "./Dialog.jsx";
import "./menu.css";

const table = {
  front: { Hell: ["Fouled", 0], Bell: ["Fouled", 0], winner: "Hell" },
  middle: { Hell: ["Fouled", 0], Bell: ["Set", 3], winner: "Bell" },
  back: { Hell: ["Fouled", 0], Bell: ["Quads", 10], winner: "Bell" },
  scooped: "Bell",
  Hell: -6,
  Bell: 6
};

class App extends Component {
  render() {
    return (
      <Dialog
        playerName="Hell"
        playerChips={200}
        opponentName="Bell"
        opponentChips={150}
        table={table}
      />
    );
  }
}

export default App;
