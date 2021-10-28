const createButton = ({ text, onClickFn }) => {
  const button = document.createElement("button");
  button.innerText = text;
  button.addEventListener("click", () => onClickFn());
  return button;
};

const createButtonGroups = (buttonObjs) => {
  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";
  buttonObjs.forEach((buttonObj) => {
    buttonGroup.append(createButton(buttonObj));
  });
  return buttonGroup;
};

export default createButtonGroups;
