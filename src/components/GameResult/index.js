import React from "react";
import { useRecoilValue } from "recoil";
import { winnerState } from "../../states/modal";
import { playerState } from "../../states/player";
import styled from "styled-components";

export default function GameResult() {
  const winner = useRecoilValue(winnerState);
  const player = useRecoilValue(playerState);

  return <Result>{winner === player.role ? <span className="win">승리</span> : <span className="lose">패배</span>}</Result>;
}

const Result = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  font-weight: bold;
  color: #fff;

  .win {
    padding: 20px 40px;
    border-radius: 20px;
    background: #1a73e8;
  }

  .lose {
    padding: 20px 40px;
    border-radius: 20px;
    background: #e81a1a;
  }
`;
