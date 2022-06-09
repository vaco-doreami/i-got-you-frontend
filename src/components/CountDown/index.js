import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../states/modal";
import styled from "styled-components";

export default function CountDown() {
  const [countDownSeconds, setCountDownSeconds] = useState(3);
  const [isShowingModal, setIsShowingModal] = useRecoilState(modalState);

  let second = countDownSeconds;

  const startCountDown = () => {
    const countDown = setInterval(() => {
      second -= 1;

      if (second === 0) {
        setIsShowingModal(false);
        clearInterval(countDown);
      }

      setCountDownSeconds(second);
    }, 1000);
  };

  useEffect(() => {
    startCountDown();
  }, []);

  return <Time>{countDownSeconds}</Time>;
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
