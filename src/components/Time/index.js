import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { timeState, winnerState } from "../../states/modal";
import { socket } from "../../utils/socket";
import styled from "styled-components";

export default function Time() {
  const gameRunningTime = 180;

  const setIsShowingTime = useSetRecoilState(timeState);
  const setIsResultModalOpen = useSetRecoilState(winnerState);
  const [remainingTime, setRemainingTime] = useState(gameRunningTime);

  let second = remainingTime;

  const startGame = second => {
    const countDown = setInterval(() => {
      second -= 1;

      if (second === 0) {
        setIsShowingTime(false);
        setIsResultModalOpen("robber");
        clearInterval(countDown);
      }

      socket.on("send-robber-counts", roleCounts => {
        if (roleCounts.robber === 0) {
          setIsShowingTime(false);
          setIsResultModalOpen("police");
          clearInterval(countDown);
        }
      });

      setRemainingTime(second);
    }, 1000);
  };

  useEffect(() => {
    startGame(second);
  }, []);

  return (
    <div>
      <TimeTicker>
        <span>{"0" + Math.trunc(remainingTime / 60)}</span>
        <span>:</span>
        <span>{remainingTime % 60 > 9 ? remainingTime % 60 : "0" + (remainingTime % 60)}</span>
      </TimeTicker>
    </div>
  );
}

const TimeTicker = styled.div`
  display: flex;
  position: fixed;
  top: 20px;
  left: 20px;
  width: 80px;
  height: 30px;
  font-weight: bold;
  background-color: rgb(255, 255, 255, 0.8);
  border: 2px solid rgb(0, 0, 0);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
