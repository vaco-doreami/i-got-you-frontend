import { Link } from "react-router-dom";
import styled from "styled-components";

export default function CreatePlayer() {
  return (
    <div className="main-background">
      <CreatePlayerWrap>
        <h3 className="title">캐릭터 생성</h3>
        <div>
          <p>이름</p>
          <input type="text" />
        </div>
        <div>
          <p>직업</p>
          <select name="" id="">
            <option value="">경찰</option>
            <option value="">도둑</option>
          </select>
        </div>
        <div>
          <p>캐릭터선택</p>
          <div className="select-character-area">
            <button className="prev"></button>
            <button className="next"></button>
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
  width: 550px;
  padding: 20px;
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
      box-sizing: border-box;
      width: 90%;
      margin: 0 auto;
      border: 2px solid #dfd57a;
      background: #fff;

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
