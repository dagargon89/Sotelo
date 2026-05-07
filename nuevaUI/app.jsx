
// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_TRIPS = [
  {
    id: 'trip-1', Driver: 'AGUILAR ESQUIVEL CARLOS', Unit: 'F-021',
    Boleta: '48525', Trip_ID: '48525', source_type: 'GENESIS_BOLETA',
    Route: 'RIO BRAVO INTERNACIONAL → FLETES SOTELO',
    Start_Date: '2026-03-23 14:21', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 385, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Total_Kms_Raw: 750, Allowed_Liters: 315.8,
    Diesel_Rate: 24.5, Yield_Used: 2.45098, Is_Pacifico: false,
    Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3916...', Origen: 'RIO BRAVO INTERNACIONAL', Destino: 'PRECOS ZARAGOZA', Kms: 0, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0, Km_Source: 'CATALOG' },
      { Factura: 'B-3916...', Origen: 'PRECOS ZARAGOZA', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 140, CVP: 'C', Peso_Carga: 20000, Litros_A_Pago: 12.4, Diesel_A_Favor: 303.8, Km_Source: 'CATALOG' },
      { Factura: 'B-3913...', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'IMPULSORA GANE', Kms: 0, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0, Km_Source: 'CATALOG' },
      { Factura: 'B-3913...', Origen: 'IMPULSORA GANE', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'C', Peso_Carga: 18000, Litros_A_Pago: 0, Diesel_A_Favor: 0, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-2', Driver: 'AGUILAR ESQUIVEL CARLOS', Unit: 'F-021',
    Boleta: '48543', Trip_ID: '48543', source_type: 'GENESIS_BOLETA',
    Route: 'PRECOS ZARAGOZA → FLETES SOTELO',
    Start_Date: '2026-03-24 21:25', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 385, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Total_Kms_Raw: 750, Allowed_Liters: 315.8,
    Diesel_Rate: 24.5, Yield_Used: 2.45098, Is_Pacifico: false,
    Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3920...', Origen: 'PRECOS ZARAGOZA', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 155, CVP: 'C', Peso_Carga: 21000, Litros_A_Pago: 8.2, Diesel_A_Favor: 200.9, Km_Source: 'CATALOG' },
      { Factura: 'B-3921...', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 0, Diesel_A_Favor: 0, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-3', Driver: 'AGUILAR RODRIGUEZ JORGE ALONSO', Unit: 'F-007',
    Boleta: '48612', Trip_ID: '48612', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → GYSA NAVOJOA',
    Start_Date: '2026-03-22 08:10', Status: 'APPROVED', Payroll_Week: 14,
    Base_Pay: 165, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 165,
    Total_Kms_Paid: 375, Total_Kms_Raw: 375, Allowed_Liters: 158.0,
    Diesel_Rate: 24.5, Yield_Used: 2.37341, Is_Pacifico: false,
    Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3901...', Origen: 'FLETES SOTELO', Destino: 'GYSA NAVOJOA', Kms: 375, Recarga: 120, CVP: 'C', Peso_Carga: 19000, Litros_A_Pago: 38.0, Diesel_A_Favor: 931.0, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-4', Driver: 'BALDERRAMA ROBLES JORGE', Unit: 'F-014',
    Boleta: '48730', Trip_ID: '48730', source_type: 'GENESIS_BOLETA',
    Route: 'BASE SOTELO CHIHUAHUA → RIO BRAVO INTERNACIONAL',
    Start_Date: '2026-03-23 09:30', Status: 'PENDING', Payroll_Week: 14,
    Base_Pay: 275, Pago_Cruce: 0, Incentive_Pay: 320, Total_Pay: 595,
    Total_Kms_Paid: 750, Total_Kms_Raw: 750, Allowed_Liters: 315.8,
    Diesel_Rate: 24.5, Yield_Used: 2.37341, Is_Pacifico: false,
    Manual_Bono_Quimico: true, Fuente_Tarifa: 'TABULADOR_BD',
    Rows: [
      { Factura: 'B-3880...', Origen: 'BASE SOTELO CHIHUAHUA', Destino: 'RIO BRAVO INTERNACIONAL', Kms: 375, Recarga: 100, CVP: 'C', Peso_Carga: 22000, Litros_A_Pago: 57.9, Diesel_A_Favor: 1418.55, Km_Source: 'CATALOG' },
      { Factura: 'B-3881...', Origen: 'RIO BRAVO INTERNACIONAL', Destino: 'BASE SOTELO CHIHUAHUA', Kms: 375, Recarga: 80, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 77.9, Diesel_A_Favor: 1908.55, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-5', Driver: 'GALVAN FERNANDEZ CESAR', Unit: 'F-034',
    Boleta: '48801', Trip_ID: '48801', source_type: 'GENESIS_BOLETA',
    Route: 'GYSA CDJ → FLETES SOTELO',
    Start_Date: '2026-03-24 11:15', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 350, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 800, Total_Kms_Raw: 800, Allowed_Liters: 307.6,
    Diesel_Rate: 24.5, Yield_Used: 2.60127, Is_Pacifico: true,
    Manual_Bono_Quimico: false, Fuente_Tarifa: 'TABULADOR_BD',
    Manual_Pac_Bono_Sierra: false, Manual_Pac_Bono_Doble: false,
    Manual_Pac_Estancia_Obregon: 0, Manual_Pac_Estancia_Mochis: 0,
    Rows: [
      { Factura: 'B-3850...', Origen: 'GYSA CDJ', Destino: 'PUENTE INT. CORDOVA', Kms: 400, Recarga: 170, CVP: 'C', Peso_Carga: 25000, Litros_A_Pago: -16.7, Diesel_A_Favor: -409.15, Km_Source: 'CATALOG', Cruce: 'MDC-01' },
      { Factura: 'B-3851...', Origen: 'PUENTE INT. CORDOVA', Destino: 'FLETES SOTELO', Kms: 400, Recarga: 90, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 63.7, Diesel_A_Favor: 1560.65, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-6', Driver: 'GALVAN FERNANDEZ CESAR', Unit: 'F-034',
    Boleta: '48822', Trip_ID: '48822', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → ELECTROCOMPONENTES',
    Start_Date: '2026-03-25 07:00', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Total_Kms_Raw: 750, Allowed_Liters: 288.4,
    Diesel_Rate: 24.5, Yield_Used: 2.60127, Is_Pacifico: false,
    Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3865...', Origen: 'FLETES SOTELO', Destino: 'ELECTROCOMPONENTES MX', Kms: 375, Recarga: 130, CVP: 'C', Peso_Carga: 20000, Litros_A_Pago: 14.2, Diesel_A_Favor: 347.9, Km_Source: 'CATALOG' },
      { Factura: 'B-3866...', Origen: 'ELECTROCOMPONENTES MX', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 144.2, Diesel_A_Favor: 3532.9, Km_Source: 'CATALOG' },
    ]
  },
  {
    id: 'trip-7', Driver: 'MARTINEZ RAMIREZ ROSALIO', Unit: 'F-022',
    Boleta: '48900', Trip_ID: '48900', source_type: 'GENESIS_BOLETA',
    Route: 'FLETES SOTELO → YAZAKI COMPONENTES',
    Start_Date: '2026-03-24 06:00', Status: 'NEEDS_INPUT', Payroll_Week: 14,
    Base_Pay: 440, Pago_Cruce: 0, Incentive_Pay: 0, Total_Pay: 0,
    Total_Kms_Paid: 750, Total_Kms_Raw: 750, Allowed_Liters: 306.1,
    Diesel_Rate: 24.5, Yield_Used: 2.45098, Is_Pacifico: false,
    Manual_Bono_Quimico: false, Fuente_Tarifa: null,
    Rows: [
      { Factura: 'B-3910...', Origen: 'FLETES SOTELO', Destino: 'YAZAKI COMPONENTES PLANTA 2', Kms: 375, Recarga: 145, CVP: 'C', Peso_Carga: 19500, Litros_A_Pago: 8.1, Diesel_A_Favor: 198.45, Km_Source: 'CATALOG' },
      { Factura: 'B-3911...', Origen: 'YAZAKI COMPONENTES PLANTA 2', Destino: 'FLETES SOTELO', Kms: 375, Recarga: 0, CVP: 'V', Peso_Carga: 0, Litros_A_Pago: 153.1, Diesel_A_Favor: 3750.95, Km_Source: 'CATALOG' },
    ]
  },
]

// ── TrayectoRow (expandable) ─────────────────────────────────────────────────
function TrayectoRow({ row, index, isExpanded, onToggle, onFieldChange, dieselPrice, unitYield }) {
  const kms = parseFloat(row.Kms) || 0
  const recarga = parseFloat(row.Recarga) || 0
  const litros = parseFloat(row.Litros_A_Pago) || 0
  const diesel = parseFloat(row.Diesel_A_Favor) || 0

  return (
    <React.Fragment>
      <tr className={`traj-row ${isExpanded ? 'expanded-row' : ''}`} onClick={onToggle}>
        <td className="traj-td traj-num">{index + 1}</td>
        <td className="traj-td">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="traj-factura">{row.Factura || 'N/A'}</span>
            <div className="traj-route">
              <span>{row.Origen || '—'}</span>
              <span className="traj-arrow">→</span>
              <span>{row.Destino || '—'}</span>
              {row.Km_Source === 'FALLBACK' && (
                <span style={{ fontSize: 9, background: 'var(--amber-bg)', color: 'var(--amber)', padding: '1px 5px', borderRadius: 4, marginLeft: 4 }}>⚠ KM</span>
              )}
              {row.Cruce && (
                <span style={{ fontSize: 9, background: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid var(--blue-bd)', padding: '1px 6px', borderRadius: 4, marginLeft: 4, fontWeight: 700 }}>{row.Cruce}</span>
              )}
            </div>
          </div>
        </td>
        <td className="traj-td traj-kms">{kms}</td>
        <td className="traj-td" style={{ textAlign: 'center' }}>
          <button className="traj-chevron-btn">
            {isExpanded ? '▲' : '▼'}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="traj-sub-panel">
          <td colSpan={4} style={{ padding: 0 }}>
            <div className="traj-sub-inner">
              <div className="field-group">
                <label className="field-label editable">KMS</label>
                <input className="field-input" type="number" value={row.Kms || ''} onChange={e => onFieldChange('Kms', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="field-group">
                <label className="field-label editable">Recarga</label>
                <input className="field-input amber-input" type="number" step="0.01" value={row.Recarga || ''} onChange={e => onFieldChange('Recarga', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="field-group">
                <label className="field-label editable">Peso Carga</label>
                <input className="field-input amber-input" type="number" value={row.Peso_Carga || ''} onChange={e => onFieldChange('Peso_Carga', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="field-group">
                <label className="field-label editable">Tipo</label>
                <select className="field-select" value={row.CVP || ''} onChange={e => onFieldChange('CVP', e.target.value)}>
                  <option value="">—</option>
                  <option value="C">C (Cargado)</option>
                  <option value="V">V (Vacío)</option>
                  <option value="PT">PT</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label readonly">Litros Pago</label>
                <div className="field-readonly">{litros.toFixed(2)}</div>
              </div>
              <div className="field-group">
                <label className="field-label highlight">Diésel Favor</label>
                <div className={`field-readonly ${diesel >= 0 ? 'green' : ''}`}>${diesel.toFixed(2)}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}

// ── BoletaCard ────────────────────────────────────────────────────────────────
function BoletaCard({ trip, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const [bonoQuimico, setBonoQuimico] = React.useState(trip.Manual_Bono_Quimico ?? false)
  const [bonoSierra, setBonoSierra]   = React.useState(trip.Manual_Pac_Bono_Sierra ?? false)
  const [bonoDoble, setBonoDoble]     = React.useState(trip.Manual_Pac_Bono_Doble ?? false)
  const [estObregon, setEstObregon]   = React.useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
  const [estMochis, setEstMochis]     = React.useState(trip.Manual_Pac_Estancia_Mochis ?? 0)
  const [expandedRows, setExpandedRows] = React.useState(new Set())
  const [rowsData, setRowsData] = React.useState(() => (trip.Rows || []).map(r => ({ ...r })))
  const [saving, setSaving] = React.useState(false)

  const unitYield = unitYields[trip.Unit] || defaultYield
  const dp = parseFloat(dieselPrice) || 24.5

  const totalKms = rowsData.reduce((s, r) => s + (parseFloat(r.Kms) || 0), 0)
  const totalRecarga = rowsData.reduce((s, r) => s + (parseFloat(r.Recarga) || 0), 0)
  const rendReal = totalRecarga > 0 ? (totalKms / totalRecarga).toFixed(2) : '—'
  const litrosPago = unitYield > 0 ? (totalKms / unitYield) - totalRecarga : 0
  const dieselFavor = litrosPago * dp

  const quimicoVal = bonoQuimico ? 250 : 0
  let pacVal = 0
  if (trip.Is_Pacifico) {
    if (bonoSierra) pacVal += 500
    if (bonoDoble) pacVal += 1726
    pacVal += (parseInt(estObregon) || 0) * 600
    pacVal += (parseInt(estMochis) || 0) * 300
  }
  const pagoCruce = parseFloat(trip.Pago_Cruce) || 0
  const incentives = quimicoVal + pacVal
  const total = (parseFloat(trip.Base_Pay) || 0) + incentives + pagoCruce

  const toggleRow = (i) => {
    setExpandedRows(prev => {
      const n = new Set(prev)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })
  }

  const handleFieldChange = (i, field, val) => {
    const next = [...rowsData]
    next[i] = { ...next[i], [field]: val }
    // recalc litros/diesel
    const allKms = next.reduce((s, r) => s + (parseFloat(r.Kms) || 0), 0)
    const allRec = next.reduce((s, r) => s + (parseFloat(r.Recarga) || 0), 0)
    const lp = unitYield > 0 ? (allKms / unitYield) - allRec : 0
    next[i].Litros_A_Pago = parseFloat(lp.toFixed(2))
    next[i].Diesel_A_Favor = parseFloat((lp * dp).toFixed(2))
    setRowsData(next)
  }

  const toggleStatus = () => {
    const newStatus = trip.Status === 'APPROVED' ? 'PENDING' : 'APPROVED'
    onUpdate({ ...trip, Status: newStatus })
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      onUpdate({
        ...trip,
        Rows: rowsData,
        Manual_Bono_Quimico: bonoQuimico,
        Incentive_Pay: incentives,
        Total_Pay: total,
        Status: 'PENDING'
      })
      setSaving(false)
    }, 600)
  }

  const initials = trip.Driver ? trip.Driver.substring(0, 2).toUpperCase() : 'DR'

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="card-identity">
          <div className="avatar">{initials}</div>
          <div>
            <div className="card-name">{trip.Driver}</div>
            <div className="card-tags">
              <span className="tag tag-slate">#{trip.Boleta}</span>
              <span className="tag tag-blue">U-{trip.Unit}</span>
              {trip.Is_Pacifico && <span className="tag tag-indigo">Pacífico</span>}
              <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 2 }}>{trip.Start_Date}</span>
            </div>
          </div>
        </div>
        <div className="card-status-row">
          <StatusBadge status={trip.Status} />
          <div className="approve-wrap">
            <div className="toggle-track" onClick={toggleStatus} style={{ cursor: 'pointer' }}>
              <div className={`toggle-thumb ${trip.Status === 'APPROVED' ? 'toggle-thumb-on' : ''}`}
                style={{ background: trip.Status === 'APPROVED' ? 'white' : 'white' }}></div>
            </div>
            <span className="approve-label">{trip.Status === 'APPROVED' ? 'Aprobada' : 'Aprobar'}</span>
          </div>
        </div>
      </div>

      {/* Finance */}
      <div className="finance-panel">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div className="finance-row" style={{ flex: 1, minWidth: 0 }}>
            <div className="finance-chip fc-base">
              <span className="finance-chip-label">Base</span>
              <span className="finance-chip-val">${(trip.Base_Pay || 0).toFixed(2)}</span>
            </div>
            <div className="finance-chip fc-cruce">
              <span className="finance-chip-label">Cruce</span>
              <span className="finance-chip-val">+${pagoCruce.toFixed(2)}</span>
            </div>
            <div className="finance-chip fc-inc">
              <span className="finance-chip-label">Incentivos</span>
              <span className="finance-chip-val">+${incentives.toFixed(2)}</span>
            </div>
            <div className="finance-chip fc-total">
              <span className="finance-chip-label">Total</span>
              <span className="finance-chip-val">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="kpi-mini-row">
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14 }}>
              <div className="kpi-mini">
                <span className="kpi-mini-label">KMS</span>
                <span className="kpi-mini-val">{totalKms.toFixed(0)}</span>
              </div>
              <div className="kpi-mini" style={{ marginTop: 6 }}>
                <span className="kpi-mini-label">REND</span>
                <span className="kpi-mini-val">{rendReal}</span>
              </div>
            </div>
            <div className={`diesel-favor-chip ${dieselFavor < 0 ? 'negative' : ''}`}>
              <div className="diesel-favor-label">Diésel Favor</div>
              <div className="diesel-favor-val">${dieselFavor.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Bonuses */}
        <div className="bonuses-row">
          <Toggle checked={bonoQuimico} onChange={setBonoQuimico} label="Químico" amount="+$250" />
          {trip.Is_Pacifico && (
            <>
              <Toggle checked={bonoSierra} onChange={setBonoSierra} label="Sierra" amount="+$500" />
              <Toggle checked={bonoDoble} onChange={setBonoDoble} label="Doble" amount="+$1,726" />
              <Stepper value={estObregon} onChange={setEstObregon} label="Obregón" amount="+$600/cu" />
              <Stepper value={estMochis} onChange={setEstMochis} label="Mochis" amount="+$300/cu" />
            </>
          )}
        </div>

        {trip.Fuente_Tarifa === 'TABULADOR_BD' && (
          <div style={{ marginTop: 10, padding: '7px 12px', background: 'var(--indigo-bg)', border: '1px solid var(--indigo-bd)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--indigo)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Tarifa BD</span>
            <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, color: 'oklch(35% 0.15 280)' }}>${pagoCruce.toFixed(2)}</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: 'var(--indigo-bg)', color: 'var(--indigo)', border: '1px solid var(--indigo-bd)', padding: '2px 7px', borderRadius: 4 }}>TABULADOR</span>
          </div>
        )}
      </div>

      {/* Trayectos */}
      {(trip.Rows || []).length > 0 && (
        <div className="trayectos-section">
          <div className="trayectos-header">
            <span className="trayectos-title">
              <span className="trayectos-title-icon">⇌</span>
              Desglose de Trayectos
            </span>
          </div>
          <table className="traj-table">
            <thead className="traj-thead">
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Factura / Ruta</th>
                <th style={{ textAlign: 'right', width: 70 }}>KMs</th>
                <th style={{ textAlign: 'center', width: 50 }}>Det.</th>
              </tr>
            </thead>
            <tbody>
              {rowsData.map((row, i) => (
                <TrayectoRow
                  key={i}
                  row={row}
                  index={i}
                  isExpanded={expandedRows.has(i)}
                  onToggle={() => toggleRow(i)}
                  onFieldChange={(field, val) => handleFieldChange(i, field, val)}
                  dieselPrice={dp}
                  unitYield={unitYield}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="card-actions">
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Guardando...' : '💾 Guardar y Recalcular'}
        </button>
      </div>
    </div>
  )
}

// ── InvoiceRow ────────────────────────────────────────────────────────────────
function InvoiceRow({ trip, index, isExpanded, onToggle, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const facturaId = trip.Boleta || trip.Trip_ID || `#${index + 1}`
  const route = trip.Route || '—'

  return (
    <div className="invoice-row">
      <button className={`invoice-trigger ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
        <span className="invoice-num">{index + 1}</span>
        <div className="invoice-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="invoice-id">{facturaId}</span>
            <span className="invoice-route">{route}</span>
          </div>
          <div className="invoice-meta">{trip.Start_Date || 'N/A'} · U-{trip.Unit}</div>
        </div>
        <div className="invoice-controls">
          <StatusBadge status={trip.Status} />
          <span className="invoice-pay">${(trip.Total_Pay || 0).toFixed(2)}</span>
          <span className="invoice-chevron">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>
      {isExpanded && (
        <div className="invoice-panel">
          <BoletaCard
            trip={trip}
            onUpdate={onUpdate}
            dieselPrice={dieselPrice}
            unitYields={unitYields}
            defaultYield={defaultYield}
          />
        </div>
      )}
    </div>
  )
}

// ── DriverAccordion ───────────────────────────────────────────────────────────
function DriverAccordion({ driverName, driverTrips, expandedTrip, onToggleTrip, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const totals = React.useMemo(() => driverTrips.reduce((acc, t) => {
    acc.base      += parseFloat(t.Base_Pay || 0)
    acc.incentivos += parseFloat(t.Incentive_Pay || 0)
    acc.total     += parseFloat(t.Total_Pay || 0)
    return acc
  }, { base: 0, incentivos: 0, total: 0 }), [driverTrips])

  const statusCounts = React.useMemo(() => ({
    approved:   driverTrips.filter(t => t.Status === 'APPROVED').length,
    needsInput: driverTrips.filter(t => t.Status === 'NEEDS_INPUT').length,
  }), [driverTrips])

  const initials = driverName ? driverName.substring(0, 2).toUpperCase() : 'DR'

  return (
    <div className="driver-card">
      <button className={`driver-header ${isOpen ? 'open' : 'closed'}`} onClick={() => setIsOpen(p => !p)}>
        <div className={`avatar ${isOpen ? 'avatar-open' : ''}`} style={{ width: 40, height: 40, flexShrink: 0 }}>
          {initials}
        </div>
        <div className="driver-meta">
          <div className="driver-name">{driverName}</div>
          <div className="driver-badges">
            <span className="driver-badge badge-boletas">
              {driverTrips.length} {driverTrips.length === 1 ? 'Boleta' : 'Boletas'}
            </span>
            {statusCounts.needsInput > 0 && (
              <span className="driver-badge badge-needs">⚠ {statusCounts.needsInput} sin capturar</span>
            )}
            {statusCounts.approved > 0 && (
              <span className="driver-badge badge-ok">✓ {statusCounts.approved} aprobadas</span>
            )}
          </div>
        </div>
        <div className="driver-financials">
          <div className="fin-item">
            <div className="fin-label">Base</div>
            <div className="fin-value">${totals.base.toFixed(2)}</div>
          </div>
          <div className="fin-item">
            <div className="fin-label">Incentivos</div>
            <div className="fin-value incentive">+${totals.incentivos.toFixed(2)}</div>
          </div>
          <div className="fin-total">
            <div className="fin-label">Total</div>
            <div className="fin-value" style={{ fontSize: 15, fontWeight: 800 }}>${totals.total.toFixed(2)}</div>
          </div>
        </div>
        <div className="driver-chevron">{isOpen ? '▲' : '▼'}</div>
      </button>

      {isOpen && (
        <div className="driver-body">
          <div className="invoice-list">
            {driverTrips.map((trip, idx) => {
              const key = trip.id || `${driverName}-${idx}`
              return (
                <InvoiceRow
                  key={key}
                  trip={trip}
                  index={idx}
                  isExpanded={expandedTrip === key}
                  onToggle={() => onToggleTrip(key)}
                  onUpdate={onUpdate}
                  dieselPrice={dieselPrice}
                  unitYields={unitYields}
                  defaultYield={defaultYield}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── TripList ──────────────────────────────────────────────────────────────────
function TripList({ trips, onUpdate, dieselPrice, unitYields, defaultYield }) {
  const [expandedTrip, setExpandedTrip] = React.useState(null)

  const handleUpdate = (updatedTrip) => {
    onUpdate(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t))
  }

  const grouped = React.useMemo(() => {
    const map = new Map()
    trips.forEach(trip => {
      const d = trip.Driver || 'Sin Conductor'
      if (!map.has(d)) map.set(d, [])
      map.get(d).push(trip)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [trips])

  if (trips.length === 0) return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <div className="empty-text">No se encontraron boletas con estos filtros.</div>
    </div>
  )

  return (
    <div className="trip-stack">
      {grouped.map(([driverName, driverTrips]) => (
        <DriverAccordion
          key={driverName}
          driverName={driverName}
          driverTrips={driverTrips}
          expandedTrip={expandedTrip}
          onToggleTrip={key => setExpandedTrip(prev => prev === key ? null : key)}
          onUpdate={handleUpdate}
          dieselPrice={dieselPrice}
          unitYields={unitYields}
          defaultYield={defaultYield}
        />
      ))}
    </div>
  )
}

// ── DashboardKPIs ─────────────────────────────────────────────────────────────
function DashboardKPIs({ trips, dieselPrice, onDieselPriceChange }) {
  const stats = React.useMemo(() => {
    let totalPay = 0, dataErrorCount = 0
    trips.forEach(t => {
      totalPay += (t.Base_Pay || 0) + (t.Incentive_Pay || 0)
      if (!t.Total_Kms_Paid || t.Total_Kms_Paid === 0) dataErrorCount++
    })
    return { totalPay, dataErrorCount }
  }, [trips])

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-label">Nómina Total</div>
        <div className="kpi-value">${stats.totalPay.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
        <div className="kpi-sub">{trips.length} Viajes Procesados</div>
        <hr className="kpi-divider" />
        <div className="diesel-label">Precio Diesel ($/L)</div>
        <input
          className="diesel-input"
          type="number" step="0.01"
          value={dieselPrice || ''}
          onChange={e => onDieselPriceChange(e.target.value)}
          placeholder="Ej. 24.50"
        />
        <div className="diesel-hint">Este valor se aplicará a todos los cálculos</div>
      </div>
      <div className={`kpi-card ${stats.dataErrorCount > 0 ? 'kpi-alert' : ''}`}>
        <div className="kpi-label">Aclaraciones de Datos</div>
        <div className="kpi-value">{stats.dataErrorCount}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Viajes con 0 Kms</div>
      </div>
    </div>
  )
}

// ── SummaryBar ────────────────────────────────────────────────────────────────
function SummaryBar({ trips }) {
  const totals = trips.reduce((acc, t) => {
    acc.base      += parseFloat(t.Base_Pay || 0)
    acc.incentive += parseFloat(t.Incentive_Pay || 0)
    acc.total     += parseFloat(t.Total_Pay || 0)
    const rows = t.Rows || []
    for (const row of rows) {
      const tipo = (row.Tipo || '').toUpperCase()
      if (row.Cruce) acc.cruces++
      else if (/^(LOC|MDC)/.test(tipo)) acc.locales++
      else if (/^PTT/.test(tipo)) acc.ptt++
    }
    return acc
  }, { base: 0, incentive: 0, total: 0, cruces: 0, locales: 0, ptt: 0 })

  return (
    <div className="summary-bar">
      <div className="summary-inner">
        <div className="summary-metrics">
          <div className="summary-item">
            <div className="summary-item-label">Total Base</div>
            <div className="summary-item-val">${totals.base.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-label">Total Incentivo</div>
            <div className={`summary-item-val ${totals.incentive >= 0 ? 'green' : ''}`}>
              {totals.incentive >= 0 ? '+' : ''}${totals.incentive.toFixed(2)}
            </div>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-item">
            <div className="summary-item-label">Cruces</div>
            <div className="summary-item-val blue">{totals.cruces}</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-label">Locales</div>
            <div className="summary-item-val">{totals.locales}</div>
          </div>
          <div className="summary-item">
            <div className="summary-item-label">PTT</div>
            <div className="summary-item-val">{totals.ptt}</div>
          </div>
        </div>
        <div className="summary-right">
          <div>
            <div className="summary-total-label">Neto a Pagar</div>
            <div className="summary-total-val">${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
          </div>
          <button className="export-btn">📊 Exportar Excel</button>
        </div>
      </div>
    </div>
  )
}

// ── FileUpload ────────────────────────────────────────────────────────────────
function FileUpload({ onUpload, loading }) {
  const [drag, setDrag] = React.useState(false)
  const inputRef = React.useRef()

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  return (
    <div className="upload-wrap">
      <div
        className={`upload-box ${drag ? 'drag-over' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <div className="upload-icon">📂</div>
        <div className="upload-title">Arrastra y Suelta Excel de Génesis con Boleta</div>
        <div className="upload-sub">o haz clic para buscar</div>
        {loading
          ? <div className="upload-btn">⏳ Procesando...</div>
          : <div className="upload-btn">Seleccionar Archivo</div>
        }
        <div className="upload-hint">.xlsx, .xls — Archivo de movimientos Génesis</div>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
          onChange={e => e.target.files[0] && onUpload(e.target.files[0])} />
      </div>
    </div>
  )
}

// ── PeriodSelector ────────────────────────────────────────────────────────────
function PeriodSelector({ weeks, onSelect }) {
  return (
    <div>
      <div className="period-title">Seleccionar Semana de Nómina</div>
      <div className="period-sub">Elige el período que deseas revisar y capturar</div>
      <div className="period-grid">
        {weeks.map(w => (
          <div key={w} className="period-card" onClick={() => onSelect(w)}>
            <div className="period-card-label">Semana</div>
            <div className="period-card-num">{w}</div>
            <div className="period-card-sub">Payroll Week</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────────
function App() {
  const [trips, setTrips]             = React.useState(MOCK_TRIPS)
  const [loaded, setLoaded]           = React.useState(true)   // demo: start loaded
  const [selectedWeek, setSelectedWeek] = React.useState(14)  // demo: start with week selected
  const [activeTab, setActiveTab]     = React.useState('ALL')
  const [driverFilter, setDriverFilter] = React.useState('')
  const [dieselPrice, setDieselPrice] = React.useState(24.50)

  const UNIT_YIELDS = {
    'F-021': 2.45098, 'F-022': 2.45098, 'F-034': 2.60127,
    'F-007': 2.37341, 'F-014': 2.37341,
  }

  const availableWeeks = React.useMemo(() =>
    [...new Set(trips.map(t => t.Payroll_Week || 0))].filter(w => w > 0), [trips])

  const visibleTrips = React.useMemo(() => {
    if (!selectedWeek) return []
    return trips.filter(t => {
      if (t.Payroll_Week !== selectedWeek) return false
      if (activeTab === 'NEEDS_INPUT' && t.Status !== 'NEEDS_INPUT') return false
      if (activeTab === 'PENDING'     && t.Status !== 'PENDING')     return false
      if (activeTab === 'APPROVED'    && t.Status !== 'APPROVED')    return false
      if (driverFilter && !(t.Driver || '').toLowerCase().includes(driverFilter.toLowerCase())) return false
      return true
    })
  }, [trips, selectedWeek, activeTab, driverFilter])

  const weekTrips = trips.filter(t => t.Payroll_Week === selectedWeek)
  const count = (s) => weekTrips.filter(t => t.Status === s).length

  const handleUpdate = (updatedTrips) => {
    const ids = new Set(updatedTrips.map ? updatedTrips.map(t => t.id) : [updatedTrips.id])
    setTrips(prev => prev.map(t => {
      if (Array.isArray(updatedTrips)) {
        return ids.has(t.id) ? updatedTrips.find(u => u.id === t.id) : t
      }
      return t.id === updatedTrips.id ? updatedTrips : t
    }))
  }

  // Demo: simulate file upload → just reuse mock data
  const handleFileUpload = (file) => {
    setLoaded(false)
    setTimeout(() => { setLoaded(true); setSelectedWeek(null) }, 800)
  }

  return (
    <div>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-logo">Sotelo <span>Nómina</span></span>
          <span className="topbar-version">v1.1 · Control Financiero</span>
        </div>
        <div className="topbar-actions">
          <a href="#" className="topbar-link">Administración</a>
          {selectedWeek && (
            <div className="week-badge">
              Semana {selectedWeek}
              <button onClick={() => setSelectedWeek(null)}>Cambiar</button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {!loaded ? (
          <FileUpload onUpload={handleFileUpload} loading={true} />
        ) : trips.length === 0 ? (
          <FileUpload onUpload={handleFileUpload} loading={false} />
        ) : !selectedWeek ? (
          <PeriodSelector weeks={availableWeeks} onSelect={setSelectedWeek} />
        ) : (
          <>
            <DashboardKPIs
              trips={weekTrips}
              dieselPrice={dieselPrice}
              onDieselPriceChange={setDieselPrice}
            />

            {/* Toolbar */}
            <div className="toolbar">
              <div className="tab-group">
                {[
                  { id: 'ALL',         label: `Todos (${weekTrips.length})` },
                  { id: 'NEEDS_INPUT', label: `Sin Capturar (${count('NEEDS_INPUT')})`, cls: 'tab-needs' },
                  { id: 'PENDING',     label: `Pendiente (${count('PENDING')})` },
                  { id: 'APPROVED',    label: `Aprobado (${count('APPROVED')})`, cls: 'tab-approved' },
                ].map(({ id, label, cls }) => (
                  <button
                    key={id}
                    className={`tab-btn ${activeTab === id ? `active ${cls || ''}` : ''}`}
                    onClick={() => { setActiveTab(id); setDriverFilter('') }}
                  >{label}</button>
                ))}
              </div>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  type="text" placeholder="Buscar conductor..."
                  value={driverFilter}
                  onChange={e => setDriverFilter(e.target.value)}
                />
                {driverFilter && (
                  <span className="search-clear" onClick={() => setDriverFilter('')}>×</span>
                )}
              </div>
            </div>

            <TripList
              trips={visibleTrips}
              onUpdate={handleUpdate}
              dieselPrice={dieselPrice}
              unitYields={UNIT_YIELDS}
              defaultYield={2.37341}
            />
          </>
        )}
      </main>

      {selectedWeek && visibleTrips.length > 0 && (
        <SummaryBar trips={visibleTrips} selectedWeek={selectedWeek} />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
