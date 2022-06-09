import { background } from "../../constants/assets";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "GameBackground",
    });
  }

  preload(players) {
    this.load.image("background", background.game);
    this.load.image("character", players[0].characterType);
  }

  create() {
    this.add.image(960, 540, "background");
    this.char = this.add.image(500, 600, "character").setScale(3, 3);
  }

  update() {}
}
