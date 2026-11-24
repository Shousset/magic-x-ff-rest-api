'use client';

import { getPaginationItems } from '@/lib/pagination';
import { translate, type Locale } from '@/lib/i18n';

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  locale: Locale;
  disabled?: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  locale,
  disabled = false,
  onPageChange,
}: PaginationControlsProps) {
  const t = (
    key: Parameters<typeof translate>[1],
    values?: Record<string, string | number>,
  ) => translate(locale, key, values);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination-controls" aria-label={t('pagination')}>
      <button
        className="pagination-page-button"
        type="button"
        aria-label={t('previousPage')}
        disabled={disabled || currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        {t('previous')}
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
            aria-label={t('page', { page: item })}
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
        aria-label={t('nextPage')}
        disabled={disabled || currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        {t('next')}
      </button>
    </nav>
  );
}
