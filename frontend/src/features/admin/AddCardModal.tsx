import type { FormEventHandler } from 'react';
import { FormInput } from './FormInput';

type AddCardModalProps = {
  error: string;
  pending: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function AddCardModal({
  error,
  pending,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  return (
    <div
      className="modal-backdrop active"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        <h2 className="add-card-heading">Registrar Nueva Carta</h2>
        <p className="add-card-subtitle">Panel para administradores.</p>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <FormInput name="name" label="Nombre de la Carta *" required />
            <div className="form-group">
              <label className="form-label" htmlFor="card-set">
                Colección (Set) *
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
              label="Rareza *"
              placeholder="mythic, rare, uncommon, common"
              required
            />
            <FormInput
              name="type"
              label="Tipo de Carta *"
              placeholder="Legendary Creature — Halfling..."
              required
            />
            <FormInput
              name="collectorNumber"
              label="N.º Coleccionista *"
              required
            />
            <FormInput name="manaCost" label="Coste de Maná" />
            <FormInput
              name="stats"
              label="Fuerza / Resistencia"
              placeholder="Ej: 2/2"
            />
            <FormInput name="artist" label="Artista" />
            <FormInput
              name="imageUrl"
              label="URL de la Imagen"
              type="url"
              full
            />
            <div className="form-group full">
              <label className="form-label" htmlFor="card-oracle">
                Texto de Habilidad (Oracle Text)
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
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={pending}
            >
              {pending ? 'Guardando...' : 'Guardar Carta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
