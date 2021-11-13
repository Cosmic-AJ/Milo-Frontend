const createIconButton = (
  buttonText,
  iconSrc,
  iconPlacement = "left",
  rotate = true
) => {
  const button = document.createElement("button");
  button.className = "icon-button";
  const buttonIcon = document.createElement("img");
  buttonIcon.src = iconSrc;
  buttonIcon.className = "icon-button__icon";

  const buttonTextSpan = document.createElement("span");
  buttonTextSpan.className = "icon-button__text";
  buttonTextSpan.innerText = buttonText;
  if (iconPlacement == "right") {
    buttonIcon.style.transform = rotate ? "rotate(180deg)" : "";
    button.append(buttonTextSpan, buttonIcon);
  } else {
    button.append(buttonIcon, buttonTextSpan);
  }
  return button;
};

export default createIconButton;
