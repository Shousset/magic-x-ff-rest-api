type FormInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  full?: boolean;
};

export function FormInput({
  name,
  label,
  placeholder,
  required = false,
  type = 'text',
  full = false,
}: FormInputProps) {
  const id = `card-${name}`;
  return (
    <div className={`form-group ${full ? 'full' : ''}`}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="search-input form-input"
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  );
}
