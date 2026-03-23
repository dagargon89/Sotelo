export default function SummaryBar({ trips }) {
    // Aggregate
    const totals = trips.reduce((acc, trip) => {
        const incentive = trip.Calculated_Incentive ?? trip.Incentive_Pay ?? 0
        const total = trip.Calculated_Total ?? trip.Total_Pay ?? trip.Base_Pay

        acc.base += trip.Base_Pay
        acc.incentive += incentive
        acc.total += total
        return acc
    }, { base: 0, incentive: 0, total: 0 })

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-8">
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Base</span>
                        <span className="font-mono text-lg text-slate-600">${totals.base.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider">Total Incentive</span>
                        <span className={`font-mono text-lg ${totals.incentive >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {totals.incentive >= 0 ? '+' : ''}${totals.incentive.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="text-right flex items-center gap-6">
                    <div>
                        <span className="text-xs text-slate-400 block uppercase tracking-wider text-right">Net Payable</span>
                        <span className="font-mono text-2xl font-bold text-slate-900">${totals.total.toFixed(2)}</span>
                    </div>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-slate-900/20">
                        Export Excel
                    </button>
                </div>
            </div>
        </div>
    )
}
