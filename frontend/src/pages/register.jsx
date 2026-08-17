import { Building2, CheckCircle2, Globe2, Mail, MapPin, Phone, TriangleAlert, UploadCloud, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth-layout';
import { InputField } from '@/components/input-field';
import { PasswordField } from '@/components/password-field';
import { PrimaryButton } from '@/components/primary-button';
import { RoleSelector } from '@/components/role-selector';
import { useAuth } from '../context/AuthContext';

const emptyCandidate = { fullName: '', email: '', phone: '', skills: '', location: '', experience: '', summary: '' };
const emptyRecruiter = { companyName: '', recruiterName: '', email: '', phone: '', website: '', location: '', size: '', industry: '' };

export default function Register() {
  const [role, setRole] = useState('candidate');
  const [candidate, setCandidate] = useState(emptyCandidate);
  const [recruiter, setRecruiter] = useState(emptyRecruiter);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const updateCandidate = (key, value) => {
    setCandidate((current) => ({ ...current, [key]: value }));
  };
  const updateRecruiter = (key, value) => {
    setRecruiter((current) => ({ ...current, [key]: value }));
  };

  const getErrors = () => {
    const nextErrors = {};
    const required = (key, value, message) => {
      if (!value || !value.trim()) nextErrors[key] = message;
    };
    if (role === 'candidate') {
      required('fullName', candidate.fullName, 'Add your full name.');
      required('email', candidate.email, 'Add an email address.');
      if (candidate.email && !/^\S+@\S+\.\S+$/.test(candidate.email)) nextErrors.email = 'That email address looks incomplete.';
      required('phone', candidate.phone, 'Add a phone number.');
      required('skills', candidate.skills, 'Add a few skills, separated by commas.');
      required('location', candidate.location, 'Tell us where you prefer to work.');
      required('experience', candidate.experience, 'Choose your experience level.');
    } else {
      required('companyName', recruiter.companyName, 'Add your company name.');
      required('recruiterName', recruiter.recruiterName, 'Add your name.');
      required('email', recruiter.email, 'Add a company email.');
      if (recruiter.email && !/^\S+@\S+\.\S+$/.test(recruiter.email)) nextErrors.email = 'That email address looks incomplete.';
      required('phone', recruiter.phone, 'Add a phone number.');
      required('website', recruiter.website, 'Add your company website.');
      required('location', recruiter.location, 'Add a company location.');
      required('size', recruiter.size, 'Select your company size.');
      required('industry', recruiter.industry, 'Select your industry.');
    }
    if (password.length < 8) nextErrors.password = 'Use at least 8 characters for a stronger password.';
    if (!confirmPassword) nextErrors.confirmPassword = 'Confirm your password.';
    else if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match yet.';
    if (!terms) nextErrors.terms = 'Agree to the terms to continue.';
    return nextErrors;
  };
  
  const errors = attempted ? getErrors() : {};

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setAttempted(false);
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = getErrors();
    setAttempted(true);
    setFeedback(null);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ kind: 'error', message: 'A few details still need your attention before registering.' });
      return;
    }
    
    setLoading(true);
    try {
      const userData = role === 'candidate' ? candidate : recruiter;
      await register({ ...userData, password }, role);
      setFeedback({ kind: 'success', message: 'Account created! Redirecting to workspace...' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'An error occurred during registration. Try a different email address.';
      setFeedback({ kind: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="register">
      <div className="auth-form-wrap register-form-wrap">
        <span className="eyebrow">Start with intention</span>
        <h2>Create your account</h2>
        <p className="auth-lead">A few details now, so the right opportunities feel closer later.</p>
        {feedback && (
          <div className={`form-feedback form-feedback-${feedback.kind}`} role="status" data-testid="status-register-feedback">
            {feedback.kind === 'success' ? <CheckCircle2 className="feedback-icon" size={17} /> : <TriangleAlert className="feedback-icon" size={17} />}
            <span>{feedback.message}</span>
          </div>
        )}
        {loading && <div className="form-progress" aria-label="Loading"><span /></div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <RoleSelector value={role} onChange={handleRoleChange} tall legend="What brings you here?" name="register-role" />

          {role === 'candidate' ? (
            <>
              <div className="field-section">
                <h3 className="field-section-heading">Your details</h3>
                <p className="field-section-note">Start with the basics. You can make your profile more specific later.</p>
                <div className="field-grid">
                  <InputField id="register-full-name" label="Full name" value={candidate.fullName} onChange={(event) => updateCandidate('fullName', event.target.value)} error={errors.fullName} icon={<UserRound size={17} aria-hidden="true" />} autoComplete="name" placeholder="Ada Lovelace" required dataTestId="input-register-full-name" />
                  <InputField id="register-email" label="Email address" value={candidate.email} onChange={(event) => updateCandidate('email', event.target.value)} error={errors.email} icon={<Mail size={17} aria-hidden="true" />} autoComplete="email" placeholder="you@example.com" type="email" inputMode="email" required dataTestId="input-register-email" />
                </div>
                <div style={{ marginTop: 13 }}>
                  <InputField id="register-phone" label="Phone number" value={candidate.phone} onChange={(event) => updateCandidate('phone', event.target.value)} error={errors.phone} icon={<Phone size={17} aria-hidden="true" />} autoComplete="tel" placeholder="+1 415 555 0184" type="tel" inputMode="tel" required dataTestId="input-register-phone" />
                </div>
              </div>
              <div className="field-section">
                <h3 className="field-section-heading">Your direction</h3>
                <div className="field-grid">
                  <InputField id="register-skills" label="Skills" value={candidate.skills} onChange={(event) => updateCandidate('skills', event.target.value)} error={errors.skills} placeholder="Product design, research, Figma" hint="Separate skills with commas." required dataTestId="input-register-skills" />
                  <InputField id="register-location" label="Preferred location" value={candidate.location} onChange={(event) => updateCandidate('location', event.target.value)} error={errors.location} icon={<MapPin size={17} aria-hidden="true" />} autoComplete="address-level2" placeholder="San Francisco or remote" required dataTestId="input-register-location" />
                </div>
                <div style={{ marginTop: 13 }}>
                  <label className="field-label" htmlFor="register-experience">Years of experience <span aria-hidden="true">*</span></label>
                  <div className={errors.experience ? 'input-error' : undefined}>
                    <div className="field-wrap">
                      <select id="register-experience" value={candidate.experience} onChange={(event) => updateCandidate('experience', event.target.value)} required aria-invalid={Boolean(errors.experience)} data-testid="input-register-experience">
                        <option value="">Select an experience level</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1–3 years</option>
                        <option value="4-7">4–7 years</option>
                        <option value="8-12">8–12 years</option>
                        <option value="13-plus">13+ years</option>
                      </select>
                    </div>
                  </div>
                  {errors.experience && <p className="field-error" role="alert">{errors.experience}</p>}
                </div>
              </div>
              <div className="field-section">
                <h3 className="field-section-heading">Show your shape</h3>
                <InputField id="register-summary" label="Short profile summary" value={candidate.summary} onChange={(event) => updateCandidate('summary', event.target.value)} hint="Two or three lines about the work you do best." placeholder="I turn complex products into clear, useful experiences." multiline rows={4} dataTestId="input-register-summary" />
              </div>
            </>
          ) : (
            <>
              <div className="field-section">
                <h3 className="field-section-heading">Company details</h3>
                <p className="field-section-note">Give candidates a useful first impression of the team behind the role.</p>
                <InputField id="register-company-name" label="Company name" value={recruiter.companyName} onChange={(event) => updateRecruiter('companyName', event.target.value)} error={errors.companyName} icon={<Building2 size={17} aria-hidden="true" />} autoComplete="organization" placeholder="Northstar Studio" required dataTestId="input-register-company-name" />
                <div className="field-grid" style={{ marginTop: 13 }}>
                  <InputField id="register-recruiter-name" label="Recruiter name" value={recruiter.recruiterName} onChange={(event) => updateRecruiter('recruiterName', event.target.value)} error={errors.recruiterName} icon={<UserRound size={17} aria-hidden="true" />} autoComplete="name" placeholder="Mara Chen" required dataTestId="input-register-recruiter-name" />
                  <InputField id="register-company-email" label="Company email" value={recruiter.email} onChange={(event) => updateRecruiter('email', event.target.value)} error={errors.email} icon={<Mail size={17} aria-hidden="true" />} autoComplete="email" placeholder="mara@northstar.co" type="email" inputMode="email" required dataTestId="input-register-company-email" />
                </div>
                <div className="field-grid" style={{ marginTop: 13 }}>
                  <InputField id="register-recruiter-phone" label="Phone number" value={recruiter.phone} onChange={(event) => updateRecruiter('phone', event.target.value)} error={errors.phone} icon={<Phone size={17} aria-hidden="true" />} autoComplete="tel" placeholder="+1 415 555 0184" type="tel" inputMode="tel" required dataTestId="input-register-recruiter-phone" />
                  <InputField id="register-company-website" label="Company website" value={recruiter.website} onChange={(event) => updateRecruiter('website', event.target.value)} error={errors.website} icon={<Globe2 size={17} aria-hidden="true" />} autoComplete="url" placeholder="https://northstar.co" type="url" required dataTestId="input-register-company-website" />
                </div>
              </div>
              <div className="field-section">
                <h3 className="field-section-heading">Your team</h3>
                <div className="field-grid">
                  <InputField id="register-company-location" label="Company location" value={recruiter.location} onChange={(event) => updateRecruiter('location', event.target.value)} error={errors.location} icon={<MapPin size={17} aria-hidden="true" />} autoComplete="address-level2" placeholder="San Francisco, CA" required dataTestId="input-register-company-location" />
                  <div className={errors.size ? 'input-error' : undefined}>
                    <label className="field-label" htmlFor="register-company-size">Company size <span aria-hidden="true">*</span></label>
                    <div className="field-wrap"><select id="register-company-size" value={recruiter.size} onChange={(event) => updateRecruiter('size', event.target.value)} required aria-invalid={Boolean(errors.size)} data-testid="input-register-company-size"><option value="">Select size</option><option value="1-10">1–10 people</option><option value="11-50">11–50 people</option><option value="51-200">51–200 people</option><option value="201-500">201–500 people</option><option value="501-plus">501+ people</option></select></div>
                    {errors.size && <p className="field-error" role="alert">{errors.size}</p>}
                  </div>
                </div>
                <div style={{ marginTop: 13 }} className={errors.industry ? 'input-error' : undefined}>
                  <label className="field-label" htmlFor="register-industry">Industry <span aria-hidden="true">*</span></label>
                  <div className="field-wrap"><select id="register-industry" value={recruiter.industry} onChange={(event) => updateRecruiter('industry', event.target.value)} required aria-invalid={Boolean(errors.industry)} data-testid="input-register-industry"><option value="">Select an industry</option><option value="technology">Technology</option><option value="healthcare">Healthcare</option><option value="finance">Finance</option><option value="climate">Climate and energy</option><option value="media">Media and culture</option><option value="other">Something else</option></select></div>
                  {errors.industry && <p className="field-error" role="alert">{errors.industry}</p>}
                </div>
              </div>
            </>
          )}

          <div className="field-section">
            <h3 className="field-section-heading">Secure your access</h3>
            <div className="field-grid">
              <PasswordField id="register-password" label="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} hint="At least 8 characters." placeholder="Create a password" dataTestId="input-register-password" />
              <PasswordField id="register-confirm-password" label="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} error={errors.confirmPassword} placeholder="Repeat your password" dataTestId="input-register-confirm-password" />
            </div>
            <label className="terms-check">
              <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} required aria-invalid={Boolean(errors.terms)} data-testid="input-register-terms" />
              <span>I agree to HireFlow’s <a href="#terms" data-testid="link-register-terms">terms and privacy policy</a>.</span>
            </label>
            {errors.terms && <p className="field-error" role="alert">{errors.terms}</p>}
          </div>
          <PrimaryButton loading={loading} dataTestId="button-register-submit">Create my account</PrimaryButton>
        </form>
        <div className="auth-switch">Already have an account? <Link to="/login" data-testid="link-switch-login">Log in <span aria-hidden="true">→</span></Link></div>
      </div>
    </AuthLayout>
  );
}