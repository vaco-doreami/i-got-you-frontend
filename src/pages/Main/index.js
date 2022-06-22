import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Main() {
  return (
    <MainWrap>
      <div>
        <img src="/images/background/main-title.png" alt="메인 이미지" />
        <Link to="/create-player" data-testid="createPlayerButton">
          플레이어 생성하기
        </Link>
      </div>
    </MainWrap>
  );
}

const MainWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #dae1e7;

  div {
    width: 1000px;
    text-align: center;

    img {
      width: 100%;
      margin-bottom: 70px;
    }

    a {
      padding: 17px 30px;
      border-radius: 20px;
      transition: 0.3s;
      background: #1a73e8;
      color: #fff;
    }

    a:hover {
      background: #6893cc;
    }
  }
`;
