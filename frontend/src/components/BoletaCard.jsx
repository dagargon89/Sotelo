import { useState } from 'react'
import { buildApiUrl } from '../api'

export default function BoletaCard({ trip, onUpdate }) {
    const [liters, setLiters] = useState(trip.Manual_Refuel_Liters || '')
    const [priceInput, setPriceInput] = useState(trip.Manual_Actual_Price_Per_Liter || '')
    const [bonoQuimico, setBonoQuimico] = useState(trip.Manual_Bono_Quimico ?? false)

    // Pacifico states
    const [pacLoaded, setPacLoaded] = useState(trip.Manual_Pac_Loaded ?? true)
    const [bonoSierra, setBonoSierra] = useState(trip.Manual_Pac_Bono_Sierra ?? false)
    const [bonoDoble, setBonoDoble] = useState(trip.Manual_Pac_Bono_Doble ?? false)
    const [estObregon, setEstObregon] = useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
    const [estMochis, setEstMochis] = useState(trip.Manual_Pac_Estancia_Mochis ?? 0)

    const calc = (inLiters, inPrice, inQuimico) => {
        const allowed = trip.Allowed_Liters
        const actual = parseFloat(inLiters) || 0
        const savings = allowed - actual
        const price = parseFloat(inPrice) > 0 ? parseFloat(inPrice) : trip.Diesel_Rate
        const incentive = savings * price
        let extras = 0
        if (inQuimico) extras += 250
        const total = trip.Base_Pay + incentive + extras
        return { savings, incentive, total }
    }

    const { incentive } = calc(liters, priceInput, bonoQuimico)
    const isPositive = incentive >= 0

    const handleInputs = (newLiters, newPrice, newQuimico) => {
        setLiters(newLiters)
        setPriceInput(newPrice)
        setBonoQuimico(newQuimico)
        const results = calc(newLiters, newPrice, newQuimico)
        const updatedTrip = {
            ...trip,
            Manual_Refuel_Liters: parseFloat(newLiters) || 0,
            Manual_Actual_Price_Per_Liter: parseFloat(newPrice) || 0,
            Manual_Bono_Quimico: newQuimico,
            Calculated_Incentive: results.incentive,
            Calculated_Total: results.total,
            Calculated_Savings: results.savings
        }
        onUpdate(updatedTrip)
    }

    const toggleStatus = () => {
        const newStatus = trip.Status === 'APPROVED' ? 'PENDING' : 'APPROVED'
        onUpdate({ ...trip, Status: newStatus })
    }

    const handleSave = async () => {
        const payload = {
            ...trip,
            Manual_Refuel_Liters: parseFloat(liters) || 0,
            Manual_Actual_Price_Per_Liter: parseFloat(priceInput) || 0,
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
                            {/* Boleta badge */}
                            <span className="inline-flex items-center gap-1.5 bg-slate-800 text-white text-[12px] font-semibold px-3 py-1 rounded-lg tracking-wide">
                                Boleta {trip.Boleta}
                            </span>
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

            {/* ── Boleta Rows Table ── */}
            {rows.length > 0 && (
                <div className="overflow-x-auto border-b border-gray-100/50">
                    <table className="w-full text-left border-collapse min-w-[1300px]">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Factura</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Cordenada</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Fecha Salida</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Fecha Llegada</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Origen</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Destino</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-right">KMS</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Recarga</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Rendimiento</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Peso de Carga (kg)</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">C / V / PT</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Remolque</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">Cliente</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Pago por KM</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Litros a Pago</th>
                                <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap bg-yellow-400 text-slate-900 text-right">Diesel a Favor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rows.map((row, i) => (
                                <tr key={i} className={`text-[12px] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-blue-50/30 transition-colors`}>
                                    {/* Factura */}
                                    <td className="px-3 py-2 text-gray-600 font-mono whitespace-nowrap">{row.Factura || '—'}</td>
                                    {/* Coordenada */}
                                    <td className="px-3 py-2 text-gray-600 font-mono whitespace-nowrap">{row.Coordenada || '—'}</td>
                                    {/* Fecha Salida */}
                                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.Fecha_Salida || '—'}</td>
                                    {/* Fecha Llegada */}
                                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.Fecha_Llegada || '—'}</td>
                                    {/* Origen */}
                                    <td className="px-3 py-2 text-gray-800 font-medium max-w-[150px] truncate" title={row.Origen}>{row.Origen || '—'}</td>
                                    {/* Destino */}
                                    <td className="px-3 py-2 text-gray-800 font-medium max-w-[150px] truncate" title={row.Destino}>{row.Destino || '—'}</td>
                                    {/* KMS */}
                                    <td className="px-3 py-2 text-gray-700 font-mono text-right">{row.Kms > 0 ? row.Kms : '—'}</td>
                                    {/* RECARGA (yellow - editable later) */}
                                    <td className="px-3 py-2 bg-yellow-50/60 text-gray-500 font-mono text-right">{row.Recarga === 0 ? '0.00' : row.Recarga}</td>
                                    {/* RENDIMIENTO */}
                                    <td className="px-3 py-2 bg-yellow-50/60 text-gray-700 font-mono text-right">{row.Rendimiento?.toFixed(5) || '—'}</td>
                                    {/* PESO DE CARGA */}
                                    <td className="px-3 py-2 bg-yellow-50/60 text-gray-400 text-right">{row.Peso_Carga || '—'}</td>
                                    {/* C/V/PT */}
                                    <td className="px-3 py-2">
                                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                                            row.CVP === 'C' ? 'bg-green-100 text-green-700' :
                                            row.CVP === 'PT' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>{row.CVP || '—'}</span>
                                    </td>
                                    {/* Remolque */}
                                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.Remolque || '—'}</td>
                                    {/* Cliente */}
                                    <td className="px-3 py-2 text-gray-800 max-w-[160px] truncate" title={row.Cliente}>{row.Cliente || '—'}</td>
                                    {/* Pago por KM */}
                                    <td className="px-3 py-2 bg-yellow-50/60 text-gray-700 font-mono text-right">{row.Pago_Por_Km > 0 ? `$${row.Pago_Por_Km.toFixed(2)}` : '—'}</td>
                                    {/* Litros a Pago */}
                                    <td className="px-3 py-2 bg-yellow-50/60 text-gray-700 font-mono text-right">{row.Litros_A_Pago?.toFixed(2) || '—'}</td>
                                    {/* Diesel a Favor */}
                                    <td className="px-3 py-2 bg-yellow-50/60 font-mono text-right">
                                        <span className={row.Diesel_A_Favor > 0 ? 'text-green-700 font-semibold' : 'text-red-600'}>
                                            {row.Diesel_A_Favor !== undefined ? row.Diesel_A_Favor.toFixed(2) : '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Financial Summary ── */}
            <div className="px-8 py-6 border-b border-gray-100/50">
                <h3 className="text-[13px] font-medium text-gray-900 mb-4">Cálculo de Nómina</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50/80 p-4 rounded-2xl">
                        <p className="text-[11px] text-gray-500 font-medium mb-1">BASE</p>
                        <p className="font-semibold text-gray-900">${trip.Base_Pay?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-2xl" title="Límite teórico sugerido por rendimiento">
                        <p className="text-[11px] text-gray-500 font-medium mb-1">LT. PERMIT</p>
                        <p className="font-semibold text-gray-900">{trip.Allowed_Liters} L</p>
                    </div>
                    <div className="bg-gray-50/80 p-4 rounded-2xl">
                        <p className="text-[11px] text-gray-500 font-medium mb-1">C. ESP / TARIFA</p>
                        <p className="font-semibold text-gray-900 text-sm">${trip.Suggested_Cost?.toFixed(2) || (trip.Allowed_Liters * trip.Diesel_Rate).toFixed(2)}</p>
                    </div>
                    <div className={`${isPositive ? 'bg-gray-900 text-white' : 'bg-red-50 text-red-700 border border-red-200'} p-4 rounded-2xl shadow flex-1 relative overflow-hidden transition-colors`}>
                        {isPositive && (
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <i className="fas fa-check-circle text-4xl text-white"></i>
                            </div>
                        )}
                        <p className={`text-[11px] font-medium mb-1 relative z-10 ${isPositive ? 'text-gray-300' : 'text-red-600'}`}>INCENTIVO</p>
                        <p className="font-semibold text-lg relative z-10">
                            {isPositive ? '+' : ''}${incentive.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">LITROS REALES</label>
                        <input
                            type="number"
                            value={liters}
                            onChange={(e) => handleInputs(e.target.value, priceInput, bonoQuimico)}
                            placeholder="0.00"
                            className="w-full bg-white border border-gray-200 text-gray-900 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent block px-4 py-2.5 transition-all shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-2">PRECIO POR LITRO</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">$</span>
                            <input
                                type="number"
                                value={priceInput}
                                onChange={(e) => handleInputs(liters, e.target.value, bonoQuimico)}
                                placeholder={trip.Diesel_Rate}
                                className="w-full bg-white border border-gray-200 text-gray-900 text-[15px] font-medium rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent block pl-8 pr-4 py-2.5 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-end pb-1">
                        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="relative flex items-center">
                                <input type="checkbox" checked={bonoQuimico} onChange={(e) => handleInputs(liters, priceInput, e.target.checked)} className="peer sr-only" />
                                <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                            </div>
                            <span className="text-[13px] font-medium text-gray-700">Aplica Químico</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* ── Footer: Bonos / Estancia + Save ── */}
            <div className="p-6 md:px-8 md:py-6 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/40">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 w-full md:w-auto">
                    {trip.Is_Pacifico && trip.Status === 'NEEDS_INPUT' && (
                        <>
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
