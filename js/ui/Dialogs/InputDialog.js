import Alert from "../Alerts/Alert";
import createIconButton from "../creatorFunctions/createIconButton";
import arrowImage from "../../../icons/arrow.png";
import DialogTextInput from "./DialogTextInput";
/*
This class is used to run interactive dialog boxes which has its own set of inputs, there is a 
next button, previous button along with a submit button.
The dialogObj should be of the form

[{
  text: String,
  inputType: textInput | avatarInput,
  keyName: String,
  validationPattern: String
}, {...}, {...}, {...},...]

spriteImg: string

*/

class InputDialog extends Alert {
  constructor(
    data,
    dialogObj,
    spriteImg,
    isOpen = false,
    forceRemove = false,
    onSubmit
  ) {
    super(null, null, isOpen, forceRemove);
    this.sliderPosition = 0;
    this.dialogObj = dialogObj;
    this.spriteImage = spriteImg;
    this.onSubmit = onSubmit;
    this.data = data;
  }

  generateConversation() {
    const convContainer = document.createElement("div");
    convContainer.className = "conv-container";
    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";
    const spriteImg = document.createElement("img");
    spriteImg.src = this.spriteImage;
    this.questionText = document.createElement("p");
    this.questionText.innerHTML = this.dialogObj[this.sliderPosition].text;
    questionContainer.append(spriteImg, this.questionText);
    convContainer.append(questionContainer);
    this.inputControl = new DialogTextInput(
      this.dialogObj[this.sliderPosition],
      this,
      this.data
    );
    this.toggleButtons("disabled");
    convContainer.append(this.inputControl.responseContainer);
    return convContainer;
  }

  makeDOMElements() {
    const container = document.getElementById("overlays");
    this.alertDiv = document.createElement("div");
    this.alertDiv.id = "dialog";
    // Controls container
    const controlContainer = document.createElement("div");
    controlContainer.className = "control-container";
    // Previous button creation
    this.prevButton = createIconButton("Prev", arrowImage, "left");
    this.prevButton.addEventListener("click", () => this.prevDialog());
    // Progess indicator creation
    this.progressSpan = document.createElement("span");
    this.progressSpan.className = "progress-indicator";
    this.progress = `${this.sliderPosition + 1}/${this.dialogObj.length}`;
    this.progressSpan.innerText = this.progress;
    // next button creation
    this.nextButton = createIconButton("Next", arrowImage, "right");
    this.nextButton.addEventListener("click", () => this.nextDialog());
    // Close button creation
    this.closeBtn = document.createElement("button");
    this.closeBtn.id = "close-button";
    this.closeBtn.addEventListener("click", () => this.closeAlert());
    const conversationContainer = this.generateConversation();
    controlContainer.append(
      this.prevButton,
      this.progressSpan,
      this.nextButton,
      this.closeBtn
    );
    this.alertDiv.append(controlContainer, conversationContainer);
    container.appendChild(this.alertDiv);
  }

  render() {
    this.progress = `${this.sliderPosition + 1}/${this.dialogObj.length}`;
    this.progressSpan.innerText = this.progress;
    this.questionText.innerHTML = this.dialogObj[this.sliderPosition].text;
    // need to update the input
    this.inputControl.update(this.dialogObj[this.sliderPosition]);
  }

  nextDialog() {
    if (this.sliderPosition + 1 < this.dialogObj.length) {
      this.sliderPosition++;
      this.render();
    }
  }

  prevDialog() {
    if (this.sliderPosition > 0) {
      this.sliderPosition--;
      this.render();
    }
  }
  // mode: string "enabled" | "disabled"
  toggleButtons(mode) {
    let errorText = "There seems to be problem with your input, please check!";
    let isDisabled = true;
    if (mode === "enabled") {
      errorText = "";
      isDisabled = false;
    }
    this.nextButton.disabled = isDisabled;
    this.prevButton.disabled = isDisabled;
    this.nextButton.title = errorText;
    this.prevButton.title = errorText;
  }
}

export default InputDialog;
