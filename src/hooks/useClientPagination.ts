import { useState, useMemo } from 'react';

export function useClientPagination<T>(
  data: T[] = [],
  itemsPerPage: number = 10,
  resetDependencies: React.DependencyList = []
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevDependencies, setPrevDependencies] = useState(resetDependencies);

  let currentRenderPage = currentPage;

  // Reset to page 1 during render when dependencies change (React recommended pattern)
  const depsChanged =
    resetDependencies.length !== prevDependencies.length ||
    resetDependencies.some((dep, i) => !Object.is(dep, prevDependencies[i]));

  if (depsChanged) {
    currentRenderPage = 1;
    setPrevDependencies(resetDependencies);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

  // Ensure current page is bounded properly just in case
  const safeCurrentPage = Math.min(Math.max(currentRenderPage, 1), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, safeCurrentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
  };

  const nextPage = () => goToPage(safeCurrentPage + 1);
  const prevPage = () => goToPage(safeCurrentPage - 1);

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
}
