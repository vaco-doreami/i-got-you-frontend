import Phaser, { Scene } from "phaser";
import { background, obstacle } from "../../constants/assets";
import { config } from "../config";

export default class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
    this.playerList = null;
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
    this.createBackground();
    this.createCars();

    for (const player of this.playerList) {
      this.createPlayers(player.id);
    }

    this.createCursor();
  }

  createBackground() {
    const background = this.add.image(960, 540, "background");
    background.depth = -1;
  }

  createCars() {
    const randomX = Phaser.Math.Between(0, config.width);

    this.redcar = this.add.image(randomX, 700, "redcar").setScale(0.5, 0.5);
    this.bluecar = this.add.image(randomX, 750, "bluecar").setScale(0.5, 0.5);
    this.greencar = this.add.image(randomX, 750, "greencar").setScale(0.5, 0.5);
    this.yellowcar = this.add.image(randomX, 810, "yellowcar").setScale(0.5, 0.5);
  }

  moveCar(car, speed) {
    car.x += speed;

    if (car.x > config.width) {
      car.x = 0;
    }
  }

  createPlayers(key) {
    const randomDefaultX = Phaser.Math.Between(200, 800);
    const randomDefaultY = Phaser.Math.Between(500, 800);

    this.player = this.physics.add.sprite(randomDefaultX, randomDefaultY, key).setScale(2, 2).refreshBody();

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(key, { start: 3, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(key, { start: 9, end: 12 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers(key, { start: 7, end: 10 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: key, frame: 0 }],
      frameRate: 20,
    });

    this.cameras.main.setBounds(0, 0, 1920, 1080);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

    this.cameras.main.setZoom(2);
  }

  loadPlayersOnComplete() {
    this.playerList.forEach(player => {
      const { id, characterPath } = player;

      this.load.spritesheet(id, characterPath, { frameWidth: 32, frameheight: 60 });
    });
  }

  createCursor() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  managePlayerMovement() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-500);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(500);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-500);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(500);
      this.player.anims.play("down", true);
    } else {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.play("turn");
    }
  }

  update() {
    this.moveCar(this.redcar, 9);
    this.moveCar(this.bluecar, 6);
    this.moveCar(this.greencar, 5);
    this.moveCar(this.yellowcar, 6);

    this.managePlayerMovement();
  }

  set(playersInfo) {
    this.playerList = playersInfo;
  }
}
