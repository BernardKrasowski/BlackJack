import { Deck } from "./Deck.js";
import { Player } from "./Player.js";
import { Table } from "./Table.js";
import { Message } from "./Message.js";

class Game {
  constructor({
    player,
    playerPoints,
    dealerPoints,
    table,
    hitButton,
    standButton,
    messageBox,
  }) {
    this.hitButton = hitButton;
    this.standButton = standButton;
    this.player = player;
    this.playerPoints = playerPoints;
    this.dealerPoints = dealerPoints;
    this.table = table;
    this.messageBox = messageBox;
    this.dealer = new Player("Croupier");
    this.deck = new Deck();
    this.deck.shuffle();
  }
  run() {
    this.hitButton.addEventListener("click", (event) => this.hitCard());
    this.standButton.addEventListener("click", (event) => this.dealerPlays());
    this.dealCards();
  }

  hitCard() {
    const card = this.deck.pickOne();
    this.player.hand.addCard(card);
    this.table.showPlayersCard(card);
    this.playerPoints.innerHTML = this.player.calculatePoints();

    if (this.player.points > 21) {
      this.hitButton.style.display = "none";
      this.standButton.style.display = "none";

      this.messageBox.setText("You Lost !!!").show();
    }
  }
  dealCards() {
    for (let n = 0; n < 2; n++) {
      let card1 = this.deck.pickOne();
      this.player.hand.addCard(card1);
      this.table.showPlayersCard(card1);

      let card2 = this.deck.pickOne();
      this.dealer.hand.addCard(card2);
      this.table.showDealersCard(card2);
    }
    this.playerPoints.innerHTML = this.player.calculatePoints();
    this.dealerPoints.innerHTML = this.dealer.calculatePoints();
  }
  dealerPlays() {
    while (
      this.dealer.points <= this.player.points &&
      this.dealer.points <= 21 &&
      this.player.points <= 21
    ) {
      const card = this.deck.pickOne();
      this.dealer.hand.addCard(card);
      this.table.showDealersCard(card);
      this.dealerPoints.innerHTML = this.dealer.calculatePoints();
    }
    this.endTheGame();
  }
  endTheGame() {
    this.hitButton.removeEventListener("click", (event) => this.hitCard());

    this.standButton.removeEventListener("click", (event) =>
      this.dealerPlays()
    );

    this.hitButton.style.display = "none";
    this.standButton.style.display = "none";

    if (this.player.points < 21 && this.player.points == this.dealer.points) {
      this.messageBox.setText("Remis").show();
      return;
    }
    if (this.player.points > 21) {
      this.messageBox.setText("Dealer Wins !!!").show();
      return;
    }
    if (this.dealer.points > 21) {
      this.messageBox.setText("You Win").show();
      return;
    }
    if (this.player.points < this.dealer.points) {
      this.messageBox.setText("Dealer Wins !!!").show();
      return;
    }
  }
}

const messageBox = new Message(document.getElementById("message"));

const table = new Table(
  document.getElementById("playersCards"),
  document.getElementById("dealersCards")
);
const player = new Player("Bernard");
const game = new Game({
  dealerPoints: document.getElementById("dealerPoints"),
  playerPoints: document.getElementById("playerPoints"),
  hitButton: document.getElementById("hit"),
  standButton: document.getElementById("stand"),
  player,
  table,
  messageBox,
});
game.run();
