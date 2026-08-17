import { Check, FileText, MessageCircle, Send, Star } from 'lucide-react';

const activityIcons = {
  apply: Send,
  resume: FileText,
  profile: MessageCircle,
  interview: Check,
  saved: Star,
};

export function ActivityItem({
  type,
  title,
  detail,
  time,
}) {
  const Icon = activityIcons[type] || Send;
  return (
    <li className="activity-item">
      <span className={`activity-icon activity-icon-${type}`}><Icon size={15} aria-hidden="true" /></span>
      <span className="activity-copy"><strong>{title}</strong><small>{detail}</small></span>
      <time>{time}</time>
    </li>
  );
}