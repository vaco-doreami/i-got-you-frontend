import Phaser from "phaser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { modalState } from "../../states/modal";
import Modal from "../Modal";
import Video from "../../components/Video";
import { playerState } from "../../states/player";

import { config } from "../../phaser/config";
import { socket, socketApi } from "../../utils/socket";
import { characterSpriteSheet } from "../../constants/assets";

import { GameScene } from "../../phaser/config";

export default function Game() {
  const isShowingModal = useRecoilValue(modalState);
  const { roomId } = useParams();
  const player = useRecoilValue(playerState);
  const [isShowVideoComponent, setIsShowVideoComponent] = useState(false);

  useEffect(() => {
    socketApi.findCurrentJoiningRoom(roomId);

    socket.on("send-current-joining-room", currentRoom => {
      currentRoom.policeId.length > 1 && setIsShowVideoComponent(true);
    });

    new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socket.on("send-room-players-info", playersInfo => {
      const playerList = playersInfo.map(playerInfo => {
        playerInfo.characterPath = characterSpriteSheet[playerInfo.characterType];

        return playerInfo;
      });

      GameScene.set(player.id, roomId, playerList);
    });
  }, []);

  return (
    <>
      {player.role === "police" && isShowVideoComponent && <Video />}
      {isShowingModal && <Modal type="countDown" />}
    </>
  );
}
