import Phaser from "phaser";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Modal from "../Modal";
import Video from "../../components/Video";
import Time from "../../components/Time";
import RobberCount from "../../components/RoleCount";

import { preloadState, timeState, winnerState } from "../../states/modal";
import { playerState, roleCountState } from "../../states/player";

import { socket, socketApi } from "../../utils/socket";
import { GameScene } from "../../phaser/config";
import { config } from "../../phaser/config";

import { SEND_ARRESTED_PLAYER, SEND_EXIT_PLAYER, SEND_ROOM_PLAYERS_INFORMATION, SEND_STOP_PLAYER, SET_VIDEO } from "../../constants/phaser";

export default function Game() {
  const isPreloadModalOpen = useRecoilValue(preloadState);
  const isShowRemainingTime = useRecoilValue(timeState);
  const isResultModalOpen = useRecoilValue(winnerState);
  const setRoleCounts = useSetRecoilState(roleCountState);

  const player = useRecoilValue(playerState);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const game = new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socketApi.findEnteredRoom(roomId);

    socket.on(SEND_ROOM_PLAYERS_INFORMATION, playersInformation => {
      GameScene.initialize(player.id, player.role, roomId, playersInformation);

      let policeCount = 0;
      let robberCount = 0;

      playersInformation.forEach(playerInformation => {
        playerInformation.role === "police" ? (policeCount += 1) : (robberCount += 1);
      });

      setRoleCounts({ policeCount, robberCount });
    });

    socket.on(SEND_ARRESTED_PLAYER, (robberId, robberCount) => {
      setRoleCounts({ robberCount });

      GameScene.makeRobberInvisible(robberId, 5);
    });

    socket.on(SEND_EXIT_PLAYER, (room, playerId) => {
      GameScene.playerLeaveGame(playerId);

      const policeCount = room.policeId.length;
      const robberCount = room.robberId.length;

      setRoleCounts({ policeCount, robberCount });
    });

    socket.on(SET_VIDEO, openVideo => {
      setIsShowVideo(openVideo);
    });

    return () => {
      socket.off(SET_VIDEO);
      socket.off(SEND_STOP_PLAYER);
      socket.off(SEND_EXIT_PLAYER);
      socket.off(SEND_ARRESTED_PLAYER);
      socket.off(SEND_ROOM_PLAYERS_INFORMATION);

      game.destroy(true, true);
    };
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

  useEffect(() => {
    return () => {
      socketApi.leaveGame(roomId, player.id, player.role);

      navigate("/");
    };
  }, []);

  return (
    <>
      {player.role === "police" && isShowVideo && <Video />}
      {isPreloadModalOpen && <Modal type="preload" />}
      {isShowRemainingTime && (
        <div id="phaser-game">
          <Time />
          <RobberCount />
        </div>
      )}
      {isResultModalOpen && <Modal type="result" />}
    </>
  );
}
