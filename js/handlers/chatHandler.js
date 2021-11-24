import { TIMEOUT } from "../constants";
import { snackbar, socket, state } from "../main";
import AudioChat from "../ui/Popup/AudioChatPopup";
import TextChat from "../ui/Popup/TextChatPopup";

let responseRecieved = false;
let roomName = "";
export const registerChatHandlers = (game) => {
  socket.on("start-chat", (data) => {
    const participant = data.participants.filter(
      (player) => player.socId !== socket.id
    )[0];
    console.log(participant);
    responseRecieved = true;
    roomName = data.roomName;
    snackbar.configure(
      `Connection established for ${data.type} chat!`,
      "success"
    );
    snackbar.show();
    if (data.type === "text") {
      const chatPopup = new TextChat(roomName, {
        name: participant.name,
      });
      chatPopup.show();
    } else if (data.type === "audio") {
      const audioPopup = new AudioChat(roomName, {
        username: participant.name,
        avatar: participant.avatar,
      });
      audioPopup.show();
    }
  });

  socket.on("cancel-chat", () => {
    snackbar.configure("The other person turned down the request :/", "sad");
    snackbar.show();
    game.commDialog.dialog.closeAlert();
  });
};

export const registerNewMessageListener = (textPopup) => {
  socket.on("add-message", (message) => {
    textPopup.addMessage(message, false);
    //console.log("Adding new messsage", message);
  });

  socket.on("chat-exit", () => {
    snackbar.configure(`${state.username} has left the chat!`, "sad");
    snackbar.show();
    console.log("Got a request to close chatwin");
  });
};

export const initiateChat = (type, toSocId, dialog) => {
  socket.emit("init-chat", {
    type,
    fromSocId: socket.id,
    toSocId,
  });
  dialog.closeAlert();
  snackbar.configure("Request Sent! waiting for response", "waiting");
  snackbar.show();
  setTimeout(() => {
    //Tell the sender that no response was recieved
    if (responseRecieved) return;
    snackbar.configure("There is no response from the other side", "sad");
    socket.emit("cancel-request", {
      fromSocId: socket.id,
    });
  }, TIMEOUT * 1000);
};

export const sendMessage = (message, roomName) => {
  socket.emit("new-message", {
    roomName,
    message,
  });
};

export const terminateChat = (roomName) => {
  socket.emit("chat-exit", roomName);
};
