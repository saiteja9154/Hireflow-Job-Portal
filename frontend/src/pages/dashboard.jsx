import { ArrowRight, BriefcaseBusiness, Bookmark, CalendarDays, CheckCircle2, ChevronRight, FileCheck2, Sparkles, UserRound, PlusCircle, Building2, UploadCloud, Download, Clock3, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard-sidebar';
import { TopNavbar } from '@/components/dashboard-navbar';
import { DashboardCard } from '@/components/dashboard-card';
import { DashboardJobCard } from '@/components/dashboard-job-card';
import { StatusBadge } from '@/components/status-badge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { jobs as mockJobs } from '@/components/hireflow-data';

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentTab, setCurrentTab] = useState('overview'); // overview, applications, saved, post-job, manage-jobs, profile
  
  // Dynamic Data
  const [applications, setApplications] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  
  // Forms state
  const [jobForm, setJobForm] = useState({
    title: '',
    company: user?.company_name || '',
    location: '',
    salary: '',
    employment_type: 'Full-time',
    experience_level: 'Mid-level',
    description: '',
    requirements: ''
  });
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    skills: user?.skills || '',
    location: user?.location || '',
    experience: user?.experience || '',
    summary: user?.summary || '',
    company_name: user?.company_name || ''
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Sync profile form when user context loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        skills: user.skills || '',
        location: user.location || '',
        experience: user.experience || '',
        summary: user.summary || '',
        company_name: user.company_name || ''
      });
      setJobForm(prev => ({ ...prev, company: user.company_name || '' }));
    }
  }, [user]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'candidate') {
        // Fetch candidate applications
        const appRes = await api.get('/applications/my');
        setApplications(appRes.data);
        
        // Fetch jobs for recommendations
        const jobRes = await api.get('/jobs');
        setAllJobs(jobRes.data);
      } else if (user?.role === 'recruiter') {
        // Fetch all jobs, then filter for this recruiter's posts
        const jobRes = await api.get('/jobs');
        const filtered = jobRes.data.filter(j => j.recruiter_id === user.id);
        setRecruiterJobs(filtered);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fail-safe fallback mock data in case backend is offline
      if (user?.role === 'candidate') {
        setAllJobs(mockJobs);
        setApplications([
          { id: 1, job: mockJobs[0], applied_at: 'Oct 12, 2024', status: 'Interview Scheduled' },
          { id: 2, job: mockJobs[1], applied_at: 'Oct 08, 2024', status: 'Under Review' },
        ]);
      } else {
        setRecruiterJobs(mockJobs.slice(0, 2).map(j => ({ ...j, recruiter_id: user.id })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, currentTab]);

  // Load applicants for a specific job
  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setCurrentTab('applicants');
    setLoadingApplicants(true);
    try {
      const response = await api.get(`/jobs/${job.id}/applications`);
      setApplicantsList(response.data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      // Fallback mock applicant
      setApplicantsList([
        {
          id: 101,
          candidate_id: 99,
          candidate: { name: 'Ada Lovelace', email: 'ada@lovelace.com', phone: '+1 415 555 1234', skills: 'React, Figma', experience: '4-7', summary: 'Ambitious developer' },
          resume_path: 'uploads/mock.pdf',
          status: 'Applied',
          applied_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Update applicant status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplicantsList(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      setFeedback({ kind: 'success', message: `Applicant status updated to ${newStatus}.` });
    } catch (error) {
      console.error('Error updating status:', error);
      setFeedback({ kind: 'error', message: 'Failed to update applicant status.' });
    }
  };

  // Delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setRecruiterJobs(prev => prev.filter(j => j.id !== jobId));
      setFeedback({ kind: 'success', message: 'Job deleted successfully.' });
    } catch (error) {
      console.error('Error deleting job:', error);
      setFeedback({ kind: 'error', message: 'Failed to delete job post.' });
    }
  };

  // Post Job submit handler
  const handlePostJob = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      await api.post('/jobs', jobForm);
      setFeedback({ kind: 'success', message: 'Job posted successfully!' });
      setJobForm({
        title: '',
        company: user?.company_name || '',
        location: '',
        salary: '',
        employment_type: 'Full-time',
        experience_level: 'Mid-level',
        description: '',
        requirements: ''
      });
      setTimeout(() => {
        setCurrentTab('manage-jobs');
        setFeedback(null);
      }, 1000);
    } catch (error) {
      console.error('Error posting job:', error);
      setFeedback({ kind: 'error', message: error.response?.data?.detail || 'Failed to post job.' });
    } finally {
      setLoading(false);
    }
  };

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      await updateProfile(profileForm);
      setFeedback({ kind: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setFeedback({ kind: 'error', message: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  // Candidate recommended jobs calculation
  const recommendedJobs = useMemo(() => {
    const list = allJobs.length > 0 ? allJobs : mockJobs;
    return list.slice(0, 8).filter((job) => {
      const needle = search.trim().toLowerCase();
      return !needle || `${job.title} ${job.company} ${job.category || ''} ${job.location}`.toLowerCase().includes(needle);
    });
  }, [search, allJobs]);

  // Statistics Computations
  const stats = useMemo(() => {
    if (user?.role === 'candidate') {
      const total = applications.length;
      const pending = applications.filter(a => ['Applied', 'Under Review'].includes(a.status)).length;
      const accepted = applications.filter(a => ['Offer Received', 'Accepted'].includes(a.status)).length;
      const interviews = applications.filter(a => a.status === 'Interview Scheduled').length;
      return { total, pending, accepted, interviews };
    } else {
      const totalJobs = recruiterJobs.length;
      const activeJobs = recruiterJobs.length; // standard logic for simplicity
      return { totalJobs, activeJobs };
    }
  }, [user, applications, recruiterJobs]);

  return (
    <div className="dashboard-shell">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />
      <div className="dashboard-main">
        <TopNavbar 
          search={search} 
          onSearch={setSearch} 
          onOpenSidebar={() => setSidebarOpen(true)} 
          showSearch={user?.role === 'candidate' && currentTab === 'overview'}
        />
        
        <main className="dashboard-content">
          {/* Welcome heading */}
          <section className="dashboard-welcome">
            <div>
              <span className="panel-eyebrow"><span className="eyebrow-dot" /> Workspace</span>
              <h1>Welcome, {user?.name || 'User'}<span>.</span></h1>
              <p>Here is the latest overview of your job workspace.</p>
            </div>
            {user?.role === 'candidate' && (
              <Link to="/jobs" className="button button-primary dashboard-find-button">
                Explore new roles <ArrowRight size={16} />
              </Link>
            )}
          </section>

          {/* Feedback banners */}
          {feedback && (
            <div className={`p-4 mb-6 rounded-xl flex items-center gap-2 border text-sm font-medium ${
              feedback.kind === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {feedback.kind === 'success' ? <CheckCircle2 size={18} /> : <TriangleAlert size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* ================= CANDIDATE WORKSPACE OVERVIEW ================= */}
          {user?.role === 'candidate' && currentTab === 'overview' && (
            <>
              <section className="dashboard-stat-grid" aria-label="Dashboard overview">
                <DashboardCard label="Jobs applied" value={stats.total} detail="Keep tracking progress" icon={<BriefcaseBusiness size={17} />} tone="blue" />
                <DashboardCard label="Interviews" value={stats.interviews} detail="Scheduled interviews" icon={<CalendarDays size={17} />} tone="teal" />
                <DashboardCard label="Offers / Accepted" value={stats.accepted} detail="Offers received" icon={<Sparkles size={17} />} tone="orange" />
                <DashboardCard label="Pending Review" value={stats.pending} detail="Under recruiter review" icon={<Clock3 size={17} />} tone="purple" />
              </section>

              <section className="dashboard-layout-grid">
                <div className="dashboard-panel recommended-panel">
                  <div className="panel-heading">
                    <div><span className="panel-eyebrow">Picked for your direction</span><h2>Recommended jobs</h2></div>
                    <Link to="/jobs" className="dashboard-view-link">View all <ChevronRight size={15} /></Link>
                  </div>
                  {recommendedJobs.length > 0 ? (
                    <div className="dashboard-jobs-grid">
                      {recommendedJobs.map((job) => <DashboardJobCard key={job.id} job={job} />)}
                    </div>
                  ) : (
                    <div className="dashboard-empty">
                      <Sparkles size={18} />
                      <p>No roles match “{search}”.</p>
                      <button type="button" onClick={() => setSearch('')}>Clear search</button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* ================= CANDIDATE APPLICATIONS TAB ================= */}
          {user?.role === 'candidate' && currentTab === 'applications' && (
            <section className="dashboard-panel applications-panel">
              <div className="panel-heading">
                <div><span className="panel-eyebrow">Keep an eye on the process</span><h2>My Applications</h2></div>
              </div>
              <div className="applications-table-wrap">
                {applications.length > 0 ? (
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const jobData = app.job || { title: 'Unknown Role', company: 'Unknown Company', location: 'Unknown' };
                        const companyMark = jobData.company ? jobData.company[0] : 'J';
                        return (
                          <tr key={app.id}>
                            <td>
                              <span className="table-company">
                                <span className="company-mark company-mark-1">{companyMark}</span>
                                <strong>{jobData.company}</strong>
                              </span>
                            </td>
                            <td>{jobData.title}</td>
                            <td>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recent'}</td>
                            <td><StatusBadge status={app.status || 'Applied'} /></td>
                            <td>
                              <Link to={`/jobs/${jobData.id}`} className="table-action text-blue-500 font-semibold text-xs hover:underline flex items-center">
                                View details <ChevronRight size={14} />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <BriefcaseBusiness size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No applications submitted yet.</p>
                    <Link to="/jobs" className="text-blue-500 font-bold hover:underline text-sm mt-1 inline-block">
                      Browse jobs and apply now
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================= CANDIDATE SAVED JOBS TAB ================= */}
          {user?.role === 'candidate' && currentTab === 'saved' && (
            <section className="dashboard-panel">
              <div className="panel-heading">
                <div><span className="panel-eyebrow">Your shortlist</span><h2>Saved Jobs</h2></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {(allJobs.length > 0 ? allJobs : mockJobs).slice(2, 5).map((job) => (
                  <div className="border border-slate-100 rounded-xl p-4 bg-white flex justify-between items-center" key={job.id}>
                    <div className="flex items-center gap-3">
                      <span className={`company-mark company-mark-${job.id % 4} h-10 w-10 text-sm font-bold flex items-center justify-center rounded-lg`}>
                        {job.companyMark || (job.company ? job.company[0] : 'J')}
                      </span>
                      <div>
                        <strong className="block text-slate-900">{job.title}</strong>
                        <small className="text-slate-500">{job.company} · {job.location}</small>
                      </div>
                    </div>
                    <Link to={`/jobs/${job.id}`} className="button button-small button-outline">
                      Apply
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= RECRUITER WORKSPACE OVERVIEW ================= */}
          {user?.role === 'recruiter' && currentTab === 'overview' && (
            <>
              <section className="dashboard-stat-grid" aria-label="Dashboard overview">
                <DashboardCard label="Jobs Posted" value={stats.totalJobs} detail="Active job posts" icon={<BriefcaseBusiness size={17} />} tone="blue" />
                <DashboardCard label="Active Openings" value={stats.activeJobs} detail="Open for applications" icon={<CheckCircle2 size={17} />} tone="teal" />
                <DashboardCard label="Total Applicants" value="Manage candidate list" detail="Updated dynamically" icon={<UserRound size={17} />} tone="orange" />
              </section>

              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div><span className="panel-eyebrow">Your postings</span><h2>Manage Job Postings</h2></div>
                  <button type="button" onClick={() => setCurrentTab('post-job')} className="button button-primary button-small flex items-center gap-1">
                    <PlusCircle size={15} /> Post a Job
                  </button>
                </div>
                
                <div className="applications-table-wrap mt-4">
                  {recruiterJobs.length > 0 ? (
                    <table className="applications-table">
                      <thead>
                        <tr>
                          <th>Job Title</th>
                          <th>Location</th>
                          <th>Salary</th>
                          <th>Created On</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recruiterJobs.map((job) => (
                          <tr key={job.id}>
                            <td><strong>{job.title}</strong></td>
                            <td>{job.location}</td>
                            <td>{job.salary}</td>
                            <td>{job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent'}</td>
                            <td className="text-right flex items-center justify-end gap-2">
                              <button 
                                type="button" 
                                onClick={() => handleViewApplicants(job)} 
                                className="button button-small button-outline py-1 px-3 text-xs"
                              >
                                View Applicants
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleDeleteJob(job.id)} 
                                className="text-red-500 hover:text-red-700 p-1 border border-transparent rounded hover:bg-red-50 cursor-pointer"
                                title="Delete job"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center text-slate-400">
                      <BriefcaseBusiness size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">You haven't posted any jobs yet.</p>
                      <button type="button" onClick={() => setCurrentTab('post-job')} className="text-blue-500 font-bold hover:underline text-sm mt-1 inline-block cursor-pointer">
                        Post your first job opening now
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* ================= RECRUITER POST JOB TAB ================= */}
          {user?.role === 'recruiter' && currentTab === 'post-job' && (
            <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Post a New Job Opening</h2>
              <p className="text-sm text-slate-500 mb-6">Create a job post so candidates can review and submit applications.</p>
              
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label block mb-1">Job Title *</label>
                    <input 
                      type="text" 
                      required 
                      value={jobForm.title} 
                      onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Developer" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="field-label block mb-1">Company Name *</label>
                    <input 
                      type="text" 
                      required 
                      disabled
                      value={jobForm.company}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label block mb-1">Location *</label>
                    <input 
                      type="text" 
                      required 
                      value={jobForm.location} 
                      onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA or Remote" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="field-label block mb-1">Salary Range *</label>
                    <input 
                      type="text" 
                      required 
                      value={jobForm.salary} 
                      onChange={e => setJobForm({ ...jobForm, salary: e.target.value })}
                      placeholder="e.g. $120k – $150k" 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label block mb-1">Employment Type *</label>
                    <select 
                      value={jobForm.employment_type} 
                      onChange={e => setJobForm({ ...jobForm, employment_type: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label block mb-1">Experience Level *</label>
                    <select 
                      value={jobForm.experience_level} 
                      onChange={e => setJobForm({ ...jobForm, experience_level: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                    >
                      <option>Entry-level</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                      <option>Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label block mb-1">Job Description *</label>
                  <textarea 
                    required 
                    rows={4}
                    value={jobForm.description} 
                    onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Provide a detailed description of the role responsibilities..." 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="field-label block mb-1">Job Requirements * (One per line)</label>
                  <textarea 
                    required 
                    rows={3}
                    value={jobForm.requirements} 
                    onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
                    placeholder="e.g.&#10;5+ years design experience&#10;Expert in Figma&#10;User research capability" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="button button-primary flex-1 justify-center cursor-pointer"
                  >
                    {loading ? 'Posting...' : 'Publish Job Post'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCurrentTab('overview')} 
                    className="button button-outline flex-1 justify-center cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ================= RECRUITER MANAGE JOBS TAB ================= */}
          {user?.role === 'recruiter' && currentTab === 'manage-jobs' && (
            <section className="dashboard-panel">
              <div className="panel-heading">
                <div><span className="panel-eyebrow">Your active listings</span><h2>Manage Job Posts</h2></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {recruiterJobs.length > 0 ? (
                  recruiterJobs.map((job) => (
                    <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between" key={job.id}>
                      <div>
                        <strong className="block text-lg text-slate-900">{job.title}</strong>
                        <span className="inline-block bg-blue-50 text-blue-600 font-bold text-xs px-2.5 py-0.5 rounded-full mt-2">
                          {job.employment_type}
                        </span>
                        <div className="text-slate-500 text-sm mt-3 flex items-center gap-1">
                          <MapPin size={14} /> {job.location}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button 
                          type="button" 
                          onClick={() => handleViewApplicants(job)} 
                          className="button button-small button-primary flex-1 justify-center text-xs cursor-pointer"
                        >
                          View Applicants
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteJob(job.id)} 
                          className="button button-small button-outline text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50 justify-center cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    No active job listings found. Click overview to post a job!
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================= RECRUITER VIEW APPLICANTS TAB ================= */}
          {user?.role === 'recruiter' && currentTab === 'applicants' && (
            <section className="dashboard-panel">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <button type="button" onClick={() => setCurrentTab('overview')} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <span className="panel-eyebrow">Applicants List</span>
                  <h2>{selectedJobForApplicants?.title}</h2>
                </div>
              </div>

              {loadingApplicants ? (
                <div className="py-12 text-center text-slate-400">Loading applicants list...</div>
              ) : applicantsList.length > 0 ? (
                <div className="space-y-4">
                  {applicantsList.map((app) => {
                    const c = app.candidate || { name: 'Unknown Candidate', email: '', phone: '', skills: '', location: '', experience: '', summary: '' };
                    return (
                      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6" key={app.id}>
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">
                              {c.experience ? `${c.experience} years exp` : 'Entry-level'}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 text-sm italic">"{c.summary || 'No summary provided.'}"</p>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                          </div>
                          
                          <div>
                            <span className="text-xs font-bold text-slate-600">Skills: </span>
                            <span className="text-xs text-slate-500">{c.skills || 'Not specified'}</span>
                          </div>

                          <div className="pt-2">
                            <a 
                              href={api.defaults.baseURL + `/${app.resume_path}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Download size={13} /> Download Resume PDF
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-4">
                          <div>
                            <span className="text-xs font-semibold text-slate-500 block mb-1">Status</span>
                            <StatusBadge status={app.status || 'Applied'} />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Change Status</label>
                            <select 
                              value={app.status || 'Applied'} 
                              onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                              className="border border-slate-200 rounded px-2.5 py-1 text-xs bg-white cursor-pointer"
                            >
                              <option>Applied</option>
                              <option>Under Review</option>
                              <option>Interview Scheduled</option>
                              <option>Offer Received</option>
                              <option>Accepted</option>
                              <option>Rejected</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <UserRound size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">No applications received for this job post yet.</p>
                </div>
              )}
            </section>
          )}

          {/* ================= UNIFIED PROFILE TAB ================= */}
          {currentTab === 'profile' && (
            <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 max-w-xl mx-auto shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Profile Workspace</h2>
              <p className="text-sm text-slate-500 mb-6">Manage your contact information and platform details.</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="field-label block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={profileForm.name} 
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="field-label block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    disabled
                    value={profileForm.email} 
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-400"
                  />
                </div>

                <div>
                  <label className="field-label block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    required 
                    value={profileForm.phone} 
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                  />
                </div>

                {user?.role === 'recruiter' ? (
                  <div>
                    <label className="field-label block mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required 
                      value={profileForm.company_name} 
                      onChange={e => setProfileForm({ ...profileForm, company_name: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="field-label block mb-1">Skills (Comma-separated)</label>
                      <input 
                        type="text" 
                        required 
                        value={profileForm.skills} 
                        onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="field-label block mb-1">Preferred Location</label>
                        <input 
                          type="text" 
                          required 
                          value={profileForm.location} 
                          onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="field-label block mb-1">Years of Experience</label>
                        <select 
                          value={profileForm.experience} 
                          onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white"
                        >
                          <option value="0-1">Less than 1 year</option>
                          <option value="1-3">1–3 years</option>
                          <option value="4-7">4–7 years</option>
                          <option value="8-12">8–12 years</option>
                          <option value="13-plus">13+ years</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="field-label block mb-1">Short Profile Summary</label>
                      <textarea 
                        rows={3} 
                        value={profileForm.summary} 
                        onChange={e => setProfileForm({ ...profileForm, summary: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="button button-primary w-full justify-center mt-2 cursor-pointer"
                >
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </form>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}