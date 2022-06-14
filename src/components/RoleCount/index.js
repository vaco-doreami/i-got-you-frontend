import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { winnerState, roleCountState } from "../../states/player";
import { timeState } from "../../states/modal";
import styled from "styled-components";

export default function RobberCount() {
  const { policeCount, robberCount } = useRecoilValue(roleCountState);
  const setIsShowingTime = useSetRecoilState(timeState);
  const setIsResultModalOpen = useSetRecoilState(winnerState);

  if (policeCount === 0) {
    setIsShowingTime(false);
    setIsResultModalOpen("robber");
  }

  if (robberCount === 0) {
    setIsShowingTime(false);
    setIsResultModalOpen("police");
  }

  return <RemainingRobber>남은 도둑 수 {robberCount}</RemainingRobber>;
}

const RemainingRobber = styled.div`
  display: flex;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 120px;
  height: 30px;
  font-weight: bold;
  background-color: rgb(255, 255, 255, 0.8);
  border: 2px solid rgb(0, 0, 0);
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
