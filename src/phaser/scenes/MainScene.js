import Phaser from "phaser";
import { background } from "../../constants/assets";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.players = null;
  }

  preload() {
    this.load.image("background", background.game);

    this.load.once("filecomplete", this.loadPlayersOnComplete, this);
  }

  create() {
    const keys = this.textures.getTextureKeys();

    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === "background") {
        this.add.image(960, 540, "background");
      } else {
        const randomDefaultX = Phaser.Math.Between(200, 800);
        const randomDefaultY = Phaser.Math.Between(500, 800);

        this.physics.add.sprite(randomDefaultX, randomDefaultY, keys[i]).setScale(2, 2);
      }
    }
  }

  loadPlayersOnComplete() {
    const players = this.players;

    players.forEach(player => {
      this.load.spritesheet(player.id, player.characterPath, { frameWidth: 32, frameheight: 60 });
    });
  }

  set(playersInfo) {
    this.players = playersInfo;
  }
}
