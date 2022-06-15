import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { playerState } from "../../states/player";
import { socket, socketApi } from "../../utils/socket";

export default function RoomList() {
  const [roomsMembers, setRoomMembers] = useState({});
  const player = useRecoilValue(playerState);
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
          {Object.keys(roomsMembers).map(roomId =>
            (roomsMembers[roomId].policeId.length === 2 && roomsMembers[roomId].robberId.length === 4) || roomsMembers[roomId].isProgressGame ? (
              ""
            ) : (
              <li key={roomId}>
                <span
                  onClick={() => {
                    if (player.role === "police") {
                      if (roomsMembers[roomId].policeId.length === 2) {
                        alert("경찰인원이 꽉찼습니다.");
                      } else {
                        socketApi.joinRoom(roomId, player);
                        navigate(`/room/${roomId}`);
                      }
                    }

                    if (player.role === "robber") {
                      if (roomsMembers[roomId].robberId.length === 4) {
                        alert("도둑인원이 꽉찼습니다.");
                      } else {
                        socketApi.joinRoom(roomId, player);
                        navigate(`/room/${roomId}`);
                      }
                    }
                  }} // 리팩토링 가능할 듯
                >{`경찰 ${roomsMembers[roomId].policeId.length} / 도둑 ${roomsMembers[roomId].robberId.length}`}</span>
              </li>
            )
          )}
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
