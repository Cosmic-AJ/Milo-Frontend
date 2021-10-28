export const generateAnims = (anims, avatarName) => {
  anims.create({
    key: "left-walk",
    frames: anims.generateFrameNames(avatarName, {
      prefix: "left-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "right-walk",
    frames: anims.generateFrameNames(avatarName, {
      prefix: "right-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "front-walk",
    frames: anims.generateFrameNames(avatarName, {
      prefix: "front-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "back-walk",
    frames: anims.generateFrameNames(avatarName, {
      prefix: "back-walk.",
      start: 0,
      end: 2,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
};
