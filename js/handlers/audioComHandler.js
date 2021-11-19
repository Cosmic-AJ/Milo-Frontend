import { snackbar, socket } from "../main";

export const registerAudioChatListener = () => {
  socket.on("play-audio", (data) => {
    const audio = new Audio(data);
    audio.play();
  });
};
