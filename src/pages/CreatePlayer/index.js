import styled from "styled-components";
import { imagePath } from "../../constants/canvas";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { info } from "../../states/player";

export default function CreatePlayer() {
  const [characterImg, setCharacterImg] = useState(imagePath.filter(target => target.role === "police"));
  const [index, setIndex] = useState(0);
  const [player, setPlayer] = useRecoilState(info);

  const roleChange = e => {
    if (e.target.value === "police") {
      setIndex(0);
      setCharacterImg(imagePath.filter(target => target.role === "police"));
    }

    if (e.target.value === "robber") {
      setIndex(0);
      setCharacterImg(imagePath.filter(target => target.role === "robber"));
    }

    setPlayer({
      ...player,
      role: e.target.value,
    });
  };

  const playerNameChange = e => {
    setPlayer({
      ...player,
      nickname: e.target.value,
    });
  };

  const prevClick = () => {
    if (index === 0) {
      setIndex(characterImg.length - 1);
    } else {
      setIndex(index - 1);
    }
  };

  const nextClick = () => {
    if (index === characterImg.length - 1) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  };

  useEffect(() => {
    setPlayer({
      ...player,
      characterType: characterImg[index].alias,
    });
  }, [index]);

  return (
    <div className="main-background">
      <CreatePlayerWrap>
        <h3 className="title">캐릭터 생성</h3>
        <div>
          <p>이름</p>
          <input type="text" onChange={playerNameChange} />
        </div>
        <div>
          <p>직업</p>
          <select onChange={roleChange}>
            <option value="police">경찰</option>
            <option value="robber">도둑</option>
          </select>
        </div>
        <div>
          <p>캐릭터선택</p>
          <div className="select-character-area">
            <button className="prev" onClick={prevClick} />
            <img src={characterImg[index].path} alt={characterImg[index].alias} />
            <button className="next" onClick={nextClick} />
          </div>
        </div>
        <p className="btn-wrap">
          <button>방 만들기</button>
          <button>방 리스트</button>
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
        background: url("/images/arrow.png") no-repeat center center / 100% 100%;
      }

      .prev {
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
