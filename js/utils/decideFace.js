export const decideFace = (sprite, atlasKey, colCoords) => {
  const xDiff = sprite.x - colCoords.x;
  const yDiff = sprite.y - colCoords.y;
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    xDiff > 0
      ? sprite.setTexture(atlasKey, "left-walk.000")
      : sprite.setTexture(atlasKey, "right-walk.000");
  } else {
    yDiff > 0
      ? sprite.setTexture(atlasKey, "back-walk.000")
      : sprite.setTexture(atlasKey, "front-walk.000");
  }
};
