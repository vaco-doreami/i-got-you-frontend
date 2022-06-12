import Phaser from "phaser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Video from "./Video";
import Modal from "../Modal";
import Time from "../../components/Time";

import { preloadState, timeState, winnerState } from "../../states/modal";
import { playerState } from "../../states/player";

import { socket, socketApi } from "../../utils/socket";
import { characterSpriteSheet } from "../../constants/assets";
import { GameScene } from "../../phaser/config";
import { config } from "../../phaser/config";

export default function Game() {
  const isPreloadModalOpen = useRecoilValue(preloadState);
  const isShowRemainingTime = useRecoilValue(timeState);
  const isResultModalOpen = useRecoilValue(winnerState);

  const player = useRecoilValue(playerState);
  const [isShowVideoComponent, setIsShowVideoComponent] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socket.emit("find-current-joining-room", roomId);

    socket.on("send-current-joining-room", currentRoom => {
      currentRoom.policeId.length > 1 && setIsShowVideoComponent(true);
    });

    socket.on("send-room-players-info", playersInfo => {
      const playerList = playersInfo.map(playerInfo => {
        playerInfo.characterPath = characterSpriteSheet[playerInfo.characterType];

        return playerInfo;
      });

      GameScene.set(player.id, player.role, roomId, playerList);
    });
  }, []);

  return (
    <>
      {player.role === "police" && isShowVideoComponent && <Video />}
      {isPreloadModalOpen && <Modal type="preload" />}
      {isShowRemainingTime && <Time />}
      {isResultModalOpen && <Modal type="showResult" />}
    </>
  );
}
