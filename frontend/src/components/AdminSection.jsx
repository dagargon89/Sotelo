import { useEffect, useMemo, useState } from 'react'
import { adminApi, uploadTabulador, activateTabuladorVersion, listTabuladorVersiones } from '../api'
import { SHOW_NEW_BADGES } from '../constants'

// Badge visual temporal
const NewBadge = () => SHOW_NEW_BADGES ? (
  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-md ml-1 select-none">
    ✦ nuevo
  </span>
) : null

const TABS = ['unidades', 'rutas', 'keywords', 'tabulador', 'audit', 'liquidaciones']

/**
 * Componente de tabla responsiva con búsqueda, paginación y ordenamiento.
 */
function AdminDataTable({ rows, loading, tab, onToggleActive, onDelete, onEdit }) {
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null) // { row } or null
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // ── Filtrado ─────────────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!search) return rows
    const lowSearch = search.toLowerCase()
    return rows.filter(row => 
      Object.values(row).some(val => 
        String(val ?? '').toLowerCase().includes(lowSearch)
      )
    )
  }, [rows, search])

  // ── Ordenamiento ─────────────────────────────────────────────────────────
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const sortedRows = useMemo(() => {
    let sortableItems = [...filteredRows]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key]
        const valB = b[sortConfig.key]
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [filteredRows, sortConfig])

  // ── Paginación ───────────────────────────────────────────────────────────
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage)
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedRows.slice(start, start + itemsPerPage)
  }, [sortedRows, currentPage])

  useEffect(() => setCurrentPage(1), [search, tab])

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse text-slate-400 font-medium italic">
        Sincronizando base de datos...
      </div>
    )
  }

  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  const hasActions = ['unidades', 'rutas', 'keywords', 'tabulador'].includes(tab)

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda y resumen */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="relative flex-1 min-w-[280px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <i className="fas fa-search text-xs"></i>
          </span>
          <input
            type="text"
            placeholder={`Buscar en ${filteredRows.length} registros...`}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
          <span className="bg-slate-200 px-2 py-1 rounded text-slate-700">{filteredRows.length}</span> resultados totales
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-200 border-b border-slate-800">
              {columns.map((key) => (
                <th 
                  key={key} 
                  className="px-4 py-3 font-semibold uppercase tracking-wider text-[10px] cursor-pointer hover:bg-slate-800 transition-colors group"
                  onClick={() => requestSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {key.replace(/_/g, ' ')}
                    {sortConfig.key === key ? (
                      <i className={`fas fa-sort-amount-${sortConfig.direction === 'asc' ? 'up' : 'down'} text-blue-400`}></i>
                    ) : (
                      <i className="fas fa-sort text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 font-semibold uppercase tracking-wider text-[10px] text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={99} className="py-12 text-center text-slate-400 italic">
                  No se encontraron resultados para "{search}"
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-blue-50/30 transition-colors group">
                  {columns.map((key) => (
                    <td key={key} className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {key === 'is_active' ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${Number(row[key]) === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {Number(row[key]) === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      ) : key === 'pago_operador' || key === 'pago' ? (
                        <span className="font-mono font-semibold text-slate-900">${Number(row[key]).toFixed(2)}</span>
                      ) : (
                        String(row[key] ?? '')
                      )}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      {confirmDelete?.row?.id === row.id ? (
                        <div className="flex justify-end items-center gap-1">
                          <span className="text-xs text-red-600 font-semibold mr-1">¿Confirmar?</span>
                          <button
                            onClick={() => { onDelete(row); setConfirmDelete(null) }}
                            className="px-2 py-1 rounded text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Sí, borrar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 rounded text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end items-center gap-1">
                          {'is_active' in row && (
                            <button
                              onClick={() => onToggleActive(row)}
                              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                                Number(row.is_active) === 1
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              }`}
                            >
                              {Number(row.is_active) === 1 ? 'Desactivar' : 'Activar'}
                            </button>
                          )}
                          <button
                            onClick={() => onEdit(row)}
                            className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ row })}
                            className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            Borrar
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-slate-500 italic">
            Mostrando {Math.min(filteredRows.length, itemsPerPage)} de {filteredRows.length} registros
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors text-slate-600"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <span className="px-4 py-1 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg border border-slate-200">
              Pagina {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors text-slate-600"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminSection() {
  const [tab, setTab] = useState('unidades')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [unidadForm, setUnidadForm] = useState({ tractor: '', yield_km_l: '' })
  const [rutaForm, setRutaForm] = useState({ origen_normalizado: '', destino_normalizado: '', distancia_km: '', region: 'GENERAL' })
  const [keyword, setKeyword] = useState('')
  const [tabuladorForm, setTabuladorForm] = useState({ tipo: '', cruce: '', origen: '', destino: '', pago_operador: '', version: 1, prioridad: 0 })

  // ── Estado para carga CSV y versiones del tabulador ─────────────────────
  const [tabVersiones, setTabVersiones] = useState([])
  const [tabUploadFile, setTabUploadFile] = useState(null)
  const [tabUploadResult, setTabUploadResult] = useState(null)
  const [tabUploadLoading, setTabUploadLoading] = useState(false)
  const [tabActivating, setTabActivating] = useState(false)

  const tabTitle = useMemo(() => {
    switch (tab) {
      case 'unidades': return 'Unidades Rendimiento'
      case 'rutas': return 'Rutas Distancias'
      case 'keywords': return 'Keywords Pacifico'
      case 'tabulador': return 'Tabulador Tarifas'
      case 'audit': return 'Audit Logs'
      case 'liquidaciones': return 'Liquidaciones Temporales'
      default: return 'Administracion'
    }
  }, [tab])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      let result
      if (tab === 'unidades') result = await adminApi.listUnidades('')
      if (tab === 'rutas') result = await adminApi.listRutas('')
      if (tab === 'keywords') result = await adminApi.listKeywords('')
      if (tab === 'tabulador') {
        result = await adminApi.listTabulador('include_inactive=1')
        // Cargar versiones disponibles en paralelo
        const ver = await listTabuladorVersiones()
        setTabVersiones(ver.versiones ?? [])
      }
      if (tab === 'audit') result = await adminApi.listAuditLogs('limit=200')
      if (tab === 'liquidaciones') result = await adminApi.listLiquidaciones('limit=200')
      setRows(result?.data || [])
    } catch (err) {
      setError(err.message)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tab])

  const handleCreateUnidad = async (e) => {
    e.preventDefault()
    await adminApi.createUnidad({ tractor: unidadForm.tractor, yield_km_l: Number(unidadForm.yield_km_l), is_active: 1 })
    setUnidadForm({ tractor: '', yield_km_l: '' })
    await loadData()
  }

  const handleCreateRuta = async (e) => {
    e.preventDefault()
    await adminApi.createRuta({
      ...rutaForm,
      distancia_km: Number(rutaForm.distancia_km),
      is_active: 1,
    })
    setRutaForm({ origen_normalizado: '', destino_normalizado: '', distancia_km: '', region: 'GENERAL' })
    await loadData()
  }

  const handleCreateKeyword = async (e) => {
    e.preventDefault()
    await adminApi.createKeyword({ keyword, is_active: 1 })
    setKeyword('')
    await loadData()
  }

  const handleCreateTabulador = async (e) => {
    e.preventDefault()
    await adminApi.createTabulador({
      ...tabuladorForm,
      pago_operador: Number(tabuladorForm.pago_operador),
      version: Number(tabuladorForm.version),
      prioridad: Number(tabuladorForm.prioridad),
      is_active: 1,
    })
    setTabuladorForm({ tipo: '', cruce: '', origen: '', destino: '', pago_operador: '', version: 1, prioridad: 0 })
    await loadData()
  }

  // ── Upload CSV del tabulador ─────────────────────────────────────────────
  const handleUploadTabulador = async (e) => {
    e.preventDefault()
    if (!tabUploadFile) return
    setTabUploadLoading(true)
    setTabUploadResult(null)
    try {
      const result = await uploadTabulador(tabUploadFile)
      setTabUploadResult({ ok: true, ...result })
      setTabUploadFile(null)
      await loadData()
    } catch (err) {
      setTabUploadResult({ ok: false, mensaje: err.message })
    } finally {
      setTabUploadLoading(false)
    }
  }

  // ── Activar versión del tabulador ────────────────────────────────────────
  const handleActivarVersion = async (version) => {
    if (!window.confirm(`¿Activar versión v${version}? Las demás versiones quedarán inactivas.`)) return
    setTabActivating(true)
    try {
      await activateTabuladorVersion(version)
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setTabActivating(false)
    }
  }

  const handleToggleActive = async (row) => {
    const nextActive = Number(row.is_active) === 1 ? 0 : 1

    if (tab === 'unidades') await adminApi.updateUnidad(row.id, { is_active: nextActive })
    if (tab === 'rutas') await adminApi.updateRuta(row.id, { is_active: nextActive })
    if (tab === 'keywords') await adminApi.updateKeyword(row.id, { is_active: nextActive })
    if (tab === 'tabulador') await adminApi.updateTabulador(row.id, { is_active: nextActive })

    await loadData()
  }

  const handleDelete = async (row) => {
    try {
      if (tab === 'unidades') await adminApi.deleteUnidad(row.id)
      if (tab === 'rutas') await adminApi.deleteRuta(row.id)
      if (tab === 'keywords') await adminApi.deleteKeyword(row.id)
      if (tab === 'tabulador') await adminApi.deleteTabulador(row.id)
      await loadData()
    } catch (err) {
      setError(`Error al borrar: ${err.message}`)
    }
  }

  const handleEdit = async (row) => {
    const current = { ...row }
    delete current.created_at
    delete current.updated_at

    const input = window.prompt('Editar JSON del registro', JSON.stringify(current, null, 2))
    if (!input) return

    let payload
    try {
      payload = JSON.parse(input)
    } catch {
      window.alert('JSON invalido')
      return
    }

    if (tab === 'unidades') await adminApi.updateUnidad(row.id, payload)
    if (tab === 'rutas') await adminApi.updateRuta(row.id, payload)
    if (tab === 'keywords') await adminApi.updateKeyword(row.id, payload)
    if (tab === 'tabulador') await adminApi.updateTabulador(row.id, payload)

    await loadData()
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Seccion Administrativa</h2>
        <a href="/" className="text-sm text-blue-700 hover:underline">Volver al modulo operativo</a>
      </div>

      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex flex-wrap gap-1">
        {TABS.map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === name 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-[1.02]' 
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100 space-y-8 min-h-[600px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{tabTitle}</h3>
            <p className="text-sm text-slate-400 mt-1">Gestión avanzada de bases de datos operativas</p>
          </div>
          <button 
            onClick={loadData} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-bold transition-all border border-blue-100"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            Sincronizar
          </button>
        </div>

        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

        {tab === 'unidades' && (
          <form onSubmit={handleCreateUnidad} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tractor</label>
              <input value={unidadForm.tractor} onChange={(e) => setUnidadForm({ ...unidadForm, tractor: e.target.value })} placeholder="Ej: F-123" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Rendimiento (km/L)</label>
              <input value={unidadForm.yield_km_l} onChange={(e) => setUnidadForm({ ...unidadForm, yield_km_l: e.target.value })} type="number" step="0.00001" min="0.00001" placeholder="Ej: 2.5" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              <i className="fas fa-plus mr-2"></i> Registrar Unidad
            </button>
          </form>
        )}

        {tab === 'rutas' && (
          <form onSubmit={handleCreateRuta} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Origen</label>
              <input value={rutaForm.origen_normalizado} onChange={(e) => setRutaForm({ ...rutaForm, origen_normalizado: e.target.value })} placeholder="Ciudad Origen" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Destino</label>
              <input value={rutaForm.destino_normalizado} onChange={(e) => setRutaForm({ ...rutaForm, destino_normalizado: e.target.value })} placeholder="Ciudad Destino" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">KM</label>
              <input value={rutaForm.distancia_km} onChange={(e) => setRutaForm({ ...rutaForm, distancia_km: e.target.value })} type="number" step="0.1" min="0.1" placeholder="Distancia" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Región</label>
              <select value={rutaForm.region} onChange={(e) => setRutaForm({ ...rutaForm, region: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                <option value="GENERAL">GENERAL</option>
                <option value="PACIFICO">PACIFICO</option>
                <option value="CLIENTE">CLIENTE</option>
              </select>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              <i className="fas fa-plus mr-2"></i> Guardar Ruta
            </button>
          </form>
        )}

        {tab === 'keywords' && (
          <form onSubmit={handleCreateKeyword} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nueva Palabra Clave</label>
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Ej: PACIFICO" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
              <i className="fas fa-plus mr-2"></i> Añadir
            </button>
          </form>
        )}

        {tab === 'tabulador' && (
          <div className="space-y-4">
            {/* Carga masiva CSV — NUEVO */}
            <div className="border rounded-lg p-4 bg-amber-50/40 border-amber-200">
              <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center">
                Cargar tabulador desde CSV <NewBadge />
              </h4>
              <form onSubmit={handleUploadTabulador} className="flex flex-wrap gap-2 items-end">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Archivo CSV (columnas: tipo, cruce, origen, destino, pago_operador, prioridad)</label>
                  <input
                    type="file" accept=".csv"
                    onChange={e => { setTabUploadFile(e.target.files[0]); setTabUploadResult(null) }}
                    className="block text-sm text-gray-700"
                  />
                </div>
                <button
                  disabled={!tabUploadFile || tabUploadLoading}
                  className="px-4 py-2 rounded bg-amber-600 text-white text-sm disabled:opacity-50"
                >
                  {tabUploadLoading ? 'Cargando...' : 'Subir CSV'}
                </button>
              </form>
              {tabUploadResult && (
                <div className={`mt-3 p-3 rounded text-sm ${tabUploadResult.ok ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                  <p className="font-medium">{tabUploadResult.mensaje || (tabUploadResult.ok ? 'Carga exitosa' : 'Error en carga')}</p>
                  {tabUploadResult.ok && (
                    <p className="text-xs mt-1">Filas OK: {tabUploadResult.filas_ok} | Rechazadas: {tabUploadResult.filas_rechazadas}</p>
                  )}
                  {tabUploadResult.errores?.length > 0 && (
                    <ul className="text-xs mt-2 list-disc ml-4">
                      {tabUploadResult.errores.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                      {tabUploadResult.errores.length > 5 && <li>...y {tabUploadResult.errores.length - 5} más</li>}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Panel de versiones disponibles — NUEVO */}
            {tabVersiones.length > 0 && (
              <div className="border rounded-lg p-4 border-slate-200">
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center">
                  Versiones del tabulador <NewBadge />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tabVersiones.map(v => (
                    <div key={v.version} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                      Number(v.activa) === 1
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <span className="font-mono font-semibold">v{v.version}</span>
                      <span className="text-xs text-slate-400">{v.total} tarifas</span>
                      {Number(v.activa) === 1
                        ? <span className="text-[10px] font-bold text-emerald-600 uppercase">activa</span>
                        : (
                          <button
                            onClick={() => handleActivarVersion(v.version)}
                            disabled={tabActivating}
                            className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          >
                            Activar
                          </button>
                        )
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulario individual */}
            <form onSubmit={handleCreateTabulador} className="bg-white p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-inner">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tipo Mov</label>
                <input value={tabuladorForm.tipo} onChange={(e) => setTabuladorForm({ ...tabuladorForm, tipo: e.target.value })} placeholder="Ej: EXP-02" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Cruce</label>
                <input value={tabuladorForm.cruce} onChange={(e) => setTabuladorForm({ ...tabuladorForm, cruce: e.target.value })} placeholder="Opcional" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Origen</label>
                <input value={tabuladorForm.origen} onChange={(e) => setTabuladorForm({ ...tabuladorForm, origen: e.target.value })} placeholder="Opcional" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Destino</label>
                <input value={tabuladorForm.destino} onChange={(e) => setTabuladorForm({ ...tabuladorForm, destino: e.target.value })} placeholder="Opcional" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Pago Operador</label>
                <input value={tabuladorForm.pago_operador} onChange={(e) => setTabuladorForm({ ...tabuladorForm, pago_operador: e.target.value })} type="number" min="0" step="0.01" placeholder="0.00" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Versión</label>
                <input value={tabuladorForm.version} onChange={(e) => setTabuladorForm({ ...tabuladorForm, version: e.target.value })} type="number" min="1" step="1" placeholder="1" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Prioridad</label>
                <input value={tabuladorForm.prioridad} onChange={(e) => setTabuladorForm({ ...tabuladorForm, prioridad: e.target.value })} type="number" step="1" placeholder="0" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <button className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10">
                <i className="fas fa-plus mr-2"></i> Crear Tarifa
              </button>
            </form>
          </div>
        )}

        <AdminDataTable
          rows={rows}
          loading={loading}
          tab={tab}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </section>
    </div>
  )
}

export default AdminSection
