import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { playerState, opponentState, sstate } from "./containers";

import "./communicate";

import { Provider, Subscribe } from "unstated";

ReactDOM.render(
  <Provider>
    <Subscribe to={[playerState, opponentState, sstate]}>
      {(playerState, opponentState, sstate) => (
        <App
          playerState={playerState}
          opponentState={opponentState}
          sstate={sstate}
        />
      )}
    </Subscribe>
  </Provider>,
  document.getElementById("root")
);
