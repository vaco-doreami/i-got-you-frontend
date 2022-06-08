import Phaser from "phaser";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { modalStatus } from "../../states/modal";
import { background } from "../../constants/assets";
import Modal from "../Modal";

export default function Game() {
  const isShowingModal = useRecoilValue(modalStatus);

  useEffect(() => {
    const config = {
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

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image("background", background.game);
    }

    function create() {
      this.add.image(960, 540, "background");
    }

    function update() {}
  }, []);

  return isShowingModal && <Modal type="countDown" />;
}
