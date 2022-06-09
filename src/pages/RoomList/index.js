import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { playerState } from "../../states/player";

import { socket, socketApi } from "../../utils/socket";

export default function RoomList() {
  const [roomsMembers, setRoomMembers] = useState({});
  const player = useRecoilState(playerState);
  const navigate = useNavigate();

  useEffect(() => {
    socketApi.enterRoomList();

    socket.on("send-rooms", allRoomMembers => {
      setRoomMembers(allRoomMembers);
    });
  }, []);

  return (
    <div className="main-background">
      <RoomListWrap>
        <h3>방 리스트</h3>
        <ul>
          {Object.keys(roomsMembers).map(roomId => (
            <li key={roomId}>
              <span
                onClick={() => {
                  socketApi.joinRoom(roomId, player[0]);
                  navigate(`/room/${roomId}`);
                }}
              >{`경찰 ${roomsMembers[roomId].policeId.length} / 도둑 ${roomsMembers[roomId].robberId.length}`}</span>
            </li>
          ))}
        </ul>
      </RoomListWrap>
    </div>
  );
}

const RoomListWrap = styled.div`
  width: 900px;

  h3 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: bold;
  }

  span {
    display: inline-block;
    width: 100%;
    padding: 20px;
    font-weight: bold;
    font-size: 18px;
    border-radius: 15px;
    margin-bottom: 20px;
    text-align: center;
    box-sizing: border-box;
    transition: 0.3s;
    background: rgba(255, 255, 255, 0.7);
  }

  span:hover {
    cursor: pointer;
    color: #fff;
    background: #1a73e8;
  }

  li:last-child {
    a {
      margin-bottom: 0;
    }
  }
`;
