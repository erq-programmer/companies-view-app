/* eslint-disable no-console */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import GlobalStyle from 'theme/GlobalStyle';
import Table from 'components/Table/Table';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainHeading = styled.h1`
  padding: 20px;
  font-size: 3.6rem;
`;

const App = () => {
  const columns = [
    {
      Header: 'Companies',
      columns: [
        {
          Header: 'ID',
          accessor: 'id',
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'City',
          accessor: 'city',
        },
        {
          Header: 'Total income',
          accessor: 'totalIncome',
        },
      ],
    },
  ];

  const [companiesData, setCompaniesData] = useState([]);
  const [filterInput, setFilterInput] = useState('');
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

  const handleTyping = useCallback((e) => {
    setFilterInput(e.target.value);
  }, []);

  const filteredCompanyByName = useMemo(
    () =>
      companiesData.filter((company) => {
        return company.name.toLowerCase().includes(filterInput.toLowerCase());
      }),
    [companiesData, filterInput],
  );

  return (
    <Wrapper>
      <GlobalStyle />
      <MainHeading>Companies View App</MainHeading>
      <div>
        <input
          onKeyPress={(event) => {
            if (event.which === 13 /* Enter */) {
              event.preventDefault();
            }
          }}
          type="text"
          placeholder="Filter by name..."
          onChange={handleTyping}
          value={filterInput}
        />
      </div>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Table columns={columns} data={filteredCompanyByName} />
      )}
    </Wrapper>
  );
};

export default App;
