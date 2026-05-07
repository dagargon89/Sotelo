import React, { useMemo } from 'react'

export default function DashboardKPIs({ trips, dieselPrice, onDieselPriceChange }) {
  const stats = useMemo(() => {
    let totalPay = 0
    let dataErrorCount = 0

    trips.forEach(t => {
      const pay = (t.Base_Pay || 0) + (t.Incentive_Pay || 0)
      totalPay += pay

      // Risk Rules
      if (t.Total_Kms_Paid === 0 || t.Total_Kms_Raw === 0) dataErrorCount++
    })

    return { totalPay, dataErrorCount }
  }, [trips])

  return (
    <div className="kpi-row">
      <div className="kpi-c">
        <div className="kpi-title">Nómina Total</div>
        <div className="kpi-val">${stats.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className="kpi-sub">{trips.length} Viajes Procesados</div>
        <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          <div className="kpi-title" style={{ marginBottom: 4 }}>Precio Diesel ($/L)</div>
          <input
            type="number"
            step="0.01"
            className="diesel-in"
            value={dieselPrice || ''}
            onChange={(e) => onDieselPriceChange(e.target.value)}
            placeholder="Ej. 24.50"
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', backgroundColor: 'var(--bg)' }}
          />
          <div className="diesel-hint" style={{ fontSize: '10px', color: 'var(--ink-4)', marginTop: 4 }}>Este valor aplica a los cálculos de esta vista.</div>
        </div>
      </div>

      <div className={`kpi-c ${stats.dataErrorCount > 0 ? 'alert' : ''}`}>
        <div className="kpi-title">Aclaraciones de Datos</div>
        <div className="kpi-val">{stats.dataErrorCount}</div>
        <div className="kpi-sub">Viajes con 0 Kms</div>
      </div>
    </div>
  )
}
