/* type: username | email | password | phone */

import getValidationFunction from "../../utils/validations";
//TOCHANGE
import whiteSprite from "../../../icons/white.png";
import errorIcon from "../../../icons/error.svg";
import AvatarPicker from "../creatorFunctions/createAvatarPicker";
import { state } from "../../main";
import { baseURL } from "../../constants";

class DialogTextInput {
  inputTypes = {
    "avatar-picker": "button",
    name: "text",
    username: "text",
    password: "password",
    email: "email",
    phone: "tel",
  };
  constructor(responseObj, dialog, data) {
    this.responseObj = responseObj;
    this.dialog = dialog;
    this.errorExists = false;
    this.data = data;
    this.makeDOMElements();
  }

  makeDOMElements() {
    this.responseContainer = document.createElement("div");
    this.responseContainer.className = "response-container";

    const inputContainer = document.createElement("div");
    inputContainer.className = "response__input-container";

    const signEmojiSpan = document.createElement("span");
    signEmojiSpan.innerText = "👉";

    this.inputBox = document.createElement("input");
    this.inputBox.focus();
    this.inputBox.className = "response__input-box";
    this.inputBox.type = this.inputTypes[this.responseObj.inputType];
    this.inputBox.placeholder = this.responseObj.placeholder;
    this.validator = getValidationFunction(this.responseObj.inputType);
    // Fill values if they exist

    this.inputBox.addEventListener("keypress", (e) => {
      const check = this.validator(e.target.value);
      if (check) {
        this.indicateErrors(check);
        return;
      }
      this.dialog.toggleButtons("enabled");
      this.errorIcon.style.display = "none";
      this.errorExists = false;
      this.nextButton.disabled = false;
      this.nextButton.removeAttribute("title");
      this.errorIcon.removeAttribute("title");
    });

    this.errorIcon = document.createElement("img");
    this.errorIcon.className = "error-icon";
    this.errorIcon.src = errorIcon;
    this.errorIcon.style.display = "none";
    this.errorExists = true;
    //Appending to input container
    inputContainer.append(signEmojiSpan, this.inputBox, this.errorIcon);

    this.nextButton = document.createElement("button");
    this.nextButton.className = "response__next-btn";
    this.nextButton.disabled = true;
    this.nextButton.innerText = this.responseObj.submitAfterInput
      ? "Submit"
      : "Next";
    this.nextButton.addEventListener("click", () => {
      if (this.responseObj.submitAfterInput) {
        this.data[this.responseObj.keyName] = this.inputBox.value;
        this.dialog.onSubmit(this.dialog);
      }
      this.dialog.nextDialog();
    });

    const spriteImg = document.createElement("img");
    spriteImg.src = state.avatar
      ? `${baseURL}/thumbnails/${state.avatar}.png`
      : `${baseURL}/thumbnails/cap_blue_boy.png`;
    //Appending to response container

    this.responseContainer.append(inputContainer, this.nextButton, spriteImg);
  }
  /* The response object 
    text: String
    inputType: name | username | password | email | phone 
    placeholder: String
  */

  update(responseObj) {
    this.inputBox.focus();
    console.log(this.responseObj.keyName);
    if (this.inputBox.value !== "Choose Avatar") {
      this.data[this.responseObj.keyName] = this.inputBox.value;
    }
    if (!this.data[responseObj.keyName]) {
      this.dialog.toggleButtons("disabled");
      this.nextButton.disabled = true;
    }
    this.responseObj = responseObj;
    this.inputBox.type = this.inputTypes[this.responseObj.inputType];
    this.inputBox.placeholder = responseObj.placeholder;
    this.inputBox.value = this.data[responseObj.keyName] || "";
    if (this.responseObj.inputType == "avatar-picker") {
      this.inputBox.value = responseObj.placeholder;
      this.inputBox.onclick = () => {
        const avatarPicker = new AvatarPicker(this.data, () => {
          this.dialog.toggleButtons("enabled");
          this.nextButton.disabled = false;
        });
      };
    } else {
      this.inputBox.onclick = () => {};
    }
    this.nextButton.innerText = responseObj.submitAfterInput
      ? "Submit"
      : "Next";
    this.validator = getValidationFunction(this.responseObj.inputType);
    this.errorIcon.removeAttribute("title");
  }
  indicateErrors(check) {
    this.errorIcon.style.display = "inline-block";
    this.errorIcon.title = check;
    this.errorExists = true;
    this.nextButton.disabled = true;
    this.nextButton.title =
      "There seems to be problem with your input, please check!";
    this.dialog.toggleButtons("disabled");
  }
}
export default DialogTextInput;
