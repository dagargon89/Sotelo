const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8081' : '')

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`
}

export async function fetchRendimientos() {
  const res = await fetch(buildApiUrl('/api/catalogs/rendimientos'))
  if (!res.ok) throw new Error('No se pudo cargar catalogo de rendimientos')
  return res.json()
}

export async function fetchRutas(params = {}) {
  const query = new URLSearchParams(params).toString()
  const path = query ? `/api/catalogs/rutas?${query}` : '/api/catalogs/rutas'
  const res = await fetch(buildApiUrl(path))
  if (!res.ok) throw new Error('No se pudo cargar catalogo de rutas')
  return res.json()
}

export async function savePendingSession(token, trips, semanaNomina = null) {
  const res = await fetch(buildApiUrl('/api/sessions/save'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, trips, semana_nomina: semanaNomina }),
  })
  if (!res.ok) throw new Error('No se pudo guardar sesion pendiente')
  return res.json()
}

export async function loadPendingSession(token) {
  const res = await fetch(buildApiUrl(`/api/sessions/pending?token=${encodeURIComponent(token)}`))
  if (!res.ok) throw new Error('No se pudo consultar sesion pendiente')
  return res.json()
}

export async function restorePendingSession(token) {
  const res = await fetch(buildApiUrl('/api/sessions/restore'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) throw new Error('No se pudo marcar sesion como restaurada')
  return res.json()
}

async function adminRequest(path, options = {}) {
  const res = await fetch(buildApiUrl(`/api/admin/${path}`), {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (!res.ok) {
    let detail = `Error ${res.status}`
    try {
      const payload = await res.json()
      detail = payload?.detail || detail
    } catch {
      // Keep default detail if response body is not JSON.
    }
    throw new Error(detail)
  }

  return res.json()
}

export const adminApi = {
  listUnidades: (params = '') => adminRequest(`unidades${params ? `?${params}` : ''}`),
  createUnidad: (payload) => adminRequest('unidades', { method: 'POST', body: JSON.stringify(payload) }),
  updateUnidad: (id, payload) => adminRequest(`unidades/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteUnidad: (id) => adminRequest(`unidades/${id}`, { method: 'DELETE' }),

  listRutas: (params = '') => adminRequest(`rutas${params ? `?${params}` : ''}`),
  createRuta: (payload) => adminRequest('rutas', { method: 'POST', body: JSON.stringify(payload) }),
  updateRuta: (id, payload) => adminRequest(`rutas/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteRuta: (id) => adminRequest(`rutas/${id}`, { method: 'DELETE' }),

  listKeywords: (params = '') => adminRequest(`keywords${params ? `?${params}` : ''}`),
  createKeyword: (payload) => adminRequest('keywords', { method: 'POST', body: JSON.stringify(payload) }),
  updateKeyword: (id, payload) => adminRequest(`keywords/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteKeyword: (id) => adminRequest(`keywords/${id}`, { method: 'DELETE' }),

  listTabulador: (params = '') => adminRequest(`tabulador${params ? `?${params}` : ''}`),
  createTabulador: (payload) => adminRequest('tabulador', { method: 'POST', body: JSON.stringify(payload) }),
  updateTabulador: (id, payload) => adminRequest(`tabulador/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTabulador: (id) => adminRequest(`tabulador/${id}`, { method: 'DELETE' }),

  listAuditLogs: (params = '') => adminRequest(`audit-logs${params ? `?${params}` : ''}`),
  listLiquidaciones: (params = '') => adminRequest(`liquidaciones${params ? `?${params}` : ''}`),
}