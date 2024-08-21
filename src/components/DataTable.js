// components/DataTable.js
import React, { useEffect } from "react";
import {
  useTable,
  usePagination,
  useFilters,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
} from "@mui/material";
import GlobalFilter from "./GlobalFilter";
import { format, isValid } from "date-fns";

function DataTable({ columns, data, onViewChange }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (onViewChange) {
      onViewChange({ pageIndex, pageSize, globalFilter });
    }
  }, [pageIndex, pageSize, globalFilter, onViewChange]);

  return (
    <>
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={`header-group-${i}`}
                sx={{ backgroundColor: "#1976d2" }}
              >
                {headerGroup.headers.map((column, j) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`header-cell-${j}`}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    {column.render("Header")}
                    <span sx={{ marginLeft: 1 }}>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  key={`row-${i}`}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f2f2f2" } }}
                >
                  {row.cells.map((cell, j) => (
                    <TableCell {...cell.getCellProps()} key={`cell-${j}`}>
                      {cell.column.Header.toLowerCase().includes("date") &&
                      isValid(new Date(cell.value))
                        ? format(new Date(cell.value), "MM/dd/yyyy HH:mm")
                        : cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={(event, newPage) => {
          setPageSize(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setPageSize(Number(event.target.value));
        }}
      />
    </>
  );
}

export default DataTable;
