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