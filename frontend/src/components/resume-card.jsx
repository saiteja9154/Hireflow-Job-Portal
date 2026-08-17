import { CheckCircle2, Download, FileText, UploadCloud } from 'lucide-react';
import { useState } from 'react';

export function ResumeCard() {
  const [resumeName, setResumeName] = useState('Ada-Lovelace-Resume.pdf');
  const [message, setMessage] = useState('');

  return (
    <article className="dashboard-panel resume-card" id="resume">
      <div className="panel-heading">
        <div><span className="panel-eyebrow">Your latest version</span><h2>Resume</h2></div>
        <FileText size={19} className="panel-heading-icon" aria-hidden="true" />
      </div>
      <div className="resume-file">
        <span className="resume-file-icon"><FileText size={20} aria-hidden="true" /></span>
        <span><strong>{resumeName}</strong><small>Updated 3 days ago · PDF</small></span>
        <CheckCircle2 size={17} className="resume-check" aria-label="Resume uploaded" />
      </div>
      <div className="resume-actions">
        <label className="dashboard-outline-button" htmlFor="dashboard-resume-upload"><UploadCloud size={15} /> Upload new
          <input id="dashboard-resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={(event) => {
            const nextName = event.target.files?.[0]?.name;
            if (nextName) {
              setResumeName(nextName);
              setMessage('New resume ready in this preview.');
            }
          }} />
        </label>
        <button type="button" className="dashboard-text-button" onClick={() => setMessage('Download preview ready. No file was downloaded.')}><Download size={15} /> Download</button>
      </div>
      {message && <p className="dashboard-inline-feedback" role="status">{message}</p>}
    </article>
  );
}