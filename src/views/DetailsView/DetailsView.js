import React, { useEffect, useState, useCallback } from 'react';
// import styled from 'styled-components';
import GlobalStyle from 'theme/GlobalStyle';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
    <div>
      <GlobalStyle />
      <Link to="/">Back</Link>

      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <section>
          <ul>
            <li>ID: {companiesData.id}</li>
            <li>Name: {companiesData.name}</li>
            <li>City: {companiesData.city}</li>
            <li>Total income: {companiesData.totalIncome}</li>
            <li>Average income: {companiesData.averageIncome}</li>
            <li>Last month income: {companiesData.lastIncomeMonth}</li>
          </ul>
        </section>
      )}
    </div>
  );
};

DetailsView.propTypes = {
  match: PropTypes.object.isRequired,
};

export default DetailsView;
