import { useMemo } from 'react'

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Main KPI: Total Payroll */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Nómina Total</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                        ${stats.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-green-600 mt-2 font-medium">
                        {trips.length} Viajes Procesados
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-tight mb-1">
                        Precio Diesel ($/L)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={dieselPrice || ''}
                        onChange={(e) => onDieselPriceChange(e.target.value)}
                        placeholder="Ej. 24.50"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 italic">Este valor se aplicará a todos los cálculos.</p>
                </div>
            </div>

            {/* Exception: Data Errors */}
            <div className={`p-4 rounded-xl shadow-sm border ${stats.dataErrorCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className={`text-sm uppercase tracking-wider font-semibold ${stats.dataErrorCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                    Aclaraciones de Datos
                </div>
                <div className={`text-2xl font-bold mt-1 ${stats.dataErrorCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                    {stats.dataErrorCount}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                    Viajes con 0 Kms
                </div>
            </div>
        </div>

    )
}

