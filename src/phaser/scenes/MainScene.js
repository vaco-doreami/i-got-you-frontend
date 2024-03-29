import { Scene } from "phaser";
import { background, obstacle } from "../../constants/assets";
import { config } from "../config";
import { socket, socketApi } from "../../utils/socket";

import { SEND_COLLIDED_PLAYER, SEND_MOVE_PLAYER, SEND_STOP_PLAYER } from "../../constants/phaser";

export default class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });

    this.id = null;
    this.role = null;
    this.roomId = null;
    this.waiting = true;
    this.isStart = false;
    this.playerList = [];
    this.playerSprites = {};
    this.nicknameSprites = {};
    this.currentDirection = "stop";
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

  makeRobberInvisible(playerId, time) {
    const timer = setInterval(() => {
      time -= 1;

      this.playerSprites[playerId].alpha === 1 ? (this.playerSprites[playerId].alpha = 0.2) : (this.playerSprites[playerId].alpha = 1);

      if (time === 0) {
        this.playerSprites[playerId].setVisible(false);
        this.nicknameSprites[playerId].setVisible(false);

        if (this.id === playerId) this.cameras.main.startFollow(this.playerSprites[playerId], false, 0.09, 0.09).setZoom(1);

        clearInterval(timer);
      }
    }, 600);
  }

  playerLeaveGame(playerId) {
    this.playerSprites[playerId].setVisible(false);
    this.nicknameSprites[playerId].setVisible(false);
  }

  preload() {
    this.load.image("background", background.game);

    for (const carName in obstacle) {
      this.load.image(carName, obstacle[carName]);
    }

    this.load.once("filecomplete", this.loadPlayersOnComplete, this);
  }

  create() {
    socket.on(SEND_MOVE_PLAYER, player => {
      if (player.id !== this.id) {
        const { id, currentDirection, coordinateX, coordinateY } = player;

        this.playerSprites[id].anims.play(id + currentDirection, true);
        this.playerSprites[id].x = coordinateX;
        this.playerSprites[id].y = coordinateY;

        this.nicknameSprites[id].x = this.playerSprites[id].body.position.x;
        this.nicknameSprites[id].y = this.playerSprites[id].body.position.y - 10;
      }
    });

    socket.on(SEND_STOP_PLAYER, player => {
      if (player.id !== this.id) {
        const { id, currentDirection, coordinateX, coordinateY } = player;

        this.playerSprites[id].anims.play(id + currentDirection);
        this.playerSprites[id].x = coordinateX;
        this.playerSprites[id].y = coordinateY;

        this.nicknameSprites[id].x = this.playerSprites[id].body.position.x;
        this.nicknameSprites[id].y = this.playerSprites[id].body.position.y - 10;
      }
    });

    socket.on(SEND_COLLIDED_PLAYER, playerId => {
      this.playerSprites[playerId].alpha === 1 ? (this.playerSprites[playerId].alpha = 0.5) : (this.playerSprites[playerId].alpha = 1);
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
      this.physics.add.overlap(this.playerSprites[this.id], this.carGroup, this.collideCar, null, this);
    } else {
      this.physics.add.overlap(this.playerSprites[this.id], this.policeGroup, this.arrestRobber, null, this);
    }

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.cameras.main.startFollow(this.playerSprites[this.id], true, 0.09, 0.09);

    this.cameras.main.setZoom(2.5);
  }

  createBackground() {
    this.background = this.add.image(960, 540, "background");
    this.background.depth = -1;
  }

  createCars() {
    this.redcar = this.physics.add.sprite(0, 700, "redcar").setScale(0.5, 0.5).setVelocityX(400).setFlipX(true);
    this.bluecar = this.physics.add.sprite(0, 750, "bluecar").setScale(0.5, 0.5).setVelocityX(600);
    this.greencar = this.physics.add.sprite(0, 750, "greencar").setScale(0.5, 0.5).setVelocityX(300);
    this.yellowcar = this.physics.add.sprite(0, 810, "yellowcar").setScale(0.5, 0.5).setVelocityX(800).setFlipX(true);

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

      this.load.spritesheet(id, characterPath, {
        frameWidth: 32,
        frameheight: 50,
      });
    });
  }

  createPlayers(key, nickname, role, coordinateX, coordinateY) {
    this.playerSprites[key] = this.physics.add.sprite(coordinateX, coordinateY, key).setScale(2, 2).refreshBody();

    const color = this.role === role ? "blue" : "red";
    this.nicknameSprites[key] = this.add.text(this.playerSprites[key].x, this.playerSprites[key].y - 10, nickname, {
      fontSize: "16px",
      align: "center",
      color,
    });

    this.playerSprites[key].setBounce(0.2);
    this.playerSprites[key].setCollideWorldBounds(true);
    this.physics.world.bounds.setTo(0, 500, config.width, config.height - 500);

    if (role === "police") {
      this.policeGroup.add(this.playerSprites[key]);
    } else {
      this.robberGroup.add(this.playerSprites[key]);
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

    this.throttle(this.contactPolice, 1000, this.policeGroup.children.entries[0], this.policeGroup.children.entries[1], this.roomId);
  }

  managePlayerMovement(key) {
    let speed;

    if (this.isStart) {
      if (this.cursors.left.isDown && this.playerSprites[key].alpha === 1) {
        this.role === "police" ? (speed = -180) : (speed = -160);

        this.playerSprites[key].setVelocityX(speed);
        this.playerSprites[key].setVelocityY(0);
        this.currentDirection = "left";
        this.playerSprites[key].anims.play(key + "left", true);
      } else if (this.cursors.right.isDown && this.playerSprites[key].alpha === 1) {
        this.role === "police" ? (speed = 180) : (speed = 160);

        this.playerSprites[key].setVelocityX(speed);
        this.playerSprites[key].setVelocityY(0);
        this.playerSprites[key].anims.play(key + "right", true);

        this.currentDirection = "right";
      } else if (this.cursors.up.isDown && this.playerSprites[key].alpha === 1) {
        this.role === "police" ? (speed = -180) : (speed = -160);

        this.playerSprites[key].setVelocityY(speed);
        this.playerSprites[key].setVelocityX(0);
        this.playerSprites[key].anims.play(key + "up", true);

        this.currentDirection = "up";
      } else if (this.cursors.down.isDown && this.playerSprites[key].alpha === 1) {
        this.role === "police" ? (speed = 180) : (speed = 160);

        this.playerSprites[key].setVelocityY(speed);
        this.playerSprites[key].setVelocityX(0);
        this.playerSprites[key].anims.play(key + "down", true);

        this.currentDirection = "down";
      } else {
        this.playerSprites[key].setVelocity(0);

        this.playerSprites[key].anims.play(key + this.currentDirection);

        this.nicknameSprites[key].x = this.playerSprites[key].body.position.x;
        this.nicknameSprites[key].y = this.playerSprites[key].body.position.y - 10;

        return this.handleStop();
      }
    }

    this.nicknameSprites[key].x = this.playerSprites[key].body.position.x;
    this.nicknameSprites[key].y = this.playerSprites[key].body.position.y - 10;

    this.handleMove();
  }

  handleMove() {
    const coordinateX = this.playerSprites[this.id].x;
    const coordinateY = this.playerSprites[this.id].y;

    socketApi.pressArrowKeys(this.roomId, this.id, this.currentDirection, coordinateX, coordinateY);
  }

  handleStop() {
    const coordinateX = this.playerSprites[this.id].x;
    const coordinateY = this.playerSprites[this.id].y;

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

  arrestRobber() {
    socketApi.arrestRobber(this.roomId, this.id);
  }

  contactPolice(player, otherPlayer, roomId) {
    const distance_x = player.x - otherPlayer.x;
    const distance_y = player.y - otherPlayer.y;

    const distance = Math.sqrt(Math.abs(distance_x * distance_x) + Math.abs(distance_y * distance_y));

    distance > 62 ? socketApi.closeVideo(roomId) : socketApi.openVideo(roomId);
  }

  throttle(callback, wait, player, otherPlayer, roomId) {
    if (this.waiting) {
      otherPlayer && callback(player, otherPlayer, roomId);

      this.waiting = false;

      const contactPoliceTimer = setTimeout(() => {
        this.waiting = true;

        clearTimeout(contactPoliceTimer);
      }, wait);
    }
  }
}
