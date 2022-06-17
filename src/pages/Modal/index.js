import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import CountDown from "../../components/CountDown";
import GameResult from "../../components/GameResult";
import RoomTitle from "../../components/RoomTitle";

export default function Modal({ type, createRoom, setIsShowRoomTitle }) {
  return ReactDOM.createPortal(
    <div>
      <ModalBackground>
        {type === "preload" && <CountDown />}
        {type === "result" && <GameResult />}
        {type === "roomTitle" && <RoomTitle createRoom={createRoom} setIsShowRoomTitle={setIsShowRoomTitle} />}
      </ModalBackground>
    </div>,
    document.getElementById("portal")
  );
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;
