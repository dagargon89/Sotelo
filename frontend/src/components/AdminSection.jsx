import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../api'

const TABS = ['unidades', 'rutas', 'keywords', 'tabulador', 'audit', 'liquidaciones']

function AdminSection() {
  const [tab, setTab] = useState('unidades')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [unidadForm, setUnidadForm] = useState({ tractor: '', yield_km_l: '' })
  const [rutaForm, setRutaForm] = useState({ origen_normalizado: '', destino_normalizado: '', distancia_km: '', region: 'GENERAL' })
  const [keyword, setKeyword] = useState('')
  const [tabuladorForm, setTabuladorForm] = useState({ tipo: '', cruce: '', origen: '', destino: '', pago_operador: '', version: 1, prioridad: 0 })

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
      if (tab === 'unidades') result = await adminApi.listUnidades('include_inactive=1')
      if (tab === 'rutas') result = await adminApi.listRutas('include_inactive=1')
      if (tab === 'keywords') result = await adminApi.listKeywords('include_inactive=1')
      if (tab === 'tabulador') result = await adminApi.listTabulador('include_inactive=1')
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

  const handleToggleActive = async (row) => {
    const nextActive = Number(row.is_active) === 1 ? 0 : 1

    if (tab === 'unidades') await adminApi.updateUnidad(row.id, { is_active: nextActive })
    if (tab === 'rutas') await adminApi.updateRuta(row.id, { is_active: nextActive })
    if (tab === 'keywords') await adminApi.updateKeyword(row.id, { is_active: nextActive })
    if (tab === 'tabulador') await adminApi.updateTabulador(row.id, { is_active: nextActive })

    await loadData()
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Desactivar registro #${row.id}?`)) return

    if (tab === 'unidades') await adminApi.deleteUnidad(row.id)
    if (tab === 'rutas') await adminApi.deleteRuta(row.id)
    if (tab === 'keywords') await adminApi.deleteKeyword(row.id)
    if (tab === 'tabulador') await adminApi.deleteTabulador(row.id)

    await loadData()
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

      <div className="bg-white rounded-xl p-2 shadow flex flex-wrap gap-2">
        {TABS.map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${tab === name ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {name}
          </button>
        ))}
      </div>

      <section className="bg-white rounded-xl p-5 shadow space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-lg font-semibold">{tabTitle}</h3>
          <button onClick={loadData} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">Recargar</button>
        </div>

        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

        {tab === 'unidades' && (
          <form onSubmit={handleCreateUnidad} className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input value={unidadForm.tractor} onChange={(e) => setUnidadForm({ ...unidadForm, tractor: e.target.value })} placeholder="Tractor (F-XXX)" className="border rounded px-3 py-2" required />
            <input value={unidadForm.yield_km_l} onChange={(e) => setUnidadForm({ ...unidadForm, yield_km_l: e.target.value })} type="number" step="0.00001" min="0.00001" placeholder="Yield km/L" className="border rounded px-3 py-2" required />
            <button className="px-3 py-2 rounded bg-emerald-600 text-white">Crear</button>
          </form>
        )}

        {tab === 'rutas' && (
          <form onSubmit={handleCreateRuta} className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input value={rutaForm.origen_normalizado} onChange={(e) => setRutaForm({ ...rutaForm, origen_normalizado: e.target.value })} placeholder="Origen" className="border rounded px-3 py-2" required />
            <input value={rutaForm.destino_normalizado} onChange={(e) => setRutaForm({ ...rutaForm, destino_normalizado: e.target.value })} placeholder="Destino" className="border rounded px-3 py-2" required />
            <input value={rutaForm.distancia_km} onChange={(e) => setRutaForm({ ...rutaForm, distancia_km: e.target.value })} type="number" step="0.1" min="0.1" placeholder="Distancia" className="border rounded px-3 py-2" required />
            <select value={rutaForm.region} onChange={(e) => setRutaForm({ ...rutaForm, region: e.target.value })} className="border rounded px-3 py-2">
              <option value="GENERAL">GENERAL</option>
              <option value="PACIFICO">PACIFICO</option>
              <option value="CLIENTE">CLIENTE</option>
            </select>
            <button className="px-3 py-2 rounded bg-emerald-600 text-white">Crear</button>
          </form>
        )}

        {tab === 'keywords' && (
          <form onSubmit={handleCreateKeyword} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword" className="border rounded px-3 py-2" required />
            <button className="px-3 py-2 rounded bg-emerald-600 text-white">Crear</button>
          </form>
        )}

        {tab === 'tabulador' && (
          <form onSubmit={handleCreateTabulador} className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input value={tabuladorForm.tipo} onChange={(e) => setTabuladorForm({ ...tabuladorForm, tipo: e.target.value })} placeholder="Tipo" className="border rounded px-3 py-2" required />
            <input value={tabuladorForm.cruce} onChange={(e) => setTabuladorForm({ ...tabuladorForm, cruce: e.target.value })} placeholder="Cruce" className="border rounded px-3 py-2" />
            <input value={tabuladorForm.origen} onChange={(e) => setTabuladorForm({ ...tabuladorForm, origen: e.target.value })} placeholder="Origen" className="border rounded px-3 py-2" />
            <input value={tabuladorForm.destino} onChange={(e) => setTabuladorForm({ ...tabuladorForm, destino: e.target.value })} placeholder="Destino" className="border rounded px-3 py-2" />
            <input value={tabuladorForm.pago_operador} onChange={(e) => setTabuladorForm({ ...tabuladorForm, pago_operador: e.target.value })} type="number" min="0" step="0.01" placeholder="Pago" className="border rounded px-3 py-2" required />
            <input value={tabuladorForm.version} onChange={(e) => setTabuladorForm({ ...tabuladorForm, version: e.target.value })} type="number" min="1" step="1" placeholder="Version" className="border rounded px-3 py-2" />
            <input value={tabuladorForm.prioridad} onChange={(e) => setTabuladorForm({ ...tabuladorForm, prioridad: e.target.value })} type="number" step="1" placeholder="Prioridad" className="border rounded px-3 py-2" />
            <button className="px-3 py-2 rounded bg-emerald-600 text-white">Crear</button>
          </form>
        )}

        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {rows.length > 0 && Object.keys(rows[0]).map((key) => <th key={key} className="text-left px-3 py-2 whitespace-nowrap">{key}</th>)}
                {['unidades', 'rutas', 'keywords', 'tabulador'].includes(tab) && <th className="text-left px-3 py-2">acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-3" colSpan={99}>Cargando...</td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="px-3 py-3" colSpan={99}>Sin datos</td>
                </tr>
              )}
              {!loading && rows.map((row) => (
                <tr key={row.id || JSON.stringify(row)} className="border-t">
                  {Object.keys(row).map((key) => (
                    <td key={key} className="px-3 py-2 whitespace-nowrap">{String(row[key] ?? '')}</td>
                  ))}
                  {['unidades', 'rutas', 'keywords', 'tabulador'].includes(tab) && (
                    <td className="px-3 py-2 whitespace-nowrap space-x-2">
                      {'is_active' in row && (
                        <button
                          onClick={() => handleToggleActive(row)}
                          className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800"
                        >
                          {Number(row.is_active) === 1 ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                      <button onClick={() => handleEdit(row)} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">Editar</button>
                      <button onClick={() => handleDelete(row)} className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Borrar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default AdminSection
