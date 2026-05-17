import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { Authorization: `Bearer ${token}` }
})

const C = {
  bg: '#F4F6FA',
  sidebar: '#0F1623',
  sidebarBorder: '#1E2A3A',
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
  white: '#FFFFFF',
  text: '#111827',
  textSub: '#6B7280',
  border: '#E5E7EB',
  cardShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
  cardShadowHover: '0 4px 12px rgba(0,0,0,0.10)',
}

const styles = {
  app: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.bg, color: C.text },
  sidebar: { width: 240, background: C.sidebar, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 },
  logoBox: { padding: '24px 20px 20px', borderBottom: `1px solid ${C.sidebarBorder}` },
  logoTitle: { color: '#fff', fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 8 },
  logoSub: { color: '#4B5563', fontSize: 11, marginTop: 3, letterSpacing: '0.5px', textTransform: 'uppercase' },
  nav: { padding: '16px 12px', flex: 1 },
  navSection: { color: '#374151', fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '10px 8px 6px' },
  main: { marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { background: C.white, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  content: { padding: 28, flex: 1 },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px' },
  pageSub: { color: C.textSub, fontSize: 13, marginTop: 2 },
  card: { background: C.white, borderRadius: 10, boxShadow: C.cardShadow, border: `1px solid ${C.border}` },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '11px 16px', textAlign: 'left', fontSize: 11, color: C.textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', background: '#F9FAFB', borderBottom: `1px solid ${C.border}` },
  td: { padding: '13px 16px', fontSize: 13.5, borderBottom: `1px solid #F3F4F6`, verticalAlign: 'middle' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' },
  modal: { background: C.white, borderRadius: 14, width: 460, maxWidth: '95vw', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', overflow: 'hidden' },
  modalHeader: { padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  modalBody: { padding: '20px 24px' },
  modalFooter: { padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 8, background: '#F9FAFB' },
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
      borderRadius: 7, cursor: 'pointer', marginBottom: 2, fontSize: 13.5, fontWeight: active ? 600 : 400,
      background: active ? C.primary : 'transparent',
      color: active ? '#fff' : '#9CA3AF',
      transition: 'all 0.15s',
    }}>
      <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{icon}</span>
      {label}
    </div>
  )
}

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ ...styles.card, padding: 20, display: 'flex', gap: 16, alignItems: 'center', transition: 'box-shadow 0.2s' }}>
      <div style={{ width: 50, height: 50, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
        <div style={{ color: C.textSub, fontSize: 12.5, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, marginTop: 3, color: sub.color }}>{sub.text}</div>}
      </div>
    </div>
  )
}

function Btn({ label, onClick, color = C.primary, small = false, outline = false }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? '6px 12px' : '9px 18px',
      background: outline ? 'transparent' : color,
      color: outline ? color : '#fff',
      border: outline ? `1.5px solid ${color}` : 'none',
      borderRadius: 7, cursor: 'pointer',
      fontSize: small ? 12 : 13.5, fontWeight: 500,
      marginLeft: small ? 6 : 0,
      transition: 'all 0.15s',
      fontFamily: 'inherit',
    }}>{label}</button>
  )
}

function Badge({ text, color, bg }) {
  return <span style={{ background: bg, color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{text}</span>
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: C.text }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 7, border: `1.5px solid ${C.border}`, fontSize: 13.5, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: C.text }

function AIPredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { Authorization: `Bearer ${token}` }
  })

  useEffect(() => {
    api.get('/api/ai/predictions')
      .then(r => { setPredictions(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>Caricamento previsioni...</div>

  const statusInfo = (s) => {
    if (s === 'empty') return { label: 'Esaurito', color: '#DC2626', bg: '#FEF2F2', icon: '🚫' }
    if (s === 'critical') return { label: 'Critico — meno di 7 giorni', color: '#DC2626', bg: '#FEF2F2', icon: '🔴' }
    if (s === 'warning') return { label: 'Attenzione — meno di 30 giorni', color: '#D97706', bg: '#FFFBEB', icon: '🟡' }
    if (s === 'ok') return { label: 'OK', color: '#16A34A', bg: '#F0FDF4', icon: '🟢' }
    if (s === 'insufficient_data') return { label: 'Dati insufficienti', color: '#6B7280', bg: '#F9FAFB', icon: '⚪' }
    if (s === 'no_consumption') return { label: 'Nessun consumo', color: '#6B7280', bg: '#F9FAFB', icon: '⚪' }
    return { label: s, color: '#6B7280', bg: '#F9FAFB', icon: '⚪' }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
      {predictions.map(p => {
        const s = statusInfo(p.status)
        return (
          <div key={p.id} style={{
            background: '#fff', borderRadius: 10, padding: 22,
            boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: `1px solid #E5E7EB`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Quantità attuale</span>
                <span style={{ fontWeight: 600 }}>{p.quantity} {p.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Consumo medio/giorno</span>
                <span style={{ fontWeight: 600 }}>{p.avg_daily_consumption ?? '—'} {p.unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>Giorni all'esaurimento</span>
                <span style={{ fontWeight: 600, color: s.color }}>
                  {p.days_until_empty !== null ? `${p.days_until_empty} giorni` : '—'}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [movements, setMovements] = useState([])
  const [page, setPage] = useState('dashboard')

  const [showItemModal, setShowItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemForm, setItemForm] = useState({ name: '', description: '', category_id: '', quantity: 0, min_threshold: 5, unit: 'pezzi' })

  const [showCatModal, setShowCatModal] = useState(false)
  const [editingCat, setEditingCat] = useState(null)
  const [catForm, setCatForm] = useState({ name: '', description: '' })

  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ username: '', email: '', password: '', role: 'viewer' })

  const [showMovModal, setShowMovModal] = useState(false)
  const [movForm, setMovForm] = useState({ item_id: '', type: 'IN', quantity: 1, note: '' })

  const fetchAll = () => {
    api.get('/api/items').then(r => setItems(r.data))
    api.get('/api/categories').then(r => setCategories(r.data))
    api.get('/api/movements').then(r => setMovements(r.data))
    if (user?.role === 'admin') api.get('/api/users').then(r => setUsers(r.data))
  }

  useEffect(() => { fetchAll() }, [])

  const critici = items.filter(i => i.quantity === 0)
  const sottoSoglia = items.filter(i => i.quantity > 0 && i.quantity < i.min_threshold)
  const logout = () => { localStorage.clear(); window.location.href = '/login' }

  const openNewItem = () => { setEditingItem(null); setItemForm({ name: '', description: '', category_id: categories[0]?.id || '', quantity: 0, min_threshold: 5, unit: 'pezzi' }); setShowItemModal(true) }
  const openEditItem = (item) => { setEditingItem(item); setItemForm({ name: item.name, description: item.description || '', category_id: item.category_id, quantity: item.quantity, min_threshold: item.min_threshold, unit: item.unit }); setShowItemModal(true) }
  const saveItem = async () => { if (editingItem) { await api.put(`/api/items/${editingItem.id}`, itemForm) } else { await api.post('/api/items', itemForm) }; setShowItemModal(false); fetchAll() }
  const deleteItem = async (id) => { if (!window.confirm('Eliminare questo articolo?')) return; await api.delete(`/api/items/${id}`); fetchAll() }

  const openNewCat = () => { setEditingCat(null); setCatForm({ name: '', description: '' }); setShowCatModal(true) }
  const openEditCat = (cat) => { setEditingCat(cat); setCatForm({ name: cat.name, description: cat.description || '' }); setShowCatModal(true) }
  const saveCat = async () => { if (editingCat) { await api.put(`/api/categories/${editingCat.id}`, catForm) } else { await api.post('/api/categories', catForm) }; setShowCatModal(false); fetchAll() }
  const deleteCat = async (id) => { if (!window.confirm('Eliminare questa categoria?')) return; await api.delete(`/api/categories/${id}`); fetchAll() }

  const openNewUser = () => { setEditingUser(null); setUserForm({ username: '', email: '', password: '', role: 'viewer' }); setShowUserModal(true) }
  const openEditUser = (u) => { setEditingUser(u); setUserForm({ username: u.username, email: u.email, password: '', role: u.role }); setShowUserModal(true) }
  const saveUser = async () => { if (editingUser) { await api.put(`/api/users/${editingUser.id}`, userForm) } else { await api.post('/api/users', userForm) }; setShowUserModal(false); fetchAll() }
  const deleteUser = async (id) => { if (!window.confirm('Eliminare questo utente?')) return; await api.delete(`/api/users/${id}`); fetchAll() }

  const openNewMov = () => { setMovForm({ item_id: items[0]?.id || '', type: 'IN', quantity: 1, note: '' }); setShowMovModal(true) }
  const saveMov = async () => { await api.post('/api/movements', movForm); setShowMovModal(false); fetchAll() }

  const roleColor = (role) => role === 'admin' ? { bg: '#EFF6FF', color: '#1D4ED8' } : role === 'magazziniere' ? { bg: '#F0FDF4', color: '#16A34A' } : { bg: '#F9FAFB', color: '#6B7280' }
  const statusInfo = (item) => item.quantity === 0 ? { label: 'Esaurito', color: C.danger, bg: '#FEF2F2' } : item.quantity < item.min_threshold ? { label: 'Sotto soglia', color: C.warning, bg: '#FFFBEB' } : { label: 'Disponibile', color: C.success, bg: '#F0FDF4' }

  const chartMovements = () => {
    const grouped = {}
    movements.forEach(m => {
      const date = new Date(m.timestamp).toLocaleDateString('it-IT')
      if (!grouped[date]) grouped[date] = { date, entrate: 0, uscite: 0 }
      if (m.quantity_delta > 0) grouped[date].entrate += m.quantity_delta
      else grouped[date].uscite += Math.abs(m.quantity_delta)
    })
    return Object.values(grouped).reverse()
  }

  return (
    <div style={styles.app}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.logoTitle}>📦 SmartWarehouse</div>
          <div style={styles.logoSub}>Magazzino Scolastico</div>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navSection}>Principale</div>
          <NavItem icon="📊" label="Dashboard" active={page === 'dashboard'} onClick={() => setPage('dashboard')} />
          <NavItem icon="📦" label="Scorte" active={page === 'items'} onClick={() => setPage('items')} />
          <NavItem icon="🔄" label="Movimenti" active={page === 'movements'} onClick={() => setPage('movements')} />
          <NavItem icon="🏷️" label="Categorie" active={page === 'categories'} onClick={() => setPage('categories')} />
          <NavItem icon="📈" label="Grafici" active={page === 'charts'} onClick={() => setPage('charts')} />
          <NavItem icon="🤖" label="Previsioni AI" active={page === 'ai'} onClick={() => setPage('ai')} />
          {user?.role === 'admin' && (
            <>
              <div style={styles.navSection}>Amministrazione</div>
              <NavItem icon="👥" label="Utenti" active={page === 'users'} onClick={() => setPage('users')} />
            </>
          )}
        </nav>
        <div style={{ padding: '16px 16px 20px', borderTop: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user?.username}</div>
              <div style={{ color: '#4B5563', fontSize: 11 }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={logout} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#6B7280', border: `1px solid #1E2A3A`, borderRadius: 7, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', transition: 'all 0.15s' }}>
            Esci
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={{ fontSize: 13, color: C.textSub }}>
            <span style={{ color: C.textSub }}>SmartWarehouse</span>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: C.text, fontWeight: 500 }}>
              {{ dashboard: 'Dashboard', items: 'Scorte', movements: 'Movimenti', categories: 'Categorie', charts: 'Grafici', ai: 'Previsioni AI', users: 'Utenti' }[page]}
            </span>
          </div>
          <div style={{ fontSize: 13, color: C.textSub }}>
            {new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        <div style={styles.content}>

          {/* DASHBOARD */}
          {page === 'dashboard' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Benvenuto, {user?.username} 👋</div>
                  <div style={styles.pageSub}>Ecco un riepilogo del magazzino</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard icon="📦" label="Articoli totali" value={items.length} color={C.primary} />
                <StatCard icon="🏷️" label="Categorie" value={categories.length} color={C.success} />
                <StatCard icon="⚠️" label="Sotto soglia" value={sottoSoglia.length} color={C.warning} sub={sottoSoglia.length > 0 ? { text: 'Richiedono attenzione', color: C.warning } : null} />
                <StatCard icon="🚫" label="Esauriti" value={critici.length} color={C.danger} sub={critici.length > 0 ? { text: 'Ordine necessario', color: C.danger } : null} />
              </div>
              {(critici.length > 0 || sottoSoglia.length > 0) && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '14px 18px', color: C.danger, marginBottom: 24, fontSize: 13.5 }}>
                  ⚠️ <strong>{critici.length + sottoSoglia.length} articoli</strong> richiedono attenzione — controlla le scorte.
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={styles.card}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 14 }}>📦 Ultimi articoli aggiunti</div>
                  {items.slice(0, 5).map(item => {
                    const s = statusInfo(item)
                    return (
                      <div key={item.id} style={{ padding: '12px 20px', borderBottom: `1px solid #F9FAFB`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.name}</span>
                        <Badge text={s.label} color={s.color} bg={s.bg} />
                      </div>
                    )
                  })}
                </div>
                <div style={styles.card}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, fontSize: 14 }}>🔄 Ultimi movimenti</div>
                  {movements.slice(0, 5).map(m => (
                    <div key={m.id} style={{ padding: '12px 20px', borderBottom: `1px solid #F9FAFB`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13.5 }}>{m.item}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: m.quantity_delta > 0 ? C.success : C.danger }}>
                        {m.quantity_delta > 0 ? '+' : ''}{m.quantity_delta}
                      </span>
                    </div>
                  ))}
                  {movements.length === 0 && <div style={{ padding: 20, color: C.textSub, fontSize: 13 }}>Nessun movimento ancora</div>}
                </div>
              </div>
            </div>
          )}

          {/* SCORTE */}
          {page === 'items' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Scorte</div>
                  <div style={styles.pageSub}>{items.length} articoli totali</div>
                </div>
                {user?.role !== 'viewer' && <Btn label="+ Nuovo Articolo" onClick={openNewItem} />}
              </div>
              <div style={styles.card}>
                <table style={styles.table}>
                  <thead>
                    <tr>{['Nome', 'Categoria', 'Quantità', 'Soglia Min.', 'Unità', 'Stato', 'Azioni'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const s = statusInfo(item)
                      return (
                        <tr key={item.id}>
                          <td style={{ ...styles.td, fontWeight: 600 }}>{item.name}</td>
                          <td style={styles.td}><Badge text={item.category} color={C.primary} bg="#EFF6FF" /></td>
                          <td style={{ ...styles.td, fontWeight: 700, fontSize: 15 }}>{item.quantity}</td>
                          <td style={{ ...styles.td, color: C.textSub }}>{item.min_threshold}</td>
                          <td style={{ ...styles.td, color: C.textSub }}>{item.unit}</td>
                          <td style={styles.td}><Badge text={s.label} color={s.color} bg={s.bg} /></td>
                          <td style={styles.td}>
                            {user?.role !== 'viewer' && <Btn label="✏️" onClick={() => openEditItem(item)} color={C.warning} small />}
                            {user?.role === 'admin' && <Btn label="🗑️" onClick={() => deleteItem(item.id)} color={C.danger} small />}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MOVIMENTI */}
          {page === 'movements' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Movimenti</div>
                  <div style={styles.pageSub}>{movements.length} movimenti registrati</div>
                </div>
                {user?.role !== 'viewer' && <Btn label="+ Registra Movimento" onClick={openNewMov} />}
              </div>
              <div style={styles.card}>
                <table style={styles.table}>
                  <thead>
                    <tr>{['Articolo', 'Tipo', 'Quantità', 'Utente', 'Note', 'Data'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {movements.length === 0 && (
                      <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: C.textSub, padding: 32 }}>Nessun movimento registrato</td></tr>
                    )}
                    {movements.map(m => (
                      <tr key={m.id}>
                        <td style={{ ...styles.td, fontWeight: 600 }}>{m.item}</td>
                        <td style={styles.td}><Badge text={m.type === 'IN' ? '⬆ Entrata' : '⬇ Uscita'} color={m.type === 'IN' ? C.success : C.danger} bg={m.type === 'IN' ? '#F0FDF4' : '#FEF2F2'} /></td>
                        <td style={{ ...styles.td, fontWeight: 700, color: m.quantity_delta > 0 ? C.success : C.danger }}>{m.quantity_delta > 0 ? '+' : ''}{m.quantity_delta}</td>
                        <td style={{ ...styles.td, color: C.textSub }}>{m.user}</td>
                        <td style={{ ...styles.td, color: C.textSub }}>{m.note || '—'}</td>
                        <td style={{ ...styles.td, color: C.textSub, fontSize: 12.5 }}>{new Date(m.timestamp).toLocaleDateString('it-IT')} {new Date(m.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIE */}
          {page === 'categories' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Categorie</div>
                  <div style={styles.pageSub}>{categories.length} categorie totali</div>
                </div>
                {user?.role === 'admin' && <Btn label="+ Nuova Categoria" onClick={openNewCat} />}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ ...styles.card, padding: 22 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{cat.name}</div>
                    <div style={{ color: C.textSub, fontSize: 13, marginBottom: 14 }}>{cat.description || 'Nessuna descrizione'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: C.primary, fontSize: 13, fontWeight: 500 }}>{items.filter(i => i.category === cat.name).length} articoli</span>
                      {user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Btn label="✏️" onClick={() => openEditCat(cat)} color={C.warning} small />
                          <Btn label="🗑️" onClick={() => deleteCat(cat.id)} color={C.danger} small />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRAFICI */}
          {page === 'charts' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Grafici</div>
                  <div style={styles.pageSub}>Analisi consumi e movimenti</div>
                </div>
              </div>

              <div style={{ ...styles.card, padding: 24, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📈 Movimenti nel tempo</div>
                {movements.length === 0 ? (
                  <div style={{ textAlign: 'center', color: C.textSub, padding: 40 }}>
                    Nessun movimento registrato — registra qualche movimento per vedere il grafico
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartMovements()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: C.textSub }} />
                      <YAxis tick={{ fontSize: 12, fill: C.textSub }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                      <Legend />
                      <Line type="monotone" dataKey="entrate" stroke={C.success} strokeWidth={2} dot={{ r: 4 }} name="Entrate" />
                      <Line type="monotone" dataKey="uscite" stroke={C.danger} strokeWidth={2} dot={{ r: 4 }} name="Uscite" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div style={{ ...styles.card, padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📊 Quantità attuale per articolo</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={items.map(i => ({ name: i.name, quantità: i.quantity, soglia: i.min_threshold }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.textSub }} />
                    <YAxis tick={{ fontSize: 12, fill: C.textSub }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13 }} />
                    <Legend />
                    <Bar dataKey="quantità" fill={C.primary} radius={[4, 4, 0, 0]} name="Quantità" />
                    <Bar dataKey="soglia" fill={C.warning} radius={[4, 4, 0, 0]} name="Soglia minima" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PREVISIONI AI */}
          {page === 'ai' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>🤖 Previsioni AI</div>
                  <div style={styles.pageSub}>Previsione esaurimento scorte basata sui movimenti storici</div>
                </div>
              </div>

              <AIPredictions />
            </div>
          )}

          {/* UTENTI */}
          {page === 'users' && (
            <div>
              <div style={styles.pageHeader}>
                <div>
                  <div style={styles.pageTitle}>Utenti</div>
                  <div style={styles.pageSub}>{users.length} utenti registrati</div>
                </div>
                <Btn label="+ Nuovo Utente" onClick={openNewUser} />
              </div>
              <div style={styles.card}>
                <table style={styles.table}>
                  <thead>
                    <tr>{['ID', 'Username', 'Email', 'Ruolo', 'Creato il', 'Azioni'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const rc = roleColor(u.role)
                      return (
                        <tr key={u.id}>
                          <td style={{ ...styles.td, color: C.textSub }}>{u.id}</td>
                          <td style={{ ...styles.td, fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.primary }}>
                                {u.username[0].toUpperCase()}
                              </div>
                              {u.username}
                            </div>
                          </td>
                          <td style={{ ...styles.td, color: C.textSub }}>{u.email}</td>
                          <td style={styles.td}><Badge text={u.role} color={rc.color} bg={rc.bg} /></td>
                          <td style={{ ...styles.td, color: C.textSub, fontSize: 12.5 }}>{new Date(u.created_at).toLocaleDateString('it-IT')}</td>
                          <td style={styles.td}>
                            <Btn label="✏️" onClick={() => openEditUser(u)} color={C.warning} small />
                            <Btn label="🗑️" onClick={() => deleteUser(u.id)} color={C.danger} small />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL ARTICOLO */}
      {showItemModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{editingItem ? '✏️ Modifica Articolo' : '✚ Nuovo Articolo'}</span>
              <button onClick={() => setShowItemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.textSub }}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <FormField label="Nome articolo *"><input style={inputStyle} value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} /></FormField>
              <FormField label="Descrizione"><input style={inputStyle} value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} /></FormField>
              <FormField label="Categoria *">
                <select style={inputStyle} value={itemForm.category_id} onChange={e => setItemForm({ ...itemForm, category_id: parseInt(e.target.value) })}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FormField label="Quantità *"><input style={inputStyle} type="number" value={itemForm.quantity} onChange={e => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })} /></FormField>
                <FormField label="Soglia min. *"><input style={inputStyle} type="number" value={itemForm.min_threshold} onChange={e => setItemForm({ ...itemForm, min_threshold: parseInt(e.target.value) })} /></FormField>
                <FormField label="Unità"><input style={inputStyle} value={itemForm.unit} onChange={e => setItemForm({ ...itemForm, unit: e.target.value })} /></FormField>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <Btn label="Annulla" onClick={() => setShowItemModal(false)} color={C.textSub} outline />
              <Btn label="💾 Salva" onClick={saveItem} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL CATEGORIA */}
      {showCatModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, width: 400 }}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{editingCat ? '✏️ Modifica Categoria' : '✚ Nuova Categoria'}</span>
              <button onClick={() => setShowCatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.textSub }}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <FormField label="Nome *"><input style={inputStyle} value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} /></FormField>
              <FormField label="Descrizione"><input style={inputStyle} value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} /></FormField>
            </div>
            <div style={styles.modalFooter}>
              <Btn label="Annulla" onClick={() => setShowCatModal(false)} color={C.textSub} outline />
              <Btn label="💾 Salva" onClick={saveCat} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL UTENTE */}
      {showUserModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, width: 400 }}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{editingUser ? '✏️ Modifica Utente' : '✚ Nuovo Utente'}</span>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.textSub }}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <FormField label="Username *"><input style={inputStyle} value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} /></FormField>
              <FormField label="Email *"><input style={inputStyle} value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} /></FormField>
              <FormField label={editingUser ? 'Nuova password (lascia vuoto per non cambiarla)' : 'Password *'}>
                <input style={inputStyle} type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} />
              </FormField>
              <FormField label="Ruolo *">
                <select style={inputStyle} value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="viewer">Viewer</option>
                  <option value="magazziniere">Magazziniere</option>
                  <option value="admin">Admin</option>
                </select>
              </FormField>
            </div>
            <div style={styles.modalFooter}>
              <Btn label="Annulla" onClick={() => setShowUserModal(false)} color={C.textSub} outline />
              <Btn label="💾 Salva" onClick={saveUser} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL MOVIMENTO */}
      {showMovModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modal, width: 420 }}>
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>🔄 Registra Movimento</span>
              <button onClick={() => setShowMovModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: C.textSub }}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <FormField label="Articolo *">
                <select style={inputStyle} value={movForm.item_id} onChange={e => setMovForm({ ...movForm, item_id: parseInt(e.target.value) })}>
                  {items.map(i => <option key={i.id} value={i.id}>{i.name} (disponibili: {i.quantity} {i.unit})</option>)}
                </select>
              </FormField>
              <FormField label="Tipo *">
                <select style={inputStyle} value={movForm.type} onChange={e => setMovForm({ ...movForm, type: e.target.value })}>
                  <option value="IN">⬆️ Entrata</option>
                  <option value="OUT">⬇️ Uscita</option>
                </select>
              </FormField>
              <FormField label="Quantità *">
                <input style={inputStyle} type="number" min="1" value={movForm.quantity} onChange={e => setMovForm({ ...movForm, quantity: parseInt(e.target.value) })} />
              </FormField>
              <FormField label="Note">
                <input style={inputStyle} type="text" placeholder="es. Aula 3B, ordine fornitore..." value={movForm.note} onChange={e => setMovForm({ ...movForm, note: e.target.value })} />
              </FormField>
            </div>
            <div style={styles.modalFooter}>
              <Btn label="Annulla" onClick={() => setShowMovModal(false)} color={C.textSub} outline />
              <Btn label="💾 Registra" onClick={saveMov} />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

