import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { socket } from "../../utils/socket";
import styled from "styled-components";

export default function Standby() {
  const [roleCount, setRoleCount] = useState({});
  const id = useParams("roomId");

  useEffect(() => {
    socket.emit("standby-room", id.roomId);

    socket.on("receive-player", roomRoleCount => {
      setRoleCount(roomRoleCount);
    });
  }, []);

  return (
    <div className="main-background">
      <StandbyWrap>
        <p className="description">Waiting for other players . . .</p>
        <div className="count-wrap">
          <p>경찰 {roleCount.police}</p>
          <p>도둑 {roleCount.robber}</p>
        </div>
        <div className="game-start-btn-wrap">{roleCount.police > 0 && roleCount.robber > 0 && <Link to={`/game/${socket.id}`}>Run!</Link>}</div>
      </StandbyWrap>
    </div>
  );
}

const StandbyWrap = styled.div`
  font-weight: bold;

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

  .game-start-btn-wrap {
    text-align: center;

    a {
      display: inline-block;
      font-size: 50px;
      padding: 30px 50px;
      border-radius: 50px;
      transition: 0.3s;
      background: #fff;
    }

    a:hover {
      color: #fff;
      background: #1a73e8;
    }
  }
`;
