import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { preloadState, timeState } from "../../states/modal";
import { useInterval } from "../../utils/hooks/useInterval";
import styled from "styled-components";

export default function CountDown() {
  const setIsModalOpen = useSetRecoilState(preloadState);
  const setIsTimeShowing = useSetRecoilState(timeState);

  const [countdown, setCountdown] = useState(3);

  let second = countdown;

  useInterval(() => {
    if (second === 1) {
      setIsModalOpen(false);
      setIsTimeShowing(true);
    }

    setCountdown(second => second - 1);
  }, 1000);

  return <Time>{countdown}</Time>;
}

const Time = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  font-weight: bold;
  color: #fff;
`;
