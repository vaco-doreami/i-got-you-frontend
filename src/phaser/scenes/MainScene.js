import { background, characterImage } from "../../constants/assets";

export default class MainScene extends Phaser.Scene {
  constructor(players) {
    super({
      key: "GameBackground",
    });

    this.players = players;
  }

  preload() {
    this.load.image("background", background.game);
    this.load.image("character", characterImage[0].path);
  }

  create() {
    this.add.image(960, 540, "background");
    this.char = this.add.image(500, 600, "character").setScale(3, 3);
  }

  update() {}
}
