import { CheckCircle2, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth-layout';
import { InputField } from '@/components/input-field';
import { PasswordField } from '@/components/password-field';
import { PrimaryButton } from '@/components/primary-button';
import { RoleSelector } from '@/components/role-selector';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailError = touched && !email.trim()
    ? 'Enter the email address you used to sign up.'
    : touched && !/^\S+@\S+\.\S+$/.test(email)
      ? 'That email address looks incomplete.'
      : undefined;
  const passwordError = touched && !password ? 'Enter your password to continue.' : undefined;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextEmailError = !email.trim()
      ? 'Enter the email address you used to sign up.'
      : !/^\S+@\S+\.\S+$/.test(email)
        ? 'That email address looks incomplete.'
        : undefined;
    const nextPasswordError = !password ? 'Enter your password to continue.' : undefined;
    
    setTouched(true);
    setFeedback(null);
    
    if (nextEmailError || nextPasswordError) {
      setFeedback({ kind: 'error', message: 'Check the highlighted fields and try again.' });
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password, role);
      setFeedback({ kind: 'success', message: 'Login successful! Opening workspace...' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Verify your email, password, and role, then try again.';
      setFeedback({ kind: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setFeedback({ kind: 'success', message: 'Password recovery is not fully active yet. Please contact support.' });
  };

  return (
    <AuthLayout mode="login">
      <div className="auth-form-wrap">
        <span className="eyebrow">Welcome back</span>
        <h2>Log in to HireFlow</h2>
        <p className="auth-lead">Pick up where you left off, with the next good move in view.</p>
        {feedback && (
          <div className={`form-feedback form-feedback-${feedback.kind}`} role="status" data-testid="status-login-feedback">
            {feedback.kind === 'success' ? <CheckCircle2 className="feedback-icon" size={17} /> : <TriangleAlert className="feedback-icon" size={17} />}
            <span>{feedback.message}</span>
          </div>
        )}
        {loading && <div className="form-progress" aria-label="Loading"><span /></div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <RoleSelector value={role} onChange={setRole} legend="I’m here to" name="login-role" />
          <InputField
            id="login-email"
            label="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={emailError}
            icon={<Mail size={17} aria-hidden="true" />}
            autoComplete="email"
            placeholder="you@example.com"
            type="email"
            inputMode="email"
            required
            dataTestId="input-login-email"
          />
          <div className="field-row-label">
            <label className="field-label" htmlFor="login-password">Password <span aria-hidden="true">*</span></label>
            <button type="button" className="plain-button" onClick={handleForgotPassword} data-testid="button-forgot-password">Forgot password?</button>
          </div>
          <PasswordField
            id="login-password"
            label=""
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={passwordError}
            autoComplete="current-password"
            placeholder="Enter your password"
            dataTestId="input-login-password"
            hideLabel
          />
          <label className="terms-check remember-check">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} data-testid="input-login-remember" />
            <span>Keep me signed in on this device</span>
          </label>
          <PrimaryButton loading={loading} dataTestId="button-login-submit">Log in</PrimaryButton>
        </form>
        <div className="auth-switch">New to HireFlow? <Link to="/register" data-testid="link-switch-register">Create an account <span aria-hidden="true">→</span></Link></div>
        <p className="privacy-note"><ShieldCheck size={14} aria-hidden="true" /> Your information stays yours. Always.</p>
      </div>
    </AuthLayout>
  );
}