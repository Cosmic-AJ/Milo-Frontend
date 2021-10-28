import { baseURL } from "../../constants";
import Popup from "./Popup";

class GamePopup extends Popup {
  constructor(gameType) {
    super();
    this.gameType = gameType;
  }

  setGameType(gameType) {
    this.gameType = gameType;
  }

  show() {
    if (!this.isOpen) {
      this.makeDOMElements();
      //Populate game;
      this.iframe = document.createElement("iframe");
      this.iframe.src = `${baseURL}/${this.gameType}/`;
      this.iframe.className = "game-frame";
      this.populatePopup(this.iframe);
      this.isOpen = true;
    }
  }
}
export default GamePopup;
