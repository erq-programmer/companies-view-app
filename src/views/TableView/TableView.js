/* eslint-disable react/prop-types */
import React, { useState, useCallback, useMemo } from 'react';
import Table from 'components/Table/Table';

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
    </>
  );
};

export default TableView;
