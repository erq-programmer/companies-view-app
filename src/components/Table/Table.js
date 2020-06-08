/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import { useTable, usePagination } from 'react-table';
import styled from 'styled-components';

const TableStyles = styled.section`
  padding: 2rem;
  width: 100%;

  table {
    border-spacing: 0;
    border: 0;
    box-shadow: 10px 10px 26px 0px rgba(0, 0, 0, 0.28);
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;

      :first-child {
        text-align: center;
      }

      :last-child {
        border-right: 0;
        text-align: center;
      }
    }

    th {
      font-size: 2rem;
      font-weight: 700;
    }
  }
`;

const Pagination = styled.div`
  padding: 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
  }

  span {
    margin: 0 20px;
    color: #f2f2f2;

    strong {
      font-weight: 700;
    }
  }

  select {
    cursor: pointer;
    padding: 5px 10px;

    option {
      cursor: pointer;
    }
  }
`;

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination,
  );

  return (
    <TableStyles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination>
        <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page
          <strong> {pageIndex + 1} </strong> of <strong>{pageOptions.length}</strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </Pagination>
    </TableStyles>
  );
};

export default Table;
