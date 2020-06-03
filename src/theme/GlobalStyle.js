import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`

  ${reset}

  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  *, *::before, *::after {
    box-sizing: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }

  body {
    font-size: 1.6rem;
    font-family: 'Roboto', sans-serif;
  }
`;

export default GlobalStyle;
