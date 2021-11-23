import { Scene } from "phaser";
import { baseURL } from "../constants";
import { registerChatHandlers } from "../handlers/chatHandler";
import {
  emitInit,
  registerMovementListeners,
} from "../handlers/movementHandler";
import { socket, state } from "../main";
import CommDialog from "../ui/creatorFunctions/createCommDialog";
import GamePopup from "../ui/Popup/GamePopup";
import ShopPopup from "../ui/Popup/ShopPopup";
import { generateAnims } from "../utils/generateAnims";

class Home extends Scene {
  constructor() {
    super({
      key: "Home",
    });
  }

  preload() {
    this.avatarName = state.avatar;
    this.needsToUpdate = [];
    this.load.image(
      "tiles",
      `${baseURL}/maps/tilesets/tuxmon-sample-32px-extruded.png`
    );
    this.load.tilemapTiledJSON("map", `${baseURL}/maps/json/tuxemon-town.json`);
  }

  create() {
    this.commDialog = new CommDialog();
    this.shop = new ShopPopup();
    this.gamePopup = new GamePopup();
    //Initialisation of loaded tilesets and json files
    const map = this.make.tilemap({
      key: "map",
    });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    // Creating map layers and assigning them to variables
    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    this.worldLayer = map.createLayer("World", tileset, 0, 0);
    const ticTacToe = map.createLayer("tictactoe", tileset, 0, 0);
    const mathGame = map.createLayer("mathgame", tileset, 0, 0);
    const dinosaurGame = map.createLayer("dinosaurgame", tileset, 0, 0);
    const memoryGame = map.createLayer("memorygame", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
    const interactive = map.createLayer("interactive", tileset, 0, 0);

    // Setting any collision properties for the environment
    this.worldLayer.setCollisionByProperty({ collides: true });
    interactive.setCollisionByProperty({ collides: true });
    ticTacToe.setCollisionByProperty({ collides: true });
    mathGame.setCollisionByProperty({ collides: true });
    dinosaurGame.setCollisionByProperty({ collides: true });
    memoryGame.setCollisionByProperty({ collides: true });

    aboveLayer.setDepth(10);
    // Get spawn point
    const spawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );

    // Adding a sprite character (Our main player)
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, this.avatarName, "front-walk.000")
      .setBodySize(32, 20, true)
      .setSize(20, 32)
      .setOffset(7, 0);
    this.player.scale = 1.2;
    this.player.setPushable(false);
    this.physics.add.collider(this.player, this.worldLayer);
    this.physics.add.collider(this.player, ticTacToe, () => {
      this.gamePopup.setGameType("tictactoe");
      this.gamePopup.show();
    });
    this.physics.add.collider(this.player, mathGame, () => {
      this.gamePopup.setGameType("mathgame");
      this.gamePopup.show();
    });
    this.physics.add.collider(this.player, dinosaurGame, () => {
      this.gamePopup.setGameType("dinosaurgame");
      this.gamePopup.show();
    });
    this.physics.add.collider(this.player, memoryGame, () => {
      this.gamePopup.setGameType("memorygame");
      this.gamePopup.show();
    });
    this.physics.add.collider(this.player, interactive, () => {
      this.shop.show();
    });

    generateAnims(this.player.anims, this.avatarName);
    emitInit(this.player.x, this.player.y).then((currentPlayers) => {
      this.currentPlayers = currentPlayers;
      this.addPlayersToScene();
    });
    registerMovementListeners(this);
    registerChatHandlers(this);

    //Initialise camera
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyDownSent = {
      vertical: "ready",
      horizontal: "ready",
    };
  }

  update(time, delta) {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    // Sending vertical movement key stroke
    if (
      this.keyDownSent.vertical === "ready" &&
      (this.cursors.down.isDown || this.cursors.up.isDown)
    ) {
      socket.emit("player-key-down", {
        socId: socket.id,
        key: this.getKeyPress(this.cursors, "vertical"),
      });
      this.keyDownSent.vertical = "sent";
    }

    if (
      this.keyDownSent.horizontal === "ready" &&
      (this.cursors.left.isDown || this.cursors.right.isDown)
    ) {
      socket.emit("player-key-down", {
        socId: socket.id,
        key: this.getKeyPress(this.cursors, "horizontal"),
      });
      this.keyDownSent.horizontal = "sent";
    }

    if (
      this.keyDownSent.vertical === "sent" &&
      this.cursors.down.isUp &&
      this.cursors.up.isUp
    ) {
      socket.emit("player-key-up", {
        socId: socket.id,
        movement: "vertical",
        x: this.player.x,
        y: this.player.y,
      });
      this.keyDownSent.vertical = "ready";
    }
    if (
      this.keyDownSent.horizontal === "sent" &&
      this.cursors.left.isUp &&
      this.cursors.right.isUp
    ) {
      socket.emit("player-key-up", {
        socId: socket.id,
        movement: "horizontal",
        x: this.player.x,
        y: this.player.y,
      });
      this.keyDownSent.horizontal = "ready";
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
    sprite.setPushable(false);
    this.physics.add.collider(this.player, sprite, (player1, player2) => {
      this.commDialog.createDialog(player);
    });
    this.physics.add.collider(sprite, this.worldLayer);
    sprite.socId = player.socId;
    sprite.scale = 1.2;
    generateAnims(sprite.anims, player.avatar);
    return sprite;
  }

  getKeyPress(cursors, direction) {
    if (direction === "vertical") {
      if (cursors.up.isDown) {
        return 1;
      } else if (cursors.down.isDown) {
        return 3;
      }
    } else {
      if (cursors.right.isDown) {
        return 2;
      } else if (cursors.left.isDown) {
        return 4;
      }
    }
  }

  moveOtherPlayers(speed) {
    //Check if other players
    Object.keys(this.needsToUpdate).forEach((socId) => {
      const sprite = this.otherSprites[socId];
      const avatar = this.currentPlayers[socId].avatar;
      const prevVelocity = sprite.body.velocity.clone();
      const key = this.needsToUpdate[socId];

      sprite.body.setVelocity(0);
      if (key.horizontal || key.vertical) {
        if (key.horizontal === 4) {
          sprite.body.setVelocityX(-speed);
        } else if (key.horizontal === 2) {
          sprite.body.setVelocityX(speed);
        }
        if (key.vertical === 1) {
          sprite.body.setVelocityY(-speed);
        } else if (key.vertical === 3) {
          sprite.body.setVelocityY(speed);
        }
        //playing animation
        if (key.horizontal === 4) {
          sprite.anims.play("left-walk", true);
        } else if (key.horizontal === 2) {
          sprite.anims.play("right-walk", true);
        }
        if (key.vertical === 1) {
          sprite.anims.play("back-walk", true);
        } else if (key.vertical === 3) {
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

export default Home;
