class QuantityController {
  constructor(min, max, onValueChange) {
    this.min = min;
    this.max = max;
    this.value = min;
    this.onValueChange = onValueChange;
    this.createDomElements();
  }

  createDomElements() {
    this.controlDiv = document.createElement("div");
    this.controlDiv.className = "flex-center";
    this.decrementButton = document.createElement("button");
    this.decrementButton.innerText = "-";
    this.decrementButton.addEventListener("click", () => this.decrement());
    this.decrementButton.disabled = true;

    this.valueSpan = document.createElement("span");
    this.valueSpan.innerText = this.value;

    this.incrementButton = document.createElement("button");
    this.incrementButton.innerText = "+";
    this.incrementButton.addEventListener("click", () => this.increment());

    this.controlDiv.append(
      this.decrementButton,
      this.valueSpan,
      this.incrementButton
    );
  }

  increment() {
    console.log("incrementing");
    if (this.value + 1 <= this.max) {
      this.value++;
      this.valueSpan.innerText = this.value;
      this.onValueChange(this.value);
    }
    if (this.value === this.max) {
      this.incrementButton.disabled = true;
    } else {
      this.incrementButton.disabled = false;
    }
    if (this.value === this.min) {
      this.decrementButton.disabled = true;
    } else {
      this.decrementButton.disabled = false;
    }
  }

  decrement() {
    console.log("decrementing");
    if (this.value - 1 >= this.min) {
      this.value--;
      this.valueSpan.innerText = this.value;
      this.onValueChange(this.value);
    }
    if (this.value === this.max) {
      this.incrementButton.disabled = true;
    } else {
      this.incrementButton.disabled = false;
    }
    if (this.value === this.min) {
      this.decrementButton.disabled = true;
    } else {
      this.decrementButton.disabled = false;
    }
  }
}

export default QuantityController;
