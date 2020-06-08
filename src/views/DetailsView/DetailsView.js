import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.span`
  display: inline-block;
  width: 80px;
  height: 80px;

  &::after {
    content: ' ';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

const Container = styled.section`
  margin: 0 10px;
  padding: 40px 60px;
  background-color: #f2f2f2;
  box-shadow: 10px 10px 26px 0px rgba(0, 0, 0, 0.28);
  font-size: 2rem;
  border-radius: 6px;

  li {
    margin: 10px 0;

    strong {
      font-weight: 700;
    }
  }
`;

const StyledLink = styled(Link)`
  color: #f2f2f2;
  padding: 4rem 2rem 2rem;
  text-decoration: none;
  font-size: 1.6rem;
  cursor: pointer;

  &:hover strong {
    background-color: #3252e9;
    color: #f2f2f2;
  }

  strong {
    background-color: #f2f2f2;
    color: #222;
    padding: 6px 10px;
    border-radius: 6px;
    transition: 0.3s ease all;
  }
`;

const DetailsView = ({ match }) => {
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

  const fetchIncomesData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://recruitment.hal.skygate.io/incomes/${match.params.id}`,
      );
      return response.data.incomes;
    } catch (e) {
      console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
      return [];
    }
  }, [match.params.id]);

  const fetchData = useCallback(async () => {
    try {
      const companies = await fetchCompaniesData();
      const currentCompany = companies.filter((company) => {
        return company.id === parseInt(match.params.id, 10);
      });
      const incomes = await fetchIncomesData();

      incomes.sort((a, b) => {
        if (a.date > b.date) return 1;
        if (b.date > a.date) return -1;
        return 0;
      });

      const lastIncomeMonthNumber = new Date(incomes[incomes.length - 1].date).getMonth();
      const lastIncomeYearNumber = new Date(incomes[incomes.length - 1].date).getFullYear();
      const lastIncomeMonth = incomes
        .filter((item) => {
          const month = new Date(item.date).getMonth();
          const year = new Date(item.date).getFullYear();
          return month === lastIncomeMonthNumber && year === lastIncomeYearNumber;
        })
        .reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.value, 10), 0);
      const totalIncome = incomes.reduce(
        (previous, current) => previous + parseInt(current.value, 10),
        0,
      );
      const averageIncome = totalIncome / incomes.length;
      const currentCompanyWithIncomes = {
        ...currentCompany[0],
        incomes,
        lastIncomeMonth,
        totalIncome,
        averageIncome,
      };
      setCompaniesData(currentCompanyWithIncomes);
      setLoading(false);
    } catch (e) {
      console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
      setLoading(true);
    }
  }, [fetchCompaniesData, fetchIncomesData, match.params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <ul>
            <li>
              <strong>ID: </strong>
              {companiesData.id}
            </li>
            <li>
              <strong>Name: </strong>
              {companiesData.name}
            </li>
            <li>
              <strong>City: </strong>
              {companiesData.city}
            </li>
            <li>
              <strong>Total income: </strong>
              {companiesData.totalIncome}
            </li>
            <li>
              <strong>Average income: </strong>
              {companiesData.averageIncome}
            </li>
            <li>
              <strong>Last month income: </strong>
              {companiesData.lastIncomeMonth}
            </li>
          </ul>
        </Container>
      )}
      <StyledLink to="/">
        Go to <strong>Companies List</strong>
      </StyledLink>
    </>
  );
};

DetailsView.propTypes = {
  match: PropTypes.object.isRequired,
};

export default DetailsView;
