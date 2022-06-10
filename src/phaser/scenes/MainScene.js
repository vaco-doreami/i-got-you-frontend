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

  loadPlayersOnComplete() {
    this.playerList.forEach(player => {
      const { id, characterPath } = player;

      this.load.spritesheet(id, characterPath, { frameWidth: 32, frameheight: 60 });
    });
  }

  update() {
    this.moveCar(this.redcar, 9, 0);
    this.moveCar(this.bluecar, 6, 0);
    this.moveCar(this.greencar, 5, 0);
    this.moveCar(this.yellowcar, 6, 0);
  }

  set(playersInfo) {
    this.playerList = playersInfo;
  }
}
