import { Check } from 'lucide-react';

const checklist = [
  { label: 'Resume uploaded', complete: true },
  { label: 'Skills added', complete: true },
  { label: 'Education completed', complete: true },
  { label: 'Experience completed', complete: false },
];

export function ProgressCard() {
  return (
    <article className="dashboard-panel progress-card" id="profile">
      <div className="panel-heading">
        <div><span className="panel-eyebrow">Stand out to the right team</span><h2>Profile strength</h2></div>
        <strong className="progress-percent">75%</strong>
      </div>
      <div className="progress-bar" aria-label="Profile 75 percent complete"><span style={{ width: '75%' }} /></div>
      <p className="progress-copy">You’re close. Complete one more section to make your profile easier to discover.</p>
      <ul className="progress-checklist">
        {checklist.map((item) => <li key={item.label} className={item.complete ? 'is-complete' : ''}>
          <span className="checklist-icon">{item.complete && <Check size={12} aria-hidden="true" />}</span>
          <span>{item.label}</span>
          {!item.complete && <button type="button" className="checklist-action">Add</button>}
        </li>)}
      </ul>
    </article>
  );
}