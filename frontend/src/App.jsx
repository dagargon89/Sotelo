import { useEffect, useMemo, useState } from 'react'
import FileUpload from './components/FileUpload'
import TripList from './components/TripList'
import SummaryBar from './components/SummaryBar'
import PeriodSelector from './components/PeriodSelector'
import DashboardKPIs from './components/DashboardKPIs'
import AdminSection from './components/AdminSection'
import { buildApiUrl, fetchRendimientos, loadPendingSession, restorePendingSession, savePendingSession } from './api'

function App() {
  const isAdminView = window.location.pathname.startsWith('/admin')

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [unitYields, setUnitYields] = useState({})
  const [defaultYield, setDefaultYield] = useState(2.37341)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [activeTab, setActiveTab] = useState('NEEDS_INPUT') // 'NEEDS_INPUT' | 'PENDING' | 'APPROVED'
  const [dieselPrice, setDieselPrice] = useState(24.50)
  const [driverFilter, setDriverFilter] = useState('')
  const [sessionToken] = useState(() => {
    const key = 'sotelo_session_token'
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const generated = `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
    localStorage.setItem(key, generated)
    return generated
  })

  useEffect(() => {
    const init = async () => {
      try {
        const [catalogData, sessionData] = await Promise.all([
          fetchRendimientos(),
          loadPendingSession(sessionToken),
        ])

        setUnitYields(catalogData.rendimientos || {})
        setDefaultYield(catalogData.default_yield || 2.37341)

        if (sessionData?.session?.datos_boleta_json) {
          const parsed = JSON.parse(sessionData.session.datos_boleta_json)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTrips(parsed)
            await restorePendingSession(sessionToken)
          }
        }
      } catch (err) {
        console.warn('No se pudo inicializar catalogos/sesion:', err)
      } finally {
        setCatalogLoading(false)
      }
    }

    init()
  }, [sessionToken])

  // Derive available weeks with date ranges from trips
  const availableWeeks = useMemo(() => {
    const weekMap = new Map()
    trips.forEach(t => {
      const w = t.Payroll_Week || 0
      if (w <= 0) return
      if (!weekMap.has(w)) weekMap.set(w, { week: w, dates: [] })
      if (t.Start_Date) weekMap.get(w).dates.push(t.Start_Date)
    })
    return Array.from(weekMap.values()).map(({ week, dates }) => {
      if (dates.length === 0) return { week, label: null }
      const parsed = dates.map(d => new Date(d.replace(' ', 'T'))).filter(d => !isNaN(d))
      if (parsed.length === 0) return { week, label: null }
      const min = new Date(Math.min(...parsed))
      const max = new Date(Math.max(...parsed))
      const fmt = (d) => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
      const label = min.toDateString() === max.toDateString() ? fmt(min) : `${fmt(min)} – ${fmt(max)}`
      return { week, label }
    })
  }, [trips])

  // Derive selected week info (for header label)
  const selectedWeekInfo = useMemo(() => availableWeeks.find(w => w.week === selectedWeek) || null, [availableWeeks, selectedWeek])

  // Derive unique driver names for the current week
  const availableDrivers = useMemo(() => [...new Set(
    trips.filter(t => t.Payroll_Week === selectedWeek).map(t => t.Driver).filter(Boolean)
  )].sort(), [trips, selectedWeek])

  // Filter trips based on selection
  const visibleTrips = useMemo(() => selectedWeek
    ? (selectedWeek === 'ALL' ? trips : trips.filter(t => {
      const matchWeek = t.Payroll_Week === selectedWeek

      // Filtro por Estado (Sincronizado)
      let matchStatus = true
      if (activeTab === 'NEEDS_INPUT') matchStatus = t.Status === 'NEEDS_INPUT'
      if (activeTab === 'PENDING') matchStatus = t.Status === 'PENDING'
      if (activeTab === 'APPROVED') matchStatus = t.Status === 'APPROVED'
      // Si activeTab === 'ALL', no filtramos (se muestran todos)

      const matchDriver = !driverFilter || (t.Driver || '').toLowerCase().includes(driverFilter.toLowerCase())

      return matchWeek && matchStatus && matchDriver
    }))
    : [], [trips, selectedWeek, activeTab, driverFilter])

  const handleFileUpload = async (file) => {
    setLoading(true)
    setSelectedWeek(null) // Reset selection on new upload
    setActiveTab('NEEDS_INPUT')
    setDriverFilter('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(buildApiUrl('/api/upload'), {
        method: 'POST',
        headers: { 'X-Session-Token': sessionToken },
        body: formData
      })
      const data = await res.json()
      // console.log("DEBUG: API Response:", data)
      if (!data.trips || data.trips.length === 0) {
        alert(data.detail || "Advertencia: El backend devolvió 0 viajes. Asegúrese de que el archivo tenga datos válidos.");
        setLoading(false);
        return;
      }
      setTrips(data.trips)
      const semanaNomina = data?.trips?.[0]?.Payroll_Week || null
      await savePendingSession(sessionToken, data.trips, semanaNomina)
    } catch (err) {
      alert("Error al subir el archivo: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async (updatedTrips) => {
    // Optimistic update
    // If a trip changed status, it might disappear from current view - handle gracefully
    // Merge updated trips into main state
    const updatedIds = new Set(updatedTrips.map(t => t.id))
    const newTrips = trips.map(t => updatedIds.has(t.id) ? updatedTrips.find(ut => ut.id === t.id) : t)
    setTrips(newTrips)
  }

  if (isAdminView) {
    return <AdminSection />
  }

  return (
    <div className="min-h-screen text-gray-900 font-sans antialiased">
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Dataholics <span className="text-blue-400">Nómina</span></h1>
          <div className="text-xs text-slate-400">
            <a href="/admin" className="mr-3 text-blue-300 hover:text-blue-100 underline">Administracion</a>
            v1.1 (Control Financiero)
            {selectedWeek && (
                <span className="ml-2 bg-blue-900 px-2 py-1 rounded text-blue-200">
                  Semana {selectedWeek}
                  {selectedWeekInfo?.label && <span className="ml-1.5 opacity-70 text-xs">{selectedWeekInfo.label}</span>}
                </span>
              )}
            {selectedWeek && (
              <button onClick={() => setSelectedWeek(null)} className="ml-2 hover:text-white underline">
                Cambiar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 pb-32">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <FileUpload onUpload={handleFileUpload} loading={loading} />
          </div>
        ) : !selectedWeek ? (
          <PeriodSelector weeks={availableWeeks} onSelect={setSelectedWeek} />
        ) : (
          <>
            <DashboardKPIs
              trips={trips.filter(t => t.Payroll_Week === selectedWeek)}
              dieselPrice={dieselPrice}
              onDieselPriceChange={setDieselPrice}
              onFilterToErrors={() => { setActiveTab('NEEDS_INPUT'); setDriverFilter('') }}
            />

            {/* Status Tabs + Filtro conductor */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
                <button
                  onClick={() => { setActiveTab('NEEDS_INPUT'); setDriverFilter('') }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'NEEDS_INPUT' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Requiere Captura ({trips.filter(t => t.Payroll_Week === selectedWeek && t.Status === 'NEEDS_INPUT').length})
                </button>
                <button
                  onClick={() => { setActiveTab('PENDING'); setDriverFilter('') }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'PENDING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Pendiente ({trips.filter(t => t.Payroll_Week === selectedWeek && t.Status === 'PENDING').length})
                </button>
                <button
                  onClick={() => { setActiveTab('APPROVED'); setDriverFilter('') }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'APPROVED' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Aprobado ({trips.filter(t => t.Payroll_Week === selectedWeek && t.Status === 'APPROVED').length})
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">🔍</span>
                <input
                  type="text"
                  list="drivers-list"
                  value={driverFilter}
                  onChange={e => setDriverFilter(e.target.value)}
                  placeholder="Conductor..."
                  className="pl-7 pr-6 py-2 text-sm border border-gray-300 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <datalist id="drivers-list">
                  {availableDrivers.map(d => <option key={d} value={d} />)}
                </datalist>
                {driverFilter && (
                  <button onClick={() => setDriverFilter('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none">×</button>
                )}
              </div>
            </div>

            <TripList
              trips={visibleTrips}
              onUpdate={handleRecalculate}
              dieselPrice={dieselPrice}
              unitYields={unitYields}
              defaultYield={defaultYield}
              onFilterChange={setActiveTab} // Sincronizamos el Header nuevo con el estado de App
              onSearchChange={setDriverFilter}
            />
          </>
        )}
      </main>

      {catalogLoading && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow">
          Cargando catalogos...
        </div>
      )}

      {selectedWeek && visibleTrips.length > 0 && (
        <SummaryBar
          trips={visibleTrips}
          selectedWeek={selectedWeek}
        />
      )}
    </div >
  )
}

export default App
