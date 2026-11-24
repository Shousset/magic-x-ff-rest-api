import type { FormEventHandler } from 'react';
import { translate, type Locale } from '@/lib/i18n';

type LoginModalProps = {
  error: string;
  locale: Locale;
  pending: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function LoginModal({
  error,
  locale,
  pending,
  onClose,
  onSubmit,
}: LoginModalProps) {
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div
      className="modal-backdrop active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label={t('close')}
          type="button"
        >
          ×
        </button>
        <div className="modal-heading">
          <h2 id="login-modal-title">{t('loginTitle')}</h2>
          <p>{t('loginDescription')}</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              {t('username')}
            </label>
            <input
              className="search-input form-input"
              id="login-username"
              name="username"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              {t('password')}
            </label>
            <input
              className="search-input form-input"
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="btn btn-primary submit-button"
            type="submit"
            disabled={pending}
          >
            {pending ? t('loggingIn') : t('loginSubmit')}
          </button>
        </form>
      </div>
    </div>
  );
}
