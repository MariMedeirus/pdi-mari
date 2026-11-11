import { useState, type FormEvent } from 'react'
import { getApiUrl, hasApiUrl, setApiUrl } from '../api'
import { useAuth } from '../auth'
import { LogoMark } from './Icons'

type Mode = 'login' | 'register'

export function AuthScreen() {
  const { login, register, error, clearError, status } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [apiUrlInput, setApiUrlInput] = useState(() => getApiUrl())
  const [apiReady, setApiReady] = useState(() => hasApiUrl())
  const [busy, setBusy] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  function saveApiUrl(event: FormEvent) {
    event.preventDefault()
    const value = apiUrlInput.trim()
    if (!value) {
      setLocalError('Cole a URL pública da API no Render (https://….onrender.com)')
      return
    }
    try {
      // valida formato básico
      const parsed = new URL(value)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('invalid')
      }
    } catch {
      setLocalError('URL inválida')
      return
    }
    setApiUrl(value)
    setApiReady(true)
    setLocalError(null)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!hasApiUrl()) {
      setLocalError('Configure a URL da API antes de entrar')
      setApiReady(false)
      return
    }
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

  if (!apiReady) {
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
              <span>Configure a URL da API</span>
            </div>
          </div>

          <p className="auth-muted">
            A variável <code>VITE_API_URL</code> não veio no build da Vercel.
            Cole a URL pública do serviço no Render (ex.:{' '}
            <code>https://mari-pdi-server.onrender.com</code>). Fica salva só
            neste navegador.
          </p>

          <form className="form" onSubmit={saveApiUrl}>
            <label className="field">
              <span>URL da API</span>
              <input
                type="url"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="https://seu-servico.onrender.com"
                required
              />
            </label>
            {message && <p className="auth-error">{message}</p>}
            <div className="form-actions">
              <button className="btn" type="submit">
                Continuar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

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
          API: <code>{getApiUrl()}</code>{' '}
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              setApiReady(false)
              setApiUrlInput(getApiUrl())
            }}
          >
            alterar
          </button>
        </p>
      </div>
    </div>
  )
}
