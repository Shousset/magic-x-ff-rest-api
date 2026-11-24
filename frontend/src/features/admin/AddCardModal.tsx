import type { FormEventHandler } from 'react';
import { translate, type Locale } from '@/lib/i18n';
import { FormInput } from './FormInput';

type AddCardModalProps = {
  error: string;
  locale: Locale;
  pending: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function AddCardModal({
  error,
  locale,
  pending,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div
      className="modal-backdrop active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-card-heading"
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t('close')}
          type="button"
        >
          ×
        </button>
        <h2 id="add-card-heading" className="add-card-heading">
          {t('addCardTitle')}
        </h2>
        <p className="add-card-subtitle">{t('adminPanel')}</p>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <FormInput name="name" label={t('cardName')} required />
            <div className="form-group">
              <label className="form-label" htmlFor="card-set">
                {t('setLabel')}
              </label>
              <select
                id="card-set"
                className="select-input"
                name="setCode"
                required
                defaultValue="HOB"
              >
                <option value="HOB">The Hobbit (HOB)</option>
                <option value="FIN">Final Fantasy (FIN)</option>
              </select>
            </div>
            <FormInput
              name="rarity"
              label={t('rarity')}
              placeholder="mythic, rare, uncommon, common"
              required
            />
            <FormInput
              name="type"
              label={t('cardType')}
              placeholder="Legendary Creature — Halfling..."
              required
            />
            <FormInput
              name="collectorNumber"
              label={t('collectorNumber')}
              required
            />
            <FormInput name="manaCost" label={t('manaCostLabel')} />
            <FormInput
              name="stats"
              label={t('stats')}
              placeholder={t('statsPlaceholder')}
            />
            <FormInput name="artist" label={t('artistLabel')} />
            <FormInput
              name="imageUrl"
              label={t('imageUrl')}
              type="url"
              full
            />
            <div className="form-group full">
              <label className="form-label" htmlFor="card-oracle">
                {t('oracleTextLabel')}
              </label>
              <textarea
                id="card-oracle"
                className="search-input form-input oracle-input"
                name="oracleText"
              />
            </div>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="form-actions">
            <button className="btn btn-outline" onClick={onClose} type="button">
              {t('cancel')}
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={pending}
            >
              {pending ? t('saving') : t('saveCard')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
