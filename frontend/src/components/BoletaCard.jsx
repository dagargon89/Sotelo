import React, { useState } from 'react'
import { buildApiUrl } from '../api'
import { UNIT_YIELDS, DEFAULT_YIELD } from '../constants'

export default function BoletaCard({ trip, onUpdate, dieselPrice }) {
    // Universal states (needed even for Boleta format)
    const [bonoQuimico, setBonoQuimico] = useState(trip.Manual_Bono_Quimico ?? false)

    // Pacifico states
    const [pacLoaded, setPacLoaded] = useState(trip.Manual_Pac_Loaded ?? true)
    const [bonoSierra, setBonoSierra] = useState(trip.Manual_Pac_Bono_Sierra ?? false)
    const [bonoDoble, setBonoDoble] = useState(trip.Manual_Pac_Bono_Doble ?? false)
    const [estObregon, setEstObregon] = useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
    const [estMochis, setEstMochis] = useState(trip.Manual_Pac_Estancia_Mochis ?? 0)

    // Accordion state - track which rows are expanded
    const [expandedRows, setExpandedRows] = useState(new Set())

    // Editable row data - initialize with trip.Rows values
    const [rowsData, setRowsData] = useState(() => {
        return (trip.Rows || []).map(row => {
            const baseData = {
                Kms: row.Kms || 0,
                Recarga: row.Recarga || 0,
                Rendimiento: row.Rendimiento || 0,
                Peso_Carga: row.Peso_Carga || 0,
                CVP: row.CVP || '',
                Pago_Por_Km: row.Pago_Por_Km || 0,
                Litros_A_Pago: row.Litros_A_Pago || 0,
                Diesel_A_Favor: row.Diesel_A_Favor || 0
            }
            return baseData
        })
    })

    const calculateDependentFields = (rowData, allRows) => {
        // Use global dieselPrice instead of hardcoded value
        const currentDieselPrice = parseFloat(dieselPrice) || 14.85

        const kms = parseFloat(rowData.Kms) || 0
        const recarga = parseFloat(rowData.Recarga) || 0

        // Rendimiento Pago (valor de la tabla de la unidad)
        const unitYield = UNIT_YIELDS[trip.Unit] || DEFAULT_YIELD

        // Calcular suma total de KMS de todas las filas
        const totalKms = (allRows || rowsData).reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)

        // Rendimiento Real: se calcula como Suma Total KMS / Recarga de esta fila
        const rendimientoReal = recarga > 0 ? (totalKms / recarga) : 0

        // Nueva fórmula solicitada:
        // Litros Pago = (KMS / Rendimiento Pago) - Recarga
        // Importante: Usamos unitYield (Rendimiento Pago) según lo solicitado por el usuario
        const litrosPermitidos = unitYield > 0 ? (kms / unitYield) : 0
        const litrosAPago = litrosPermitidos - recarga

        // Diesel a Favor = Litros Pago × Precio Diesel
        const dieselAFavor = litrosAPago * currentDieselPrice

        return {
            Rendimiento: parseFloat(rendimientoReal.toFixed(2)),
            Litros_A_Pago: parseFloat(litrosAPago.toFixed(2)),
            Diesel_A_Favor: parseFloat(dieselAFavor.toFixed(2))
        }
    }

    // Realizar cálculos iniciales después de definir rowsData
    React.useEffect(() => {
        const initialCalculations = rowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, rowsData)
        }))
        setRowsData(initialCalculations)
    }, [])


    // React to diesel price changes
    React.useEffect(() => {
        const newRowsData = rowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, rowsData)
        }))
        setRowsData(newRowsData)

        // Notify parent of all updated rows at once
        const updatedRows = (trip.Rows || []).map((or, i) => ({
            ...or,
            ...newRowsData[i]
        }))
        onUpdate({ ...trip, Rows: updatedRows })
    }, [dieselPrice])

    const toggleRow = (index) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedRows(newExpanded)
    }

    const handleRowFieldChange = (rowIndex, field, value) => {
        const newRowsData = [...rowsData]
        newRowsData[rowIndex] = {
            ...newRowsData[rowIndex],
            [field]: value
        }

        // Recalcular todos los campos dependientes para TODAS las filas
        // porque el rendimiento depende de la suma total de KMS
        const updatedRows = newRowsData.map(row => ({
            ...row,
            ...calculateDependentFields(row, newRowsData)
        }))

        setRowsData(updatedRows)

        // Notify parent component of the update for all rows
        const updatedTripRows = (trip.Rows || []).map((originalRow, i) => ({
            ...originalRow,
            ...updatedRows[i]
        }))

        onUpdate({
            ...trip,
            Rows: updatedTripRows
        })
    }

    const toggleStatus = () => {
        const newStatus = trip.Status === 'APPROVED' ? 'PENDING' : 'APPROVED'
        onUpdate({ ...trip, Status: newStatus })
    }

    const handleSave = async () => {
        // Merge current rowsData back into trip.Rows so backend receives updated values
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
        } catch (err) {
            alert('Error al guardar: ' + err.message)
        }
    }

    const rows = trip.Rows || []
    const initials = trip.Driver ? trip.Driver.substring(0, 2).toUpperCase() : 'DR'

    // Helper function to get invoice number with multiple possible field names
    const getFactura = (row) => {
        // Try different possible field names
        return row.Factura ||
               row.factura ||
               row.Invoice ||
               row.invoice ||
               row.Folio_Liquidacion ||
               row.folio_liquidacion ||
               row.bill ||
               row.Bill ||
               ''
    }

    // Helper function to get coordenada
    const getCoordenada = (row) => {
        return row.Coordenada ||
               row.coordenada ||
               row.Coordinate ||
               row.coordinate ||
               ''
    }

    // Debug: Log rows data to check what we're receiving
    React.useEffect(() => {
        if (rows.length > 0 && trip.Boleta === 48531) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log(`🔍 DEBUG Boleta ${trip.Boleta}`)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log(`📦 Full Trip Object:`, trip)
            console.log(`📋 Rows Array (${rows.length} rows):`, rows)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            rows.forEach((row, idx) => {
                console.log(`📄 Row ${idx}:`)
                console.log('   All keys:', Object.keys(row))
                console.log('   Full object:', row)
                console.log('   Factura attempts:', {
                    'row.Factura': row.Factura,
                    'row.factura': row.factura,
                    'row.Invoice': row.Invoice,
                    'row.Folio_Liquidacion': row.Folio_Liquidacion,
                    'getFactura()': getFactura(row)
                })
                console.log('   Coordenada attempts:', {
                    'row.Coordenada': row.Coordenada,
                    'row.coordenada': row.coordenada,
                    'getCoordenada()': getCoordenada(row)
                })
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            })
        }
    }, [trip.Boleta, rows])

    return (
        <div className="glass-panel subtle-shadow rounded-3xl overflow-hidden mb-8 transition-all hover:shadow-lg">

            {/* ── Header: Driver + Boleta + Status ── */}
            <div className="px-8 py-5 flex flex-wrap justify-between items-center border-b border-gray-100/50">
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-lg border border-gray-200 flex-shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-[19px] font-semibold tracking-tight text-gray-900">{trip.Driver}</h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {/* Boleta, Unit and Yield badges */}
                            <div className="flex gap-1.5">
                                <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-[12px] font-semibold px-3 py-1 rounded-lg tracking-wide">
                                    Boleta {trip.Boleta}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[12px] font-semibold px-3 py-1 rounded-lg tracking-wide">
                                    Unidad {trip.Unit}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1 rounded-lg tracking-wide">
                                    Rend. Pago {UNIT_YIELDS[trip.Unit] || DEFAULT_YIELD}
                                </span>
                            </div>

                            <span className="text-[13px] text-gray-500">{trip.Start_Date || 'Fecha N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <label className="flex items-center gap-3 cursor-pointer group mr-4">
                        <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Aprobado</span>
                        <input
                            type="checkbox"
                            checked={trip.Status === 'APPROVED'}
                            onChange={toggleStatus}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 transition-colors cursor-pointer"
                        />
                    </label>
                    {trip.Status === 'APPROVED' ? (
                        <>
                            <i className="fas fa-check-circle text-green-500"></i>
                            <span className="text-[13px] font-medium text-green-700">Aprobado</span>
                        </>
                    ) : trip.Status === 'NEEDS_INPUT' ? (
                        <>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                            </span>
                            <span className="text-[13px] font-medium text-orange-700">Falta Captura</span>
                        </>
                    ) : (
                        <>
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                            <span className="text-[13px] font-medium text-gray-700">Pendiente</span>
                        </>
                    )}
                </div>
            </div>

            {/* ── Boleta Rows Accordion ── */}
            {rows.length > 0 && (
                <div className="border-b border-gray-100/50">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[14%]">Factura</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[12%]">Coordenada</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[16%]">Fecha Salida</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[16%]">Fecha Llegada</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[18%]">Origen</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider w-[18%]">Destino</th>
                                <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wider text-center w-[6%]">
                                    <i className="fas fa-chevron-down"></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => {
                                const isExpanded = expandedRows.has(i)
                                return (
                                    <React.Fragment key={i}>
                                        {/* Main Row - Always Visible */}
                                        <tr
                                            className={`cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-blue-50/40 transition-colors border-b border-gray-100`}
                                            onClick={() => toggleRow(i)}
                                        >
                                            <td className="px-4 py-3 text-gray-700 font-mono text-[14px]">
                                                {getFactura(row) || <span className="text-gray-400 italic">Sin factura</span>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 font-mono text-[14px]">
                                                {getCoordenada(row) || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-[14px]">{row.Fecha_Salida || '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-[14px]">{row.Fecha_Llegada || '—'}</td>
                                            <td className="px-4 py-3 text-gray-800 font-medium text-[14px]" title={row.Origen}>
                                                <div className="truncate">{row.Origen || '—'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-800 font-medium text-[14px]" title={row.Destino}>
                                                <div className="truncate">{row.Destino || '—'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-500 text-[14px] transition-transform duration-200`}></i>
                                            </td>
                                        </tr>

                                        {/* Expanded Content - Additional Row */}
                                        {isExpanded && (
                                            <tr className={`${i % 2 === 0 ? 'bg-blue-50/30' : 'bg-blue-50/50'} border-b border-blue-200`}>
                                                <td colSpan="7" className="px-0 py-0">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="bg-slate-700 text-white">
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-right">KMS ✎</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-yellow-400 text-slate-900 text-right">Recarga ✎</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-blue-400 text-slate-900 text-right">Rendimiento 🔢</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-yellow-400 text-slate-900 text-right">Peso Carga ✎</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-center">Tipo ✎</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">Remolque</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider">Cliente</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-yellow-400 text-slate-900 text-right">Pago/KM ✎</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-green-400 text-slate-900 text-right">Litros Pago 🔢</th>
                                                                <th className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider bg-green-400 text-slate-900 text-right">Diesel Favor 🔢</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr className="bg-white/80">
                                                                {/* KMS - Editable */}
                                                                <td className="px-4 py-2 bg-white">
                                                                    <input
                                                                        type="number"
                                                                        value={rowsData[i]?.Kms || ''}
                                                                        onChange={(e) => handleRowFieldChange(i, 'Kms', parseFloat(e.target.value) || 0)}
                                                                        className="w-full px-2 py-1 text-[13px] text-right font-mono border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                </td>
                                                                {/* Recarga - Editable */}
                                                                <td className="px-4 py-2 bg-yellow-50/60">
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={rowsData[i]?.Recarga || ''}
                                                                        onChange={(e) => handleRowFieldChange(i, 'Recarga', parseFloat(e.target.value) || 0)}
                                                                        className="w-full px-2 py-1 text-[13px] text-right font-mono border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                                    />
                                                                </td>
                                                                {/* Rendimiento - Calculado automáticamente (KMS / Recarga) */}
                                                                <td className="px-4 py-3 bg-blue-50/60">
                                                                    <div className="text-[13px] text-right font-mono font-semibold text-gray-900">
                                                                        {rowsData[i]?.Rendimiento?.toFixed(2) || '0.00'}
                                                                    </div>
                                                                </td>
                                                                {/* Peso de Carga - Editable */}
                                                                <td className="px-4 py-2 bg-yellow-50/60">
                                                                    <input
                                                                        type="number"
                                                                        value={rowsData[i]?.Peso_Carga || ''}
                                                                        onChange={(e) => handleRowFieldChange(i, 'Peso_Carga', parseFloat(e.target.value) || 0)}
                                                                        className="w-full px-2 py-1 text-[13px] text-right font-mono border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                                    />
                                                                </td>
                                                                {/* Tipo C/V/PT - Editable Select */}
                                                                <td className="px-4 py-2 text-center">
                                                                    <select
                                                                        value={rowsData[i]?.CVP || ''}
                                                                        onChange={(e) => handleRowFieldChange(i, 'CVP', e.target.value)}
                                                                        className={`px-2 py-1 text-[11px] font-bold rounded border-2 focus:ring-2 focus:ring-blue-500 ${
                                                                            rowsData[i]?.CVP === 'C' ? 'bg-green-100 text-green-700 border-green-300' :
                                                                            rowsData[i]?.CVP === 'PT' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                                                            'bg-gray-100 text-gray-600 border-gray-300'
                                                                        }`}
                                                                    >
                                                                        <option value="">—</option>
                                                                        <option value="C">C</option>
                                                                        <option value="V">V</option>
                                                                        <option value="PT">PT</option>
                                                                    </select>
                                                                </td>
                                                                {/* Remolque - Read only */}
                                                                <td className="px-4 py-3 text-gray-600 text-[13px]">{row.Remolque || '—'}</td>
                                                                {/* Cliente - Read only */}
                                                                <td className="px-4 py-3 text-gray-800 text-[13px]" title={row.Cliente}>
                                                                    <div className="truncate max-w-[150px]">{row.Cliente || '—'}</div>
                                                                </td>
                                                                {/* Pago por KM - Editable */}
                                                                <td className="px-4 py-2 bg-yellow-50/60">
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={rowsData[i]?.Pago_Por_Km || ''}
                                                                        onChange={(e) => handleRowFieldChange(i, 'Pago_Por_Km', parseFloat(e.target.value) || 0)}
                                                                        className="w-full px-2 py-1 text-[13px] text-right font-mono border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                                                    />
                                                                </td>
                                                                {/* Litros a Pago - Calculado automáticamente */}
                                                                <td className="px-4 py-3 bg-green-50/60">
                                                                    <div className="text-[13px] text-right font-mono font-semibold text-gray-900">
                                                                        {rowsData[i]?.Litros_A_Pago?.toFixed(2) || '0.00'}
                                                                    </div>
                                                                </td>
                                                                {/* Diesel a Favor - Calculado automáticamente */}
                                                                <td className="px-4 py-3 bg-green-50/60">
                                                                    <div className={`text-[13px] text-right font-mono font-bold ${
                                                                        (rowsData[i]?.Diesel_A_Favor || 0) > 0
                                                                            ? 'text-green-700'
                                                                            : 'text-red-600'
                                                                    }`}>
                                                                        ${rowsData[i]?.Diesel_A_Favor?.toFixed(2) || '0.00'}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* overall boleta summary at bottom of table */}
                    <div className="bg-slate-50/80 px-8 py-4 border-t border-gray-100 flex flex-wrap justify-end items-center gap-x-12 gap-y-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">TOTAL KMS BOLETA</span>
                            <span className="text-sm font-mono font-bold text-gray-700">
                                {rowsData.reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0).toFixed(1)}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">TOTAL RECARGA</span>
                            <span className="text-sm font-mono font-bold text-gray-700">
                                {rowsData.reduce((sum, r) => sum + (parseFloat(r.Recarga) || 0), 0).toFixed(3)}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-widest mb-1">REND. REAL (BOLETA)</span>
                            <span className="text-sm font-mono font-bold text-gray-700">
                                {(() => {
                                    const tKms = rowsData.reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)
                                    const tRec = rowsData.reduce((sum, r) => sum + (parseFloat(r.Recarga) || 0), 0)
                                    return tRec > 0 ? (tKms / tRec).toFixed(3) : '—'
                                })()}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">

                            <span className="text-[10px] uppercase font-bold text-green-600 tracking-widest mb-1 underline decoration-green-300">LITROS PAGO (BOLETA)</span>
                            <span className="text-lg font-mono font-bold text-slate-900">
                                {(() => {
                                    const tKms = rowsData.reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)
                                    const tRec = rowsData.reduce((sum, r) => sum + (parseFloat(r.Recarga) || 0), 0)
                                    const rendPago = UNIT_YIELDS[trip.Unit] || DEFAULT_YIELD
                                    const res = rendPago > 0 ? (tKms / rendPago) - tRec : 0
                                    return res.toFixed(2)
                                })()}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-bold text-slate-800 tracking-widest mb-1">BOLETA INCENTIVO TOTAL</span>
                            <span className="text-xl font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                                {(() => {
                                    const tKms = rowsData.reduce((sum, r) => sum + (parseFloat(r.Kms) || 0), 0)
                                    const tRec = rowsData.reduce((sum, r) => sum + (parseFloat(r.Recarga) || 0), 0)
                                    const rendPago = UNIT_YIELDS[trip.Unit] || DEFAULT_YIELD
                                    const resLitros = rendPago > 0 ? (tKms / rendPago) - tRec : 0
                                    const currentDieselPrice = parseFloat(dieselPrice) || 14.85
                                    return `$${(resLitros * currentDieselPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                })()}
                            </span>
                        </div>
                    </div>
                </div>

            )}

            {/* ── Footer: Bonos / Estancia + Save ── */}
            <div className="p-6 md:px-8 md:py-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/40">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full md:w-auto">

                    {/* Bono Quimico - Universal, visible on all cards */}
                    <label className="flex items-center gap-3 cursor-pointer group" title="Agrega $250 al total del viaje">
                        <div className="relative flex items-center">
                            <input type="checkbox" checked={bonoQuimico} onChange={e => setBonoQuimico(e.target.checked)} className="peer sr-only" />
                            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </div>
                        <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Aplica Químico <span className="text-gray-400 font-normal">(+$250)</span></span>
                    </label>

                    {/* Pacific Options - Only if Is_Pacifico */}
                    {trip.Is_Pacifico && (
                        <>
                            <div className="w-px h-6 bg-gray-200 hidden lg:block"></div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={pacLoaded} onChange={e => setPacLoaded(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 transition-colors cursor-pointer" />
                                <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Viaje Cargado</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={bonoSierra} onChange={e => setBonoSierra(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 transition-colors cursor-pointer" />
                                <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Bono Sierra</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" checked={bonoDoble} onChange={e => setBonoDoble(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 transition-colors cursor-pointer" />
                                <span className="text-[13px] font-medium text-gray-700 group-hover:text-gray-900">Bono Doble</span>
                            </label>
                            <div className="w-px h-6 bg-gray-200 hidden lg:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-gray-500">Est. Obregón</span>
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                    <button onClick={() => setEstObregon(Math.max(0, estObregon - 1))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"><i className="fas fa-minus text-[10px]"></i></button>
                                    <span className="w-6 text-center text-[13px] font-semibold text-gray-900">{estObregon}</span>
                                    <button onClick={() => setEstObregon(estObregon + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"><i className="fas fa-plus text-[10px]"></i></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium text-gray-500">Est. Mochis</span>
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                    <button onClick={() => setEstMochis(Math.max(0, estMochis - 1))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"><i className="fas fa-minus text-[10px]"></i></button>
                                    <span className="w-6 text-center text-[13px] font-semibold text-gray-900">{estMochis}</span>
                                    <button onClick={() => setEstMochis(estMochis + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"><i className="fas fa-plus text-[10px]"></i></button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <button onClick={handleSave} className="w-full md:w-auto px-8 py-3 text-[14px] font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-900/20 transition-all shadow-lg flex items-center justify-center gap-2">
                    <i className="fas fa-save"></i> Guardar y Calcular
                </button>
            </div>
        </div>
    )
}
