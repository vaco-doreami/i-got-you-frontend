import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { characterImage as character, characterSpriteSheet } from "../../constants/assets";
import { SEND_SOCKET_ID } from "../../constants/phaser";
import { socket, socketApi } from "../../utils/socket";
import { playerState } from "../../states/player";

export default function CreatePlayer() {
  const [characterImages, setCharacterImages] = useState(character.filter(target => target.role === "police"));
  const [index, setIndex] = useState(0);
  const [player, setPlayer] = useRecoilState(playerState);
  const navigate = useNavigate();

  const handleRoleChange = e => {
    const role = e.target.value;

    const policeOrRobber = character.filter(target => target.role === role);

    setIndex(0);
    setCharacterImages(policeOrRobber);

    setPlayer({
      ...player,
      role,
    });
  };

  const handleNicknameChange = e => {
    const nickname = e.target.value;

    setPlayer({
      ...player,
      nickname,
    });
  };

  useEffect(() => {
    const characterType = characterImages[index].alias;
    const characterPath = characterSpriteSheet[characterType];

    setPlayer({
      ...player,
      characterPath,
      characterType,
    });
  }, [index, characterImages]);

  const createRoom = () => {
    socketApi.assignRoomCreatorAsHost({
      ...player,
    });

    socket.on(SEND_SOCKET_ID, socketId => {
      setPlayer({
        ...player,
        id: socketId,
      });
    });

    navigate(`/room/${socket.id}`);
  };

  const enterRoomList = () => {
    socket.on(SEND_SOCKET_ID, socketId => {
      setPlayer({
        ...player,
        id: socketId,
      });
    });

    navigate("/room/list");
  };

  const handleArrowClick = e => {
    const last = characterImages.length - 1;

    if (e.target.name === "previous") {
      index === 0 ? setIndex(last) : setIndex(index - 1);
    }

    if (e.target.name === "next") {
      index === last ? setIndex(0) : setIndex(index + 1);
    }
  };

  const handleRoomEntryClick = e => {
    if (e.target.name === "create-room") {
      player.nickname.length === 0 ? alert("이름을 작성해주세요.") : createRoom();
    }

    if (e.target.name === "enter-room-list") {
      player.nickname.length === 0 ? alert("이름을 작성해주세요.") : enterRoomList();
    }
  };

  return (
    <div className="main-background">
      <CreatePlayerWrap>
        <h3 className="title">캐릭터 생성</h3>
        <div>
          <p>이름</p>
          <input type="text" maxLength="5" onChange={handleNicknameChange} />
        </div>
        <div>
          <p>직업</p>
          <select onChange={handleRoleChange}>
            <option value="police">경찰</option>
            <option value="robber">도둑</option>
          </select>
        </div>
        <div>
          <p>캐릭터선택</p>
          <div className="select-character-area">
            <button className="previous" name="previous" type="button" onClick={handleArrowClick} />
            <img src={characterImages[index].path} alt={characterImages[index].alias} />
            <button className="next" name="next" type="button" onClick={handleArrowClick} />
          </div>
        </div>
        <p className="btn-wrap">
          <button name="create-room" onClick={handleRoomEntryClick}>
            방 만들기
          </button>
          <button name="enter-room-list" onClick={handleRoomEntryClick}>
            방 리스트
          </button>
        </p>
      </CreatePlayerWrap>
    </div>
  );
}

const CreatePlayerWrap = styled.div`
  width: 500px;
  padding: 30px;
  margin: 0 auto;
  border-radius: 20px;
  background: #fff;
  text-align: center;

  h3 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 30px;
    font-weight: bold;
  }

  div {
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 20px;
    background: #f9f7e5;

    p {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
    }

    .select-character-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      width: 90%;
      height: 140px;
      margin: 0 auto;
      border: 2px solid #dfd57a;
      background: #fff;

      img {
        width: 60px;
      }

      button {
        width: 10px;
        height: 13px;
        border: none;
        background: url("/images/button/arrow.png") no-repeat center center / 100% 100%;
      }

      .previous {
        transform: rotate(-180deg);
      }
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
      background: #61d209;
    }

    button:last-child:hover {
      background: #b8ec90;
    }
  }

  input,
  select {
    width: 90%;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    border: 2px solid #dfd57a;
    border-radius: 10px;
  }
`;
