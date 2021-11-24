import { baseURL } from "../../constants";
import { registerAudioChatListener } from "../../handlers/audioComHandler";
import { terminateChat } from "../../handlers/chatHandler";
import muteIcon from "../../../icons/mute.svg";
import micIcon from "../../../icons/mic.svg";
import exitIcon from "../../../icons/exit.png";
import Popup from "./Popup";
import { socket, state } from "../../main";
import createIconButton from "../creatorFunctions/createIconButton";

class Participant {
  constructor(username, avatar) {
    this.username = username;
    this.avatar = `${baseURL}/thumbnails/${avatar}.png`;
    this.isMute = true;
    this.makeParticipantDiv();
  }

  makeParticipantDiv() {
    this.container = document.createElement("div");
    this.container.className = "participant";
    const avatarImage = document.createElement("img");
    avatarImage.alt = this.username;
    avatarImage.src = this.avatar;
    const userSpan = document.createElement("span");
    userSpan.innerText = this.username;
    const muteIndicatorDiv = document.createElement("div");
    muteIndicatorDiv.className = "mute-icon-div";
    this.muteIndicator = document.createElement("span");
    this.muteIndicator.className = "mute-icon";
    this.muteIndicator.style.backgroundSize = "contain";
    this.mute();
    muteIndicatorDiv.appendChild(this.muteIndicator);
    this.container.append(avatarImage, muteIndicatorDiv, userSpan);
  }

  renderMuteIndicator() {
    this.muteIndicator.style.background = this.isMute
      ? `url(${muteIcon})`
      : "none";
  }

  mute() {
    this.isMute = true;
    this.renderSpeaking(false);
    this.renderMuteIndicator();
  }

  unmute() {
    this.isMute = false;
    this.renderSpeaking(true);
    this.renderMuteIndicator();
  }

  renderSpeaking(speaking) {
    if (speaking) {
      this.container.style.outline = "solid 1px #ffc700";
    } else {
      this.container.style.outline = "none";
    }
  }
}

export default class AudioChat extends Popup {
  /**
   *
   * @param {string} roomName
   * @param {object} sender
   * @param
   */
  constructor(roomName, sender) {
    super(false, () => {
      terminateChat(roomName);
    });
    this.roomName = roomName;
    this.sender = sender;
    this.latency = 500;
    this.loggedInUser = new Participant(state.username, state.avatar);
    this.participant = new Participant(sender.username, sender.avatar);
  }

  show() {
    if (this.isOpen) return;

    this.makeDOMElements();
    this.chatContainer = document.createElement("div");
    this.chatContainer.className = "chat-container";

    this.participantContainer = this.createParticipantsDiv();
    const audioControlContainer = this.createAudioControlDiv();
    this.muteButton.disabled = true;
    this.chatContainer.append(this.participantContainer, audioControlContainer);
    this.populatePopup(this.chatContainer);
    registerAudioChatListener(this);
    this.initialiseRecorder();
  }

  createParticipantsDiv() {
    const container = document.createElement("div");
    container.className = "participant-container";
    container.append(this.loggedInUser.container, this.participant.container);
    return container;
  }

  createAudioControlDiv() {
    //Mute Button
    //Leave button

    const controls = document.createElement("div");
    controls.className = "audio-controls";

    this.muteButton = document.createElement("button");
    this.muteButtonIcon = document.createElement("span");
    this.muteButtonIcon.className = "mute-icon";
    this.muteButtonIcon.style.background = `url(${muteIcon})`;
    this.muteButtonText = document.createElement("span");
    this.muteButtonText.className = "mute-icon-text";
    this.muteButtonText.innerText = "Unmute";
    this.muteButton.append(this.muteButtonIcon, this.muteButtonText);
    this.muteButton.addEventListener("click", () => {
      let isMute = this.loggedInUser.isMute;
      if (isMute) {
        socket.emit("participant-unmute", this.roomName);
        this.unmuteRecorder();
      } else {
        socket.emit("participant-mute", this.roomName);
        this.muteRecorder();
      }
    });

    this.exitButton = createIconButton("Exit", exitIcon, "left");
    this.exitButton.addEventListener("click", () => {
      socket.emit("chat-exit", this.roomName);
      this.close();
    });
    controls.append(this.muteButton, this.exitButton);
    return controls;
  }

  muteRecorder() {
    this.muteButtonIcon.style.background = `url(${muteIcon})`;
    this.muteButtonText.innerText = "Unmute";
    this.loggedInUser.mute();
    this.mediaRecorder.stop();
  }

  unmuteRecorder() {
    this.muteButtonIcon.style.background = `url(${micIcon})`;
    this.muteButtonText.innerText = "Mute";
    this.loggedInUser.unmute();
    this.mediaRecorder.start();
    setTimeout(() => {
      this.mediaRecorder.stop();
    }, this.latency);
  }

  initialiseRecorder() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.muteButton.disabled = false;
      //This array stores all the audio recorded
      let audioChunks = [];

      this.mediaRecorder.addEventListener("dataavailable", function (event) {
        console.log("Data collected");
        audioChunks.push(event.data);
      });
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        audioChunks = [];

        const fileReader = new FileReader();
        fileReader.readAsDataURL(audioBlob);
        fileReader.onloadend = () => {
          // if (!userStatus.microphone || !userStatus.online) return;

          var base64String = fileReader.result;
          socket.emit("voice", {
            voice: base64String,
            roomName: this.roomName,
          });
        };

        if (!this.loggedInUser.isMute) {
          this.mediaRecorder.start();
          setTimeout(() => {
            this.mediaRecorder.stop();
          }, this.latency);
        }
      });

      if (!this.loggedInUser.isMute) {
        this.mediaRecorder.start();
        setTimeout(() => {
          this.mediaRecorder.stop();
        }, this.latency);
      }
    });
  }
}
