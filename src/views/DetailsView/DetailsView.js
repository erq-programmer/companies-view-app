/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailsView = ({ companiesData, isLoading }) => {
  const getDetailsId = () => {
    const re = /details/g;

    const startIndex = re.exec(document.URL);

    const result = document.URL.slice(startIndex.index + 8);

    return parseInt(result, 10);
  };

  const getCompanyDataFromId = (id) => {
    return companiesData.filter((company) => {
      return company.id === id;
    });
  };

  const company = getCompanyDataFromId(getDetailsId());

  return (
    <Wrapper>
      <GlobalStyle />
      <Link to="/">Back</Link>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <section>
          <ul>
            {console.log(company)}
            <li>ID: {company[0].id}</li>
            <li>Name: {company[0].name}</li>
            <li>City: {company[0].city}</li>
            <li>Total income: {company[0].totalIncome}</li>
            <li>Average income: </li>
            <li>Last month income: </li>
          </ul>
        </section>
      )}
    </Wrapper>
  );
};

export default DetailsView;
