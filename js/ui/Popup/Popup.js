export default class Popup {
  constructor(isOpen = false, onClose = () => {}) {
    this.onClose = onClose;
    this.isOpen = isOpen;
  }

  makeDOMElements() {
    const parent = document.getElementById("overlays");
    this.bgDiv = document.createElement("div");
    this.bgDiv.className = "bg-disabled";
    this.container = document.createElement("div");
    this.container.className = "popup-container";
    this.closeBtn = document.createElement("button");
    this.closeBtn.className = "close-button";
    this.closeBtn.addEventListener("click", () => this.close());
    this.container.append(this.closeBtn);
    parent.append(this.bgDiv, this.container);
  }

  populatePopup(child) {
    this.container.append(child);
  }
  show() {
    if (!this.isOpen) {
      this.makeDOMElements();
      this.isOpen = true;
    }
  }
  close() {
    this.isOpen = false;
    this.container.classList.add("closeState");
    setTimeout(() => this.remove(), 300);
  }

  remove() {
    this.bgDiv.style.zIndex = -2;
    this.container.remove();
  }
}
