import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, FileText, MapPin, Sparkles, TriangleAlert, UploadCloud, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { jobs as mockJobs } from '@/components/hireflow-data';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
        // Fallback to mock data
        const foundMock = mockJobs.find((j) => j.id === Number(id));
        if (foundMock) {
          setJob({
            ...foundMock,
            employment_type: foundMock.type,
            experience_level: 'Mid-level',
            requirements: '• Relevant experience in the domain\n• Clean code principles\n• Collaboration and user-focused mindset'
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setFeedback({ kind: 'error', message: 'Only PDF files are supported.' });
        setResume(null);
        return;
      }
      setResume(file);
      setFeedback(null);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setFeedback({ kind: 'error', message: 'Please select a resume (PDF) to upload.' });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', resume);

    try {
      await api.post(`/jobs/${id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeedback({ kind: 'success', message: 'Application submitted successfully! Redirecting to your dashboard...' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error applying for job:', error);
      const msg = error.response?.data?.detail || 'An error occurred while submitting your application.';
      setFeedback({ kind: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-page">
        <SiteHeader />
        <main className="py-20 text-center text-slate-400">Loading job details...</main>
        <SiteFooter />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="app-page">
        <SiteHeader />
        <main className="py-20 text-center">
          <h2 className="text-xl font-bold">Job Not Found</h2>
          <p className="text-slate-500 mt-2">The job post you are looking for does not exist or has been removed.</p>
          <Link to="/jobs" className="button button-primary mt-4 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Find Jobs
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const requirementsList = job.requirements
    ? job.requirements.split('\n').filter((line) => line.trim())
    : ['Relevant experience in the industry', 'Strong communication skills', 'Ability to work in agile teams'];

  return (
    <div className="app-page">
      <SiteHeader />
      <main className="job-details-container max-w-4xl mx-auto px-4 py-8">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to search
        </Link>
        
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="company-mark company-mark-large bg-blue-50 text-blue-600 font-bold text-2xl h-14 w-14 rounded-xl flex items-center justify-center">
                {job.company ? job.company[0] : 'J'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">{job.company}</p>
                <h1 className="text-2xl font-bold text-slate-900 mt-1">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><BriefcaseBusiness size={14} /> {job.employment_type || job.type}</span>
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
                </div>
              </div>
            </div>
            
            {!user && (
              <Link to="/login" className="button button-primary self-start md:self-center">
                Log in to Apply
              </Link>
            )}
          </div>

          {/* Body Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Role Overview</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Requirements</h2>
                <ul className="space-y-2">
                  {requirementsList.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 leading-relaxed">
                      <span className="text-blue-500 mt-1.5">•</span>
                      <span>{req.replace(/^[•\-\*\s]+/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Application / Status Panel */}
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 self-start">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500 animate-pulse" /> Apply for this position
              </h3>

              {user ? (
                user.role === 'candidate' ? (
                  <form onSubmit={handleApply} className="space-y-4">
                    {feedback && (
                      <div className={`p-3 rounded-lg flex items-start gap-2 text-xs font-medium ${
                        feedback.kind === 'success' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                          : 'bg-red-50 text-red-800 border border-red-100'
                      }`} role="status">
                        {feedback.kind === 'success' ? <CheckCircle2 size={15} /> : <TriangleAlert size={15} />}
                        <span>{feedback.message}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 block">Attach your PDF resume</label>
                      <label className="border border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-white">
                        <UploadCloud size={24} className="text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-700 text-center truncate max-w-[180px]">
                          {resume ? resume.name : 'Choose PDF file'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">PDF format only (Max 10MB)</span>
                        <input 
                          type="file" 
                          accept=".pdf" 
                          onChange={handleFileChange} 
                          className="hidden" 
                          required 
                        />
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className={`button button-primary w-full justify-center flex items-center gap-2 cursor-pointer ${
                        submitting ? 'opacity-70 pointer-events-none' : ''
                      }`}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </form>
                ) : (
                  <div className="text-slate-500 text-sm leading-relaxed">
                    <p className="font-semibold text-slate-700">Recruiter view</p>
                    <p className="mt-1">You are logged in as a Recruiter. Candidates can apply to this job using a candidate account.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 mb-4">Please log in to your candidate account to apply for this role.</p>
                  <Link to="/login" className="button button-primary w-full justify-center">
                    Log in
                  </Link>
                  <p className="text-xs text-slate-400 mt-3">
                    Don't have an account? <Link to="/register" className="text-blue-500 font-bold hover:underline">Register</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
