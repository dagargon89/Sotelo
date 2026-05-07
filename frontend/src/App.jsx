import { useEffect, useMemo, useState } from 'react'
import FileUpload from './components/FileUpload'
import TripList from './components/TripList'
import SummaryBar from './components/SummaryBar'
import PeriodSelector from './components/PeriodSelector'
import DashboardKPIs from './components/DashboardKPIs'
import AdminSection from './components/AdminSection'
import Sidebar from './components/Sidebar'
import { buildApiUrl, fetchRendimientos } from './api'

function App() {
  const isAdminView = window.location.pathname.startsWith('/admin')

  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [unitYields, setUnitYields] = useState({})
  const [defaultYield, setDefaultYield] = useState(2.37341)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [activeTab, setActiveTab] = useState('ALL') // 'ALL' | 'NEEDS_INPUT' | 'APPROVED'
  const [dieselPrice, setDieselPrice] = useState(24.50)
  const [driverFilter, setDriverFilter] = useState('')
  const [selectedDriver, setSelectedDriver] = useState(null)

  useEffect(() => {
    fetchRendimientos()
      .then(catalogData => {
        setUnitYields(catalogData.rendimientos || {})
        setDefaultYield(catalogData.default_yield || 2.37341)
      })
      .catch(err => console.warn('No se pudo cargar catalogos:', err))
      .finally(() => setCatalogLoading(false))
  }, [])

  // Derive available weeks from trips
  const availableWeeks = useMemo(() => [...new Set(trips.map(t => t.Payroll_Week || 0))].filter(w => w > 0), [trips])

  const handleFileUpload = async (file) => {
    setLoading(true)
    setSelectedWeek(null) // Reset selection on new upload
    setActiveTab('ALL')
    setDriverFilter('')
    setSelectedDriver(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(buildApiUrl('/api/upload'), {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (!data.trips || data.trips.length === 0) {
        alert(data.detail || "Advertencia: El backend devolvió 0 viajes. Asegúrese de que el archivo tenga datos válidos.");
        setLoading(false);
        return;
      }
      setTrips(data.trips)
    } catch (err) {
      alert("Error al subir el archivo: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculate = async (updatedTrips) => {
    const updatedIds = new Set(updatedTrips.map(t => t.id))
    const newTrips = trips.map(t => updatedIds.has(t.id) ? updatedTrips.find(ut => ut.id === t.id) : t)
    setTrips(newTrips)
  }

  const groupedTrips = useMemo(() => {
    const map = new Map()
    trips.filter(t => t.Payroll_Week === selectedWeek).forEach(t => {
      const d = t.Driver || 'Sin Nombre'
      if (!map.has(d)) map.set(d, [])
      map.get(d).push(t)
    })
    
    let entries = Array.from(map.entries())
    if (activeTab === 'NEEDS_INPUT') entries = entries.filter(([d, ts]) => ts.some(t => t.Status === 'NEEDS_INPUT'))
    if (activeTab === 'APPROVED') entries = entries.filter(([d, ts]) => ts.every(t => t.Status === 'APPROVED'))
    if (driverFilter) entries = entries.filter(([d]) => d.toLowerCase().includes(driverFilter.toLowerCase()))
    
    return entries.sort((a,b) => a[0].localeCompare(b[0]))
  }, [trips, selectedWeek, activeTab, driverFilter])

  // Get current driver's trips
  const currentDriverTrips = useMemo(() => {
    if (!selectedDriver) return []
    return trips.filter(t => t.Payroll_Week === selectedWeek && (t.Driver || 'Sin Nombre') === selectedDriver)
  }, [trips, selectedWeek, selectedDriver])

  if (isAdminView) {
    return <AdminSection />
  }

  return (
    <>
      {/* Topbar V2 */}
      <header className="topbar">
        <div className="topbar-wordmark">Dataholics<span className="text-blue-400">Nómina</span></div>
        <div className="topbar-sep"></div>
        <div className="topbar-tag">v2.0</div>
        <div className="topbar-spacer"></div>
        
        {selectedWeek && (
          <div className="week-pill" onClick={() => setSelectedWeek(null)} style={{ cursor: 'pointer' }}>
            <span className="week-pill-label">Semana {selectedWeek}</span>
            <span className="week-pill-change">Cambiar</span>
          </div>
        )}
        
        <div className="topbar-nav">
          <a href="/admin">Administración</a>
        </div>
      </header>

      {trips.length === 0 ? (
        <div className="fullscreen-center">
          <FileUpload onUpload={handleFileUpload} loading={loading} />
        </div>
      ) : !selectedWeek ? (
        <div className="fullscreen-center">
          <PeriodSelector weeks={availableWeeks} onSelect={setSelectedWeek} />
        </div>
      ) : (
        <div className="app-shell">
          <Sidebar 
            grouped={groupedTrips}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={driverFilter}
            onSearchChange={setDriverFilter}
            selectedWeek={selectedWeek}
          />

          <div className="detail-panel">
            {!selectedDriver ? (
              <div className="empty-detail">
                <div className="ed-icon">👋</div>
                <div className="ed-title">Selecciona un conductor</div>
                <div className="ed-sub">Elige un conductor del panel lateral para revisar o capturar sus boletas.</div>
              </div>
            ) : (
              <>
                <DashboardKPIs
                  trips={currentDriverTrips}
                  dieselPrice={dieselPrice}
                  onDieselPriceChange={setDieselPrice}
                />
                <TripList
                  driverName={selectedDriver}
                  trips={currentDriverTrips}
                  onUpdate={handleRecalculate}
                  dieselPrice={dieselPrice}
                  unitYields={unitYields}
                  defaultYield={defaultYield}
                />
              </>
            )}
          </div>
        </div>
      )}

      {catalogLoading && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow z-50">
          Cargando catalogos...
        </div>
      )}

      {selectedWeek && trips.length > 0 && (
        <SummaryBar
          trips={trips.filter(t => t.Payroll_Week === selectedWeek)}
          selectedWeek={selectedWeek}
        />
      )}
    </>
  )
}

export default App
