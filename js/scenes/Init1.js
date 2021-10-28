import { Scene } from "phaser";
import { baseURL } from "../constants";
import { setState, socket, state } from "../main";
import { generateAnims } from "../utils/generateAnims";

export class Init1 extends Scene {
  constructor() {
    super({
      key: "Init1",
    });
  }

  preload() {
    this.avatarName = state.avatar;
    this.needsToUpdate = [];
    this.load.image("tiles", `${baseURL}/maps/tilesets/BeachTileset.png`);
    this.load.tilemapTiledJSON("beach", `${baseURL}/maps/json/beach.json`);
  }

  create() {
    //Initialisation of loaded tilesets and json files
    const map = this.make.tilemap({
      key: "beach",
      tileWidth: 32,
      tileHeight: 32,
    });
    const tileset = map.addTilesetImage("beach", "tiles");

    // Creating map layers and assigning them to variables
    const ground = map.createLayer("ground", tileset, 0, 0);
    const interactive = map.createLayer("interactiveLayer", tileset, 0, 0);
    const water = map.createLayer("water", tileset, 0, 0);

    // Setting any collision properties for the environment
    interactive.setCollisionByProperty({ collides: true });
    water.setCollisionByProperty({ collides: true });
    // Get spawn point
    const spawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );

    // Adding a sprite character (Our main player)
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, this.avatarName, "front-walk.000")
      .setBodySize(32, 20, true)
      .setSize(20, 30)
      .setOffset(0, 0);

    this.physics.add.collider(this.player, water);
    console.log("MY SOCKET ID: ", socket.id);

    socket.emit(
      "init",
      {
        socId: socket.id,
        name: state.name,
        avatar: state.avatar,
        x: this.player.x,
        y: this.player.y,
      },
      (currentPlayers) => {
        this.currentPlayers = currentPlayers;
        this.addPlayersToScene();
      }
    );
    /* data: {
        id: string (socketId),
        playerInfo: {
          name: String,
          avatar: String,
          x: number,
          y: number
        }
      } */
    socket.on("new-player", (player) => {
      this.currentPlayers[player.socId] = player;
      this.otherSprites[player.socId] = this.addPlayer(player);
      console.log(this.otherSprites);
    });

    socket.on("move-player", (data) => {
      this.needsToUpdate[data.socId] = data.key;
    });

    socket.on("stop-player", (data) => {
      this.needsToUpdate[data.socId] = null;
      const sprite = this.otherSprites[data.socId];
      sprite.setPosition(data.x, data.y);
    });

    socket.on("remove-player", (socketId) => {
      delete this.currentPlayers[socketId];
      // this.otherSprites.find(sprite => sprite.socId === socketId);
      // this.otherSprites.
    });

    generateAnims(this.player.anims, this.avatarName);

    //Initialise camera
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyDownSent = "ready";
  }

  update(time, delta) {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();
    if (
      this.keyDownSent === "ready" &&
      (this.cursors.down.isDown ||
        this.cursors.up.isDown ||
        this.cursors.left.isDown ||
        this.cursors.right.isDown)
    ) {
      socket.emit("player-key-down", {
        socId: socket.id,
        key: this.getKeyPress(this.cursors),
      });
      this.keyDownSent = "sent";
    }

    if (
      this.keyDownSent === "sent" &&
      this.cursors.down.isUp &&
      this.cursors.up.isUp &&
      this.cursors.left.isUp &&
      this.cursors.right.isUp
    ) {
      socket.emit("player-key-up", {
        socId: socket.id,
        x: this.player.x,
        y: this.player.y,
      });
      this.keyDownSent = "ready";
    }

    // Stop any previous movement from the last frame
    this.player.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player.anims.play("left-walk", true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play("right-walk", true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play("back-walk", true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play("front-walk", true);
    } else {
      this.player.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0)
        this.player.setTexture(this.avatarName, "left-walk.000");
      else if (prevVelocity.x > 0)
        this.player.setTexture(this.avatarName, "right-walk.000");
      else if (prevVelocity.y < 0)
        this.player.setTexture(this.avatarName, "back-walk.000");
      else if (prevVelocity.y > 0)
        this.player.setTexture(this.avatarName, "front-walk.000");
    }

    this.moveOtherPlayers(speed);
  }

  addPlayersToScene() {
    this.otherSprites = [];
    Object.keys(this.currentPlayers).forEach((playerSocId) => {
      if (playerSocId !== socket.id) {
        this.otherSprites[playerSocId] = this.addPlayer(
          this.currentPlayers[playerSocId]
        );
      }
    });
  }

  addPlayer(player) {
    const sprite = this.physics.add.sprite(
      player.x,
      player.y,
      player.avatar,
      "left-walk.000"
    );
    sprite.socId = player.socId;
    generateAnims(sprite.anims, player.avatar);
    return sprite;
  }

  getKeyPress(cursors) {
    if (cursors.up.isDown) {
      return 1;
    } else if (cursors.right.isDown) {
      return 2;
    } else if (cursors.down.isDown) {
      return 3;
    } else if (cursors.left.isDown) {
      return 4;
    }
  }

  moveOtherPlayers(speed) {
    //Check if other players
    Object.keys(this.needsToUpdate).forEach((socId) => {
      const sprite = this.otherSprites[socId];
      const avatar = this.currentPlayers[socId].avatar;
      const prevVelocity = sprite.body.velocity.clone();
      const key = this.needsToUpdate[socId]; //Return 1 | 2 | 3 | 4

      sprite.body.setVelocity(0);
      if (key) {
        if (key === 4) {
          sprite.body.setVelocityX(-speed);
          sprite.anims.play("left-walk", true);
        } else if (key === 2) {
          sprite.body.setVelocityX(speed);
          sprite.anims.play("right-walk", true);
        } else if (key === 1) {
          sprite.body.setVelocityY(-speed);
          sprite.anims.play("back-walk", true);
        } else if (key === 3) {
          sprite.body.setVelocityY(speed);
          sprite.anims.play("front-walk", true);
        }
        sprite.body.velocity.normalize().scale(speed);
      } else {
        sprite.anims.stop();
        if (prevVelocity.x < 0) sprite.setTexture(avatar, "left-walk.000");
        else if (prevVelocity.x > 0)
          sprite.setTexture(avatar, "right-walk.000");
        else if (prevVelocity.y < 0) sprite.setTexture(avatar, "back-walk.000");
        else if (prevVelocity.y > 0)
          sprite.setTexture(avatar, "front-walk.000");
        delete this.needsToUpdate[socId];
      }
    });
  }
}
