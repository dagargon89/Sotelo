export default function PeriodSelector({ weeks, onSelect }) {
    // weeks is [{ week: number, label: string|null }]
    // Sort descending (newest first)
    const sortedWeeks = [...weeks].sort((a, b) => b.week - a.week)

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Seleccionar Periodo de Nómina</h2>
                    <p className="text-slate-500 mt-2">¿Qué semana está procesando hoy?</p>
                </div>

                <div className="space-y-4">
                    {sortedWeeks.map(item => (
                        <button
                            key={item.week}
                            onClick={() => onSelect(item.week)}
                            className="w-full group relative flex items-center justify-between p-4 rounded-lg border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {item.week}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-slate-900">Semana {item.week}</div>
                                    <div className="text-xs text-slate-500">{item.label || 'Ciclo de Nómina 2026'}</div>
                                </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-blue-500 flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => onSelect('ALL')}
                        className="text-sm text-slate-400 hover:text-slate-600 underline"
                    >
                        Mostrar Todos los Datos (No Recomendado)
                    </button>
                </div>
            </div>
        </div>
    )
}
