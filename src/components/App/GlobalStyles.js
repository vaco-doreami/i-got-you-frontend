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
    background: url("/images/background/main_background.png") no-repeat center center / cover;
  }
`;

export default GlobalStyles;
