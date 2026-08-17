import { BriefcaseBusiness, Check, UserRound } from 'lucide-react';

export function RoleSelector({ value, onChange, tall = false, name = 'auth-role', legend }) {
  const options = [
    { value: 'candidate', title: 'I’m looking for work', description: 'Discover a role that fits.' },
    { value: 'recruiter', title: 'I’m hiring', description: 'Meet people who move work forward.' },
  ];
  return (
    <fieldset className="role-fieldset">
      <legend>{legend}</legend>
      <div className="role-options">
        {options.map((option) => {
          const selected = value === option.value;
          const Icon = option.value === 'candidate' ? UserRound : BriefcaseBusiness;
          return (
            <label className={`role-option ${tall ? 'role-option-tall' : ''} ${selected ? 'role-option-active' : ''}`} key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                data-testid={`input-${name}-${option.value}`}
              />
              <span>
                <strong><Icon size={16} aria-hidden="true" /> {tall ? option.title : option.value === 'candidate' ? 'Find my next role' : 'Build my team'}</strong>
                {tall && <small>{option.description}</small>}
              </span>
              {tall && selected && <Check className="role-check" size={16} aria-hidden="true" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}