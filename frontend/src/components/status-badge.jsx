export function StatusBadge({ status }) {
  const statusClass = (status || 'Applied').toLowerCase().replaceAll(' ', '-');
  return <span className={`status-badge status-${statusClass}`}>{status}</span>;
}