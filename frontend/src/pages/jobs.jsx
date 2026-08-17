import { ArrowRight, ChevronLeft, ChevronRight, Filter, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { JobCard } from '@/components/job-card';
import { jobs as mockJobs } from '@/components/hireflow-data';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import api from '../services/api';

const pageSize = 6;

export default function Jobs() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All locations');
  const [type, setType] = useState('All job types');
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = {};
        if (query.trim()) params.query = query.trim();
        if (location !== 'All locations') params.location = location;
        if (type !== 'All job types') params.employment_type = type;

        const response = await api.get('/jobs', { params });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback filter over mock data
        const filtered = mockJobs.filter((job) => {
          const searchable = `${job.title} ${job.company} ${job.category} ${job.tags?.join(' ') || ''}`.toLowerCase();
          const matchesQuery = !query.trim() || searchable.includes(query.toLowerCase());
          const matchesLocation = location === 'All locations' || job.location.toLowerCase().includes(location.toLowerCase());
          const matchesType = type === 'All job types' || job.type === type;
          return matchesQuery && matchesLocation && matchesType;
        });
        setJobs(filtered);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJobs();
    }, 250);

    return () => clearTimeout(timer);
  }, [query, location, type]);

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const visibleJobs = jobs.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = Boolean(query || location !== 'All locations' || type !== 'All job types');
  const clearFilters = () => { setQuery(''); setLocation('All locations'); setType('All job types'); setPage(1); };
  const onQueryChange = (value) => { setQuery(value); setPage(1); };

  return (
    <div className="app-page">
      <SiteHeader />
      <main className="jobs-page">
        <section className="jobs-hero"><div className="jobs-hero-inner"><span className="eyebrow"><span className="eyebrow-dot" /> Your next good move</span><h1>Find work that<br /><em>fits.</em></h1><p>Thoughtful roles at companies with something worth building.</p></div><div className="jobs-hero-art"><div /><div /><div /></div></section>
        <section className="job-search-section">
          <div className="search-bar-large">
            <Search size={20} />
            <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search by role, skill, or company" aria-label="Search jobs" data-testid="input-job-search" />
            <button type="button" className="search-button" onClick={() => setPage(1)} data-testid="button-search-jobs">Search jobs <ArrowRight size={16} /></button>
          </div>
          <button type="button" className="mobile-filter-button" onClick={() => setMobileFilters((open) => !open)} data-testid="button-mobile-filters"><SlidersHorizontal size={16} /> Filters {hasFilters ? '· Active' : ''}</button>
          <div className={`job-filters ${mobileFilters ? 'job-filters-open' : ''}`}>
            <label className="select-filter"><MapPin size={16} /><select value={location} onChange={(event) => { setLocation(event.target.value); setPage(1); }} aria-label="Filter by location" data-testid="select-job-location"><option>All locations</option><option>Remote</option><option>New York</option><option>Austin</option><option>Chicago</option><option>Boston</option><option>Denver</option><option>San Francisco</option><option>Portland</option></select></label>
            <label className="select-filter"><Filter size={16} /><select value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} aria-label="Filter by job type" data-testid="select-job-type"><option>All job types</option><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Hybrid</option></select></label>
            {hasFilters && <button type="button" className="clear-filter-button" onClick={clearFilters} data-testid="button-clear-filters">Clear filters <X size={14} /></button>}
          </div>
        </section>
        <section className="job-results-section">
          <div className="results-heading"><div><span className="eyebrow">Open opportunities</span><h2>{loading ? 'Searching' : jobs.length} roles worth knowing about</h2></div><span className="results-sort">Sorted by <strong>recently added</strong></span></div>
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading jobs...</div>
          ) : visibleJobs.length > 0 ? (
            <div className="jobs-results-grid">{visibleJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
          ) : (
            <div className="empty-jobs"><div className="empty-icon"><Search size={24} /></div><h3>No roles match that search yet.</h3><p>Try a broader title, location, or remove a filter to see more possibilities.</p><button type="button" className="button button-outline" onClick={clearFilters} data-testid="button-empty-clear">Show all roles</button></div>
          )}
          {!loading && visibleJobs.length > 0 && <div className="pagination" aria-label="Job results pagination"><span>Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, jobs.length)} of {jobs.length}</span><div className="pagination-buttons"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} aria-label="Previous page" data-testid="button-pagination-previous"><ChevronLeft size={17} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" className={page === number ? 'pagination-active' : ''} onClick={() => setPage(number)} aria-label={`Page ${number}`} aria-current={page === number ? 'page' : undefined} data-testid={`button-pagination-${number}`}>{number}</button>)}<button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} aria-label="Next page" data-testid="button-pagination-next"><ChevronRight size={17} /></button></div></div>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}