import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';

const Heading = styled.h1`
  font-size: 2rem;
`;

function App() {
  return (
    <div>
      <GlobalStyle />
      <Heading>Hello</Heading>
    </div>
  );
}

export default App;
