import Popup from "./Popup";
import createIconButton from "../creatorFunctions/createIconButton";
import sendIcon from "../../../icons/send.png";
import {
  sendMessage,
  registerNewMessageListener,
  terminateChat,
} from "../../handlers/chatHandler";

class TextChat extends Popup {
  /**
   *
   * @param {string} roomName
   * @param {object} sender
   * @param
   */
  constructor(roomName, sender) {
    super(false, () => {
      terminateChat(roomName);
      console.log("Sending event and closing chat");
    });
    this.roomName = roomName;
    this.sender = sender;
  }
  show() {
    if (!this.isOpen) {
      this.makeDOMElements();
      this.chatContainer = document.createElement("div");
      this.chatContainer.className = "chat-container";
      const chatWindowWrapper = this.createChatWindow();
      const chatForm = this.createFormInput();

      this.chatContainer.append(chatWindowWrapper, chatForm);
      this.populatePopup(this.chatContainer);
      registerNewMessageListener(this);
    }
  }

  createChatWindow() {
    const mainContainer = document.createElement("div");
    mainContainer.className = "chats__container";
    const recepientName = document.createElement("h2");
    recepientName.innerText = this.sender.name;
    this.chatWindow = document.createElement("div");
    this.chatWindow.className = "chat__window";
    const startTalkingMessage = document.createElement("h2");
    startTalkingMessage.className = "float-message";
    startTalkingMessage.innerText = "Very silent here ◔‿◔";
    this.isChatEmpty = true;
    this.chatWindow.appendChild(startTalkingMessage);
    mainContainer.append(recepientName, this.chatWindow);
    return mainContainer;
  }
  createFormInput() {
    const mainContainer = document.createElement("form");
    mainContainer.className = "chat__input-form";

    this.messageInput = document.createElement("input");
    this.messageInput.type = "text";
    this.messageInput.placeholder = " Enter Text!";

    const sendButton = createIconButton("Send", sendIcon, "right", false);
    sendButton.type = "submit";
    sendButton.disabled = true;
    sendButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.messageInput.value.trim() !== "") {
        sendMessage(this.messageInput.value, this.roomName);
        this.addMessage(this.messageInput.value, true);
        this.messageInput.value = "";
      }
    });

    this.messageInput.addEventListener("input", (e) => {
      sendButton.disabled = e.target.value === "";
    });

    mainContainer.append(this.messageInput, sendButton);
    return mainContainer;
  }

  /**
   *
   * @param {string} message
   * @param {boolean} fromMe
   */
  addMessage(message, fromMe) {
    if (this.isChatEmpty) {
      document.querySelector(".float-message").remove();
      this.isChatEmpty = false;
    }
    const newMessage = document.createElement("div");
    newMessage.className = "chat_message";
    if (fromMe) {
      newMessage.classList.add("from-me");
    }
    const messageSpan = document.createElement("span");
    messageSpan.innerHTML = message;
    const timeSpan = document.createElement("span");
    timeSpan.innerText = new Date()
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
    newMessage.append(messageSpan, timeSpan);
    this.chatWindow.append(newMessage);
  }
}

export default TextChat;
