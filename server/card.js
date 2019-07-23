const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
const suits = ["s", "h", "d", "c"];

class Deck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  draw(n = 1) {
    return this.cards.splice(0, n);
  }

  shuffle() {
    const n = this.cards.length;
    for (let i = 0; i < n - 1; i += 1) {
      const j = Math.floor(Math.random() * (n - i)) + i;
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  reset() {
    this.cards = [];
    suits.forEach(suit => {
      this.cards = this.cards.concat(ranks.map(rank => rank + suit));
    });
    this.shuffle();
  }
}

module.exports = { ranks, suits, Deck };
