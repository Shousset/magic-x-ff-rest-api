export type PaginationItem = number | 'ellipsis';

const MAX_VISIBLE_PAGES = 7;

export function getPageOffset(currentPage: number, pageSize: number): number {
  const page = Number.isInteger(currentPage) ? Math.max(1, currentPage) : 1;
  const size = Number.isInteger(pageSize) ? Math.max(1, pageSize) : 1;
  return (page - 1) * size;
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    return [];
  }

  const page = Math.min(
    totalPages,
    Math.max(1, Number.isInteger(currentPage) ? currentPage : 1),
  );

  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const firstVisiblePage = Math.max(2, page - 1);
  const lastVisiblePage = Math.min(totalPages - 1, page + 1);
  const items: PaginationItem[] = [1];

  if (firstVisiblePage > 2) {
    items.push('ellipsis');
  }

  for (let visiblePage = firstVisiblePage; visiblePage <= lastVisiblePage; visiblePage++) {
    items.push(visiblePage);
  }

  if (lastVisiblePage < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);
  return items;
}
