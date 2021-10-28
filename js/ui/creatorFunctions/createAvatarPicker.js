import { avatarList } from "../../utils/avatarList";
import arrow from "../../../icons/arrow.png";
import { baseURL } from "../../constants";

class AvatarPicker {
  constructor(data, onClose) {
    this.avatarList = avatarList;
    this.avatarIndex = 0;
    this.makeDOMElements();
    this.data = data;
    this.onClose = onClose;
  }

  makeDOMElements() {
    const parent = document.getElementById("overlays");
    this.bgDiv = document.createElement("div");
    this.bgDiv.className = "bg-disabled";
    this.container = document.createElement("div");
    this.container.className = "avatar-picker__container";

    const previewDiv = document.createElement("div");
    previewDiv.className = "avatar-picker__preview";
    const previewMainDiv = document.createElement("div");
    previewMainDiv.className = "flex-center";
    this.leftArrow = document.createElement("img");
    this.leftArrow.addEventListener("click", () => this.prevAvatar());
    this.leftArrow.className = "left-arrow";
    this.leftArrow.style.opacity = 0;
    this.leftArrow.src = arrow;
    this.mainImg = document.createElement("img");
    this.mainImg.className = "img-preview";
    this.mainImg.src = `${baseURL}/thumbnails/${
      this.avatarList[this.avatarIndex].name
    }.png`;
    this.rightArrow = document.createElement("img");
    this.rightArrow.addEventListener("click", () => this.nextAvatar());
    this.rightArrow.className = "right-arrow";
    this.rightArrow.src = arrow;
    previewMainDiv.append(this.leftArrow, this.mainImg, this.rightArrow);
    previewDiv.append(previewMainDiv);

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "avatar-picker__details";
    const headline = document.createElement("h1");
    headline.innerText = "Character Selection";
    const subHeadline1 = document.createElement("h2");
    subHeadline1.innerText = "Name";
    this.nameElement = document.createElement("h3");
    this.nameElement.innerText = this.avatarList[this.avatarIndex].name;

    const subHeadline2 = document.createElement("h2");
    subHeadline2.innerText = "About";
    this.descElement = document.createElement("h3");
    this.descElement.innerText = this.avatarList[this.avatarIndex].desc;

    const selectButton = document.createElement("button");
    selectButton.innerText = "Select this character";
    selectButton.addEventListener("click", () => {
      this.data["avatar"] = this.avatarList[this.avatarIndex].name;
      this.close();
    });

    detailsDiv.append(
      headline,
      subHeadline1,
      this.nameElement,
      subHeadline2,
      this.descElement,
      selectButton
    );

    this.container.append(previewDiv, detailsDiv);
    parent.append(this.bgDiv, this.container);
  }
  close() {
    this.onClose();
    this.bgDiv.style.zIndex = -2;
    this.container.remove();
  }

  update() {
    const currentAvatar = this.avatarList[this.avatarIndex];
    this.nameElement.innerText = currentAvatar.name;
    this.descElement.innerText = currentAvatar.desc;
    this.mainImg.src = `${baseURL}/thumbnails/${currentAvatar.name}.png`;
    this.leftArrow.style.opacity = this.avatarIndex === 0 ? 0 : 1;
    this.rightArrow.style.opacity =
      this.avatarIndex === this.avatarList.length - 1 ? 0 : 1;
  }

  nextAvatar(button) {
    if (this.avatarIndex + 1 < this.avatarList.length) {
      this.avatarIndex++;
      this.update();
    }
  }

  prevAvatar() {
    if (this.avatarIndex - 1 >= 0) {
      this.avatarIndex--;
      this.update();
    }
  }
}

export default AvatarPicker;
