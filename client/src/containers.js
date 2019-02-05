import { Container } from "unstated";
import Card from "./card";

function createPlayer(name, chips) {
  return {
    name,
    chips,
    front: ["Ts", null, "6c"].map(x => Card.fromString(x)),
    middle: [null, "4s", "7h", null, 0].map(x => Card.fromString(x)),
    bottom: ["2c", null, "6s", "Qs", null].map(x => Card.fromString(x)),
    dealt: [0, 5, 6, 7, 3].map(r => new Card(r, 3))
  };
}

class GameState extends Container {
  constructor(player1Name, player1Chips, player2Name, player2Chips) {
    super();
    this.state = {
      selected: null,
      player: createPlayer(player1Name, player1Chips),
      opponent: createPlayer(player2Name, player2Chips),
      history: []
    };
  }
}

const gameState = new GameState("Alice", 200, "Bob", 200);

export default gameState;
