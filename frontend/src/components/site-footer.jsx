import { ArrowUpRight, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-column">
          <Link to="/" className="brand brand-light" data-testid="link-footer-logo">
            <span className="brand-mark"><Sparkles size={15} strokeWidth={2.8} /></span>
            <span>Hire<span>Flow</span></span>
          </Link>
          <p>A more considered way to find work that moves you forward.</p>
          <a href="mailto:hello@hireflow.co" className="footer-email" data-testid="link-footer-email"><Mail size={15} /> hello@hireflow.co</a>
        </div>
        <div className="footer-links-group">
          <p className="footer-heading">Explore</p>
          <Link to="/jobs" data-testid="link-footer-jobs">Find jobs <ArrowUpRight size={13} /></Link>
          <Link to="/register" data-testid="link-footer-register">Create an account <ArrowUpRight size={13} /></Link>
          <a href="#how-it-works" data-testid="link-footer-how">How it works</a>
        </div>
        <div className="footer-links-group">
          <p className="footer-heading">Company</p>
          <a href="mailto:hello@hireflow.co" data-testid="link-footer-contact">Contact</a>
          <a href="#about" data-testid="link-footer-about">About HireFlow</a>
          <a href="#privacy" data-testid="link-footer-privacy">Privacy policy</a>
          <a href="#terms" data-testid="link-footer-terms">Terms of service</a>
        </div>
        <div className="footer-note">
          <span className="eyebrow eyebrow-light">Made for momentum</span>
          <p>Good work starts with the right conversation.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 HireFlow, Inc.</span>
        <span>Built for the next chapter.</span>
      </div>
    </footer>
  );
}