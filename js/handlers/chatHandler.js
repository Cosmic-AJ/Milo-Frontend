import { socket } from "../main";
import Dialog from "../ui/Dialogs/Dialog";

socket.on("chat-request", (data) => {
  const requestDialog = new Dialog({
    text: `${data.senderName}`,
    inputType: "icon-buttons",
    buttons: [
      {
        text: "Accept",
        onClickFn: () => {},
      },
      {
        text: "Deny",
        onClickFn: () => {},
      },
      {
        text: "Go for text",
        onClickFn: () => {},
      },
    ],
  });
});
