export function DashboardCard({
  label,
  value,
  detail,
  icon,
  tone = 'blue',
}) {
  return (
    <article className={`dashboard-card dashboard-card-${tone}`}>
      <div className="dashboard-card-top">
        <span className="dashboard-card-icon">{icon}</span>
        <span className="dashboard-card-detail">{detail}</span>
      </div>
      <p className="dashboard-card-label">{label}</p>
      <strong className="dashboard-card-value">{value}</strong>
    </article>
  );
}