import Phaser from "phaser";
import { backgroundPath } from "../../constants/canvas";

export default function Game() {
  var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  var game = new Phaser.Game(config);

  function preload() {
    this.load.image("background", backgroundPath[0].path);
  }

  function create() {
    this.add.image(960, 540, "background");
  }

  function update() {}
}
