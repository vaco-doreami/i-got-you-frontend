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
import { characterSpriteSheet } from "../../constants/assets";
import { GameScene } from "../../phaser/config";
import { config } from "../../phaser/config";

import { SEND_ARRESTED_PLAYER, SEND_LEFT_PLAYER, SEND_ROOM_PLAYERS_INFORMATION, SET_VIDEO } from "../../constants/phaser";

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
    new Phaser.Game(config);

    socketApi.enterGame(roomId);

    socketApi.findCurrentJoiningRoom(roomId);

    socket.on(SET_VIDEO, openVideo => {
      setIsShowVideo(openVideo);
    });

    socket.on(SEND_ROOM_PLAYERS_INFORMATION, (playersInfo, policeIdArray, robberIdArray) => {
      const playerList = playersInfo.map(playerInfo => {
        playerInfo.characterPath = characterSpriteSheet[playerInfo.characterType];

        return playerInfo;
      });

      GameScene.initialize(player.id, player.role, roomId, playerList);

      const policeCount = policeIdArray.length;
      const robberCount = robberIdArray.length;

      setRoleCounts({ policeCount, robberCount });
    });

    socket.on(SEND_ARRESTED_PLAYER, (robberId, robberCount) => {
      setRoleCounts({ robberCount });

      GameScene.makeRobberInvisible(robberId);
    });

    socket.on(SEND_LEFT_PLAYER, (room, playerId) => {
      GameScene.playerLeaveGame(playerId);

      const policeCount = room.policeId.length;
      const robberCount = room.robberId.length;

      setRoleCounts({ policeCount, robberCount });
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
        GameScene.sys.destroy(true);
        navigate("/");
        window.location.reload();
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
        <div>
          <Time />
          <RobberCount />
        </div>
      )}
      {isResultModalOpen && <Modal type="result" />}
    </>
  );
}
