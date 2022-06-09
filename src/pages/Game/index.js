import Phaser from "phaser";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { modalState } from "../../states/modal";
import Modal from "../Modal";

import { config } from "../../phaser/config";
import { socket, socketApi } from "../../utils/socket";
import { characterSpriteSheet } from "../../constants/assets";

import { GameScene } from "../../phaser/config";

export default function Game() {
  const isShowingModal = useRecoilValue(modalState);
  const { roomId } = useParams();

  useEffect(() => {
    new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socket.on("send-room-players-info", playersInfo => {
      const players = playersInfo.map(playerInfo => {
        playerInfo.characterType = characterSpriteSheet[playerInfo.characterType];

        return playerInfo;
      });

      GameScene.preload(players);
    });
  }, []);

  return isShowingModal && <Modal type="countDown" />;
}
