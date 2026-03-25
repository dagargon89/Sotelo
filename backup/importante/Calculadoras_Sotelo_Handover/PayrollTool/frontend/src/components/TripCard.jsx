import { useState, useEffect } from 'react'
import { buildApiUrl } from '../api'

export default function TripCard({ trip, onUpdate }) {
    const [liters, setLiters] = useState(trip.Manual_Refuel_Liters || '')
    const [showLegs, setShowLegs] = useState(false)

    // Pacifico states
    const [pacLoaded, setPacLoaded] = useState(trip.Manual_Pac_Loaded ?? true)
    const [bonoSierra, setBonoSierra] = useState(trip.Manual_Pac_Bono_Sierra ?? false)
    const [bonoDoble, setBonoDoble] = useState(trip.Manual_Pac_Bono_Doble ?? false)
    const [estObregon, setEstObregon] = useState(trip.Manual_Pac_Estancia_Obregon ?? 0)
    const [estMochis, setEstMochis] = useState(trip.Manual_Pac_Estancia_Mochis ?? 0)

    // Real-time calculation within component for instant feedback
    const calc = (inputLiters) => {
        const allowed = trip.Allowed_Liters
        const actual = parseFloat(inputLiters) || 0
        const savings = allowed - actual
        const incentive = savings * trip.Diesel_Rate
        const total = trip.Base_Pay + incentive
        return { savings, incentive, total }
    }

    const { incentive, total } = calc(liters)
    const isPositive = incentive >= 0

    const handleChange = (e) => {
        const val = e.target.value
        setLiters(val)

        // Propagate update to parent (debounced in real app)
        // Optimistic Update
        const results = calc(val) // Calculate results based on new input
        const updatedTrip = {
            ...trip,
            Manual_Refuel_Liters: parseFloat(val) || 0, // Ensure number type
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
            Manual_Pac_Loaded: pacLoaded,
            Manual_Pac_Bono_Sierra: bonoSierra,
            Manual_Pac_Bono_Doble: bonoDoble,
            Manual_Pac_Estancia_Obregon: parseInt(estObregon) || 0,
            Manual_Pac_Estancia_Mochis: parseInt(estMochis) || 0,
            Status: 'PENDING'
        };
        try {
            const res = await fetch(buildApiUrl('/api/calculate'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trips: [payload] })
            });
            const data = await res.json();
            if (data.trips && data.trips.length > 0) {
                // Return array structure if onUpdate expects an array (see TripList mapping) 
                // Wait, TripList passes handleTripUpdate which expects ONE updated trip config.
                // Wait, TripList says: const handleTripUpdate = (updatedTrip) => { onUpdate([updatedTrips as whole array]) }
                // So TripList handleTripUpdate handles an object.
                onUpdate(data.trips[0]);
            }
        } catch (err) {
            alert('Error recalculating trip: ' + err.message);
        }
    }

    return (
        <div className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${trip.Status === 'APPROVED' ? 'border-green-200 bg-green-50/30' : trip.Status === 'NEEDS_INPUT' ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
                {/* 1. Trip Header & Route */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                                {trip.Unit}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                                {trip.Trip_ID}
                            </span>
                            <span className="font-bold text-slate-800 text-sm">
                                {trip.Driver}
                            </span>
                            {trip.Status === 'APPROVED' && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    APPROVED
                                </span>
                            )}
                            {trip.Status === 'NEEDS_INPUT' && (
                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    INCOMPLETE
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{trip.Start_Date}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs font-medium text-slate-500 uppercase">Approve</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                                    checked={trip.Status === 'APPROVED'}
                                    onChange={toggleStatus}
                                />
                            </label>
                        </div>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm whitespace-pre-wrap break-words">{trip.Route}</h3>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500 items-center">
                        <span>unit: <b>{trip.Unit}</b></span>
                        <span>kms: <b>{trip.Total_Kms_Paid}</b></span>
                        <span>yield: <b>{trip.Yield_Used}</b></span>
                        {trip.Legs && trip.Legs.length > 0 && (
                            <button onClick={() => setShowLegs(!showLegs)} className="text-blue-500 hover:text-blue-700 font-medium ml-2 uppercase text-[10px] tracking-wider border border-blue-200 bg-blue-50 px-2 py-0.5 rounded transition-all">
                                {showLegs ? 'Ocultar' : 'Ver'} {trip.Legs.length} Coordenadas
                            </button>
                        )}
                    </div>
                </div>

                {/* Inputs & Stats */}
                <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Base</div>
                        <div className="font-mono font-medium text-slate-700">${trip.Base_Pay.toFixed(2)}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-slate-400 mb-1">Allowed</div>
                        <div className="font-mono font-medium text-blue-600">{trip.Allowed_Liters} L</div>
                    </div>

                    <div className="flex flex-col w-24">
                        <label className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider font-bold">Refuel</label>
                        <input
                            type="number"
                            value={liters}
                            onChange={handleChange}
                            placeholder="0.0"
                            className="w-full px-2 py-1 text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center bg-white"
                        />
                    </div>

                    <div className="text-center min-w-[80px]">
                        <div className="text-xs text-slate-400 mb-1">Incentive</div>
                        <div className={`font-mono font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}${incentive.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legs / Coordenadas Breakdown */}
            {showLegs && trip.Legs && trip.Legs.length > 0 && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full">
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>Desglose de Coordenadas (Trayectos)</span>
                    </h4>
                    <ul className="space-y-1">
                        {trip.Legs.map((leg, i) => (
                            <li key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-slate-200 last:border-0 text-xs">
                                <div className="flex items-center gap-2 flex-wrap mb-1 sm:mb-0">
                                    <span className="font-mono text-slate-400 bg-white border border-slate-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{i + 1}</span>
                                    <span className="font-medium text-slate-700 text-sm">{leg.Origin} <span className="text-slate-400 mx-1">&rarr;</span> {leg.Destination}</span>

                                    {leg.Is_Loaded ? (
                                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold">Cargado</span>
                                    ) : (
                                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold">Vacío/PT</span>
                                    )}
                                    <span className="px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded text-[10px] font-mono">{leg.Type}</span>
                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium hidden sm:inline-block">{leg.Status}</span>
                                </div>
                                <div className="font-mono font-medium text-slate-600 bg-white px-2 py-1 border border-slate-100 rounded shadow-sm">{leg.Kms} km</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Pacifico Form */}
            {trip.Is_Pacifico && trip.Status === 'NEEDS_INPUT' && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="text-orange-800 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Completar Datos Pacífico
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={pacLoaded} onChange={e => setPacLoaded(e.target.checked)} className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4" />
                            <span className="text-sm text-slate-700 font-medium">Viaje Cargado (.30c)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={bonoSierra} onChange={e => setBonoSierra(e.target.checked)} className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4" />
                            <span className="text-sm text-slate-700 font-medium">Bono Sierra ($500)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={bonoDoble} onChange={e => setBonoDoble(e.target.checked)} className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4" />
                            <span className="text-sm text-slate-700 font-medium">Bono Doble ($1726)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700 font-medium">Estancias Obregón:</span>
                            <input type="number" min="0" value={estObregon} onChange={e => setEstObregon(e.target.value)} className="w-16 border-slate-300 rounded text-center px-2 py-1 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-700 font-medium">Estancias Mochis:</span>
                            <input type="number" min="0" value={estMochis} onChange={e => setEstMochis(e.target.value)} className="w-16 border-slate-300 rounded text-center px-2 py-1 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleSave} className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium shadow hover:bg-orange-700 transition active:scale-95">
                            Calcular y Guardar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
