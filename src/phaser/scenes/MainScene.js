import Phaser, { Scene } from "phaser";
import { background, obstacle } from "../../constants/assets";
import { config } from "../config";
import { socket, socketApi } from "../../utils/socket";

export default class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
    this.id = null;
    this.roomId = null;
    this.players = {};
    this.playerList = null;
    this.lastDirection = "down";
  }

  set(id, roomId, playersInfo) {
    this.id = id;
    this.roomId = roomId;
    this.playerList = playersInfo;
  }

  preload() {
    this.load.image("background", background.game);

    this.load.image("redcar", obstacle.redcar);
    this.load.image("bluecar", obstacle.bluecar);
    this.load.image("greencar", obstacle.greencar);
    this.load.image("yellowcar", obstacle.yellowcar);

    this.load.once("filecomplete", this.loadPlayersOnComplete, this);
  }

  create() {
    socket.on("send-move-player", player => {
      if (player.id !== this.id) {
        this.players[player.id].play(player.id + player.anims, true);
        this.players[player.id].x = player.coordinateX;
        this.players[player.id].y = player.coordinateY;
      }
    });

    socket.on("send-stop-player", player => {
      if (player.id !== this.id) {
        this.players[player.id].anims.stop();
        this.players[player.id].x = player.coordinateX;
        this.players[player.id].y = player.coordinateY;
      }
    });

    this.createBackground();

    this.createCars();

    this.createCursor();

    for (const player of this.playerList) {
      this.createPlayers(player.id, player.coordinateX, player.coordinateY);
    }

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.cameras.main.startFollow(this.players[this.id], true, 0.09, 0.09);

    this.cameras.main.setZoom(2);
  }

  createBackground() {
    const background = this.add.image(960, 540, "background");
    background.depth = -1;
  }

  createCars() {
    const randomX = Phaser.Math.Between(0, config.width);

    this.redcar = this.physics.add.sprite(randomX, 700, "redcar").setScale(0.5, 0.5);
    this.bluecar = this.physics.add.sprite(randomX, 750, "bluecar").setScale(0.5, 0.5);
    this.greencar = this.physics.add.sprite(randomX, 750, "greencar").setScale(0.5, 0.5);
    this.yellowcar = this.physics.add.sprite(randomX, 810, "yellowcar").setScale(0.5, 0.5);
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  moveCar(car, speed) {
    car.x += speed;

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

  createPlayers(key, coordinateX, coordinateY) {
    this.players[key] = this.physics.add.sprite(coordinateX, coordinateY, key).setScale(2, 2).refreshBody();

    this.players[key].setBounce(0.2);
    this.players[key].setCollideWorldBounds(true);
    this.physics.world.bounds.setTo(0, 500, config.width, config.height - 500);

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
      key: key + "turn",
      frames: [{ key: key, frame: 0 }],
      frameRate: 20,
    });
  }

  update() {
    this.moveCar(this.redcar, 9);
    this.moveCar(this.bluecar, 6);
    this.moveCar(this.greencar, 5);
    this.moveCar(this.yellowcar, 6);

    this.managePlayerMovement();
  }

  managePlayerMovement() {
    if (this.cursors.left.isDown) {
      this.players[this.id].setVelocityX(-160);
      this.players[this.id].anims.play(this.id + "left", true);

      this.lastDirection = "left";

      this.handleMove();
    } else if (this.cursors.right.isDown) {
      this.players[this.id].setVelocityX(160);
      this.players[this.id].anims.play(this.id + "right", true);

      this.lastDirection = "right";

      this.handleMove();
    } else if (this.cursors.up.isDown) {
      this.players[this.id].setVelocityY(-160);
      this.players[this.id].anims.play(this.id + "up", true);

      this.lastDirection = "up";

      this.handleMove();
    } else if (this.cursors.down.isDown) {
      this.players[this.id].setVelocityY(160);
      this.players[this.id].anims.play(this.id + "down", true);

      this.lastDirection = "down";

      this.handleMove();
    } else {
      this.players[this.id].setVelocityX(0);
      this.players[this.id].setVelocityY(0);

      this.players[this.id].anims.play(this.id + this.lastDirection);

      this.handleStop();
    }
  }

  handleMove() {
    const coordinateX = this.players[this.id].x;
    const coordinateY = this.players[this.id].y;

    socketApi.pressArrowKeys(this.roomId, this.id, this.lastDirection, coordinateX, coordinateY);
  }

  handleStop() {
    const coordinateX = this.players[this.id].x;
    const coordinateY = this.players[this.id].y;

    socketApi.offArrowKeys(this.roomId, this.id, this.lastDirection, coordinateX, coordinateY);
  }
}
