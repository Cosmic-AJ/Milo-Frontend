import { snackbar, socket } from "../main";

export const registerAudioChatListener = (audioChatPopup) => {
  socket.on("play-audio", (data) => {
    const audio = new Audio(data);
    audio.play();
  });

  socket.on("participant-mute", () => {
    audioChatPopup.participant.mute();
  });

  socket.on("participant-unmute", () => {
    audioChatPopup.participant.unmute();
  });

  socket.on("chat-exit", () => {
    snackbar.configure(
      `${audioChatPopup.loggedInUser.username} has left the audio chat!`,
      "sad"
    );
    snackbar.show();
    audioChatPopup.close();
  });
};
