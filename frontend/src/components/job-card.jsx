import { ArrowUpRight, BriefcaseBusiness, Clock3, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function JobCard({ job, compact = false }) {
  const [saved, setSaved] = useState(false);
  const companyMark = job.companyMark || (job.company ? job.company[0] : 'J');
  
  return (
    <article className={`job-card ${compact ? 'job-card-compact' : ''}`} data-testid={`card-job-${job.id}`}>
      <div className="job-card-top">
        <div className={`company-mark company-mark-${job.id % 4}`} aria-hidden="true">{companyMark}</div>
        <button
          type="button"
          className={`save-button ${saved ? 'save-button-active' : ''}`}
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
          onClick={() => setSaved((value) => !value)}
          data-testid={`button-save-job-${job.id}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 4.2h10.6a1 1 0 0 1 1 1v14.4l-6.3-3.4-6.3 3.4V5.2a1 1 0 0 1 1-1Z" /></svg>
        </button>
      </div>
      <div className="job-card-copy">
        <p className="job-company">{job.company}</p>
        <h3>{job.title}</h3>
        <div className="job-meta"><span><MapPin size={14} /> {job.location}</span><span><BriefcaseBusiness size={14} /> {job.employment_type || job.type}</span></div>
        {!compact && <p className="job-description">{job.description}</p>}
      </div>
      <div className="job-card-bottom">
        <div>
          <p className="job-salary">{job.salary}</p>
          <p className="job-posted"><Clock3 size={13} /> {job.posted || 'Recently'}</p>
        </div>
        <Link to={`/jobs/${job.id}`} className="text-link" data-testid={`link-view-job-${job.id}`}>View role <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  );
}