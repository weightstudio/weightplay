(function (root) {
  "use strict";

  const SUITS = Object.freeze(["spades", "hearts", "clubs", "diamonds"]);
  const SUIT_SYMBOLS = Object.freeze({ spades: "♠", hearts: "♥", clubs: "♣", diamonds: "♦" });
  const RANK_LABELS = Object.freeze(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]);

  class Card {
    constructor(suit, rank, id, faceUp = false) {
      this.suit = suit;
      this.rank = rank;
      this.id = id;
      this.faceUp = faceUp;
    }

    get isRed() {
      return this.suit === "hearts" || this.suit === "diamonds";
    }

    get rankLabel() {
      return RANK_LABELS[this.rank - 1] || String(this.rank);
    }

    get colorClass() {
      return this.isRed ? "red" : "black";
    }

    clone() {
      return new Card(this.suit, this.rank, this.id, this.faceUp);
    }

    toJSON() {
      return { suit: this.suit, rank: this.rank, id: this.id, faceUp: this.faceUp };
    }

    static from(data) {
      return new Card(data.suit, Number(data.rank), data.id, Boolean(data.faceUp));
    }
  }

  class Deck {
    constructor(cards = []) {
      this.cards = cards;
    }

    static buildShuffled(seed = 0, suits = SUITS, copies = 1) {
      const cards = [];
      const selectedSuits = Array.isArray(suits) && suits.length ? suits : SUITS;
      const deckCopies = Math.max(1, Number(copies) || 1);
      for (let copy = 0; copy < deckCopies; copy += 1) {
        for (const suit of selectedSuits) {
          for (let rank = 1; rank <= 13; rank += 1) {
            cards.push(new Card(suit, rank, `${suit}-${rank}-${copy}-${seed >>> 0}-${cards.length + 1}`));
          }
        }
      }
      return new Deck(cards).shuffle(seed);
    }

    shuffle(seed) {
      let value = (seed || 0) >>> 0;
      const random = () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 0x100000000;
      };
      for (let index = this.cards.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [this.cards[index], this.cards[swapIndex]] = [this.cards[swapIndex], this.cards[index]];
      }
      return this;
    }

    draw(count = 1) {
      const drawn = [];
      for (let index = 0; index < count && this.cards.length; index += 1) drawn.push(this.cards.pop());
      return drawn;
    }

    toJSON() {
      return this.cards.map((card) => card.toJSON());
    }

    static fromJSON(raw = []) {
      return new Deck(raw.map((card) => Card.from(card)));
    }
  }

  class Tableau {
    constructor(columns = 7) {
      this.columns = Array.from({ length: columns }, () => []);
    }

    clear() {
      this.columns.forEach((column) => column.splice(0));
    }

    top(columnIndex) {
      return this.columns[columnIndex]?.at(-1) || null;
    }

    canTakeFrom(columnIndex, row, validator) {
      const column = this.columns[columnIndex];
      const card = column?.[row];
      if (!card || !card.faceUp) return null;
      const group = column.slice(row);
      if (group.some((candidate) => !candidate.faceUp)) return null;
      const isValid = validator || ((current, next) => current.rank === next.rank + 1 && current.isRed !== next.isRed);
      for (let index = 0; index < group.length - 1; index += 1) {
        if (!isValid(group[index], group[index + 1])) return null;
      }
      return { columnIndex, row, cards: group };
    }

    toJSON() {
      return this.columns.map((column) => column.map((card) => card.toJSON()));
    }

    static fromJSON(raw = []) {
      const table = new Tableau(raw.length || 7);
      table.columns = raw.map((column) => column.map((card) => Card.from(card)));
      return table;
    }
  }

  class Foundation {
    constructor(suit = null) {
      this.suit = suit;
      this.cards = [];
    }

    clear() {
      this.cards.splice(0);
    }

    top() {
      return this.cards.at(-1) || null;
    }

    isReadyFor(card) {
      if (!card || (this.suit && card.suit !== this.suit)) return false;
      if (!this.top()) return card.rank === 1;
      return card.rank === this.top().rank + 1;
    }

    toJSON() {
      return this.cards.map((card) => card.toJSON());
    }

    static fromJSON(suit, raw = []) {
      const foundation = new Foundation(suit);
      foundation.cards = raw.map((card) => Card.from(card));
      return foundation;
    }
  }

  class Stock {
    constructor(cards = []) {
      this.cards = cards;
    }

    clear() {
      this.cards.splice(0);
    }

    isEmpty() {
      return this.cards.length === 0;
    }

    draw(count = 1) {
      const drawn = this.cards.splice(-count);
      drawn.forEach((card) => { card.faceUp = true; });
      return drawn;
    }

    toJSON() {
      return this.cards.map((card) => card.toJSON());
    }

    static fromJSON(raw = []) {
      return new Stock(raw.map((card) => Card.from(card)));
    }
  }

  class Waste {
    constructor(cards = []) {
      this.cards = cards;
    }

    clear() {
      this.cards.splice(0);
    }

    top() {
      return this.cards.at(-1) || null;
    }

    pop() {
      return this.cards.pop() || null;
    }

    toJSON() {
      return this.cards.map((card) => card.toJSON());
    }

    static fromJSON(raw = []) {
      return new Waste(raw.map((card) => Card.from(card)));
    }
  }

  class RuleEngine {
    canPlaceOnTableau(card, targetCard) {
      if (!card) return false;
      if (!targetCard) return card.rank === 13;
      return card.isRed !== targetCard.isRed && card.rank + 1 === targetCard.rank;
    }

    canPlaceOnFoundation(card, foundation) {
      return foundation?.isReadyFor(card) || false;
    }
  }

  class UndoStack {
    constructor() {
      this.items = [];
    }

    clear() {
      this.items.length = 0;
    }

    push(snapshot) {
      this.items.push(JSON.parse(JSON.stringify(snapshot)));
    }

    pop() {
      return this.items.pop() || null;
    }

    get length() {
      return this.items.length;
    }
  }

  class SoundEngine {
    constructor(storageKey = "card_games_sound_v1") {
      this.storageKey = storageKey;
      this.enabled = true;
      try { this.enabled = localStorage.getItem(storageKey) !== "0"; } catch (_error) { }
      this.ctx = null;
    }

    ensureContext() {
      if (!this.enabled || this.ctx) return;
      try {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return;
        this.ctx = new AudioContextCtor();
        if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
      } catch (_error) {
        this.ctx = null;
      }
    }

    setEnabled(value) {
      this.enabled = Boolean(value);
      try { localStorage.setItem(this.storageKey, this.enabled ? "1" : "0"); } catch (_error) { }
    }

    beep({ frequency = 500, duration = 90, type = "triangle", gain = 0.12 } = {}) {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const start = this.ctx.currentTime;
        const oscillator = this.ctx.createOscillator();
        const amplifier = this.ctx.createGain();
        oscillator.type = type;
        amplifier.gain.setValueAtTime(0, start);
        amplifier.gain.linearRampToValueAtTime(gain, start + 0.008);
        amplifier.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.02, duration) / 1000);
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.connect(amplifier).connect(this.ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + duration / 1000);
      } catch (_error) { }
    }

    deal() { this.beep({ frequency: 330, duration: 70, type: "sawtooth", gain: 0.07 }); }
    draw() { this.deal(); }
    place() { this.beep({ frequency: 520, duration: 75, type: "triangle", gain: 0.11 }); }
    flip() { this.beep({ frequency: 660, duration: 85, type: "triangle", gain: 0.08 }); }
    complete() { this.beep({ frequency: 780, duration: 150, type: "sine", gain: 0.13 }); }
    win() { this.beep({ frequency: 740, duration: 120, type: "square", gain: 0.15 }); }
    reject() { this.beep({ frequency: 180, duration: 120, type: "square", gain: 0.08 }); }
  }

  root.WPCardEngine = Object.freeze({
    SUITS,
    SUIT_SYMBOLS,
    RANK_LABELS,
    Card,
    Deck,
    Tableau,
    Foundation,
    Stock,
    Waste,
    RuleEngine,
    UndoStack,
    SoundEngine,
  });
})(window);
