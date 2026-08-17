import { ArrowUpRight, BriefcaseBusiness, Bookmark, Clock3, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const experienceByCategory = {
  Design: 'Mid-level',
  'Software Development': 'Senior',
  Marketing: 'Mid-level',
  'Data Analytics': '2–4 years',
  'AI & Machine Learning': 'Senior',
  Finance: 'Lead',
};

export function DashboardJobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const companyMark = job.companyMark || (job.company ? job.company[0] : 'J');

  return (
    <article className="dashboard-job-card">
      <div className="dashboard-job-top">
        <div className={`company-mark company-mark-${job.id % 4}`} aria-hidden="true">{companyMark}</div>
        <button 
          type="button" 
          className={`dashboard-save-button ${saved ? 'is-saved' : ''}`} 
          onClick={() => setSaved((value) => !value)} 
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
        >
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="dashboard-job-company">{job.company}</p>
      <h3>{job.title}</h3>
      <div className="dashboard-job-meta">
        <span><MapPin size={13} />{job.location}</span>
        <span><BriefcaseBusiness size={13} />{job.employment_type || job.type}</span>
      </div>
      <div className="dashboard-job-tags">
        <span>{job.experience_level || experienceByCategory[job.category] || 'Experienced'}</span>
        <span>{job.category}</span>
      </div>
      <div className="dashboard-job-bottom">
        <span>
          <strong>{job.salary}</strong>
          <small><Clock3 size={12} /> {job.posted || 'Recently'}</small>
        </span>
        <button 
          type="button" 
          className="dashboard-apply-button cursor-pointer" 
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          Apply <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
}