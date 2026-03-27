import { useMemo } from 'react'

export default function DashboardKPIs({ trips }) {
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
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Nómina Total</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                    ${stats.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-green-600 mt-2 font-medium">
                    {trips.length} Viajes Procesados
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
