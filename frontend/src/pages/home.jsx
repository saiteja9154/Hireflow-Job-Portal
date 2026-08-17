import { ArrowRight, ArrowUpRight, Check, ChevronRight, CircleDot, Compass, Layers3, Search, Sparkles, UsersRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobCard } from '@/components/job-card';
import { categories, jobs as mockJobs } from '@/components/hireflow-data';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import api from '../services/api';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to mock jobs in case API is not fully set up
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="app-page">
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> The thoughtful job platform</span>
              <h1>Find Your Dream Job <em>with HireFlow.</em></h1>
              <p className="hero-description">Connect talented candidates with the right companies through a simple and professional hiring platform.</p>
              <div className="hero-actions">
                <Link to="/jobs" className="button button-primary button-large" data-testid="link-hero-find-jobs">Find jobs <ArrowRight size={17} /></Link>
                <Link to="/register" className="button button-ghost button-large" data-testid="link-hero-post-job">Post a job <span className="button-arrow">↗</span></Link>
              </div>
              <div className="hero-trust"><div className="avatar-stack"><span>AR</span><span>JM</span><span>SK</span><span>+</span></div><p><strong>50,000+</strong> people finding their next move</p></div>
            </div>
            <div className="hero-visual" aria-label="A network of opportunities">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />
              <div className="visual-orbit orbit-three" />
              <div className="visual-core"><Sparkles size={26} /><span>your next<br /><strong>good move</strong></span></div>
              <div className="orbit-chip chip-one"><span className="chip-icon chip-green"><Check size={14} /></span><span><strong>New role found</strong><small>Product Design · Remote</small></span></div>
              <div className="orbit-chip chip-two"><span className="chip-icon chip-orange"><CircleDot size={14} /></span><span><strong>Northstar Labs</strong><small>Building with purpose</small></span></div>
              <div className="orbit-chip chip-three"><span className="chip-icon chip-blue"><UsersRound size={14} /></span><span><strong>Meet your people</strong><small>2,500+ growing teams</small></span></div>
              <div className="visual-stamp">WORK<br /><span>with</span><br />INTENT</div>
            </div>
          </div>
          <div className="hero-footnote"><span>Scroll to explore</span><span className="scroll-line" /></div>
        </section>

        <section className="section featured-section">
          <div className="section-heading-row">
            <div><span className="eyebrow">Worth a closer look</span><h2>Roles with room<br />to <em>grow.</em></h2></div>
            <Link to="/jobs" className="text-link text-link-large" data-testid="link-featured-view-all">View all open roles <ArrowUpRight size={17} /></Link>
          </div>
          <div className="featured-grid">
            {loading ? (
              <div className="col-span-full py-8 text-center text-slate-400">Loading open roles...</div>
            ) : jobs.length > 0 ? (
              jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400">No open roles found.</div>
            )}
          </div>
        </section>

        <section className="section category-section">
          <div className="section-heading-row category-heading">
            <div><span className="eyebrow">Find your corner</span><h2>Work that fits<br /><em>how you think.</em></h2></div>
            <p>From first idea to final detail, find a team where your particular way of seeing things is an advantage.</p>
          </div>
          <div className="category-grid">
            {categories.map((category) => <Link to="/jobs" className={`category-card category-${category.accent}`} key={category.name} data-testid={`link-category-${category.name.toLowerCase().replaceAll(' ', '-')}`}>
              <span className="category-symbol">{category.icon}</span><span className="category-name">{category.name}</span><span className="category-count">{category.count}</span><ChevronRight className="category-arrow" size={18} />
            </Link>)}
          </div>
        </section>

        <section className="section how-section" id="how-it-works">
          <div className="how-intro"><span className="eyebrow eyebrow-light">The HireFlow way</span><h2>Good things happen when the <em>fit</em> is right.</h2><p>No black boxes or endless forms. Just a clear path to work you can be proud of.</p><Link to="/register" className="button button-light" data-testid="link-how-start">Start your search <ArrowRight size={16} /></Link></div>
          <div className="steps-list">
            <div className="step-item"><span className="step-number">01</span><div><h3>Create an account</h3><p>Tell us what you’re good at, what you care about, and where you want to go next.</p></div><Compass size={23} /></div>
            <div className="step-item"><span className="step-number">02</span><div><h3>Apply or post jobs</h3><p>Explore thoughtful roles at companies that value the way you make an impact.</p></div><Search size={23} /></div>
            <div className="step-item"><span className="step-number">03</span><div><h3>Get hired</h3><p>Apply with intention, meet the people behind the role, and start a useful conversation.</p></div><Layers3 size={23} /></div>
          </div>
        </section>

        <section className="stats-section" id="about">
          <div className="stats-heading"><span className="eyebrow">A growing signal</span><h2>Momentum looks<br /><em>good</em> on you.</h2></div>
          <div className="stats-grid"><div><strong>10,000<span>+</span></strong><p>open roles</p></div><div><strong>2,500<span>+</span></strong><p>companies with ambition</p></div><div><strong>50,000<span>+</span></strong><p>candidates on the move</p></div></div>
        </section>
        <section className="closing-cta"><div><span className="eyebrow">Make your next move count</span><h2>There’s good work<br /><em>waiting for you.</em></h2></div><Link to="/jobs" className="button button-primary button-large" data-testid="link-closing-jobs">See what’s out there <ArrowRight size={17} /></Link></section>
      </main>
      <SiteFooter />
    </div>
  );
}