// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_TRIPS_V2 = [
  {
    id: 'trip-1', Driver: 'AGUILAR ESQUIVEL CARLOS', Unit: 'F-021',
    Boleta: '48525', source_type: 'GENESIS_BOLETA',
    Route: 'RIO BRAVO INTERNACIONAL → FLETES SOTELO',
    Start_Date: '2026-03-23 14:21', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 385, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Allowed_Liters: 315.8, Diesel_Rate: 24.5, Yield_Used: 2.45098,
    Is_Pacifico: false, Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3916', Origen: 'RIO BRAVO INTERNACIONAL', Destino: 'PRECOS ZARAGOZA', Kms: 0, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0 },
      { Factura: 'B-3916', Origen: 'PRECOS ZARAGOZA', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 140, CVP: 'C', Peso_Carga: 20000, Litros_A_Pago: 12.4, Diesel_A_Favor: 303.8 },
      { Factura: 'B-3913', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'IMPULSORA GANE', Kms: 0, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0 },
      { Factura: 'B-3913', Origen: 'IMPULSORA GANE', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'C', Peso_Carga: 18000, Litros_A_Pago: 0, Diesel_A_Favor: 0 },
    ]
  },
  {
    id: 'trip-2', Driver: 'AGUILAR ESQUIVEL CARLOS', Unit: 'F-021',
    Boleta: '48543', source_type: 'GENESIS_BOLETA',
    Route: 'PRECOS ZARAGOZA → FLETES SOTELO',
    Start_Date: '2026-03-24 21:25', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 385, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Allowed_Liters: 315.8, Diesel_Rate: 24.5, Yield_Used: 2.45098,
    Is_Pacifico: false, Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3920', Origen: 'PRECOS ZARAGOZA', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 155, CVP: 'C', Peso_Carga: 21000, Litros_A_Pago: 8.2, Diesel_A_Favor: 200.9 },
      { Factura: 'B-3921', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0 },
    ]
  },
  {
    id: 'trip-3', Driver: 'AGUILAR RODRIGUEZ JORGE ALONSO', Unit: 'F-007',
    Boleta: '48612', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → GYSA NAVOJOA',
    Start_Date: '2026-03-22 08:10', Status: 'APPROVED', Payroll_Week: 14,
    Base_Pay: 165, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 165,
    Total_Kms_Paid: 375, Allowed_Liters: 158.0, Diesel_Rate: 24.5, Yield_Used: 2.37341,
    Is_Pacifico: false, Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3901', Origen: 'FLETES SOTELO', Destino: 'GYSA NAVOJOA', Kms: 375, Recarga: 120, CVP: 'C', Peso_Carga: 19000, Litros_A_Pago: 38.0, Diesel_A_Favor: 931.0 },
    ]
  },
  {
    id: 'trip-4', Driver: 'BALDERRAMA ROBLES JORGE', Unit: 'F-014',
    Boleta: '48730', source_type: 'GENESIS_BOLETA',
    Route: 'BASE SOTELO CHIHUAHUA → RIO BRAVO INTERNACIONAL',
    Start_Date: '2026-03-23 09:30', Status: 'PENDING', Payroll_Week: 14,
    Base_Pay: 275, Pago_Cruce: 0, Incentive_Pay: 320, Total_Pay: 595,
    Total_Kms_Paid: 750, Allowed_Liters: 315.8, Diesel_Rate: 24.5, Yield_Used: 2.37341,
    Is_Pacifico: false, Manual_Bono_Quimico: true, Fuente_Tarifa: 'TABULADOR_BD',
    Rows: [
      { Factura: 'B-3880', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'RIO BRAVO INTERNACIONAL', Kms: 375, Recarga: 100, CVP: 'C', Peso_Carga: 22000, Litros_A_Pago: 57.9, Diesel_A_Favor: 1418.55 },
      { Factura: 'B-3881', Origen: 'RIO BRAVO INTERNACIONAL', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 80, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 77.9, Diesel_A_Favor: 1908.55 },
    ]
  },
  {
    id: 'trip-5', Driver: 'GALVAN FERNANDEZ CESAR', Unit: 'F-034',
    Boleta: '48801', source_type: 'GENESIS_BOLETA',
    Route: 'GYSA CDJ → FLETES SOTELO',
    Start_Date: '2026-03-24 11:15', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 350, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 800, Allowed_Liters: 307.6, Diesel_Rate: 24.5, Yield_Used: 2.60127,
    Is_Pacifico: true, Manual_Bono_Quimico: false,
    Manual_Pac_Bono_Sierra: false, Manual_Pac_Bono_Doble: false,
    Manual_Pac_Estancia_Obregon: 0, Manual_Pac_Estancia_Mochis: 0,
    Fuente_Tarifa: 'TABULADOR_BD',
    Rows: [
      { Factura: 'B-3850', Origen: 'GYSA CDJ', Destino: 'PUENTE INT. CORDOVA', Kms: 400, Recarga: 170, CVP: 'C', Peso_Carga: 25000, Litros_A_Pago: -16.7, Diesel_A_Favor: -409.15, Cruce: 'MDC-01' },
      { Factura: 'B-3851', Origen: 'PUENTE INT. CORDOVA', Destino: 'FLETES SOTELO', Kms: 400, Recarga: 90, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 63.7, Diesel_A_Favor: 1560.65 },
    ]
  },
  {
    id: 'trip-6', Driver: 'GALVAN FERNANDEZ CESAR', Unit: 'F-034',
    Boleta: '48822', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → ELECTROCOMPONENTES',
    Start_Date: '2026-03-25 07:00', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Allowed_Liters: 288.4, Diesel_Rate: 24.5, Yield_Used: 2.60127,
    Is_Pacifico: false, Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3865', Origen: 'FLETES SOTELO', Destino: 'ELECTROCOMPONENTES MX', Kms: 375, Recarga: 130, CVP: 'C', Peso_Carga: 20000, Litros_A_Pago: 14.2, Diesel_A_Favor: 347.9 },
      { Factura: 'B-3866', Origen: 'ELECTROCOMPONENTES MX', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 144.2, Diesel_A_Favor: 3532.9 },
    ]
  },
  {
    id: 'trip-7', Driver: 'MARTINEZ RAMIREZ ROSALIO', Unit: 'F-022',
    Boleta: '48900', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → YAZAKI COMPONENTES',
    Start_Date: '2026-03-24 06:00', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Allowed_Liters: 306.1, Diesel_Rate: 24.5, Yield_Used: 2.45098,
    Is_Pacifico: false, Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3910', Origen: 'FLETES SOTELO', Destino: 'YAZAKI COMPONENTES PLANTA 2', Kms: 375, Recarga: 145, CVP: 'C', Peso_Carga: 19500, Litros_A_Pago: 8.1, Diesel_A_Favor: 198.45 },
      { Factura: 'B-3911', Origen: 'YAZAKI COMPONENTES PLANTA 2', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 153.1, Diesel_A_Favor: 3750.95 },
    ]
  },
  {
    id: 'trip-8', Driver: 'MONTERO BURROLA LUIS LEOBARDO', Unit: 'F-009',
    Boleta: '48950', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → SAFRAN PLANTA 5',
    Start_Date: '2026-03-23 16:40', Status: 'APPROVED', Payroll_Week: 14,
    Base_Pay: 385, Pago_Cruce: 110, Incentive_Pay: 250, Total_Pay: 745,
    Total_Kms_Paid: 750, Allowed_Liters: 315.8, Diesel_Rate: 24.5, Yield_Used: 2.37341,
    Is_Pacifico: false, Manual_Bono_Quimico: true, Fuente_Tarifa: 'TABULADOR_BD',
    Rows: [
      { Factura: 'B-3870', Origen: 'FLETES SOTELO', Destino: 'SAFRAN PLANTA 5', Kms: 375, Recarga: 110, CVP: 'C', Peso_Carga: 17000, Litros_A_Pago: 48.1, Diesel_A_Favor: 1178.45 },
      { Factura: 'B-3871', Origen: 'SAFRAN PLANTA 5', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 95, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 63.1, Diesel_A_Favor: 1545.95 },
    ]
  },
]

const UNIT_YIELDS_V2 = { 'F-021': 2.45098, 'F-022': 2.45098, 'F-034': 2.60127, 'F-007': 2.37341, 'F-014': 2.37341, 'F-009': 2.37341 }
const DEFAULT_YIELD_V2 = 2.37341

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `$${parseFloat(n || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const initials = (name) => name ? name.substring(0, 2).toUpperCase() : 'DR'

// ── StatusBadge ───────────────────────────────────────────────────────────────
function SBadge({ status }) {
  const cfg = {
    APPROVED:    { cls: 'sbadge sb-approved', dot: '#22c55e', label: 'Aprobado' },
    NEEDS_INPUT: { cls: 'sbadge sb-needs',    dot: '#f59e0b', label: 'Sin capturar' },
    PENDING:     { cls: 'sbadge sb-pending',  dot: '#94a3b8', label: 'Pendiente' },
  }
  const s = cfg[status] || cfg.PENDING
  return (
    <span className={s.cls}>
      <span className="sbadge-dot" style={{ background: s.dot }}></span>
      {s.label}
    </span>
  )
}

// ── PillToggle ────────────────────────────────────────────────────────────────
function PillToggle({ checked, onChange, label, amount }) {
  return (
    <div className={`bonus-pill ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <div>
        <div className="bonus-pill-lbl">{label}</div>
        {amount && <div className="bonus-pill-amt">{amount}</div>}
      </div>
      <div className={`pill-toggle ${checked ? 'on' : ''}`}>
        <div className="pill-toggle-thumb"></div>
      </div>
    </div>
  )
}

// ── StepperPill ───────────────────────────────────────────────────────────────
function StepperPill({ value, onChange, label, amount }) {
  return (
    <div className="bonus-pill">
      <div>
        <div className="bonus-pill-lbl">{label}</div>
        {amount && <div className="bonus-pill-amt">{amount}</div>}
      </div>
      <div className="stepper-inline">
        <button className="stepper-btn" onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)) }}>−</button>
        <span className="stepper-num">{value}</span>
        <button className="stepper-btn" onClick={(e) => { e.stopPropagation(); onChange(value + 1) }}>+</button>
      </div>
    </div>
  )
}

// ── RouteTimeline step ────────────────────────────────────────────────────────
function RouteStep({ row, index, total, isExpanded, onToggle, onFieldChange, dp, unitYield }) {
  const kms = parseFloat(row.Kms) || 0
  const diesel = parseFloat(row.Diesel_A_Favor) || 0
  const isLast = index === total - 1
  const cvpCls = row.CVP === 'C' ? 'cvp-c' : 'cvp-v'

  return (
    <div className="route-step">
      {/* Spine */}
      <div className="step-spine">
        <div className={`step-dot ${isExpanded ? 'expanded-dot' : (kms > 0 ? 'active' : '')}`}></div>
        {!isLast && <div className="step-line"></div>}
      </div>

      {/* Content */}
      <div className={`step-content ${isExpanded ? 'open' : ''}`} onClick={onToggle}>
        <div className="step-row">
          <div className="step-labels">
            <div className="step-factura">{row.Factura || 'N/A'}</div>
            <div className="step-route-text">
              <span>{row.Origen || '—'}</span>
              <span className="step-arrow">→</span>
              <span>{row.Destino || '—'}</span>
              {row.Cruce && <span className="step-cruce-tag">{row.Cruce}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {row.CVP && <span className={`step-cvp ${cvpCls}`}>{row.CVP === 'C' ? 'Cargado' : 'Vacío'}</span>}
            <span className="step-kms">{kms} km</span>
            <button className="step-expand-btn" onClick={(e) => { e.stopPropagation(); onToggle() }}>
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="step-detail" onClick={e => e.stopPropagation()}>
            <div className="sdf-group">
              <label className="sdf-label edit">KMS</label>
              <input className="sdf-input" type="number" value={row.Kms || ''} onChange={e => onFieldChange('Kms', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="sdf-group">
              <label className="sdf-label edit">Recarga</label>
              <input className="sdf-input amber" type="number" step="0.01" value={row.Recarga || ''} onChange={e => onFieldChange('Recarga', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="sdf-group">
              <label className="sdf-label edit">Peso Carga</label>
              <input className="sdf-input amber" type="number" value={row.Peso_Carga || ''} onChange={e => onFieldChange('Peso_Carga', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="sdf-group">
              <label className="sdf-label edit">Tipo</label>
              <select className="sdf-select" value={row.CVP || ''} onChange={e => onFieldChange('CVP', e.target.value)}>
                <option value="">—</option>
                <option value="C">C (Cargado)</option>
                <option value="V">V (Vacío)</option>
                <option value="PT">PT</option>
              </select>
            </div>
            <div className="sdf-group">
              <label className="sdf-label ro">Litros Pago</label>
              <div className="sdf-ro">{(parseFloat(row.Litros_A_Pago) || 0).toFixed(2)}</div>
            </div>
            <div className="sdf-group">
              <label className="sdf-label hi">Diésel Favor</label>
              <div className={`sdf-ro ${diesel >= 0 ? 'green' : 'red'}`}>{fmt(diesel)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── BoletaDetail (expandable content) ────────────────────────────────────────
function BoletaDetail({ trip, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const [bonoQuimico, setBQ]     = React.useState(trip.Manual_Bono_Quimico ?? false)
  const [bonoSierra, setBS]      = React.useState(trip.Manual_Pac_Bono_Sierra ?? false)
  const [bonoDoble, setBD]       = React.useState(trip.Manual_Pac_Bono_Doble ?? false)
  const [estOb, setEO]           = React.useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
  const [estMo, setEM]           = React.useState(trip.Manual_Pac_Estancia_Mochis ?? 0)
  const [expandedRows, setER]    = React.useState(new Set())
  const [rowsData, setRD]        = React.useState(() => (trip.Rows || []).map(r => ({ ...r })))
  const [saving, setSaving]      = React.useState(false)

  const unitYield = unitYields[trip.Unit] || defaultYield
  const dp = parseFloat(dieselPrice) || 24.5

  const totalKms    = rowsData.reduce((s, r) => s + (parseFloat(r.Kms) || 0), 0)
  const totalRec    = rowsData.reduce((s, r) => s + (parseFloat(r.Recarga) || 0), 0)
  const rendReal    = totalRec > 0 ? (totalKms / totalRec).toFixed(2) : '—'
  const litrosPago  = unitYield > 0 ? (totalKms / unitYield) - totalRec : 0
  const dieselFavor = litrosPago * dp

  const quim  = bonoQuimico ? 250 : 0
  let pacVal  = 0
  if (trip.Is_Pacifico) {
    if (bonoSierra) pacVal += 500
    if (bonoDoble)  pacVal += 1726
    pacVal += (parseInt(estOb) || 0) * 600
    pacVal += (parseInt(estMo) || 0) * 300
  }
  const pagoCruce  = parseFloat(trip.Pago_Cruce) || 0
  const incentives = quim + pacVal
  const total      = (parseFloat(trip.Base_Pay) || 0) + incentives + pagoCruce

  const toggleRow = (i) => setER(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })

  const handleField = (i, field, val) => {
    const next = rowsData.map((r, idx) => idx === i ? { ...r, [field]: val } : r)
    const allKms = next.reduce((s, r) => s + (parseFloat(r.Kms) || 0), 0)
    const allRec = next.reduce((s, r) => s + (parseFloat(r.Recarga) || 0), 0)
    const lp = unitYield > 0 ? (allKms / unitYield) - allRec : 0
    next[i] = { ...next[i], Litros_A_Pago: parseFloat(lp.toFixed(2)), Diesel_A_Favor: parseFloat((lp * dp).toFixed(2)) }
    setRD(next)
  }

  const toggleStatus = () => onUpdate({ ...trip, Status: trip.Status === 'APPROVED' ? 'PENDING' : 'APPROVED' })

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onUpdate({ ...trip, Rows: rowsData, Manual_Bono_Quimico: bonoQuimico, Incentive_Pay: incentives, Total_Pay: total, Status: 'PENDING' })
      setSaving(false)
    }, 500)
  }

  return (
    <div className="boleta-body">
      {/* Finance */}
      <div className="finance-section">
        <div className="finance-chips-row">
          <div className="fc fc-base">
            <span className="fc-lbl">Base</span>
            <span className="fc-val">{fmt(trip.Base_Pay)}</span>
          </div>
          <div className="fc fc-cruce">
            <span className="fc-lbl">Cruce</span>
            <span className="fc-val">+{fmt(pagoCruce)}</span>
          </div>
          <div className="fc fc-inc">
            <span className="fc-lbl">Incentivos</span>
            <span className="fc-val">+{fmt(incentives)}</span>
          </div>
          <div className="fc fc-total">
            <span className="fc-lbl">Total Boleta</span>
            <span className="fc-val">{fmt(total)}</span>
          </div>
        </div>

        <div className="kpi-strip">
          <div className="kpi-strip-item">
            <span className="kpi-strip-lbl">KMS Totales</span>
            <span className="kpi-strip-val">{totalKms.toFixed(0)} km</span>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-lbl">Rendimiento</span>
            <span className="kpi-strip-val copper">{rendReal} km/L</span>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-lbl">Litros a Pago</span>
            <span className="kpi-strip-val">{litrosPago.toFixed(2)}</span>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-lbl">Diésel Favor</span>
            <span className={`kpi-strip-val ${dieselFavor >= 0 ? 'green' : 'red'}`}>{fmt(dieselFavor)}</span>
          </div>
          <div className="kpi-strip-item">
            <span className="kpi-strip-lbl">Unidad</span>
            <span className="kpi-strip-val">U-{trip.Unit}</span>
          </div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="bonuses-section">
        <div className="bonuses-label">Bonos & Incentivos Manuales</div>
        <div className="bonuses-pills">
          <PillToggle checked={bonoQuimico} onChange={setBQ} label="Químico" amount="+$250" />
          {trip.Is_Pacifico && (
            <>
              <PillToggle checked={bonoSierra} onChange={setBS} label="Sierra" amount="+$500" />
              <PillToggle checked={bonoDoble}  onChange={setBD} label="Doble"  amount="+$1,726" />
              <StepperPill value={estOb} onChange={setEO} label="Estancia Obregón" amount="+$600/cu" />
              <StepperPill value={estMo} onChange={setEM} label="Estancia Mochis"  amount="+$300/cu" />
            </>
          )}
        </div>
        {trip.Fuente_Tarifa === 'TABULADOR_BD' && (
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--primary-muted)', border: '1px solid var(--primary-border)', borderRadius: 'var(--r)', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>
            📋 Tarifa desde Tabulador BD — {fmt(pagoCruce)}
          </div>
        )}
      </div>

      {/* Route Timeline */}
      {(trip.Rows || []).length > 0 && (
        <div className="trayectos-section">
          <div className="trayectos-head">
            <span className="trayectos-title">
              <span className="trayectos-icon">⇌</span>
              Desglose de Trayectos
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-4)', background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 20 }}>
              {trip.Rows.length} tramos
            </span>
          </div>
          <div className="route-timeline">
            {rowsData.map((row, i) => (
              <RouteStep
                key={i}
                row={row}
                index={i}
                total={rowsData.length}
                isExpanded={expandedRows.has(i)}
                onToggle={() => toggleRow(i)}
                onFieldChange={(field, val) => handleField(i, field, val)}
                dp={dp}
                unitYield={unitYield}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="boleta-actions">
        <div className="approve-row">
          <div className="approve-toggle-wrap" onClick={toggleStatus}>
            <div className={`pill-toggle ${trip.Status === 'APPROVED' ? 'on' : ''}`}>
              <div className="pill-toggle-thumb"></div>
            </div>
            <span className="approve-lbl">{trip.Status === 'APPROVED' ? 'Aprobada ✓' : 'Marcar como Aprobada'}</span>
          </div>
        </div>
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Guardando…' : '💾 Guardar y Recalcular'}
        </button>
      </div>
    </div>
  )
}

// ── BoletaCard (trigger + expandable) ────────────────────────────────────────
function BoletaCardV2({ trip, index, isOpen, onToggle, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const needsCls  = trip.Status === 'NEEDS_INPUT' ? 'needs' : trip.Status === 'APPROVED' ? 'approved' : ''
  const openClass = isOpen ? 'open' : ''

  return (
    <div className="boleta-card">
      <button className={`boleta-trigger ${needsCls} ${openClass}`} onClick={onToggle}>
        <span className="bt-num">{index + 1}</span>
        <div className="bt-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="bt-id">{trip.Boleta}</span>
            <span className="bt-route">{trip.Route}</span>
          </div>
          <div className="bt-meta">{trip.Start_Date} · U-{trip.Unit}</div>
        </div>
        <div className="bt-controls">
          <SBadge status={trip.Status} />
          <span className="bt-total">{fmt(trip.Total_Pay)}</span>
          <span className="bt-chevron">{isOpen ? '▲' : '▼'}</span>
        </div>
      </button>

      {isOpen && (
        <BoletaDetail
          trip={trip}
          onUpdate={onUpdate}
          dieselPrice={dieselPrice}
          unitYields={unitYields}
          defaultYield={defaultYield}
        />
      )}
    </div>
  )
}

// ── Detail Panel Content ──────────────────────────────────────────────────────
function DriverDetail({ driverTrips, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const [openBoleta, setOpenBoleta] = React.useState(null)

  if (!driverTrips || driverTrips.length === 0) {
    return (
      <div className="empty-detail">
        <div className="empty-detail-icon">👈</div>
        <div className="empty-detail-text">Selecciona un conductor de la lista</div>
      </div>
    )
  }

  const driver = driverTrips[0].Driver
  const totals = driverTrips.reduce((acc, t) => {
    acc.base      += parseFloat(t.Base_Pay || 0)
    acc.incentivos += parseFloat(t.Incentive_Pay || 0)
    acc.cruce     += parseFloat(t.Pago_Cruce || 0)
    acc.total     += parseFloat(t.Total_Pay || 0)
    return acc
  }, { base: 0, incentivos: 0, cruce: 0, total: 0 })

  const statusCounts = {
    approved:   driverTrips.filter(t => t.Status === 'APPROVED').length,
    needsInput: driverTrips.filter(t => t.Status === 'NEEDS_INPUT').length,
    pending:    driverTrips.filter(t => t.Status === 'PENDING').length,
  }

  const handleUpdate = (updated) => onUpdate(updated)

  return (
    <>
      {/* Driver Hero */}
      <div className="driver-hero">
        <div className="driver-hero-top">
          <div className="driver-hero-identity">
            <div className="driver-hero-avatar">{initials(driver)}</div>
            <div>
              <div className="driver-hero-name">{driver}</div>
              <div className="driver-hero-badges">
                <span className="hero-badge hero-badge-default">
                  {driverTrips.length} {driverTrips.length === 1 ? 'boleta' : 'boletas'}
                </span>
                {statusCounts.needsInput > 0 && (
                  <span className="hero-badge hero-badge-needs">⚠ {statusCounts.needsInput} sin capturar</span>
                )}
                {statusCounts.approved > 0 && (
                  <span className="hero-badge hero-badge-ok">✓ {statusCounts.approved} aprobadas</span>
                )}
                {statusCounts.pending > 0 && (
                  <span className="hero-badge hero-badge-default">{statusCounts.pending} pendientes</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="driver-hero-financials">
          <div className="hero-fin-item">
            <div className="hero-fin-label">Base</div>
            <div className="hero-fin-val muted">{fmt(totals.base)}</div>
          </div>
          <div className="hero-fin-item">
            <div className="hero-fin-label">Cruce</div>
            <div className="hero-fin-val muted">{fmt(totals.cruce)}</div>
          </div>
          <div className="hero-fin-item">
            <div className="hero-fin-label">Incentivos</div>
            <div className="hero-fin-val accent">{fmt(totals.incentivos)}</div>
          </div>
          <div className="hero-fin-total">
            <div className="hero-fin-label">Total del Período</div>
            <div className="hero-fin-val">{fmt(totals.total)}</div>
          </div>
        </div>
      </div>

      {/* Boleta stack */}
      <div className="boleta-stack">
        {driverTrips.map((trip, i) => (
          <BoletaCardV2
            key={trip.id}
            trip={trip}
            index={i}
            isOpen={openBoleta === trip.id}
            onToggle={() => setOpenBoleta(prev => prev === trip.id ? null : trip.id)}
            onUpdate={handleUpdate}
            dieselPrice={dieselPrice}
            unitYields={unitYields}
            defaultYield={defaultYield}
          />
        ))}
      </div>
    </>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function SidebarV2({ grouped, selectedDriver, onSelectDriver, activeTab, onTabChange, search, onSearchChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="sidebar-head-top">
          <span className="sidebar-title">Conductores</span>
          <span className="week-badge-sm">Sem. 14</span>
        </div>
        <div className="sidebar-search">
          <span className="sidebar-search-icon">🔍</span>
          <input
            className="sidebar-search-input"
            type="text"
            placeholder="Buscar conductor…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-tabs">
        {[
          { id: 'ALL',         label: 'Todos',    cls: '' },
          { id: 'NEEDS_INPUT', label: 'Pendiente', cls: 't-needs' },
          { id: 'APPROVED',    label: 'Aprobado',  cls: 't-ok' },
        ].map(({ id, label, cls }) => (
          <button
            key={id}
            className={`sidebar-tab ${activeTab === id ? `active ${cls}` : ''}`}
            onClick={() => onTabChange(id)}
          >{label}</button>
        ))}
      </div>

      <div className="sidebar-list">
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-4)', fontSize: 13 }}>
            Sin resultados
          </div>
        )}
        {grouped.map(([driverName, trips]) => {
          const total = trips.reduce((s, t) => s + parseFloat(t.Total_Pay || 0), 0)
          const approved = trips.filter(t => t.Status === 'APPROVED').length
          const needs    = trips.filter(t => t.Status === 'NEEDS_INPUT').length
          const progress = trips.length > 0 ? (approved / trips.length) * 100 : 0
          const isSelected = selectedDriver === driverName
          const hasNeeds   = needs > 0

          return (
            <div
              key={driverName}
              className={`driver-row ${isSelected ? 'selected' : ''} ${hasNeeds ? 'has-needs' : ''}`}
              onClick={() => onSelectDriver(driverName)}
            >
              <div className="driver-avatar">{initials(driverName)}</div>
              <div className="driver-row-info">
                <div className="driver-row-name">{driverName}</div>
                <div className="driver-row-meta">
                  <span className="dr-badge dr-badge-boletas">{trips.length} boletas</span>
                  {needs > 0    && <span className="dr-badge dr-badge-needs">⚠ {needs}</span>}
                  {approved > 0 && <span className="dr-badge dr-badge-ok">✓ {approved}</span>}
                </div>
                <div className="driver-progress">
                  <div
                    className={`driver-progress-fill ${progress === 0 ? 'zero' : ''}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="driver-row-total">
                <span className="driver-row-total-val">{fmt(total)}</span>
                <span className="driver-row-total-label">total</span>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────
function KPICards({ trips, dieselPrice, onDieselChange }) {
  const stats = React.useMemo(() => {
    let totalPay = 0, errors = 0
    trips.forEach(t => {
      totalPay += (t.Base_Pay || 0) + (t.Incentive_Pay || 0)
      if (!t.Total_Kms_Paid || t.Total_Kms_Paid === 0) errors++
    })
    return { totalPay, errors }
  }, [trips])

  return (
    <div className="kpi-row">
      <div className="kpi-c">
        <div className="kpi-c-label">Nómina Total</div>
        <div className="kpi-c-value">{fmt(stats.totalPay)}</div>
        <div className="kpi-c-sub">{trips.length} viajes procesados</div>
        <hr className="kpi-c-divider" />
        <div className="diesel-lbl">Precio Diesel ($/L)</div>
        <input
          className="diesel-in"
          type="number" step="0.01"
          value={dieselPrice || ''}
          onChange={e => onDieselChange(e.target.value)}
          placeholder="Ej. 24.50"
        />
        <div className="diesel-hint">Se aplica a todos los cálculos de diésel</div>
      </div>
      <div className={`kpi-c ${stats.errors > 0 ? 'alert' : ''}`}>
        <div className="kpi-c-label">Aclaraciones de Datos</div>
        <div className="kpi-c-value">{stats.errors}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Viajes con 0 Kms detectados</div>
      </div>
    </div>
  )
}

// ── SummaryBar ────────────────────────────────────────────────────────────────
function SumBar({ trips }) {
  const t = trips.reduce((acc, trip) => {
    acc.base      += parseFloat(trip.Base_Pay || 0)
    acc.incentive += parseFloat(trip.Incentive_Pay || 0)
    acc.total     += parseFloat(trip.Total_Pay || 0)
    ;(trip.Rows || []).forEach(r => {
      const tipo = (r.Tipo || '').toUpperCase()
      if (r.Cruce) acc.cruces++
      else if (/^(LOC|MDC)/.test(tipo)) acc.locales++
      else if (/^PTT/.test(tipo)) acc.ptt++
    })
    return acc
  }, { base: 0, incentive: 0, total: 0, cruces: 0, locales: 0, ptt: 0 })

  return (
    <div className="sum-bar">
      <div className="sum-bar-inner">
        <div className="sum-metrics">
          <div className="sum-item">
            <div className="sum-lbl">Total Base</div>
            <div className="sum-val muted">{fmt(t.base)}</div>
          </div>
          <div className="sum-item">
            <div className="sum-lbl">Incentivos</div>
            <div className="sum-val copper">{fmt(t.incentive)}</div>
          </div>
          <div className="sum-divider"></div>
          <div className="sum-item">
            <div className="sum-lbl">Cruces</div>
            <div className="sum-val">{t.cruces}</div>
          </div>
          <div className="sum-item">
            <div className="sum-lbl">Locales</div>
            <div className="sum-val">{t.locales}</div>
          </div>
          <div className="sum-item">
            <div className="sum-lbl">PTT</div>
            <div className="sum-val muted">{t.ptt}</div>
          </div>
        </div>
        <div className="sum-right">
          <div>
            <div className="sum-total-lbl">Neto a Pagar</div>
            <div className="sum-total-val">{fmt(t.total)}</div>
          </div>
          <button className="export-btn">📊 Exportar Excel</button>
        </div>
      </div>
    </div>
  )
}

// ── FileUpload ────────────────────────────────────────────────────────────────
function FileUploadV2({ onUpload, loading }) {
  const [drag, setDrag] = React.useState(false)
  const ref = React.useRef()
  return (
    <div className="fullscreen-center">
      <div
        className={`upload-card ${drag ? 'over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onUpload(f) }}
        onClick={() => ref.current.click()}
      >
        <div className="upload-icon-wrap">📂</div>
        <div className="upload-title">Sube el Excel de Génesis</div>
        <div className="upload-sub">Arrastra el archivo aquí o haz clic para buscar</div>
        <div className="upload-cta">{loading ? '⏳ Procesando…' : '📁 Seleccionar Archivo'}</div>
        <div className="upload-hint">.xlsx · .xls — Movimientos Génesis con Boleta</div>
        <input ref={ref} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
          onChange={e => e.target.files[0] && onUpload(e.target.files[0])} />
      </div>
    </div>
  )
}

// ── PeriodSelector ────────────────────────────────────────────────────────────
function PeriodSelectorV2({ weeks, onSelect }) {
  return (
    <div className="fullscreen-center">
      <div className="period-screen">
        <div className="period-eyebrow">Módulo Operativo</div>
        <div className="period-heading">Seleccionar Semana</div>
        <div className="period-sub">Elige el período de nómina que deseas revisar y capturar</div>
        <div className="period-cards">
          {weeks.map(w => (
            <div key={w} className="period-card-item" onClick={() => onSelect(w)}>
              <div className="period-week-label">Semana</div>
              <div className="period-week-num">{w}</div>
              <div className="period-week-sub">Payroll Week</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── App V2 ────────────────────────────────────────────────────────────────────
function AppV2() {
  const [view, setView]                = React.useState('main') // 'main' | 'admin'
  const [trips, setTrips]              = React.useState(MOCK_TRIPS_V2)
  const [loaded, setLoaded]            = React.useState(true)
  const [selectedWeek, setSelectedWeek] = React.useState(14)
  const [selectedDriver, setSelectedDriver] = React.useState('AGUILAR ESQUIVEL CARLOS')
  const [activeTab, setActiveTab]      = React.useState('ALL')
  const [search, setSearch]            = React.useState('')
  const [dieselPrice, setDieselPrice]  = React.useState(24.50)

  const weekTrips = React.useMemo(() =>
    trips.filter(t => t.Payroll_Week === selectedWeek), [trips, selectedWeek])

  const availableWeeks = React.useMemo(() =>
    [...new Set(trips.map(t => t.Payroll_Week || 0))].filter(w => w > 0), [trips])

  // Group + filter for sidebar
  const grouped = React.useMemo(() => {
    const map = new Map()
    weekTrips.forEach(t => {
      const d = t.Driver || 'Sin Conductor'
      if (!map.has(d)) map.set(d, [])
      map.get(d).push(t)
    })
    return Array.from(map.entries())
      .filter(([name, ts]) => {
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return false
        if (activeTab === 'NEEDS_INPUT') return ts.some(t => t.Status === 'NEEDS_INPUT')
        if (activeTab === 'APPROVED')    return ts.every(t => t.Status === 'APPROVED')
        return true
      })
      .sort(([a], [b]) => a.localeCompare(b))
  }, [weekTrips, activeTab, search])

  const selectedTrips = React.useMemo(() =>
    weekTrips.filter(t => t.Driver === selectedDriver), [weekTrips, selectedDriver])

  const handleUpdate = (updated) =>
    setTrips(prev => prev.map(t => t.id === updated.id ? updated : t))

  const handleFileUpload = () => { setLoaded(false); setTimeout(() => { setLoaded(true); setSelectedWeek(null) }, 800) }

  if (view === 'admin') return (
    <div>
      <header className="topbar">
        <div className="topbar-wordmark">Sotelo <em>Nómina</em></div>
        <div className="topbar-sep"></div>
        <span className="topbar-tag">v1.1 · Control Financiero</span>
        <div className="topbar-spacer"></div>
        <nav className="topbar-nav">
          <button className="topbar-nav-link" onClick={() => setView('main')}>← Módulo Operativo</button>
        </nav>
      </header>
      <AdminSection onBack={() => setView('main')} />
    </div>
  )

  return (
    <div>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-wordmark">Sotelo <em>Nómina</em></div>
        <div className="topbar-sep"></div>
        <span className="topbar-tag">v1.1 · Control Financiero</span>
        <div className="topbar-spacer"></div>
        <nav className="topbar-nav">
          <button className="topbar-nav-link" onClick={() => setView('admin')}>Administración</button>
        </nav>
        {selectedWeek && (
          <div className="week-pill">
            <span className="week-pill-label">Semana</span>
            {selectedWeek}
            <button className="week-pill-change" onClick={() => setSelectedWeek(null)}>Cambiar</button>
          </div>
        )}
      </header>

      {!loaded ? (
        <FileUploadV2 onUpload={handleFileUpload} loading={true} />
      ) : trips.length === 0 ? (
        <FileUploadV2 onUpload={handleFileUpload} loading={false} />
      ) : !selectedWeek ? (
        <PeriodSelectorV2 weeks={availableWeeks} onSelect={setSelectedWeek} />
      ) : (
        <div className="app-shell">
          {/* Sidebar */}
          <SidebarV2
            grouped={grouped}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={search}
            onSearchChange={setSearch}
          />

          {/* Detail Panel */}
          <div className="detail-panel">
            <KPICards
              trips={weekTrips}
              dieselPrice={dieselPrice}
              onDieselChange={setDieselPrice}
            />
            {selectedDriver ? (
              <DriverDetail
                key={selectedDriver}
                driverTrips={selectedTrips}
                onUpdate={handleUpdate}
                dieselPrice={dieselPrice}
                unitYields={UNIT_YIELDS_V2}
                defaultYield={DEFAULT_YIELD_V2}
              />
            ) : (
              <div className="empty-detail">
                <div className="empty-detail-icon">👈</div>
                <div className="empty-detail-text">Selecciona un conductor para ver sus boletas</div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedWeek && weekTrips.length > 0 && <SumBar trips={weekTrips} />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppV2 />)
