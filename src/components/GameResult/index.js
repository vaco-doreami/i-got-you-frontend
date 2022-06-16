import React from "react";
import { useRecoilValue } from "recoil";
import { winnerState } from "../../states/modal";
import { playerState } from "../../states/player";
import styled from "styled-components";

export default function GameResult() {
  const winner = useRecoilValue(winnerState);
  const player = useRecoilValue(playerState);

  return <Result>{winner === player.role ? <span>{player.role} 승리</span> : <span>{player.role} 패배</span>}</Result>;
}

const Result = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  font-weight: bold;
  color: #fff;
`;
