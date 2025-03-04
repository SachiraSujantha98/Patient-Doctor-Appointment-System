import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

interface Column<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown) => string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  error?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onSort?: (orderBy: string, orderDirection: 'asc' | 'desc') => void;
}

export function DataTable<T>({
  columns,
  rows,
  totalCount,
  page,
  rowsPerPage,
  loading = false,
  error,
  orderBy,
  orderDirection = 'asc',
  onPageChange,
  onRowsPerPageChange,
  onSort,
}: DataTableProps<T>) {
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  const handleSort = (columnId: string) => {
    if (!onSort) return;
    const isAsc = orderBy === columnId && orderDirection === 'asc';
    onSort(columnId, isAsc ? 'desc' : 'asc');
  };

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id.toString()}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? orderDirection : 'asc'}
                      onClick={() => handleSort(column.id.toString())}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    if (column.render) {
                      return (
                        <TableCell key={column.id.toString()} align={column.align}>
                          {column.render(row)}
                        </TableCell>
                      );
                    }

                    const value = column.id instanceof String ? row[column.id as keyof T] : undefined;
                    return (
                      <TableCell key={column.id.toString()} align={column.align}>
                        {column.format && value ? column.format(value) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
} 