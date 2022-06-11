import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  button {
    cursor: pointer;
  }

  textarea {
    resize: none;
  };

  a {
    color: #000;
    text-decoration: none;
  }

  .main-background {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url("/images/background/main-background.png") no-repeat center center / cover;
  }

  video {
    width: 100%;
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    -moz-transform: rotateY(180deg); /* Firefox */
    border-radius: 30px;
  }
`;

export default GlobalStyles;
