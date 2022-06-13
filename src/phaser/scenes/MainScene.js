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
    this.players = {};
    this.playerList = [];
    this.currentDirection = "stop";
  }

  set(id, role, roomId, playerList) {
    this.id = id;
    this.role = role;
    this.roomId = roomId;
    this.playerList = playerList;
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

        this.players[player.id].anims.play(id + currentDirection, true);
        this.players[player.id].x = coordinateX;
        this.players[player.id].y = coordinateY;
      }
    });

    socket.on("send-stop-player", player => {
      if (player.id !== this.id) {
        const { id, currentDirection, coordinateX, coordinateY } = player;

        this.players[id].anims.play(id + currentDirection);
        this.players[id].x = coordinateX;
        this.players[id].y = coordinateY;
      }
    });

    socket.on("send-collided-player", playerId => {
      this.players[playerId].alpha === 1 ? (this.players[playerId].alpha = 0.5) : (this.players[playerId].alpha = 1);
    });

    socket.on("send-arrested-player", playerId => {
      this.players[playerId].setVisible(false);
    });

    this.carGroup = this.add.group();
    this.policeGroup = this.add.group();
    this.robberGroup = this.add.group();

    this.createBackground();

    this.createCars();

    this.createCursor();

    for (const player of this.playerList) {
      const { id, role, coordinateX, coordinateY } = player;

      this.createPlayers(id, role, coordinateX, coordinateY);
    }

    if (this.role === "police") {
      this.physics.add.overlap(this.players[this.id], this.carGroup, this.collideCar, null, this);
    } else {
      this.physics.add.overlap(this.players[this.id], this.policeGroup, this.arrest, null, this);
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
    this.redcar = this.physics.add.sprite(400, 700, "redcar").setScale(0.5, 0.5);
    this.bluecar = this.physics.add.sprite(500, 750, "bluecar").setScale(0.5, 0.5);
    this.greencar = this.physics.add.sprite(600, 750, "greencar").setScale(0.5, 0.5);
    this.yellowcar = this.physics.add.sprite(700, 810, "yellowcar").setScale(0.5, 0.5);

    this.carGroup.add(this.redcar);
    this.carGroup.add(this.bluecar);
    this.carGroup.add(this.greencar);
    this.carGroup.add(this.yellowcar);
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

  createPlayers(key, role, coordinateX, coordinateY) {
    this.players[key] = this.physics.add.sprite(coordinateX, coordinateY, key).setScale(2, 2).refreshBody();

    this.players[key].setBounce(0.2);
    this.players[key].setCollideWorldBounds(true);
    this.physics.world.bounds.setTo(0, 500, config.width, config.height - 500);

    if (role === "police") {
      this.policeGroup.add(this.players[key]);
    } else {
      this.robberGroup.add(this.players[key]);
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
    this.moveCar(this.redcar, 9);
    this.moveCar(this.bluecar, 6);
    this.moveCar(this.greencar, 5);
    this.moveCar(this.yellowcar, 6);

    this.managePlayerMovement(this.id);
  }

  managePlayerMovement(key) {
    if (this.cursors.left.isDown && this.players[key].alpha === 1) {
      this.players[key].setVelocityX(-160);
      this.players[key].anims.play(key + "left", true);

      this.currentDirection = "left";
    } else if (this.cursors.right.isDown && this.players[key].alpha === 1) {
      this.players[key].setVelocityX(160);
      this.players[key].anims.play(key + "right", true);

      this.currentDirection = "right";
    } else if (this.cursors.up.isDown && this.players[key].alpha === 1) {
      this.players[key].setVelocityY(-160);
      this.players[key].anims.play(key + "up", true);

      this.currentDirection = "up";
    } else if (this.cursors.down.isDown && this.players[key].alpha === 1) {
      this.players[key].setVelocityY(160);
      this.players[key].anims.play(key + "down", true);

      this.currentDirection = "down";
    } else {
      this.players[key].setVelocity(0);

      this.players[key].anims.play(key + this.currentDirection);

      return this.handleStop();
    }

    this.handleMove();
  }

  handleMove() {
    const coordinateX = this.players[this.id].x;
    const coordinateY = this.players[this.id].y;

    socketApi.pressArrowKeys(this.roomId, this.id, this.currentDirection, coordinateX, coordinateY);
  }

  handleStop() {
    const coordinateX = this.players[this.id].x;
    const coordinateY = this.players[this.id].y;

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

    this.cameras.main.startFollow(this.players[this.id], false, 0.09, 0.09);
    this.cameras.main.setZoom(1);
  }
}
