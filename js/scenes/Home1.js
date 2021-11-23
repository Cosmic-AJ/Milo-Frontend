import { Scene } from "phaser";
import { baseURL } from "../constants";
import Dialog from "../ui/Dialogs/Dialog";
import handleLogin from "../handlers/loginHandler";
import handleSignup from "../handlers/signupHandler";
import { decideFace } from "../utils/decideFace";
import { generateAnims } from "../utils/generateAnims";
import { setState, state } from "../main";
import { avatarList } from "../utils/avatarList";
import Stats from "../ui/Alerts/Stats";

class Home1 extends Scene {
  constructor() {
    super({
      key: "Home1",
    });
  }

  preload() {
    const user = localStorage.getItem("user");
    if (user) {
      setState(JSON.parse(user));
    }
    this.avatarName = state.avatar || "cap_blue_boy";
    this.load.image(
      "login_tiles",
      `${baseURL}/maps/tilesets/tuxmon-sample-32px-extruded.png`
    );
    this.load.tilemapTiledJSON("login_map", `${baseURL}/maps/json/login.json`);

    avatarList.forEach((avatar) =>
      this.load.atlas(
        avatar.name,
        `${baseURL}/characters/sprites/${avatar.name}.png`,
        `${baseURL}/characters/json/spritesheet.json`
      )
    );
    this.dialog = new Dialog(
      {
        text: `Hey, do you want to <span class="hy">Login</span> or <span class="hy">Sign Up</span>?`,
        inputType: "buttons",
        buttons: [
          {
            text: "Login",
            onClickFn: () => handleLogin(this),
          },
          {
            text: "Sign Up",
            onClickFn: () => handleSignup(this),
          },
        ],
      },
      `${baseURL}/thumbnails/bald_blue_boy.png`,
      false,
      true,
      () => {
        this.resume();
        this.updatePlayer();
      }
    );
    if (localStorage.getItem("JWT")) {
      this.stats = new Stats(state);
    }
  }

  create() {
    //Initialisation of loaded tilesets and json files
    const map = this.make.tilemap({
      key: "login_map",
    });
    const tileset = map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "login_tiles"
    );

    // Creating map layers and assigning them to variables
    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
    const interactive = map.createLayer("interactive", tileset, 0, 0);

    // Setting any collision properties for the environment
    worldLayer.setCollisionByProperty({ collides: true });
    interactive.setCollisionByProperty({ collides: true });

    aboveLayer.setDepth(10);
    // Get spawn point
    const spawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Spawn Point"
    );

    const loginSpawnPoint = map.findObject(
      "Objects",
      (obj) => obj.name === "Login Spawn Point"
    );

    // Adding a sprite character (Our main player)
    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, this.avatarName, "front-walk.000")
      .setBodySize(32, 20, true)
      .setSize(20, 32)
      .setOffset(7, 0);
    this.player.scale = 1.3;

    this.physics.add.collider(this.player, worldLayer);
    this.loginSprite = this.physics.add
      .sprite(
        loginSpawnPoint.x,
        loginSpawnPoint.y,
        "bald_blue_boy",
        "right-walk.000"
      )
      .setSize(20, 32)
      .setOffset(7, 0);
    this.loginSprite.scale = 1.3;
    this.loginSprite.body.immovable = true;

    this.physics.add.collider(this.player, this.loginSprite, (collision) => {
      decideFace(this.loginSprite, "bald_blue_boy", {
        x: collision.x,
        y: collision.y,
      });
      this.pause();
      this.dialog.show();
    });

    this.physics.add.collider(this.player, interactive, () => {
      if (state && localStorage.getItem("JWT")) {
        if (!this.stats) {
          this.stats = new Stats(state);
        }
        this.scene.start("Home");
      } else {
        console.log("Need to login or signup");
      }
    });

    generateAnims(this.player.anims, this.avatarName);

    //Initialise camera
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

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
  }

  pause() {
    // this.physics.pause();
    this.input.keyboard.disableGlobalCapture();
    //this.player.anims.pauseAll();
  }

  resume() {
    // this.physics.resume();
    this.input.keyboard.enableGlobalCapture();
    //this.player.anims.resumeAll();
  }

  updatePlayer() {
    if (localStorage.getItem("JWT")) {
      this.avatarName = state.avatar;
      this.player.anims.remove("front-walk");
      this.player.anims.remove("back-walk");
      this.player.anims.remove("left-walk");
      this.player.anims.remove("right-walk");
      generateAnims(this.player.anims, this.avatarName);
      this.player.setTexture(this.avatarName, "back-walk.000");
    }
  }
}

export default Home1;
