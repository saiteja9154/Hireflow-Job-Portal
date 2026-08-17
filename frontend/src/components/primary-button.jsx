import { ArrowRight, Check, LoaderCircle } from 'lucide-react';

export function PrimaryButton({ children, loading = false, success = false, disabled, dataTestId, ...props }) {
  return (
    <button
      {...props}
      type={props.type ?? 'submit'}
      className={`button button-primary button-submit ${props.className ?? ''}`}
      disabled={disabled || loading}
      aria-busy={loading}
      data-testid={dataTestId}
    >
      {loading ? (
        <><LoaderCircle size={16} className="button-loader" aria-hidden="true" /> Working on it…</>
      ) : success ? (
        <><Check size={16} aria-hidden="true" /> Preview saved</>
      ) : (
        <>{children} <ArrowRight size={16} aria-hidden="true" /></>
      )}
    </button>
  );
}