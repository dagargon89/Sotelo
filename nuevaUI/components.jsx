
// ─── Shared Components ────────────────────────────────────────────────────────

// Status badge
const StatusBadge = ({ status }) => {
  const cfg = {
    APPROVED:    { label: 'Aprobado',     cls: 'status-approved',    dot: '#22c55e' },
    NEEDS_INPUT: { label: 'Sin capturar', cls: 'status-needs-input', dot: '#f59e0b' },
    PENDING:     { label: 'Pendiente',    cls: 'status-pending',     dot: '#94a3b8' },
  }
  const s = cfg[status] || cfg.PENDING
  return (
    <span className={`status-badge ${s.cls}`}>
      <span className="status-dot" style={{ background: s.dot }}></span>
      {s.label}
    </span>
  )
}

// Avatar initials
const Avatar = ({ name, size = 'md', open = false }) => {
  const initials = name ? name.substring(0, 2).toUpperCase() : 'DR'
  const sz = size === 'sm' ? 32 : 40
  return (
    <div className={`avatar ${open ? 'avatar-open' : ''}`} style={{ width: sz, height: sz }}>
      {initials}
    </div>
  )
}

// Toggle Switch
const Toggle = ({ checked, onChange, label, amount }) => (
  <label className="toggle-pill">
    <div className="toggle-info">
      <span className="toggle-label">{label}</span>
      {amount && <span className="toggle-amount">{amount}</span>}
    </div>
    <div className="toggle-track" onClick={() => onChange(!checked)}>
      <div className={`toggle-thumb ${checked ? 'toggle-thumb-on' : ''}`}></div>
    </div>
  </label>
)

// Stepper
const Stepper = ({ value, onChange, label, amount }) => (
  <div className="toggle-pill">
    <div className="toggle-info">
      <span className="toggle-label">{label}</span>
      {amount && <span className="toggle-amount">{amount}</span>}
    </div>
    <div className="stepper">
      <button onClick={() => onChange(Math.max(0, value - 1))} className="stepper-btn">−</button>
      <span className="stepper-val">{value}</span>
      <button onClick={() => onChange(value + 1)} className="stepper-btn">+</button>
    </div>
  </div>
)

// Stat chip
const Chip = ({ label, value, color }) => (
  <div className="chip" style={{ '--chip-color': color }}>
    <span className="chip-label">{label}</span>
    <span className="chip-value">{value}</span>
  </div>
)

// Moneda
const Money = ({ value, plus = false, color }) => {
  const formatted = `$${parseFloat(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return <span style={{ color }}>{plus && value > 0 ? '+' : ''}{formatted}</span>
}

// Export to window
Object.assign(window, { StatusBadge, Avatar, Toggle, Stepper, Chip, Money })
