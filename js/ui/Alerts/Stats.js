import { baseURL } from "../../constants";
import moneyIcon from "../../../icons/money.png";

class Stats {
  constructor({ avatar, username, exp, money }) {
    this.avatar = avatar;
    this.username = username;
    this.max = 100;
    this.level = parseInt(exp / this.max, 10);
    this.exp = exp % this.max;
    if (this.level === 0) this.level++;
    this.money = money;
    this.makeDOMElements();
  }

  makeDOMElements() {
    const parent = document.getElementById("overlays");
    this.container = document.createElement("div");
    this.container.className = "stats-container";

    //Creating the basic info
    const otherDetailsDiv = document.createElement("div");
    otherDetailsDiv.className = "misc-details";
    const usernameAvatarDiv = this.createImgSpanDiv(
      "avatar-img-div",
      `${baseURL}/thumbnails/${this.avatar}.png`,
      this.username
    );
    const moneyDiv = this.createImgSpanDiv(
      "money-div",
      moneyIcon,
      `$ ${this.money}`
    );
    otherDetailsDiv.append(usernameAvatarDiv, moneyDiv);

    const expDetailsDiv = document.createElement("div");
    this.expSpan = document.createElement("span");
    this.expSpan.innerHTML = `Level ${this.level}<br>${this.exp} xp / ${this.max} xp`;
    this.createExpMeter();
    expDetailsDiv.append(this.expSpan, this.meterContainer);
    expDetailsDiv.className = "exp-details";
    this.container.append(otherDetailsDiv, expDetailsDiv);
    parent.append(this.container);
  }

  createImgSpanDiv(divClass, imgSrc, spanText) {
    const div = document.createElement("div");
    div.className = divClass;
    const image = document.createElement("img");
    image.src = imgSrc;
    const span = document.createElement("span");
    span.innerText = spanText;
    div.append(image, span);
    return div;
  }

  createExpMeter() {
    this.meterContainer = document.createElement("div");
    this.meterContainer.className = "exp-meter-container";
    this.meterFiller = document.createElement("div");
    this.meterFiller.className = "exp-meter-fill";
    this.meterFiller.style.width = `${this.exp}%`;
    this.meterContainer.append(this.meterFiller);
  }

  incrementMoney(amount) {
    this.money += amount;
    const moneySpan = document.querySelector(".money-div").lastChild;
    moneySpan.innerText = `$ ${this.money}`;
  }

  decrementMoney(amount) {
    this.money -= amount;
    const moneySpan = document.querySelector(".money-div").lastChild;
    moneySpan.innerText = `$ ${this.money}`;
  }

  incrementExp(expCount) {
    this.exp += expCount;
    this.expSpan.innerText = `${this.exp} xp`;
    this.meterFiller.style.width = `${this.exp}%`;
  }
}

export default Stats;
