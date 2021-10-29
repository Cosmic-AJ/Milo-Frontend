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
    game.needsToUpdate[data.socId] = {
      horizontal: data.horizontal, // int (2 | 4)
      vertical: data.vertical, // int (1 | 3)
    };
  });

  socket.on("stop-player", (data) => {
    const update = game.needsToUpdate[data.socId];
    if (update) {
      update[data.movement] = null;
    }
    const sprite = game.otherSprites[data.socId];
    sprite.setPosition(data.x, data.y);
  });

  socket.on("remove-player", (socketId) => {
    delete game.currentPlayers[socketId];
    game.otherSprites[socketId].destroy();
    delete game.otherSprites[socketId];
  });
};
