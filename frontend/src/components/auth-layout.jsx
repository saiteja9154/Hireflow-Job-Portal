import { ArrowLeft, Check, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, mode }) {
  const isLogin = mode === 'login';
  return (
    <main className="auth-page">
      <div className="auth-aside">
        <Link to="/" className="brand brand-light" data-testid="link-auth-logo">
          <span className="brand-mark"><Sparkles size={15} strokeWidth={2.8} /></span>
          <span>Hire<span>Flow</span></span>
        </Link>
        <div className="auth-aside-copy">
          <span className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> {isLogin ? 'A better next step' : 'Make a considered start'}</span>
          <h1>{isLogin ? 'Welcome back to your momentum.' : 'Your next chapter starts here.'}</h1>
          <p>{isLogin ? 'Keep your search focused, your options open, and the right work within reach.' : 'Tell us what good work looks like to you. We’ll keep the signal clear.'}</p>
          <div className="aside-proof" aria-label="HireFlow highlights">
            <div className="aside-proof-row"><span className="aside-proof-icon"><Check size={14} /></span><span><strong>Thoughtful by default</strong><small>Tools that respect your time</small></span></div>
            <div className="aside-proof-row"><span className="aside-proof-icon aside-proof-icon-teal"><TrendingUp size={14} /></span><span><strong>Keep moving forward</strong><small>A clearer path to the right fit</small></span></div>
          </div>
        </div>
        <div className="auth-aside-foot"><span className="aside-line" /> <span>Trusted by curious people and growing teams</span></div>
      </div>
      <div className="auth-panel">
        <Link to="/" className="back-link" data-testid="link-auth-back"><ArrowLeft size={16} /> Back to home</Link>
        {children}
      </div>
    </main>
  );
}