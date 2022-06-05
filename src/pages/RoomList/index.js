import { Link } from "react-router-dom";
import styled from "styled-components";

export default function RoomList() {
  return (
    <div className="main-background">
      <RoomListWrap>
        <h3>방 리스트</h3>
        <ul>
          <li>
            <Link to="">경찰 1 / 도둑 2</Link>
          </li>
          <li>
            <Link to="">경찰 1 / 도둑 2</Link>
          </li>
          <li>
            <Link to="">경찰 1 / 도둑 2</Link>
          </li>
          <li>
            <Link to="">경찰 1 / 도둑 2</Link>
          </li>
          <li>
            <Link to="">경찰 1 / 도둑 2</Link>
          </li>
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

  a {
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

  a:hover {
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
