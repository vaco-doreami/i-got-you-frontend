import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import CountDown from "../../components/CountDown";

export default function Modal(props) {
  return ReactDOM.createPortal(
    <div>
      <ModalBackground>{props.type === "countDown" && <CountDown />}</ModalBackground>
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
