import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { timeState, winnerState } from "../../states/modal";
import { useInterval } from "../../utils/hooks/useInterval";
import styled from "styled-components";

export default function Time() {
  const setIsShowingTime = useSetRecoilState(timeState);
  const setIsResultModalOpen = useSetRecoilState(winnerState);

  const [remainingTime, setRemainingTime] = useState(180);

  let second = remainingTime;

  useInterval(() => {
    if (second === 1) {
      setIsResultModalOpen("robber");
      setIsShowingTime(false);
    }

    setRemainingTime(second - 1);
  }, 1000);

  return (
    <TimeTicker>
      <span>{"0" + Math.trunc(remainingTime / 60)}</span>
      <span>:</span>
      <span>{remainingTime % 60 > 9 ? remainingTime % 60 : "0" + (remainingTime % 60)}</span>
    </TimeTicker>
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
