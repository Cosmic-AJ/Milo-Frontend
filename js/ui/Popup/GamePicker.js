import Popup from "./Popup";

class GamePicker extends Popup {
  constructor() {
    super(false);
    this.games = [
      {
        name: "Tic Tac Toe",
        url: "tictactoe",
      },
      {
        name: "Running Dinosaur",
        url: "dinosaurgame",
      },
      {
        name: "Math Game",
        url: "mathgame",
      },
      {
        name: "Remember That!",
        url: "memorygame",
      },
    ];
  }
  show() {
    this.makeDOMElements();
    const container = document.createElement("div");
    container.append("game");
    this.populatePopup(container);
  }
}
