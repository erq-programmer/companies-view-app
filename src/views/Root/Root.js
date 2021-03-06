import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import GlobalStyle from 'theme/GlobalStyle';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DetailsView from 'views/DetailsView/DetailsView';
import TableView from 'views/TableView/TableView';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MainHeading = styled.h1`
  padding: 2rem 0 3rem;
  text-align: center;
  font-size: 3.6rem;
  font-weight: 700;
  color: #f2f2f2;
`;

const Root = () => {
  const [companiesData, setCompaniesData] = useState([]);

  const [isLoading, setLoading] = useState(true);

  const fetchCompaniesData = useCallback(async () => {
    try {
      const response = await axios.get('https://recruitment.hal.skygate.io/companies');
      return response.data;
    } catch (e) {
      console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
      return [];
    }
  }, []);

  const fetchIncomesData = useCallback(async (id) => {
    try {
      const response = await axios.get(`https://recruitment.hal.skygate.io/incomes/${id}`);
      return response.data.incomes;
    } catch (e) {
      console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
      return [];
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const companies = await fetchCompaniesData();
      const companiesWithIncomes = await Promise.all(
        companies.map(async (company) => {
          const { id } = company;
          const incomes = await fetchIncomesData(id);
          const totalIncome = incomes.reduce(
            (previous, current) => previous + parseInt(current.value, 10),
            0,
          );
          return {
            ...company,
            incomes,
            totalIncome,
          };
        }),
      );
      const sortedCompaniesWithIncomes = companiesWithIncomes.sort(
        (a, b) => b.totalIncome - a.totalIncome,
      );
      setCompaniesData(sortedCompaniesWithIncomes);
      setLoading(false);
    } catch (e) {
      console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
      setLoading(true);
    }
  }, [fetchCompaniesData, fetchIncomesData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Router>
      <Wrapper>
        <GlobalStyle />
        <MainHeading>Companies View App</MainHeading>
        <Switch>
          <Route exact path="/">
            <TableView companiesData={companiesData} isLoading={isLoading} />
          </Route>
          <Route path="/details/:id" render={({ match }) => <DetailsView match={match} />} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default Root;
