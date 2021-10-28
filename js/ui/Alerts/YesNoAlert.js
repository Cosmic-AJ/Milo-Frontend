import Alert from "./Alert";
import tickIcon from "../../icons/tick.png";
import crossIcon from "../../icons/cross.png";
import createIconButton from "../creatorFunctions/createIconButton";

class YesNoAlert extends Alert {
  constructor(text, onYes, onNo) {
    super(text);
    this.text = text;
    this.onYes = onYes;
    this.onNo = onNo;
  }

  yesButtonClicked() {
    this.closeAlert();
    this.onYes();
  }

  noButtonClicked() {
    this.closeAlert();
    this.onNo();
  }

  makeDOMElements() {
    if (!this.DOMExists()) {
      const container = document.getElementById("overlays");
      this.alertDiv = document.createElement("div");
      this.alertDiv.id = "alert";
      const yesBtn = createIconButton("Yes", tickIcon);
      yesBtn.addEventListener("click", () => this.yesButtonClicked());

      const NoBtn = createIconButton("No", crossIcon);
      NoBtn.addEventListener("click", () => this.noButtonClicked());

      this.alertText = document.createElement("span");
      this.alertText.id = "alertText";
      this.alertText.innerText = this.text;

      const buttonSetDiv = document.createElement("div");
      buttonSetDiv.className = "button-set";
      buttonSetDiv.append(yesBtn, NoBtn);

      // Append buttons
      this.alertDiv.append(this.alertText, buttonSetDiv);
      container.appendChild(this.alertDiv);
    }
  }
}

export default YesNoAlert;
