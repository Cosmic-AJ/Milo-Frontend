import { baseURL } from "../../constants";
import { state } from "../../main";
import Alert from "../Alerts/Alert";
import createButtonGroups from "../creatorFunctions/createButtonGroup";
class Dialog extends Alert {
  constructor(
    dialogObj,
    spriteImg,
    isOpen = false,
    forceRemove = false,
    onClose = () => {}
  ) {
    super(null, onClose, isOpen, forceRemove);
    this.dialogObj = dialogObj;
    this.spriteImg = spriteImg;
  }

  makeDOMElements() {
    const container = document.getElementById("overlays");
    this.alertDiv = document.createElement("div");
    this.alertDiv.id = "dialog";
    this.closeBtn = document.createElement("button");
    this.closeBtn.id = "close-button";
    this.closeBtn.addEventListener("click", () => this.closeAlert());
    const conversationContainer = this.generateConversation();
    this.alertDiv.append(this.closeBtn, conversationContainer);
    container.appendChild(this.alertDiv);
  }

  generateConversation() {
    const convContainer = document.createElement("div");
    convContainer.className = "conv-container";
    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";
    const spriteImg = document.createElement("img");
    spriteImg.src = this.spriteImg;
    this.questionText = document.createElement("p");
    this.questionText.innerHTML = this.dialogObj.text;
    questionContainer.append(spriteImg, this.questionText);
    convContainer.append(questionContainer);
    this.inputControl = createButtonGroups(this.dialogObj.buttons);
    const userSpriteImg = document.createElement("img");
    userSpriteImg.src = state.avatar
      ? `${baseURL}/thumbnails/${state.avatar}.png`
      : `${baseURL}/thumbnails/cap_blue_boy.png`;
    this.inputControl.append(userSpriteImg);
    convContainer.append(this.inputControl);
    return convContainer;
  }
}
export default Dialog;
