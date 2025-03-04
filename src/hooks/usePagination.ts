import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  rowsPerPage: number;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

interface UsePaginationProps {
  initialPage?: number;
  initialRowsPerPage?: number;
  initialOrderBy?: string;
  initialOrderDirection?: 'asc' | 'desc';
}

export const usePagination = ({
  initialPage = 0,
  initialRowsPerPage = 10,
  initialOrderBy = 'createdAt',
  initialOrderDirection = 'desc',
}: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    rowsPerPage: initialRowsPerPage,
    orderBy: initialOrderBy,
    orderDirection: initialOrderDirection,
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
      rowsPerPage: newRowsPerPage,
    }));
  }, []);

  const handleSort = useCallback((orderBy: string, orderDirection: 'asc' | 'desc') => {
    setPagination((prev) => ({
      ...prev,
      orderBy,
      orderDirection,
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
    }));
  }, []);

  return {
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    handleSort,
    resetPagination,
  };
}; 