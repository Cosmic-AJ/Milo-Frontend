class Alert {
  // This class helps us to hook logic to our DOM
  constructor(text, onClose, isOpen = false, forceRemove = false) {
    this.text = text;
    this.isOpen = isOpen ? true : false;
    this.onClose = onClose;
    this.forceRemove = forceRemove;
    if (isOpen) {
      this.makeDOMElements();
    }
  }

  setAlertText = (text) => {
    if (this.alertText) {
      this.alertText = text;
    }
  };

  show() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.makeDOMElements();
    }
  }

  closeAlert() {
    this.alertDiv.className = "closeState";
    this.isOpen = false;
    this.setAlertText("");
    this.onClose && this.onClose();
    if (this.forceRemove) {
      setTimeout(() => this.remove(), 500);
    }
  }

  remove() {
    this.alertDiv.remove();
  }

  DOMExists() {
    const alertDiv = document.getElementById("alert");
    if (alertDiv !== null) {
      return true;
    } else {
      return false;
    }
  }

  makeDOMElements() {
    if (!this.DOMExists) {
      const container = document.getElementById("overlays");
      this.alertDiv = document.createElement("div");
      this.alertDiv.id = "alert";
      this.closeBtn = document.createElement("button");
      this.closeBtn.className = "close-button";
      this.closeBtn.addEventListener("click", () => this.closeAlert());
      this.alertDiv.appendChild(this.closeBtn);
      this.alertText = document.createElement("span");
      this.alertText.id = "alertText";
      this.alertText.innerText = this.text;
      this.alertDiv.appendChild(this.alertText);
      container.appendChild(this.alertDiv);
    }
  }
}

export default Alert;
