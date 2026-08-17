export function InputField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  icon,
  multiline = false,
  dataTestId,
  required = false,
  autoComplete,
  placeholder,
  type = 'text',
  min,
  max,
  inputMode,
  rows = 4,
}) {
  return (
    <div className={error ? 'input-error' : undefined}>
      <label className="field-label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className="field-wrap">
        {icon}
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required={required}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            data-testid={dataTestId}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            inputMode={inputMode}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            data-testid={dataTestId}
          />
        )}
      </div>
      {error ? <p className="field-error" id={`${id}-error`} role="alert">{error}</p> : hint ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
    </div>
  );
}