import { useState, useEffect } from 'react'
import axios from 'axios'

const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { Authorization: `Bearer ${token}` }
})

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [page, setPage] = useState('dashboard')

  useEffect(() => {
    api.get('/api/items').then(r => setItems(r.data))
    api.get('/api/categories').then(r => setCategories(r.data))
    api.get('/api/users').then(r => setUsers(r.data))
  }, [])

  const critici = items.filter(i => i.quantity === 0)
  const sottoSoglia = items.filter(i => i.quantity > 0 && i.quantity < i.min_threshold)

  const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, background: '#001529', display: 'flex',
        flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0
      }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #ffffff12' }}>
          <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>📦 SmartWarehouse</div>
          <div style={{ color: '#ffffff55', fontSize: 11, marginTop: 2 }}>Magazzino Scolastico</div>
        </div>

        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {[
            { key: 'dashboard', icon: '📊', label: 'Dashboard' },
            { key: 'items', icon: '📦', label: 'Scorte' },
            { key: 'categories', icon: '🏷️', label: 'Categorie' },
            ...(user?.role === 'admin' ? [{ key: 'users', icon: '👥', label: 'Utenti' }] : []),
          ].map(item => (
            <div key={item.key} onClick={() => setPage(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 6, cursor: 'pointer',
              marginBottom: 2, fontSize: 13.5,
              background: page === item.key ? '#1677ff' : 'transparent',
              color: page === item.key ? '#fff' : '#ffffffaa',
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #ffffff12' }}>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>👤 {user?.username}</div>
          <div style={{ color: '#ffffff55', fontSize: 11 }}>{user?.role}</div>
          <button onClick={logout} style={{
            marginTop: 10, width: '100%', padding: '7px',
            background: '#ff4d4f', color: '#fff', border: 'none',
            borderRadius: 6, cursor: 'pointer', fontSize: 13
          }}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 220, flex: 1, background: '#f0f2f5', padding: 24 }}>

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: 20 }}>📊 Dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Articoli totali', value: items.length, icon: '📦', color: '#e6f4ff' },
                { label: 'Categorie', value: categories.length, icon: '🏷️', color: '#f6ffed' },
                { label: 'Sotto soglia', value: sottoSoglia.length, icon: '⚠️', color: '#fff7e6' },
                { label: 'Esauriti', value: critici.length, icon: '🚫', color: '#fff2f0' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 8, padding: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', gap: 16, alignItems: 'center'
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ color: '#8c8c8c', fontSize: 12.5 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {(critici.length > 0 || sottoSoglia.length > 0) && (
              <div style={{
                background: '#fff2f0', border: '1px solid #ffccc7',
                borderRadius: 8, padding: '12px 16px', color: '#cf1322', marginBottom: 24
              }}>
                ⚠️ <strong>{critici.length + sottoSoglia.length} articoli</strong> richiedono attenzione!
              </div>
            )}
          </div>
        )}

        {/* SCORTE */}
        {page === 'items' && (
          <div>
            <h2 style={{ marginBottom: 20 }}>📦 Scorte</h2>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Nome', 'Categoria', 'Quantità', 'Soglia Min.', 'Unità', 'Stato'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#8c8c8c', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const status = item.quantity === 0 ? { label: 'Esaurito', color: '#ff4d4f', bg: '#fff2f0' }
                      : item.quantity < item.min_threshold ? { label: 'Sotto soglia', color: '#d46b08', bg: '#fff7e6' }
                      : { label: 'Disponibile', color: '#389e0d', bg: '#f6ffed' }
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ background: '#e6f4ff', color: '#0958d9', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>{item.category}</span></td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.quantity}</td>
                        <td style={{ padding: '14px 16px', color: '#8c8c8c' }}>{item.min_threshold}</td>
                        <td style={{ padding: '14px 16px', color: '#8c8c8c' }}>{item.unit}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ background: status.bg, color: status.color, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{status.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIE */}
        {page === 'categories' && (
          <div>
            <h2 style={{ marginBottom: 20 }}>🏷️ Categorie</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {categories.map(cat => (
                <div key={cat.id} style={{
                  background: '#fff', borderRadius: 8, padding: 20,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{cat.name}</div>
                  <div style={{ color: '#8c8c8c', fontSize: 13 }}>{cat.description || 'Nessuna descrizione'}</div>
                  <div style={{ marginTop: 12, color: '#1677ff', fontSize: 13 }}>
                    {items.filter(i => i.category === cat.name).length} articoli
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UTENTI */}
        {page === 'users' && (
          <div>
            <h2 style={{ marginBottom: 20 }}>👥 Utenti</h2>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['ID', 'Username', 'Email', 'Ruolo', 'Creato il'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#8c8c8c', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '14px 16px', color: '#8c8c8c' }}>{u.id}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>👤 {u.username}</td>
                      <td style={{ padding: '14px 16px', color: '#8c8c8c' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: u.role === 'admin' ? '#f9f0ff' : '#f6ffed',
                          color: u.role === 'admin' ? '#531dab' : '#389e0d',
                          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500
                        }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#8c8c8c', fontSize: 13 }}>
                        {new Date(u.created_at).toLocaleDateString('it-IT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}