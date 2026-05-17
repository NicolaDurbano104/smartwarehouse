import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('https://smartwarehouse-y04k.onrender.com/api/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/dashboard'
    } catch {
      setError('Credenziali non valide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F6FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: '48px 44px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #E5E7EB',
      }}>
        {/* Logo e benvenuto */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.4px', marginBottom: 6 }}>
            SmartWarehouse
          </div>
          <div style={{ color: '#6B7280', fontSize: 13.5, lineHeight: 1.6 }}>
            Bentornato. Accedi per gestire il magazzino.
          </div>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '10px 14px',
            color: '#DC2626', fontSize: 13, marginBottom: 20
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#111827' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="es. admin"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 7,
              border: '1.5px solid #E5E7EB', fontSize: 13.5,
              outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#111827' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 7,
              border: '1.5px solid #E5E7EB', fontSize: 13.5,
              outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '11px',
            background: loading ? '#93C5FD' : '#2563EB',
            color: '#fff', border: 'none', borderRadius: 7,
            fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'background 0.15s',
          }}
        >
          {loading ? 'Accesso in corso...' : 'Accedi →'}
        </button>
      </div>
    </div>
  )
}