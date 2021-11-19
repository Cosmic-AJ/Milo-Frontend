import { TIMEOUT } from "../constants";
import { snackbar, socket } from "../main";
import TextChat from "../ui/Popup/TextChatPopup";

let responseRecieved = false;
let roomName = "";
export const registerChatHandlers = () => {
  socket.on("start-chat", (data) => {
    responseRecieved = true;
    roomName = data.roomName;
    snackbar.configure(
      `Connection established for ${data.type} chat!`,
      "success"
    );
    snackbar.show();
    if (data.type === "text") {
      const chatPopup = new TextChat(roomName, {
        name: "Sandeep",
      });
      chatPopup.show();
    } else if (data.type === "audio") {
      console.log("Opening audio chat popup");
    }
  });

  socket.on("cancel-chat", () => {
    snackbar.configure("The other person turned down the request :/", "sad");
    snackbar.show();
  });
};

export const registerNewMessageListener = (textPopup) => {
  socket.on("add-message", (message) => {
    textPopup.addMessage(message, false);
    //console.log("Adding new messsage", message);
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
  socket.emit("terminate-chat", () => {
    roomName;
  });
};
