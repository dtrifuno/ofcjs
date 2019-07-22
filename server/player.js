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

export { Player };
