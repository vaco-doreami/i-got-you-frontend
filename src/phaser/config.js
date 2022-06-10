import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
export const GameScene = new MainScene();

export const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "phaser-game",
  physics: {
    default: "arcade",
  },
  scene: [GameScene],
};
