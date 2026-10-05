import type { FormEventHandler } from 'react';

type LoginModalProps = {
  error: string;
  pending: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function LoginModal({
  error,
  pending,
  onClose,
  onSubmit,
}: LoginModalProps) {
  return (
    <div
      className="modal-backdrop active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content login-modal">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        <div className="modal-heading">
          <h2>Iniciar Sesión</h2>
          <p>Accede para administrar tu inventario de cartas</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              Usuario
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
              Contraseña
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
            {pending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
