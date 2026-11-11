import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth'
import { LogoMark } from './Icons'

type Mode = 'login' | 'register'

export function AuthScreen() {
  const { login, register, error, clearError, status } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLocalError(null)
    clearError()
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        await register(name.trim(), email.trim(), password)
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Não foi possível entrar')
    } finally {
      setBusy(false)
    }
  }

  function switchMode(next: Mode) {
    setMode(next)
    setLocalError(null)
    clearError()
  }

  if (status === 'loading') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="auth-muted">Carregando sessão…</p>
        </div>
      </div>
    )
  }

  const message = localError ?? error

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <LogoMark size={40} />
          <div>
            <strong>
              <span className="tok-fn">plano</span>
              <span className="tok-punc">.</span>
              dev
            </strong>
            <span>Entre para sincronizar o PDI na nuvem</span>
          </div>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={mode === 'login' ? 'is-active' : ''}
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            className={mode === 'register' ? 'is-active' : ''}
            aria-selected={mode === 'register'}
            onClick={() => switchMode('register')}
          >
            Criar conta
          </button>
        </div>

        <form className="form" onSubmit={onSubmit}>
          {mode === 'register' && (
            <label className="field">
              <span>Nome</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                minLength={2}
              />
            </label>
          )}
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={8}
            />
          </label>

          {message && <p className="auth-error">{message}</p>}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={busy}>
              {busy
                ? 'Aguarde…'
                : mode === 'login'
                  ? 'Entrar'
                  : 'Criar conta'}
            </button>
          </div>
        </form>

        <p className="auth-muted">
          Demo: mariana@example.com / mariana123 — API em{' '}
          <code>{import.meta.env.VITE_API_URL}</code>
        </p>
      </div>
    </div>
  )
}
