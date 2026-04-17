import { exportToExcel } from '../utils/exportExcel'
import { SHOW_NEW_BADGES } from '../constants'

// Badge visual temporal para marcar secciones nuevas
const NewBadge = () => SHOW_NEW_BADGES ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-md ml-1.5 select-none">
        ✦ nuevo
    </span>
) : null

export default function SummaryBar({ trips, selectedWeek }) {
    // ── Totales financieros ──────────────────────────────────────────────────
    const totals = trips.reduce((acc, trip) => {
        const incentive = trip.Calculated_Incentive ?? trip.Incentive_Pay ?? 0
        const total = trip.Calculated_Total ?? trip.Total_Pay ?? trip.Base_Pay

        acc.base     += trip.Base_Pay ?? 0
        acc.incentive += incentive
        acc.total    += total

        // ── Contadores de categoría de movimiento (desde Rows) ─────────────
        const rows = trip.Rows ?? []
        for (const row of rows) {
            const tipo  = (row.Tipo ?? '').toUpperCase()
            const cruce = row.Cruce ?? null

            if (cruce) {
                acc.cruces++
            } else if (/^(LOC|MDC)/.test(tipo)) {
                acc.locales++
            } else if (/^PTT/.test(tipo)) {
                acc.ptt++
            }
        }

        // Contar trips con tarifa del tabulador aplicada
        if (trip.Fuente_Tarifa === 'TABULADOR_BD') {
            acc.conTabulador++
        }

        return acc
    }, { base: 0, incentive: 0, total: 0, cruces: 0, locales: 0, ptt: 0, conTabulador: 0 })

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-y-2">

                {/* Totales financieros */}
                <div className="flex gap-6 flex-wrap items-center">
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Base</span>
                        <span className="font-mono text-lg text-slate-600">${totals.base.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Incentivo</span>
                        <span className={`font-mono text-lg ${totals.incentive >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {totals.incentive >= 0 ? '+' : ''}${totals.incentive.toFixed(2)}
                        </span>
                    </div>

                    {/* ── Contadores de tipo de movimiento (NUEVO) ─────────── */}
                    <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                    <div className="flex gap-4 flex-wrap items-center">
                        <div className="text-center">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                                Cruces <NewBadge />
                            </span>
                            <span className="font-mono text-lg text-blue-700 font-semibold">{totals.cruces}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                                Locales <NewBadge />
                            </span>
                            <span className="font-mono text-lg text-slate-600 font-semibold">{totals.locales}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                                PTT <NewBadge />
                            </span>
                            <span className="font-mono text-lg text-slate-400 font-semibold">{totals.ptt}</span>
                        </div>
                        {totals.conTabulador > 0 && (
                            <div className="text-center">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider flex items-center gap-1">
                                    Con tarifa BD <NewBadge />
                                </span>
                                <span className="font-mono text-lg text-emerald-600 font-semibold">{totals.conTabulador}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Neto y exportar */}
                <div className="text-right flex items-center gap-6">
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider text-right">Neto a Pagar</span>
                        <span className="font-mono text-2xl font-bold text-slate-900">${totals.total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => exportToExcel(trips, selectedWeek)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-slate-900/20"
                    >
                        Exportar Excel
                    </button>
                </div>
            </div>
        </div>
    )
}
