import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Table from 'components/Table/Table';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FilterInput = styled.input`
  padding: 10px 20px;
  font-size: 1.4rem;
  width: 100%;
  max-width: 600px;
  border: none;
  background-color: #f2f2f2;
`;

const columns = [
  {
    Header: 'Companies',
    columns: [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: (accessor) => (
          <Link to={{ pathname: `/details/${accessor.cell.value}` }}>{accessor.cell.value}</Link>
        ),
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

const TableView = ({ companiesData, isLoading }) => {
  const [filterInput, setFilterInput] = useState('');

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
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <Container>
          <FilterInput
            onKeyPress={(event) => {
              if (event.which === 13) {
                event.preventDefault();
              }
            }}
            type="text"
            placeholder="Filter by name..."
            onChange={handleTyping}
            value={filterInput}
          />
          <Table columns={columns} data={filteredCompanyByName} />
        </Container>
      )}
    </>
  );
};

TableView.propTypes = {
  companiesData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default TableView;
