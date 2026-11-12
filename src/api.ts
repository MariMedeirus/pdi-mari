import type { PlannerState } from './types'

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getApiUrl()
  if (!base) {
    throw new ApiError(
      0,
      'URL da API não configurada. Defina VITE_API_URL no deploy.',
    )
  }

  const { headers, ...rest } = options
  const res = await fetch(`${base}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
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

  getPlanner() {
    return request<PlannerResponse>('/planner')
  },

  putPlanner(state: PlannerState) {
    return request<PlannerResponse>('/planner', {
      method: 'PUT',
      body: JSON.stringify(state),
    })
  },
}
