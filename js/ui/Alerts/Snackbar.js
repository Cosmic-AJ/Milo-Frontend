class Snackbar {
  // accent: "success" | "warning" | 'error'
  constructor() {
    this.makeDOMElements();
  }

  makeDOMElements() {
    this.container = document.getElementById("snackbars");
    this.snackbarDiv = document.createElement("div");
    this.snackbarDiv.id = "snackbar";
    this.textSpan = document.createElement("span");
    this.textSpan.innerHTML = "";
    this.closeButton = document.createElement("button");
    this.closeButton.id = "close-button";
    this.closeButton.addEventListener("click", () => this.close());
    this.snackbarDiv.append(this.textSpan, this.closeButton);
    this.container.append(this.snackbarDiv);
    this.close();
  }
  setText(updateText) {
    this.textSpan.innerHTML = updateText;
  }

  show() {
    this.container.style.zIndex = 10;
    this.snackbarDiv.className = "";
  }

  configure(text, accent) {
    this.text = text;
    this.accent = accent;
    this.textSpan.innerHTML = this.text;
  }

  close() {
    this.container.style.zIndex = -1;
    this.snackbarDiv.className = "closeState";
  }
}

export default Snackbar;
