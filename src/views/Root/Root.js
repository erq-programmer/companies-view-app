import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import GlobalStyle from 'theme/GlobalStyle';
import Table from 'components/Table/Table';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
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

  const [data, setData] = useState([]);
  // const [incomeData, setIncomeData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios('https://recruitment.hal.skygate.io/companies');

        // const income = await axios(
        //   `https://recruitment.hal.skygate.io/incomes/${response.data[0].id}`,
        // );
        // console.log('Wykonaj');

        // setIncomeData(income.data);

        // setIncomeData(income.data);

        setData(response.data);
        setLoading(false);

        // console.log(income);
      } catch (e) {
        console.error(`😱 Something went wrong with axios... [Error message] ${e.message}`);
        setLoading(true);
      }

      // console.log(response.data.map((company) => company.id));

      // setIncomeData(income.data.incomes.map((val) => val.value));
    })();
  }, []);

  return (
    <Wrapper>
      <GlobalStyle />
      <MainHeading>Companies View App</MainHeading>
      {isLoading ? <span>Loading...</span> : <Table columns={columns} data={data} />}
    </Wrapper>
  );
};

export default App;
