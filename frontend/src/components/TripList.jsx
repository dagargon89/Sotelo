import React, { useState, useMemo } from 'react'
import TripCard from './TripCard'
import BoletaCard from './BoletaCard'
import TripListHeader from './TripListHeader'

// ── Driver Accordion Header ──────────────────────────────────────────────────
function DriverAccordion({ driverName, driverTrips, expandedTrip, onToggleTrip, onUpdate, dieselPrice, unitYields, defaultYield }) {
    const [isOpen, setIsOpen] = useState(false)

    // Calcular totales del conductor
    const totals = useMemo(() => {
        return driverTrips.reduce((acc, trip) => {
            acc.basePay    += parseFloat(trip.Base_Pay    || 0)
            acc.pagoCruce  += parseFloat(trip.Pago_Cruce  || 0)
            acc.incentivos += parseFloat(trip.Incentive_Pay || 0)
            acc.total      += parseFloat(trip.Total_Pay   || 0)
            acc.kms        += parseFloat(trip.Total_Kms_Paid || 0)
            return acc
        }, { basePay: 0, pagoCruce: 0, incentivos: 0, total: 0, kms: 0 })
    }, [driverTrips])

    const initials = driverName ? driverName.substring(0, 2).toUpperCase() : 'DR'

    const statusCounts = useMemo(() => {
        const approved    = driverTrips.filter(t => t.Status === 'APPROVED').length
        const needsInput  = driverTrips.filter(t => t.Status === 'NEEDS_INPUT').length
        const pending     = driverTrips.filter(t => !t.Status || t.Status === 'PENDING').length
        return { approved, needsInput, pending }
    }, [driverTrips])

    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">

            {/* ── Encabezado del Conductor (Click para expandir) ── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-full text-left px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-colors focus:outline-none ${isOpen ? 'bg-slate-900 text-white' : 'bg-white hover:bg-slate-50'}`}
            >
                {/* Avatar + Nombre */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0 ${isOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className={`text-[15px] font-bold tracking-tight leading-tight truncate ${isOpen ? 'text-white' : 'text-slate-900'}`}>
                            {driverName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <i className="fas fa-file-invoice text-[9px]"></i>
                                {driverTrips.length} {driverTrips.length === 1 ? 'Boleta' : 'Boletas'}
                            </span>
                            {statusCounts.approved > 0 && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isOpen ? 'bg-emerald-500/30 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                                    <i className="fas fa-check-circle text-[9px]"></i> {statusCounts.approved}
                                </span>
                            )}
                            {statusCounts.needsInput > 0 && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isOpen ? 'bg-amber-500/30 text-amber-200' : 'bg-amber-100 text-amber-700'}`}>
                                    <i className="fas fa-exclamation-circle text-[9px]"></i> {statusCounts.needsInput} sin capturar
                                </span>
                            )}
                            {statusCounts.pending > 0 && (
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isOpen ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    <i className="fas fa-clock text-[9px]"></i> {statusCounts.pending} Pend.
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resumen Financiero */}
                <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 ${isOpen ? 'text-slate-400' : 'text-slate-400'}`}>Base</p>
                            <p className={`text-xs font-mono font-bold leading-none ${isOpen ? 'text-slate-300' : 'text-slate-700'}`}>${totals.basePay.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 ${isOpen ? 'text-indigo-300' : 'text-indigo-400'}`}>Incentivos</p>
                            <p className={`text-xs font-mono font-bold leading-none ${isOpen ? 'text-indigo-200' : 'text-indigo-700'}`}>+${totals.incentivos.toFixed(2)}</p>
                        </div>
                        <div className={`text-right px-3 py-1.5 rounded-lg ${isOpen ? 'bg-white/10' : 'bg-slate-900 text-white'}`}>
                            <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 ${isOpen ? 'text-slate-300' : 'text-slate-400'}`}>Total</p>
                            <p className={`text-sm font-mono font-bold leading-none ${isOpen ? 'text-white' : 'text-white'}`}>${totals.total.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Chevron */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-white/15 rotate-180' : 'bg-slate-100'}`}>
                        <i className={`fas fa-chevron-down text-[10px] ${isOpen ? 'text-white' : 'text-slate-500'}`}></i>
                    </div>
                </div>
            </button>

            {/* ── Tarjetas del Conductor (Expandidas) ── */}
            {isOpen && (
                <div className="border-t border-slate-200">
                    {/* Lista de facturas colapsables */}
                    <div className="divide-y divide-slate-100">
                        {driverTrips.map((trip, idx) => {
                            const isExpanded = expandedTrip === (trip.id || `${driverName}-${idx}`)
                            const tripKey    = trip.id || `${driverName}-${idx}`
                            return (
                                <InvoiceRow
                                    key={tripKey}
                                    trip={trip}
                                    index={idx}
                                    isExpanded={isExpanded}
                                    onToggle={() => onToggleTrip(tripKey)}
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

// ── Invoice Row (factura colapsable dentro del conductor) ────────────────────
function InvoiceRow({ trip, index, isExpanded, onToggle, onUpdate, dieselPrice, unitYields, defaultYield }) {
    const CardComponent = trip.source_type === 'GENESIS_BOLETA' ? BoletaCard : TripCard

    const facturaId = trip.Boleta || trip.Trip_ID || `#${index + 1}`
    const route     = trip.Route ? trip.Route : (trip.Rows && trip.Rows.length > 0
        ? `${trip.Rows[0]?.Origen || '—'} → ${trip.Rows[trip.Rows.length - 1]?.Destino || '—'}`
        : '—')

    const statusConfig = {
        APPROVED:    { label: 'Aprobado',  cls: 'bg-emerald-100 text-emerald-700', icon: 'fa-check-circle' },
        NEEDS_INPUT: { label: 'Sin capturar', cls: 'bg-amber-100 text-amber-700',   icon: 'fa-exclamation-circle' },
        PENDING:     { label: 'Pendiente', cls: 'bg-slate-100 text-slate-600',     icon: 'fa-clock' },
    }
    const statusKey = trip.Status in statusConfig ? trip.Status : 'PENDING'
    const status    = statusConfig[statusKey]

    return (
        <div className={`transition-all ${isExpanded ? 'bg-blue-50/30' : 'bg-white'}`}>
            {/* ── Fila resumen de la factura (clickeable) ── */}
            <button
                onClick={onToggle}
                className={`w-full text-left px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 transition-colors focus:outline-none hover:bg-slate-50/80 ${isExpanded ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
            >
                {/* Número + ID */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                    </span>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-mono text-xs font-bold ${isExpanded ? 'text-blue-700' : 'text-slate-700'}`}>
                                {facturaId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[240px]">
                                {route}
                            </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{trip.Start_Date || 'N/A'} · U-{trip.Unit}</span>
                    </div>
                </div>

                {/* Estado + Total + Chevron */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${status.cls}`}>
                        <i className={`fas ${status.icon} text-[9px]`}></i> {status.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-800">
                        ${(trip.Total_Pay || 0).toFixed(2)}
                    </span>
                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[9px]`}></i>
                    </div>
                </div>
            </button>

            {/* ── Tarjeta completa expandida ── */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-2 bg-blue-50/20">
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-full"></div>
                        <div className="pl-3">
                            <CardComponent
                                trip={trip}
                                onUpdate={onUpdate}
                                dieselPrice={dieselPrice}
                                unitYields={unitYields}
                                defaultYield={defaultYield}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── TripList Principal ───────────────────────────────────────────────────────
export default function TripList({ trips, onUpdate, dieselPrice, unitYields, defaultYield }) {
    const [expandedTrip, setExpandedTrip] = useState(null)

    const handleTripUpdate = (updatedTrip) => {
        const newTrips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t)
        onUpdate(newTrips)
    }

    const handleToggleTrip = (tripKey) => {
        setExpandedTrip(prev => prev === tripKey ? null : tripKey)
    }

    // Agrupar trips por conductor
    const grouped = useMemo(() => {
        const map = new Map()
        trips.forEach(trip => {
            const driver = trip.Driver || 'Sin Conductor'
            if (!map.has(driver)) map.set(driver, [])
            map.get(driver).push(trip)
        })
        // Ordenar conductores alfabéticamente
        return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
    }, [trips])

    return (
        <div className="space-y-4">
            {trips.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <i className="fas fa-inbox text-4xl mb-3 opacity-20"></i>
                    <p className="font-medium text-sm">No se encontraron boletas con estos filtros.</p>
                </div>
            ) : (
                grouped.map(([driverName, driverTrips]) => (
                    <DriverAccordion
                        key={driverName}
                        driverName={driverName}
                        driverTrips={driverTrips}
                        expandedTrip={expandedTrip}
                        onToggleTrip={handleToggleTrip}
                        onUpdate={handleTripUpdate}
                        dieselPrice={dieselPrice}
                        unitYields={unitYields}
                        defaultYield={defaultYield}
                    />
                ))
            )}
        </div>
    )
}
