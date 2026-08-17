import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useState } from 'react';

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = 'new-password',
  placeholder,
  dataTestId,
  hideLabel = false,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <div className={error ? 'input-error' : undefined}>
        {!hideLabel && <label className="field-label" htmlFor={id}>{label}<span aria-hidden="true"> *</span></label>}
        <div className="field-wrap">
          <LockKeyhole size={17} aria-hidden="true" />
          <input
            id={id}
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            data-testid={dataTestId}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
            data-testid={`button-toggle-${id}`}
          >
            {visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
          </button>
        </div>
        {error ? <p className="field-error" id={`${id}-error`} role="alert">{error}</p> : hint ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
      </div>
    </div>
  );
}