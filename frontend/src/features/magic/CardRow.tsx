'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { RowComponentProps } from 'react-window';
import type { Card } from '@/types/magic';

const fallbackImage = '/img/MTG.png';

type CardRowProps = {
  cards: Card[];
  columns: number;
  onCardSelect: (card: Card) => void;
};

/**
 * Row rendered by react-window's virtualized list.
 *
 * Each row is one grid row of `columns` catalog cards. react-window passes
 * `index`, `style` and ARIA attributes; we use `style` to position the row and
 * render only the slice of cards that belong to this row index. react-window
 * only re-renders rows that enter/leave the viewport, so the catalog renders
 * only the cards actually on screen.
 */
export const CardRow = ({
  cards,
  columns,
  index,
  style,
  onCardSelect,
  ariaAttributes,
}: RowComponentProps<CardRowProps>) => {
  const start = index * columns;
  const slice = cards.slice(start, start + columns);

  return (
    <div
      className="card-row"
      style={{ ...style, ['--card-columns']: String(columns) } as CSSProperties}
      {...ariaAttributes}
    >
      {slice.map((card) => (
        <button
          className="card-item"
          key={card.id}
          onClick={() => {
            onCardSelect(card);
          }}
          type="button"
        >
          <span className="card-img-wrapper">
            <span
              className={`card-set-badge ${
                card.setCode === 'HOB'
                  ? 'set-badge-hob'
                  : card.setCode === 'FRA'
                    ? 'set-badge-fra'
                    : 'set-badge-fin'
              }`}
            >
              {card.setCode || 'FIN'}
            </span>
            <Image
              src={card.imageUrl || fallbackImage}
              alt={card.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 210px"
              className="card-img"
              loading="lazy"
              unoptimized={true}
            />
          </span>
          <span className="card-body">
            <strong className="card-name">{card.name}</strong>
            <span className="card-badges">
              <span
                className={`badge badge-rarity-${card.rarity.name.toLowerCase()}`}
              >
                {card.rarity.name}
              </span>
              <span className="badge">{card.cardType.name}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};