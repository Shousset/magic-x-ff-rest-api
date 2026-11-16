'use client';

import { getPaginationItems } from '@/lib/pagination';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  disabled = false,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination-controls" aria-label="Paginación del catálogo">
      <button
        className="pagination-page-button"
        type="button"
        aria-label="Página anterior"
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Anterior
      </button>
      {getPaginationItems(currentPage, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            className="pagination-ellipsis"
            key={`ellipsis-${index}`}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            className={`pagination-page-button${item === currentPage ? ' active' : ''}`}
            type="button"
            key={item}
            aria-label={`Página ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        className="pagination-page-button"
        type="button"
        aria-label="Página siguiente"
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
