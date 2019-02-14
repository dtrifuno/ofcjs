import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
