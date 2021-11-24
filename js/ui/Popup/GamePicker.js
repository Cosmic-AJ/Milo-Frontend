import Popup from "./Popup";
import { baseURL } from "../../constants";
import playIcon from "../../../icons/play.png";
import leaderboardIcon from "../../../icons/leaderboard.png";
import createIconButton from "../creatorFunctions/createIconButton";
import Leaderboard from "./Leaderboard";
import GamePopup from "./GamePopup";
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
    if (this.isOpen) return;

    this.makeDOMElements();
    const container = document.createElement("div");
    const gameCenterHead = document.createElement("h1");
    gameCenterHead.innerText = "Game Center";
    const gameGrid = this.makeGameGrid();
    container.append(gameCenterHead, gameGrid);
    this.populatePopup(container);
    this.isOpen = true;
  }

  makeGameGrid() {
    const container = document.createElement("div");
    container.className = "game-grid";
    this.games.forEach((game) =>
      container.append(this.makeGameContainer(game))
    );
    return container;
  }

  makeGameContainer(game) {
    const container = document.createElement("div");
    container.className = "game-container";

    const imgName = document.createElement("div");
    imgName.className = "game-img-name";

    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = `${baseURL}/thumbnails/${game.url}.png`;

    const gameNameSpan = document.createElement("span");
    gameNameSpan.className = "game-name";
    gameNameSpan.innerText = game.name;

    imgName.append(thumbnailImg, gameNameSpan);

    const leaderboardBtn = document.createElement("button");
    leaderboardBtn.innerHTML = `<img src=${leaderboardIcon} alt="leaderboard"/>`;
    leaderboardBtn.title = "Leaderboard";
    leaderboardBtn.addEventListener("click", () => {
      const lb = new Leaderboard(game.url);
      lb.show();
    });

    const playGameBtn = document.createElement("button");
    playGameBtn.innerHTML = `<img src=${playIcon} alt="Play Game"/>`;
    playGameBtn.title = "Play";
    playGameBtn.addEventListener("click", () => {
      const gamePopup = new GamePopup(game.url);
      gamePopup.show();
    });

    container.append(imgName, leaderboardBtn, playGameBtn);
    return container;
  }
}

export default GamePicker;
