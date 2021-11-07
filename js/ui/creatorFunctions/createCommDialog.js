import { socket, state } from "../../main";
import Dialog from "../Dialogs/Dialog";
import micIcon from "../../../icons/microphone.png";
import chatIcon from "../../../icons/chat.png";
import cancelIcon from "../../../icons/cross.png";
import { baseURL } from "../../constants";
/*  
@params
player {
  name: string,
  avatar: string,
  socId: string,
}

*/
const initiateChat = (type, toSocId) => {
  socket.emit("init-chat", {
    type,
    fromSocId: socket.id,
    toSocId,
  });
};

export default class CommDialog {
  constructor() {
    this.playerApproached = null;
  }

  initiateChat = (type, toSocId) => {
    socket.emit("init-chat", {
      type,
      fromSocId: socket.id,
      toSocId,
    });
  };

  setPlayerApproached(player) {
    if (player !== this.playerApproached) this.playerApproached = player;
  }

  createDialog(player) {
    this.setPlayerApproached(player);
    if (!this.dialog) {
      this.dialog = new Dialog(
        {
          text: `Choose a mode of communication with ${this.playerApproached.username}`,
          inputType: "icon-buttons",
          buttons: [
            {
              text: "Audio",
              icon: micIcon,
              onClickFn: () =>
                this.initiateChat("audio", this.playerApproached.socId),
            },
            {
              text: "Chat",
              icon: chatIcon,
              onClickFn: () =>
                initiateChat("text", this.playerApproached.socId),
            },
            {
              text: "Cancel",
              icon: cancelIcon,
              onClickFn: () => {
                //Close the dialog
              },
            },
          ],
        },
        `${baseURL}/thumbnails/${state.avatar}.png`,
        false,
        true
      );
    }
    this.dialog.show();
  }
}
