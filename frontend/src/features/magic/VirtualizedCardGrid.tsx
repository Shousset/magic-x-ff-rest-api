'use client';

import { memo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { List } from 'react-window';
import type { Card } from '@/types/magic';
import { CardRow } from './CardRow';

const CARD_ROW_HEIGHT = 332; // card-img-wrapper (250px) + card-body (~82px)
const CARD_COLUMNS = 3;
const CARD_WIDTH = 210;
const CARD_GAP = 16;

type VirtualizedCardGridProps = {
  cards: Card[];
  onCardSelect: (card: Card) => void;
};

/**
 * Wraps react-window's `FixedSizeList` so the catalog renders only the rows
 * that are actually visible in the viewport.
 *
 * Layout notes:
 * - The grid is a single vertical list of rows; each row contains
 *   `CARD_COLUMNS` cards laid out with CSS grid, so the outer list only
 *   needs to know the row height and the number of rows.
 * - The list is sized to its container with `height: 100%` and `min-height: 0`
 *   so flex parents (e.g. the app container) actually constrain it. Without
 *   `min-height: 0` the flex child ignores its parent's bounds and the list
 *   renders every row, defeating virtualization.
 * - `useLayoutEffect` measures the container width on mount/resize and
 *   recomputes the number of columns + row width, which keeps the grid
 *   responsive without re-mounting the list.
 */
export const VirtualizedCardGrid = memo(
  ({ cards, onCardSelect }: VirtualizedCardGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const updateWidth = useCallback(() => {
      const node = containerRef.current;
      if (!node) return;
      const width = node.clientWidth;
      if (width > 0) setContainerWidth(width);
    }, []);

    useLayoutEffect(() => {
      updateWidth();
      const node = containerRef.current;
      if (!node) return undefined;
      const observer = new ResizeObserver(() => updateWidth());
      observer.observe(node);
      return () => observer.disconnect();
    }, [updateWidth]);

    const columns = Math.max(
      1,
      Math.floor((containerWidth + CARD_GAP) / (CARD_WIDTH + CARD_GAP)) ||
        CARD_COLUMNS,
    );
    const rowCount = Math.ceil(cards.length / columns);

    const rowKey = useCallback(
      (index: number) => `${index}-${columns}`,
      [columns],
    );

    const rowProps = { cards, onCardSelect, columns };

    if (containerWidth === 0) {
      // Render nothing until we know the real width; the grid will paint on
      // the first measurement, avoiding a 0-width list that renders all rows.
      return <div ref={containerRef} className="virtualized-card-grid" />;
    }

    return (
      <div ref={containerRef} className="virtualized-card-grid">
        <List
          className="virtualized-card-list"
          rowCount={rowCount}
          rowHeight={CARD_ROW_HEIGHT}
          rowKey={rowKey}
          rowComponent={CardRow}
          rowProps={rowProps}
          style={{
            height: '100%',
            width: '100%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        />
      </div>
    );
  },
);

VirtualizedCardGrid.displayName = 'VirtualizedCardGrid';