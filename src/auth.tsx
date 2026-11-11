import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getStoredToken, setStoredToken, type AuthUser } from './api'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'
/** Como a sessão atual foi aberta — o sync usa isso no hydrate. */
export type SessionKind = 'restore' | 'login' | 'register'

type AuthContextValue = {
  status: AuthStatus
  user: AuthUser | null
  token: string | null
  sessionKind: SessionKind | null
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [sessionKind, setSessionKind] = useState<SessionKind | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = getStoredToken()
    if (!stored) {
      setStatus('anonymous')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { user: me } = await api.me(stored)
        if (cancelled) return
        setToken(stored)
        setUser(me)
        setSessionKind('restore')
        setStatus('authenticated')
      } catch {
        if (cancelled) return
        setStoredToken(null)
        setToken(null)
        setUser(null)
        setSessionKind(null)
        setStatus('anonymous')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const applySession = useCallback(
    (next: { user: AuthUser; token: string }, kind: SessionKind) => {
      setStoredToken(next.token)
      setToken(next.token)
      setUser(next.user)
      setSessionKind(kind)
      setStatus('authenticated')
      setError(null)
    },
    [],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)
      try {
        const res = await api.login({ email, password })
        applySession(res, 'login')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha no login')
        throw err
      }
    },
    [applySession],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null)
      try {
        const res = await api.register({ name, email, password })
        applySession(res, 'register')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha no cadastro')
        throw err
      }
    },
    [applySession],
  )

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    setUser(null)
    setSessionKind(null)
    setStatus('anonymous')
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      status,
      user,
      token,
      sessionKind,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [status, user, token, sessionKind, error, login, register, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
