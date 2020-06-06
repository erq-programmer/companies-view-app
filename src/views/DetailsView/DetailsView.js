/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainHeading = styled.h1`
  padding: 20px;
  font-size: 3.6rem;
`;

const DetailsView = () => {
  return (
    <Wrapper>
      <GlobalStyle />
      <MainHeading>Details View</MainHeading>
      <Link to="/">Back</Link>
    </Wrapper>
  );
};

export default DetailsView;
