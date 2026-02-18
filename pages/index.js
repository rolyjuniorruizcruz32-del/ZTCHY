import { useState } from 'react'
import Head from 'next/head'

const VIEWS = { LOGIN: 'login', REGISTER: 'register', VERIFY: 'verify', FORGOT: 'forgot', RESET: 'reset', DASHBOARD: 'dashboard' }

export default function Home() {
  const [view, setView] = useState(VIEWS.LOGIN)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const api = async (action, body) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...body })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      return data
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUser(data.user)
      setView(VIEWS.DASHBOARD)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    const ok = await api('register', { email, password, name })
    if (ok) setView(VIEWS.VERIFY)
  }

  const handleVerify = async e => {
    e.preventDefault()
    const ok = await api('verify', { email, code })
    if (ok) { setView(VIEWS.LOGIN); setCode(''); setError('') }
  }

  const handleForgot = async e => {
    e.preventDefault()
    const ok = await api('forgot', { email })
    if (ok) setView(VIEWS.RESET)
  }

  const handleReset = async e => {
    e.preventDefault()
    const ok = await api('reset', { email, code, newPassword })
    if (ok) { setView(VIEWS.LOGIN); setCode(''); setNewPassword('') }
  }

  return (
    <>
      <Head>
        <title>ZTCHY — Login</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050505; color: #f0f0f0; font-family: 'DM Sans', sans-serif; min-height: 100vh; }
        .page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
        .left {
          background: #0a0a0a; display: flex; align-items: center; justify-content: center;
          padding: 60px; border-right: 1px solid #1a1a1a; position: relative; overflow: hidden;
        }
        .left::before {
          content: ''; position: absolute; top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(232,255,71,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .brand { text-align: left; }
        .brand-icon {
          width: 56px; height: 56px; background: #e8ff47; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 32px;
        }
        .brand-icon svg { width: 28px; height: 28px; }
        .brand h1 {
          font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800;
          letter-spacing: -2px; line-height: 1; margin-bottom: 16px; color: #f0f0f0;
        }
        .brand p { color: #555; font-size: 16px; line-height: 1.6; max-width: 320px; }
        .brand .tagline { color: #e8ff47; font-weight: 500; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
        .right { display: flex; align-items: center; justify-content: center; padding: 60px; }
        .card { width: 100%; max-width: 400px; }
        .card-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 6px; }
        .card-sub { color: #555; font-size: 14px; margin-bottom: 36px; }
        .field { margin-bottom: 16px; }
        label { display: block; font-size: 12px; font-weight: 500; color: #888; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px; }
        input {
          width: 100%; padding: 14px 16px; background: #111; border: 1px solid #222;
          border-radius: 10px; color: #f0f0f0; font-size: 15px; font-family: inherit;
          transition: border-color .2s, box-shadow .2s; outline: none;
        }
        input:focus { border-color: #e8ff47; box-shadow: 0 0 0 3px rgba(232,255,71,0.08); }
        input::placeholder { color: #333; }
        .btn {
          width: 100%; padding: 15px; background: #e8ff47; color: #0a0a0a;
          border: none; border-radius: 10px; font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
          transition: opacity .2s, transform .15s; margin-top: 8px;
        }
        .btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .btn:disabled { opacity: .4; cursor: not-allowed; }
        .btn.secondary { background: transparent; color: #f0f0f0; border: 1px solid #222; }
        .btn.secondary:hover:not(:disabled) { border-color: #444; }
        .link-row { text-align: center; margin-top: 20px; font-size: 14px; color: #555; }
        .link { color: #e8ff47; cursor: pointer; background: none; border: none; font: inherit; padding: 0; }
        .link:hover { text-decoration: underline; }
        .error-box { background: rgba(255,80,60,0.1); border: 1px solid rgba(255,80,60,0.25); color: #ff6b6b; border-radius: 8px; padding: 12px 14px; font-size: 13px; margin-bottom: 16px; }
        .code-hint { color: #555; font-size: 13px; margin-bottom: 20px; }
        .code-hint span { color: #e8ff47; }
        .dashboard { text-align: center; }
        .dash-icon { width: 72px; height: 72px; border-radius: 50%; background: #e8ff47; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .dash-icon svg { width: 32px; height: 32px; }
        .dash-email { color: #555; font-size: 14px; margin: 8px 0 32px; }
        @media (max-width: 768px) { .page { grid-template-columns: 1fr; } .left { display: none; } .right { padding: 40px 24px; } }
      `}</style>

      <div className="page">
        <div className="left">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="tagline">Acceso seguro</p>
            <h1>Bienvenido<br />de vuelta.</h1>
            <p>Plataforma segura con verificación por correo y recuperación de contraseña.</p>
          </div>
        </div>

        <div className="right">
          <div className="card">

            {view === VIEWS.LOGIN && (
              <form onSubmit={handleLogin}>
                <div className="card-title">Iniciar sesión</div>
                <div className="card-sub">Ingresa tus credenciales para continuar</div>
                {error && <div className="error-box">{error}</div>}
                <div className="field">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button className="btn" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
                <div className="link-row">
                  <button type="button" className="link" onClick={() => { setView(VIEWS.FORGOT); setError('') }}>¿Olvidaste tu contraseña?</button>
                </div>
                <div className="link-row">
                  ¿No tienes cuenta?{' '}
                  <button type="button" className="link" onClick={() => { setView(VIEWS.REGISTER); setError('') }}>Regístrate</button>
                </div>
              </form>
            )}

            {view === VIEWS.REGISTER && (
              <form onSubmit={handleRegister}>
                <div className="card-title">Crear cuenta</div>
                <div className="card-sub">Te enviaremos un código de verificación</div>
                {error && <div className="error-box">{error}</div>}
                <div className="field">
                  <label>Nombre</label>
                  <input type="text" placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                </div>
                <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Crear cuenta'}</button>
                <div className="link-row">
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" className="link" onClick={() => { setView(VIEWS.LOGIN); setError('') }}>Inicia sesión</button>
                </div>
              </form>
            )}

            {view === VIEWS.VERIFY && (
              <form onSubmit={handleVerify}>
                <div className="card-title">Verifica tu correo</div>
                <p className="code-hint">Enviamos un código de 6 dígitos a <span>{email}</span></p>
                {error && <div className="error-box">{error}</div>}
                <div className="field">
                  <label>Código de verificación</label>
                  <input type="text" placeholder="123456" value={code} onChange={e => setCode(e.target.value)} required maxLength={6} style={{ letterSpacing: '8px', fontSize: '22px', textAlign: 'center' }} />
                </div>
                <button className="btn" disabled={loading}>{loading ? 'Verificando...' : 'Verificar cuenta'}</button>
                <div className="link-row">
                  <button type="button" className="link" onClick={() => { setView(VIEWS.REGISTER); setError('') }}>← Volver</button>
                </div>
              </form>
            )}

            {view === VIEWS.FORGOT && (
              <form onSubmit={handleForgot}>
                <div className="card-title">Recuperar contraseña</div>
                <div className="card-sub">Te enviaremos un código para restablecer tu contraseña</div>
                {error && <div className="error-box">{error}</div>}
                <div className="field">
                  <label>Correo electrónico</label>
                  <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button className="btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar código'}</button>
                <div className="link-row">
                  <button type="button" className="link" onClick={() => { setView(VIEWS.LOGIN); setError('') }}>← Volver al login</button>
                </div>
              </form>
            )}

            {view === VIEWS.RESET && (
              <form onSubmit={handleReset}>
                <div className="card-title">Nueva contraseña</div>
                <p className="code-hint">Ingresa el código enviado a <span>{email}</span></p>
                {error && <div className="error-box">{error}</div>}
                <div className="field">
                  <label>Código de recuperación</label>
                  <input type="text" placeholder="123456" value={code} onChange={e => setCode(e.target.value)} required maxLength={6} style={{ letterSpacing: '8px', fontSize: '22px', textAlign: 'center' }} />
                </div>
                <div className="field">
                  <label>Nueva contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <button className="btn" disabled={loading}>{loading ? 'Guardando...' : 'Cambiar contraseña'}</button>
              </form>
            )}

            {view === VIEWS.DASHBOARD && (
              <div className="dashboard">
                <div className="dash-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="card-title">¡Bienvenido!</div>
                <div className="dash-email">{user?.email}</div>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>Has iniciado sesión correctamente.</p>
                <button className="btn secondary" onClick={() => { setView(VIEWS.LOGIN); setUser(null); setEmail(''); setPassword(''); }}>
                  Cerrar sesión
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
