import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socket, socketApi } from "../../utils/socket";
import { playerState } from "../../states/player";
import { CHANGE_ALL_PLAYER_SCENE, LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST, RECEIVE_PLAYER } from "../../constants/socket";
import styled from "styled-components";

export default function Standby() {
  const [roleCount, setRoleCount] = useState({});
  const { id, role } = useRecoilValue(playerState);
  const [isHost, setIsHost] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { policeCount, robberCount } = roleCount;

  useEffect(() => {
    socketApi.standby(roomId);

    socket.on(RECEIVE_PLAYER, roomRoleCount => setRoleCount(roomRoleCount));

    socket.on(CHANGE_ALL_PLAYER_SCENE, () => navigate(`/game/${roomId}`));

    socket.on(LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST, () => navigate("/room/list"));
  }, []);

  useEffect(() => {
    id === roomId ? setIsHost(true) : setIsHost(false);
  }, [id]);

  const handleRunButton = roomId => socketApi.handleRunButton(roomId);

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
          <p>경찰 {policeCount}</p>
          <p>도둑 {robberCount}</p>
        </div>
        <div className="game-start-button-wrap">
          {policeCount > 0 && robberCount > 0 && isHost && (
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
