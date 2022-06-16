import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socket, socketApi } from "../../utils/socket";
import { playerState } from "../../states/player";
import styled from "styled-components";

export default function Standby() {
  const [roleCount, setRoleCount] = useState({});
  const { id, role, isHost } = useRecoilValue(playerState);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socketApi.standby(roomId);

    socket.on("receive-player", roomRoleCount => setRoleCount(roomRoleCount));

    socket.on("change-all-player-scene", () => navigate(`/game/${roomId}`));

    socket.on("leave-room-player-redirect-room-list", () => navigate("/room/list"));
  }, []);

  const handleRunButton = roomId => {
    socketApi.handleRunButton(roomId);
  };

  const handleExitButton = (roomId, role, id, isHost) => {
    socketApi.leaveRoom(roomId, role, id, isHost);
  };

  return (
    <div className="main-background">
      <StandbyWrap>
        <img
          src="/images/button/leave.png"
          alt="leave-button-images"
          onClick={() => {
            handleExitButton(roomId, role, id, isHost);
          }}
        />
        <p className="description">Waiting for other players . . .</p>
        <div className="count-wrap">
          <p>경찰 {roleCount.police}</p>
          <p>도둑 {roleCount.robber}</p>
        </div>
        <div className="game-start-button-wrap">
          {roleCount.police > 0 && roleCount.robber > 0 && isHost && (
            <button
              type="button"
              onClick={() => {
                handleRunButton(roomId);
              }}
            >
              Run!
            </button>
          )}
        </div>
      </StandbyWrap>
    </div>
  );
}

const StandbyWrap = styled.div`
  font-weight: bold;

  img {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    cursor: pointer;
  }

  .description {
    font-size: 40px;
  }

  .count-wrap {
    padding: 80px;

    p {
      font-size: 100px;
      text-align: center;
    }

    p:first-child {
      margin-bottom: 20px;
    }
  }

  .game-start-button-wrap {
    text-align: center;

    button {
      display: inline-block;
      font-size: 50px;
      padding: 30px 50px;
      border-radius: 50px;
      transition: 0.3s;
      border: none;
      background: #fff;
    }

    button:hover {
      color: #fff;
      background: #1a73e8;
    }
  }
`;
