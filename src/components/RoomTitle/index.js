import { useState } from "react";
import styled from "styled-components";

export default function RoomTitle({ createRoom, setIsShowRoomTitle }) {
  const [roomTitle, setRoomTitle] = useState("");

  return (
    <RoomTitleWrap>
      <h3 className="title">방 제목</h3>
      <div>
        <input
          type="text"
          onChange={e => {
            setRoomTitle(e.target.value);
          }}
        />
      </div>
      <p className="btn-wrap">
        <button
          onClick={() => {
            if (roomTitle.length === 0) {
              alert("방제목을 입력해주세요.");
            } else {
              setIsShowRoomTitle(false);
              createRoom(roomTitle);
            }
          }}
        >
          방 생성
        </button>
        <button
          onClick={() => {
            setIsShowRoomTitle(false);
          }}
        >
          취소
        </button>
      </p>
    </RoomTitleWrap>
  );
}

const RoomTitleWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  padding: 30px;
  border-radius: 20px;
  background: #fff;

  h3 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: bold;
  }

  div {
    padding: 20px;
    border-radius: 20px;
    background: #f9f7e5;

    input {
      width: 100%;
      text-align: center;
      padding: 10px;
      box-sizing: border-box;
      border: 2px solid #dfd57a;
      border-radius: 10px;
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;

    button {
      width: 49%;
      padding: 15px 20px;
      font-size: 16px;
      border: none;
      border-radius: 10px;
      transition: 0.3s;
      color: #fff;
    }

    button:first-child {
      background: #1a73e8;
    }

    button:first-child:hover {
      background: #6893cc;
    }

    button:last-child {
      background: #2a2a2a;
    }

    button:last-child:hover {
      background: #858585;
    }
  }
`;
