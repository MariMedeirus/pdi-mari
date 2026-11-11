import type { PlannerState } from './types'

const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined
if (!rawApiUrl?.trim()) {
  throw new Error('VITE_API_URL não definida. Configure no .env / variáveis do deploy.')
}
const API_URL = rawApiUrl.replace(/\/$/, '')

const TOKEN_KEY = 'mariana-mederios-token'

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
  const { token, headers, ...rest } = options
  const res = await fetch(`${API_URL}${path}`, {
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
  url: API_URL,

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
