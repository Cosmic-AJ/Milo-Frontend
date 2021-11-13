import { socket, state } from "../../main";
import Dialog from "../Dialogs/Dialog";
import micIcon from "../../../icons/microphone.png";
import chatIcon from "../../../icons/chat.png";
import cancelIcon from "../../../icons/cross.png";
import { baseURL } from "../../constants";
import { initiateChat } from "../../handlers/chatHandler";
/*  
@params
player {
  name: string,
  avatar: string,
  socId: string,
}

*/
export default class CommDialog {
  constructor() {
    this.playerApproached = null;
  }

  setPlayerApproached(player) {
    if (player !== this.playerApproached) this.playerApproached = player;
  }

  createDialog(player) {
    this.setPlayerApproached(player);
    if (!this.dialog) {
      this.dialog = new Dialog(
        {
          text: `Choose a mode of communication with ${this.playerApproached.name}`,
          inputType: "icon-buttons",
          buttons: [
            {
              text: "Audio",
              icon: micIcon,
              onClickFn: () =>
                initiateChat("audio", this.playerApproached.socId, this.dialog),
            },
            {
              text: "Chat",
              icon: chatIcon,
              onClickFn: () =>
                initiateChat("text", this.playerApproached.socId, this.dialog),
            },
            {
              text: "Cancel",
              icon: cancelIcon,
              onClickFn: () => {
                initiateChat(
                  "cancel",
                  this.playerApproached.socId,
                  this.dialog
                );
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
