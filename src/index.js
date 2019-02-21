import io from 'socket.io';
import { Deck } from './card';
import { scorer } from './standardRanker';

const runningGames = new Map([]);

class Player {
  constructor() {
    this.name = null;
    this.chips = 0;
    this.front = [];
    this.middle = [];
    this.back = [];
    this.dealt = [];
  }

  setName(name) {
    this.name = name;
  }

  setChips(chips) {
    this.chips = chips;
  }

  getDealt(xs) {
    this.dealt = [];
    for (const [index, card] of xs) {
      this.dealt[index] = card;
    }
  }

  set(fromIdx, toRow, toIdx) {
    if (!this.dealt[fromIdx] || this[toRow][toIdx]) {
      return false;
    }

    this[toRow][toIdx] = this.dealt[fromIdx];
    this.dealt[fromIdx] = null;
    return true;
  }

  allRowsSet() {
    if (this.front.filter(x => x).length < 3) return false;
    if (this.middle.filter(x => x).length < 5) return false;
    if (this.back.filter(x => x).length < 5) return false;
    return true;
  }

  reset() {
    this.front = [];
    this.middle = [];
    this.back = [];
    this.dealt = [];
  }

  clearDealt() {
    this.dealt = [];
  }
}

class GameHandler {
  constructor(socket, playerName, gameID, gameType) {
    this.gameID = gameID;
    this.gameType = gameType;

    this.player1 = new Player();
    this.player1.setName(playerName);
    this.player1.socket = socket;
    this.idToPlayer = {};
    this.idToPlayer[socket.id] = this.player1;
    this.idToOpponent = {};

    this.status = 'wait';
    this.deck = new Deck();
  }

  /**
   * Handles a message from one of the players.
   * @param {socket} socket - The socket on which the message was received.
   * @param {object} data - Message content.
   */
  handle(socket, data) {
    console.log(`Handler for ${this.gameID} needs to handle ${JSON.stringify(data)}.`);

    if (data.msg === 'join') {
      this.handleJoin(socket, data);
    } else if (data.msg === 'set') {
      this.handleSet(socket, data);
    }
  }

  /**
   * Informs both clients that the game is starting.
   */
  gameStart() {
    console.log(`Sending gameStarts to ${this.player1.socket.id} and ${this.player2.socket.id}.`);

    this.player1.socket.emit('reply', {
      msg: 'gameStart',
      payload: [0, this.player2.name, 0]
    });

    this.player2.socket.emit('reply', {
      msg: 'gameStart',
      payload: [0, this.player1.name, 0]
    });

    // select a button FIXME
    const button = [this.player1, this.player2][Math.round(Math.random())];
    this.status = { playerToAct: button, moves: 5, action: 'buttonDeal' };
    this.deal(button, 5, 5);
  }

  /**
   * Handles attempts to join the game.
   * @param {socket} socket - The socket on which the message was received.
   * @param {object} data - Message content.
   */
  handleJoin(socket, data) {
    console.log(`Handling join from ${socket.id}.`);
    // is game waiting for another player?
    if (this.status !== 'wait') {
      console.log('Game already in progress.');
      this.terminate(socket, 'You are attempting to join a game that is already in progress.');
      return;
    }

    // is player2's name different from player1?
    if (this.player1.name === data.playerName) {
      console.log(`Name ${data.playerName} is already taken.`);
      this.terminate(socket, 'Name is already taken.');
      return;
    }

    console.log(Object.keys(this.idToPlayer));
    this.player2 = new Player();
    this.player2.setName(data.playerName);
    this.player2.socket = socket;
    this.idToPlayer[socket.id] = this.player2;
    console.log(Object.keys(this.idToPlayer));

    this.idToOpponent[socket.id] = this.player1;
    this.idToOpponent[this.player1.socket.id] = this.player2;

    this.gameStart();
  }

  /**
   * Handles a card set message from a client.
   * @param {socket} socket - The socket on which the message was received.
   * @param {object} data - Message content.
   */
  handleSet(socket, data) {
    // check if waiting for card from player
    const player = this.idToPlayer[socket.id];
    const opponent = this.idToOpponent[socket.id];
    console.log(Object.keys(this.idToPlayer));
    console.log(this.status.playerToAct.socket.id);
    console.log(player.socket.id);
    if (this.status.playerToAct !== player) {
      this.terminate(socket, 'A player made a move when it was not their turn.');
      return;
    }

    const [idxFrom, rowTo, idxTo] = data.payload;
    if (player.set(idxFrom, rowTo, idxTo)) {
      const card = player[rowTo][idxTo];
      opponent.socket.emit('reply', {
        msg: 'oppoSet',
        payload: [idxFrom, rowTo, idxTo, card]
      });
      this.status.moves -= 1;
      this.next();
    } else {
      this.terminate(socket, "A player tried to set a card they weren't dealt.");
    }
  }

  handleGameEnd() {
    const table = scorer.scoreGame(this.player1, this.player2);
    console.log(this.player1.name);
    console.log(this.player2.name);

    this.player1.socket.emit('reply', {
      msg: 'roundEnd',
      payload: table
    });

    this.player2.socket.emit('reply', {
      msg: 'roundEnd',
      payload: table
    });
  }

  /**
   *
   * @param {Object} player - The player to whom the cards are to be dealt.
   * @param {number} numCardsToDraw - The number of cards to deal.
   * @param {number} numCardsToSet - The number of cards the player is allowed to set.
   * @param {boolean} pineapple - Should the card faces be hidden from the opponents?
   */
  deal(player, numCardsToDraw, numCardsToSet, pineapple = false) {
    let cards;
    if (numCardsToDraw === 1) {
      cards = this.deck.draw(1).map((c, i) => [2, c]);
    } else if (numCardsToDraw === 3) {
      cards = this.deck.draw(3).map((c, i) => [i + 1, c]);
    } else {
      cards = this.deck.draw(numCardsToDraw).map((c, i) => [i, c]);
    }
    const opponent = this.idToOpponent[player.socket.id];
    player.getDealt(cards);

    player.socket.emit('reply', {
      msg: 'deal',
      payload: [cards, numCardsToSet]
    });

    let concealedCards;
    if (pineapple) {
      concealedCards = cards.map(([i, _]) => [i, 'Xx']);
    }

    opponent.socket.emit('reply', {
      msg: 'oppoDeal',
      payload: pineapple ? [concealedCards, numCardsToSet] : [cards, numCardsToSet]
    });
  }

  /**
   * Advance to the next game state.
   */
  next() {
    const { status } = this;
    const currentID = status.playerToAct.socket.id;

    // check if player has more actions due
    if (status.moves > 0) {
      return;
    }

    // check if game is over
    if (this.player1.allRowsSet() && this.player2.allRowsSet()) {
      this.handleGameEnd();
      return;
    }

    const player = this.idToPlayer[currentID];
    const opponent = this.idToOpponent[currentID];
    if (status.action === 'buttonDeal') {
      this.status = {
        playerToAct: opponent,
        action: 'deal',
        moves: 5
      };
      this.deal(opponent, 5, 5);
    } else if (status.action === 'deal' || status.action === 'set') {
      this.status = {
        playerToAct: opponent,
        action: 'set',
        moves: 1
      };
      if (this.gameType === 'pineapple') {
        player.clearDealt();
        this.deal(opponent, 3, 2, true);
        this.status.moves = 2;
      } else {
        this.deal(opponent, 1, 1);
      }
    }
  }

  terminate(socket, message) {
    socket.emit('reply', {
      msg: 'terminate',
      payload: message
    });
  }
}

const wss = io(3001);

/**
 * Handles a join game attempt - creates a new GameHandler if one doesn't exist for gameID, otherwise defers to handler.
 * @param {*} socket
 * @param {*} payload
 * @returns {GameHandler|null} - A GameHandler for the given gameID if one didn't already exist, otherwise null.
 */
function handleJoinGame(socket, payload) {
  let { gameID, playerName } = payload;
  const { gameType } = payload;
  console.log(`got a create game from ${socket.id}: ${[playerName, gameID]}`);

  // check if both name and game ID are present
  if (!gameID || !playerName) {
    socket.emit('reply', {
      msg: 'terminate',
      payload: 'Invalid name or game ID.'
    });
    return null;
  }

  // trim name and game ID
  playerName = playerName.substring(0, 20);
  gameID = gameID.substring(0, 20);

  let handler = runningGames.get(gameID);
  if (handler !== undefined) {
    // game exists, let handler handle it
    handler.handleJoin(socket, payload);
    return null;
  }

  // we need to create game
  handler = new GameHandler(socket, playerName, gameID, gameType);
  runningGames.set(gameID, handler);
  console.log(`registering new handler for ${gameID}`);
  return handler;
}

wss.on('connection', socket => {
  console.log('connection!');

  runningGames.forEach(handler => {
    console.log(handler.gameID);
    socket.on(handler.gameID, data => handler.handle(socket, data));
  });

  socket.on('joinGame', payload => {
    const handler = handleJoinGame(socket, payload);
    if (handler) {
      socket.on(handler.gameID, data => handler.handle(socket, data));
    }
  });
});
