import { Container } from "unstated";

class ScreenState extends Container {
  constructor() {
    super();
    this.state = {
      inGame: false,
      dialog: false,
      table: null
    };
  }

  setTable(newTable) {
    this.setState(state => ({
      ...state,
      table: newTable
    }));
  }

  showGameScreen() {
    this.setState(state => ({
      ...state,
      inGame: true
    }));
  }

  showEndOfRound() {
    this.setState(state => ({
      ...state,
      inGame: true,
      dialog: true
    }));
  }

  hideEndOfRound() {
    this.setState(state => ({
      ...state,
      inGame: true,
      dialog: false
    }));
  }

  showMainMenu() {
    this.setState(state => ({
      inGame: false,
      dialog: false,
      table: null
    }));
  }
}

const sstate = new ScreenState();

class PlayerState extends Container {
  constructor(name, chips) {
    super();
    this.state = {
      name,
      chips,
      front: Array(3).fill(null),
      middle: Array(5).fill(null),
      back: Array(5).fill(null),
      dealt: Array(5).fill(null),
      numCardsToSet: 0
    };
  }

  setName(name) {
    this.setState(state => ({
      ...state,
      name
    }));
  }

  setChips(chips) {
    this.setState(state => ({
      ...state,
      chips
    }));
  }

  changeChips(delta) {
    this.setState(state => ({
      ...state,
      chips: state.chips + delta
    }));
  }

  handleDeal(xs) {
    this.setState(state => {
      const dealt = this.state.dealt;
      console.log(dealt);
      console.log(xs);
      const { cards, numCardsToSet } = xs;
      this.state.numCardsToSet = numCardsToSet;
      cards.forEach(([idx, card]) => {
        dealt[idx] = card;
      });
      return {
        ...state,
        dealt
      };
    });
  }

  move(fromIdx, toRow, toIdx, card) {
    this.setState(state => {
      const newRow = state[toRow].slice();
      const newDealt = state.dealt.slice();
      [newRow[toIdx], newDealt[fromIdx]] = [card, null];
      const newPlayer = state;
      newPlayer[toRow] = newRow;
      newPlayer.numCardsToSet -= 1;
      newPlayer.dealt = newDealt;
      if (newPlayer.numCardsToSet === 0) {
        newPlayer.dealt = Array(5).fill(null);
      }
      newPlayer.selected = null;
      console.log(newPlayer);
      return newPlayer;
    });
  }

  resetCards() {
    this.setState(state => ({
      ...state,
      front: Array(3).fill(null),
      middle: Array(5).fill(null),
      back: Array(5).fill(null),
      dealt: Array(5).fill(null)
    }));
  }
}

const playerState = new PlayerState("Alice", 200);
const opponentState = new PlayerState("Bob", 200);

export { playerState, opponentState, sstate };
