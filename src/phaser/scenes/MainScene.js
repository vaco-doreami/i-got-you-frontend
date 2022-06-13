import { Scene } from "phaser";
import { background, obstacle } from "../../constants/assets";
import { config } from "../config";
import { socket, socketApi } from "../../utils/socket";

export default class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });

    this.id = null;
    this.role = null;
    this.roomId = null;
    this.playerList = [];
    this.spritePlayers = {};
    this.spriteNicknames = {};
    this.currentDirection = "stop";
    this.isStart = false;
  }

  initialize(id, role, roomId, playerList) {
    this.id = id;
    this.role = role;
    this.roomId = roomId;
    this.playerList = playerList;
  }

  gameSet(isStart) {
    this.isStart = isStart;
  }

  preload() {
    this.load.image("background", background.game);

    for (const carName in obstacle) {
      this.load.image(carName, obstacle[carName]);
    }

    this.load.once("filecomplete", this.loadPlayersOnComplete, this);
  }

  create() {
    socket.on("send-move-player", player => {
      if (player.id !== this.id) {
        const { id, currentDirection, coordinateX, coordinateY } = player;

        this.spritePlayers[id].anims.play(id + currentDirection, true);
        this.spritePlayers[id].x = coordinateX;
        this.spritePlayers[id].y = coordinateY;

        this.spriteNicknames[id].x = this.spritePlayers[id].body.position.x;
        this.spriteNicknames[id].y = this.spritePlayers[id].body.position.y - 10;
      }
    });

    socket.on("send-stop-player", player => {
      if (player.id !== this.id) {
        const { id, currentDirection, coordinateX, coordinateY } = player;

        this.spritePlayers[id].anims.play(id + currentDirection);
        this.spritePlayers[id].x = coordinateX;
        this.spritePlayers[id].y = coordinateY;

        this.spriteNicknames[id].x = this.spritePlayers[id].body.position.x;
        this.spriteNicknames[id].y = this.spritePlayers[id].body.position.y - 10;
      }
    });

    socket.on("send-collided-player", playerId => {
      this.spritePlayers[playerId].alpha === 1 ? (this.spritePlayers[playerId].alpha = 0.5) : (this.spritePlayers[playerId].alpha = 1);
    });

    socket.on("send-arrested-player", playerId => {
      this.spritePlayers[playerId].setVisible(false);
      this.spriteNicknames[playerId].setVisible(false);
    });

    this.carGroup = this.add.group();
    this.policeGroup = this.add.group();
    this.robberGroup = this.add.group();

    this.createBackground();

    this.createCars();

    this.createCursor();

    for (const player of this.playerList) {
      const { id, nickname, role, coordinateX, coordinateY } = player;

      this.createPlayers(id, nickname, role, coordinateX, coordinateY);
    }

    if (this.role === "police") {
      this.physics.add.overlap(this.spritePlayers[this.id], this.carGroup, this.collideCar, null, this);
    } else {
      this.physics.add.overlap(this.spritePlayers[this.id], this.policeGroup, this.arrest, null, this);
    }

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.cameras.main.startFollow(this.spritePlayers[this.id], true, 0.09, 0.09);

    this.cameras.main.setZoom(2);
  }

  createBackground() {
    const background = this.add.image(960, 540, "background");
    background.depth = -1;
  }

  createCars() {
    this.redcar = this.physics.add.sprite(0, 700, "redcar").setScale(0.5, 0.5).setVelocityX(400);
    this.bluecar = this.physics.add.sprite(0, 750, "bluecar").setScale(0.5, 0.5).setVelocityX(600);
    this.greencar = this.physics.add.sprite(0, 750, "greencar").setScale(0.5, 0.5).setVelocityX(300);
    this.yellowcar = this.physics.add.sprite(0, 810, "yellowcar").setScale(0.5, 0.5).setVelocityX(800);

    this.carGroup.add(this.redcar);
    this.carGroup.add(this.bluecar);
    this.carGroup.add(this.greencar);
    this.carGroup.add(this.yellowcar);
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  moveCar(car) {
    if (car.x > config.width) {
      car.x = 0;
    }
  }

  loadPlayersOnComplete() {
    this.playerList.forEach(player => {
      const { id, characterPath } = player;

      this.load.spritesheet(id, characterPath, { frameWidth: 32, frameheight: 50 });
    });
  }

  createPlayers(key, nickname, role, coordinateX, coordinateY) {
    this.spritePlayers[key] = this.physics.add.sprite(coordinateX, coordinateY, key).setScale(2, 2).refreshBody();

    const color = this.role === role ? "blue" : "red";
    this.spriteNicknames[key] = this.add.text(this.spritePlayers[key].x, this.spritePlayers[key].y - 10, nickname, { fontSize: "16px", color: color, align: "center" });

    this.spritePlayers[key].setBounce(0.2);
    this.spritePlayers[key].setCollideWorldBounds(true);
    this.physics.world.bounds.setTo(0, 500, config.width, config.height - 500);

    if (role === "police") {
      this.policeGroup.add(this.spritePlayers[key]);
    } else {
      this.robberGroup.add(this.spritePlayers[key]);
    }

    this.anims.create({
      key: key + "left",
      frames: this.anims.generateFrameNumbers(key, { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: key + "right",
      frames: this.anims.generateFrameNumbers(key, { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: key + "down",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: key + "up",
      frames: this.anims.generateFrameNumbers(key, { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: key + "stop",
      frames: [{ key: key, frame: 0 }],
      frameRate: 20,
    });
  }

  update() {
    this.moveCar(this.redcar);
    this.moveCar(this.bluecar);
    this.moveCar(this.greencar);
    this.moveCar(this.yellowcar);

    this.managePlayerMovement(this.id);
  }

  managePlayerMovement(key) {
    if (this.isStart) {
      if (this.cursors.left.isDown && this.spritePlayers[key].alpha === 1) {
        this.spritePlayers[key].setVelocityX(-160);
        this.spritePlayers[key].anims.play(key + "left", true);

        this.currentDirection = "left";
      } else if (this.cursors.right.isDown && this.spritePlayers[key].alpha === 1) {
        this.spritePlayers[key].setVelocityX(160);
        this.spritePlayers[key].anims.play(key + "right", true);

        this.currentDirection = "right";
      } else if (this.cursors.up.isDown && this.spritePlayers[key].alpha === 1) {
        this.spritePlayers[key].setVelocityY(-160);
        this.spritePlayers[key].anims.play(key + "up", true);

        this.currentDirection = "up";
      } else if (this.cursors.down.isDown && this.spritePlayers[key].alpha === 1) {
        this.spritePlayers[key].setVelocityY(160);
        this.spritePlayers[key].anims.play(key + "down", true);

        this.currentDirection = "down";
      } else {
        this.spritePlayers[key].setVelocity(0);

        this.spritePlayers[key].anims.play(key + this.currentDirection);

        this.spriteNicknames[key].x = this.spritePlayers[key].body.position.x;
        this.spriteNicknames[key].y = this.spritePlayers[key].body.position.y - 10;

        return this.handleStop();
      }
    }

    this.spriteNicknames[key].x = this.spritePlayers[key].body.position.x;
    this.spriteNicknames[key].y = this.spritePlayers[key].body.position.y - 10;

    this.handleMove();
  }

  handleMove() {
    const coordinateX = this.spritePlayers[this.id].x;
    const coordinateY = this.spritePlayers[this.id].y;

    socketApi.pressArrowKeys(this.roomId, this.id, this.currentDirection, coordinateX, coordinateY);
  }

  handleStop() {
    const coordinateX = this.spritePlayers[this.id].x;
    const coordinateY = this.spritePlayers[this.id].y;

    socketApi.offArrowKeys(this.roomId, this.id, this.currentDirection, coordinateX, coordinateY);
  }

  collideCar(player) {
    if (player.alpha === 1) {
      socketApi.policeOpacityChanged(this.roomId, this.id);

      const timer = setTimeout(() => {
        socketApi.policeOpacityChanged(this.roomId, this.id);

        clearTimeout(timer);
      }, 3000);
    }
  }

  arrest() {
    socketApi.arrestRobber(this.roomId, this.id);

    this.cameras.main.startFollow(this.spritePlayers[this.id], false, 0.09, 0.09);
    this.cameras.main.setZoom(1);
  }
}
