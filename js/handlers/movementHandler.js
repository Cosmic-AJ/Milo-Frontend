import { socket, state } from "../main";

export const emitInit = (currentX, currentY) => {
  return new Promise((resolve, reject) => {
    socket.emit(
      "init",
      {
        socId: socket.id,
        name: state.name,
        avatar: state.avatar,
        x: currentX,
        y: currentY,
      },
      (currentPlayers) => {
        resolve(currentPlayers);
      }
    );
  });
};

export const registerMovementListeners = (game) => {
  socket.on("new-player", (player) => {
    game.currentPlayers[player.socId] = player;
    game.otherSprites[player.socId] = game.addPlayer(player);
  });

  socket.on("move-player", (data) => {
    game.needsToUpdate[data.socId] = data.key;
  });

  socket.on("stop-player", (data) => {
    game.needsToUpdate[data.socId] = null;
    const sprite = game.otherSprites[data.socId];
    sprite.setPosition(data.x, data.y);
  });

  socket.on("remove-player", (socketId) => {
    delete game.currentPlayers[socketId];
    game.otherSprites[socketId].destroy();
    delete game.otherSprites[socketId];
  });
};
