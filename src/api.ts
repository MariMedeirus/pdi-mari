import type { PlannerState } from './types'

const TOKEN_KEY = 'mariana-mederios-token'
const API_URL_KEY = 'mariana-mederios-api-url'

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/$/, '')
}

/** URL embutida no build (Vercel) ou salva neste navegador. */
export function getApiUrl(): string {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  if (fromEnv) return normalizeUrl(fromEnv)

  try {
    const fromStorage = localStorage.getItem(API_URL_KEY)?.trim()
    if (fromStorage) return normalizeUrl(fromStorage)
  } catch {
    /* ignore */
  }

  return ''
}

export function setApiUrl(url: string) {
  const normalized = normalizeUrl(url)
  if (!normalized) {
    try {
      localStorage.removeItem(API_URL_KEY)
    } catch {
      /* ignore */
    }
    return
  }
  try {
    localStorage.setItem(API_URL_KEY, normalized)
  } catch {
    /* ignore */
  }
}

export function hasApiUrl(): boolean {
  return getApiUrl().length > 0
}

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export type PlannerResponse = {
  state: PlannerState
  updatedAt: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const base = getApiUrl()
  if (!base) {
    throw new ApiError(
      0,
      'URL da API não configurada. Informe a URL do Render na tela de login.',
    )
  }

  const { token, headers, ...rest } = options
  const res = await fetch(`${base}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  let body: unknown = null
  const text = await res.text()
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  if (!res.ok) {
    const message =
      body && typeof body === 'object' && body !== null && 'message' in body
        ? String((body as { message: unknown }).message)
        : `Erro ${res.status}`
    throw new ApiError(res.status, message)
  }

  return body as T
}

export const api = {
  get url() {
    return getApiUrl()
  },

  register(input: { name: string; email: string; password: string }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  login(input: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  me(token: string) {
    return request<{ user: AuthUser }>('/auth/me', { token })
  },

  getPlanner(token: string) {
    return request<PlannerResponse>('/me/planner', { token })
  },

  putPlanner(token: string, state: PlannerState) {
    return request<PlannerResponse>('/me/planner', {
      method: 'PUT',
      token,
      body: JSON.stringify(state),
    })
  },
}
