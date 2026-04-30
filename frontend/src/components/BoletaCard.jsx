import React, { useState } from 'react'
import { buildApiUrl } from '../api'

// Compact iOS-style Toggle Switch
const ToggleSwitch = ({ checked, onChange, label, amountLabel }) => (
    <label className="flex items-center justify-between cursor-pointer group bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all">
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
            {amountLabel && <span className="text-[10px] font-semibold text-emerald-600">{amountLabel}</span>}
        </div>
        <div className="relative ml-2">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="peer sr-only" />
            <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-focus:ring-1 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
        </div>
    </label>
);

// Compact Stepper
const Stepper = ({ value, onChange, label, amountLabel }) => (
    <div className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all">
        <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{label}</span>
            {amountLabel && <span className="text-[10px] font-semibold text-emerald-600">{amountLabel}</span>}
        </div>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5 ml-2">
            <button onClick={() => onChange(Math.max(0, value - 1))} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"><i className="fas fa-minus text-[8px]"></i></button>
            <span className="w-6 text-center text-xs font-bold text-slate-900">{value}</span>
            <button onClick={() => onChange(value + 1)} className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-colors"><i className="fas fa-plus text-[8px]"></i></button>
        </div>
    </div>
);

export default function BoletaCard({ trip, onUpdate, dieselPrice, unitYields = {}, defaultYield = 2.37341 }) {
    // Universal states
    const [bonoQuimico, setBonoQuimico] = useState(trip.Manual_Bono_Quimico ?? false)

    // Pacifico states
    const [pacLoaded, setPacLoaded] = useState(trip.Manual_Pac_Loaded ?? true)
    const [bonoSierra, setBonoSierra] = useState(trip.Manual_Pac_Bono_Sierra ?? false)
    const [bonoDoble, setBonoDoble] = useState(trip.Manual_Pac_Bono_Doble ?? false)
    const [estObregon, setEstObregon] = useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
    const [estMochis, setEstMochis] = useState(trip.Manual_Pac_Estancia_Mochis ?? 0)

    // Accordion state
    const [expandedRows, setExpandedRows] = useState(new Set())

    // UX states
    const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'ok' | 'error'
    const [isDirty, setIsDirty] = useState(false)

    // Editable row data
    const [rowsData, setRowsData] = useState(() => {
        return (trip.Rows || []).map(row => ({
            Kms: row.Kms || 0,
            Recarga: row.Recarga || 0,
            Rendimiento: row.Rendimiento || 0,
            Peso_Carga: row.Peso_Carga || 0,
            CVP: row.CVP || '',
            Pago_Por_Km: row.Pago_Por_Km || 0,
            Litros_A_Pago: row.Litros_A_Pago || 0,
            Diesel_A_Favor: row.Diesel_A_Favor || 0
        }))
    })

    const calculateDependentFields = (rowData, allRows) => {
        const currentDieselPrice = parseFloat(dieselPrice) || 14.85
        const recarga = parseFloat(rowData.Recarga) || 0
        const unitYield = unitYields[trip.Unit] || defaultYield
        const totalKms = (allRows || rowsData).reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)
        const rendimientoReal = recarga > 0 ? (totalKms / recarga) : 0
        const litrosAPago = unitYield > 0 ? (totalKms / unitYield) - recarga : 0
        const dieselAFavor = litrosAPago * currentDieselPrice

        return {
            Rendimiento: parseFloat(rendimientoReal.toFixed(2)),
            Litros_A_Pago: parseFloat(litrosAPago.toFixed(2)),
            Diesel_A_Favor: parseFloat(dieselAFavor.toFixed(2))
        }
    }

    React.useEffect(() => {
        const initialCalculations = rowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, rowsData)
        }))
        setRowsData(initialCalculations)
    }, [])

    const recalcAndNotify = (currentRowsData) => {
        const quimico = bonoQuimico ? 250 : 0
        let bonos = 0
        if (trip.Is_Pacifico) {
            if (bonoSierra) bonos += 500
            if (bonoDoble) bonos += 1726
            bonos += (parseInt(estObregon) || 0) * 600
            bonos += (parseInt(estMochis) || 0) * 300
        }

        const pagoCruceVal = parseFloat(trip.Pago_Cruce) || 0
        const incentivePay = quimico + bonos + pagoCruceVal
        const basePay = parseFloat(trip.Base_Pay) || 0
        const updatedRows = (trip.Rows || []).map((or, i) => ({ ...or, ...currentRowsData[i] }))

        onUpdate({
            ...trip,
            Rows: updatedRows,
            Incentive_Pay: parseFloat(incentivePay.toFixed(2)),
            Total_Pay: parseFloat((basePay + incentivePay).toFixed(2)),
        })
    }

    React.useEffect(() => {
        const newRowsData = rowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, rowsData)
        }))
        setRowsData(newRowsData)
        recalcAndNotify(newRowsData)
    }, [dieselPrice])

    React.useEffect(() => {
        recalcAndNotify(rowsData)
    }, [bonoQuimico, bonoSierra, bonoDoble, estObregon, estMochis, pacLoaded])

    const toggleRow = (index) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(index)) newExpanded.delete(index)
        else newExpanded.add(index)
        setExpandedRows(newExpanded)
    }

    const handleRowFieldChange = (rowIndex, field, value) => {
        // Clamp negative values for numeric fields
        let cleanValue = value
        if (['Kms', 'Recarga', 'Peso_Carga'].includes(field) && parseFloat(value) < 0) {
            cleanValue = 0
        }

        const newRowsData = [...rowsData]
        newRowsData[rowIndex] = { ...newRowsData[rowIndex], [field]: cleanValue }

        const updatedRows = newRowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, newRowsData)
        }))

        setRowsData(updatedRows)
        recalcAndNotify(updatedRows)
        setIsDirty(true)
    }

    const toggleStatus = () => {
        const newStatus = trip.Status === 'APPROVED' ? 'PENDING' : 'APPROVED'
        onUpdate({ ...trip, Status: newStatus })
    }

    const handleSave = async () => {
        setSaveStatus('saving')
        const updatedRows = (trip.Rows || []).map((originalRow, i) => ({
            ...originalRow,
            ...rowsData[i]
        }))

        const payload = {
            ...trip,
            Rows: updatedRows,
            Manual_Bono_Quimico: bonoQuimico,
            Manual_Pac_Loaded: pacLoaded,
            Manual_Pac_Bono_Sierra: bonoSierra,
            Manual_Pac_Bono_Doble: bonoDoble,
            Manual_Pac_Estancia_Obregon: parseInt(estObregon) || 0,
            Manual_Pac_Estancia_Mochis: parseInt(estMochis) || 0,
            Status: 'PENDING'
        }
        try {
            const res = await fetch(buildApiUrl('/api/calculate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trips: [payload] })
            })
            const data = await res.json()
            if (data.trips && data.trips.length > 0) {
                onUpdate(data.trips[0])
            }
            setSaveStatus('ok')
            setIsDirty(false)
            setTimeout(() => setSaveStatus('idle'), 2500)
        } catch (err) {
            setSaveStatus('error')
            setTimeout(() => setSaveStatus('idle'), 3000)
        }
    }

    const rows = trip.Rows || []
    const initials = trip.Driver ? trip.Driver.substring(0, 2).toUpperCase() : 'DR'

    const getFactura = (row) => row.Factura || row.factura || row.Invoice || row.invoice || row.Folio_Liquidacion || row.folio_liquidacion || row.bill || row.Bill || ''
    const getCoordenada = (row) => row.Coordenada || row.coordenada || row.Coordinate || row.coordinate || ''

    // Calculate dynamic totals for display
    const totalKmsBoleta = rowsData.reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)
    const totalRecarga = rowsData.reduce((sum, r) => sum + (parseFloat(r.Recarga) || 0), 0)
    const rendReal = totalRecarga > 0 ? (totalKmsBoleta / totalRecarga).toFixed(2) : '—'
    const rendPago = unitYields[trip.Unit] || defaultYield
    const litrosPago = rendPago > 0 ? (totalKmsBoleta / rendPago) - totalRecarga : 0
    const totalDiésel = litrosPago * (parseFloat(dieselPrice) || 14.85)

    const quimicoVal = bonoQuimico ? 250 : 0
    let pacificoBonosVal = 0
    if (trip.Is_Pacifico) {
        if (bonoSierra) pacificoBonosVal += 500
        if (bonoDoble) pacificoBonosVal += 1726
        pacificoBonosVal += (parseInt(estObregon) || 0) * 600
        pacificoBonosVal += (parseInt(estMochis) || 0) * 300
    }
    const pagoCruceVal = parseFloat(trip.Pago_Cruce) || 0

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm">

            {/* ── 1. Header (Compact) ── */}
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">{trip.Driver}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                #{trip.Boleta}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                                U-{trip.Unit}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                                {trip.Start_Date || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {trip.Status === 'APPROVED' ? (
                        <div className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <i className="fas fa-check-circle"></i> Aprobado
                        </div>
                    ) : trip.Status === 'NEEDS_INPUT' ? (
                        <div className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-help" title="Presiona el botón para aprobar la boleta">
                            <i className="fas fa-exclamation-circle"></i> Sin capturar
                        </div>
                    ) : (
                        <div className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <i className="fas fa-clock"></i> Pendiente
                        </div>
                    )}

                    <div className="border-l border-slate-200 pl-3">
                        <label className="flex items-center gap-1.5 cursor-pointer group" title={trip.Status === 'APPROVED' ? 'Quitar aprobación' : 'Marcar como aprobada'}>
                            <div className="relative flex items-center">
                                <input type="checkbox" checked={trip.Status === 'APPROVED'} onChange={toggleStatus} className="peer sr-only" />
                                <div className="w-7 h-4 bg-slate-300 rounded-full peer peer-focus:ring-1 peer-focus:ring-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors select-none">
                                {trip.Status === 'APPROVED' ? 'Aprobada' : 'Aprobar'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* ── 2. Finance & KPI Panel (Compact) ── */}
            <div className="px-4 py-3 border-b border-slate-100 bg-white">
                <div className="flex flex-col md:flex-row gap-4 items-center">

                    {/* Financial Summary */}
                    <div className="flex-1 flex flex-wrap md:flex-nowrap gap-2 w-full">
                        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-center min-w-[100px]">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Base</span>
                            <span className="text-sm font-bold text-slate-800 leading-none">${trip.Base_Pay?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex flex-col justify-center min-w-[100px]">
                            <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">Cruce</span>
                            <span className="text-sm font-bold text-indigo-800 leading-none">+ ${(trip.Pago_Cruce || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex flex-col justify-center min-w-[100px]">
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Incentivos</span>
                            <span className="text-sm font-bold text-blue-800 leading-none">+ ${(quimicoVal + pacificoBonosVal).toFixed(2)}</span>
                        </div>
                        <div className="flex-1 bg-slate-900 rounded-lg p-2.5 flex flex-col justify-center min-w-[100px]">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total</span>
                            <span className="text-base font-bold text-white leading-none">${trip.Total_Pay?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>

                    {/* Operational KPIs */}
                    <div className="md:w-56 flex justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 w-8">KMS</span>
                                <span className="text-xs font-mono font-bold text-slate-800">{totalKmsBoleta.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 w-8">REND</span>
                                <span className="text-xs font-mono font-bold text-slate-800">{rendReal}</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center text-right bg-slate-50 rounded p-1.5 border border-slate-100">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Diésel Favor</span>
                            <span className={`text-sm font-mono font-bold ${totalDiésel > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                ${totalDiésel.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Manual Bonuses Toggles */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2">
                        <ToggleSwitch checked={bonoQuimico} onChange={setBonoQuimico} label="Químico" amountLabel="+$250" />

                        {trip.Is_Pacifico && (
                            <>
                                <ToggleSwitch checked={bonoSierra} onChange={setBonoSierra} label="Sierra" amountLabel="+$500" />
                                <ToggleSwitch checked={bonoDoble} onChange={setBonoDoble} label="Doble" amountLabel="+$1,726" />
                                <Stepper value={estObregon} onChange={setEstObregon} label="Obregón" amountLabel="+$600/cu" />
                                <Stepper value={estMochis} onChange={setEstMochis} label="Mochis" amountLabel="+$300/cu" />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 3. Legs/Rows Table (Compact) ── */}
            {rows.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-200">
                    <div className="px-4 py-2 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <i className="fas fa-route text-slate-400"></i> Desglose de Trayectos
                        </h3>
                        {trip.Has_Km_Fallback && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                <i className="fas fa-exclamation-triangle"></i> Fallback KM
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left border-collapse">
                            <thead>
                                <tr className="border-y border-slate-200 bg-slate-100">
                                    <th className="px-4 py-1.5 text-[9px] font-bold text-slate-500 uppercase w-10">#</th>
                                    <th className="px-4 py-1.5 text-[9px] font-bold text-slate-500 uppercase">Factura / Ruta</th>
                                    <th className="px-4 py-1.5 text-[9px] font-bold text-slate-500 uppercase text-right">KMs</th>
                                    <th className="px-4 py-1.5 text-[9px] font-bold text-slate-500 uppercase text-center w-12">Detalle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {rows.map((row, i) => {
                                    const isExpanded = expandedRows.has(i);
                                    return (
                                        <React.Fragment key={i}>
                                            <tr
                                                className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                                                onClick={() => toggleRow(i)}
                                            >
                                                <td className="px-4 py-2 font-mono text-xs text-slate-400 font-bold">{i + 1}</td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-slate-700 w-16 truncate">{getFactura(row) || 'N/A'}</span>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            <span className="font-bold text-slate-800">{row.Origen || '—'}</span>
                                                            <i className="fas fa-arrow-right text-[8px] text-slate-300"></i>
                                                            <span className="font-bold text-slate-800">{row.Destino || '—'}</span>
                                                            {row.Km_Source === 'FALLBACK' && (
                                                                <span className="text-[8px] text-amber-600 bg-amber-100 px-1 rounded ml-1">⚠ KM</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-right font-mono text-xs font-bold text-slate-700">
                                                    {rowsData[i]?.Kms || row.Kms || 0}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[9px]`}></i>
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* ── Sub-Grid Panel ── */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="4" className="p-0 border-b border-blue-100">
                                                        <div className="bg-blue-50/30 px-4 py-3 shadow-inner relative">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-slate-500 uppercase ml-0.5">KMS</label>
                                                                    <input type="number" min="0" value={rowsData[i]?.Kms || ''} onChange={(e) => handleRowFieldChange(i, 'Kms', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono shadow-sm focus:ring-1 focus:ring-blue-500 outline-none" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-amber-600 uppercase ml-0.5" title="Litros de combustible recargados en este trayecto">Recarga <span className="text-slate-400 normal-case font-normal">(L)</span></label>
                                                                    <input type="number" step="0.01" min="0" value={rowsData[i]?.Recarga || ''} onChange={(e) => handleRowFieldChange(i, 'Recarga', parseFloat(e.target.value) || 0)} className="w-full bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs font-mono shadow-sm focus:ring-1 focus:ring-amber-500 outline-none" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-amber-600 uppercase ml-0.5">Peso Carga</label>
                                                                    <input type="number" min="0" value={rowsData[i]?.Peso_Carga || ''} onChange={(e) => handleRowFieldChange(i, 'Peso_Carga', parseFloat(e.target.value) || 0)} className="w-full bg-amber-50 border border-amber-200 rounded px-2 py-1 text-xs font-mono shadow-sm focus:ring-1 focus:ring-amber-500 outline-none" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-slate-500 uppercase ml-0.5">Tipo</label>
                                                                    <select value={rowsData[i]?.CVP || ''} onChange={(e) => handleRowFieldChange(i, 'CVP', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold shadow-sm focus:ring-1 focus:ring-blue-500 outline-none">
                                                                        <option value="">—</option>
                                                                        <option value="C">C (Cargado)</option>
                                                                        <option value="V">V (Vacío)</option>
                                                                        <option value="PT">PT</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1 bg-white/50 border border-slate-200/50 rounded px-2 py-1 flex flex-col justify-center">
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Litros Pago</span>
                                                                    <span className="font-mono font-bold text-slate-800 text-xs">{rowsData[i]?.Litros_A_Pago?.toFixed(2) || '0.00'}</span>
                                                                </div>
                                                                <div className="space-y-1 bg-emerald-50/50 border border-emerald-100 rounded px-2 py-1 flex flex-col justify-center">
                                                                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Diesel a Favor</span>
                                                                    <span className="font-mono font-bold text-emerald-800 text-xs">${rowsData[i]?.Diesel_A_Favor?.toFixed(2) || '0.00'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── 4. Bottom Actions ── */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end items-center">
                {isDirty && (
                    <span className="text-[10px] text-amber-600 font-semibold mr-3 flex items-center gap-1">
                        <i className="fas fa-circle text-[6px] animate-pulse"></i> Cambios sin guardar
                    </span>
                )}
                <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`w-full md:w-auto px-6 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 disabled:cursor-not-allowed ${
                        saveStatus === 'ok' ? 'bg-emerald-600 hover:bg-emerald-500' :
                        saveStatus === 'error' ? 'bg-red-600 hover:bg-red-500' :
                        saveStatus === 'saving' ? 'bg-slate-600' :
                        'bg-slate-900 hover:bg-slate-800'
                    }`}
                >
                    {saveStatus === 'saving' ? (
                        <><i className="fas fa-spinner fa-spin"></i> Guardando...</>
                    ) : saveStatus === 'ok' ? (
                        <><i className="fas fa-check"></i> Guardado</>
                    ) : saveStatus === 'error' ? (
                        <><i className="fas fa-times"></i> Error al guardar</>
                    ) : (
                        <><i className="fas fa-save"></i> Guardar y Recalcular</>
                    )}
                </button>
            </div>

        </div>
    )
}
