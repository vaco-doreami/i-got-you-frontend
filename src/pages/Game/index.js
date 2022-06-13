import Phaser from "phaser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Modal from "../Modal";
import Video from "../../components/Video";
import Time from "../../components/Time";
import RobberCount from "../../components/RobberCount";

import { preloadState, timeState } from "../../states/modal";
import { playerState, robberCountState, winnerState } from "../../states/player";

import { socket, socketApi } from "../../utils/socket";
import { characterSpriteSheet } from "../../constants/assets";
import { GameScene } from "../../phaser/config";
import { config } from "../../phaser/config";

export default function Game() {
  const isPreloadModalOpen = useRecoilValue(preloadState);
  const isShowRemainingTime = useRecoilValue(timeState);
  const isResultModalOpen = useRecoilValue(winnerState);
  const setRobberNumber = useSetRecoilState(robberCountState);

  const player = useRecoilValue(playerState);
  const [isShowVideoComponent, setIsShowVideoComponent] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socketApi.findCurrentJoiningRoom(roomId);

    socket.on("send-current-joining-room", currentRoom => {
      currentRoom.policeId.length > 1 && setIsShowVideoComponent(true);
    });

    socket.on("send-room-players-info", (playersInfo, totalRobberArray) => {
      const playerList = playersInfo.map(playerInfo => {
        playerInfo.characterPath = characterSpriteSheet[playerInfo.characterType];

        return playerInfo;
      });

      GameScene.initialize(player.id, player.role, roomId, playerList);

      const totalRobberNumber = totalRobberArray.length;

      setRobberNumber(totalRobberNumber);
    });

    socket.on("send-arrested-player", (robberId, remainingRobberNumber) => {
      setRobberNumber(remainingRobberNumber);

      GameScene.makeRobberInvisible(robberId);
    });
  }, []);

  useEffect(() => {
    if (!isPreloadModalOpen) {
      GameScene.gameSet(true);
    }
  }, [isPreloadModalOpen]);

  useEffect(() => {
    if (isResultModalOpen) {
      const moveToMainScreen = setTimeout(() => {
        navigate("/");
      }, 5000);

      return () => clearTimeout(moveToMainScreen);
    }
  }, [isResultModalOpen]);

  return (
    <>
      {player.role === "police" && isShowVideoComponent && <Video />}
      {isPreloadModalOpen && <Modal type="preload" />}
      {isShowRemainingTime && (
        <div>
          <Time />
          <RobberCount />
        </div>
      )}
      {isResultModalOpen && <Modal type="showResult" />}
    </>
  );
}
