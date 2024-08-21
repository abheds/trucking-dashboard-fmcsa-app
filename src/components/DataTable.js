import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useFilters,
} from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import GlobalFilter from "./GlobalFilter";
import { format, isValid } from "date-fns";

const DraggableHeader = ({ column, index, moveColumn }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "column",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "column",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <TableCell
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: "#1976d2 !important",
        color: "#fff !important",
        fontWeight: "bold !important",
      }}
      {...column.getHeaderProps(column.getSortByToggleProps())}
      key={column.id}
    >
      {column.render("Header")}
      <span>
        {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
      </span>
    </TableCell>
  );
};

const DataTable = ({ columns, data, onViewChange }) => {
  const [orderedColumns, setColumns] = useState(columns);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    setGlobalFilter,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: orderedColumns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const moveColumn = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedColumn = orderedColumns[dragIndex];
      setColumns(
        update(orderedColumns, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, draggedColumn],
          ],
        })
      );
    },
    [orderedColumns]
  );

  useEffect(() => {
    if (onViewChange) {
      onViewChange({ pageIndex, pageSize, globalFilter });
    }
  }, [pageIndex, pageSize, globalFilter, onViewChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <TableContainer component={Paper}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((column, index) => (
                  <DraggableHeader
                    key={column.id}
                    column={column}
                    index={index}
                    moveColumn={moveColumn}
                  />
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={i}>
                  {row.cells.map((cell) => (
                    <TableCell {...cell.getCellProps()} key={cell.column.id}>
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
        count={rows.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={(event, newPage) => gotoPage(newPage)}
        onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
      />
    </DndProvider>
  );
};

export default DataTable;
