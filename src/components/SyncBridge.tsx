import { useEffect, useRef, useState } from 'react'
import { api, hasApiUrl } from '../api'
import { normalizeImportedState, usePlanner } from '../store'

export type SyncStatus = 'idle' | 'hydrating' | 'synced' | 'saving' | 'error' | 'offline'

type SyncBridgeProps = {
  onStatus?: (status: SyncStatus, detail?: string) => void
}

/**
 * Hidrata o planner da Mari (GET /planner) e faz PUT debounced a cada mudança.
 */
export function SyncBridge({ onStatus }: SyncBridgeProps) {
  const { state, dispatch } = usePlanner()
  const [ready, setReady] = useState(false)
  const skipPutRef = useRef(false)
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!hasApiUrl()) {
      onStatus?.('offline', 'VITE_API_URL não configurada')
      setReady(true)
      return
    }

    if (hydratedRef.current) return
    hydratedRef.current = true

    let cancelled = false
    setReady(false)
    onStatus?.('hydrating')

    ;(async () => {
      try {
        const remote = await api.getPlanner()
        if (cancelled) return
        skipPutRef.current = true
        dispatch({
          type: 'replace-state',
          state: normalizeImportedState(remote),
        })
        onStatus?.('synced')
      } catch (err) {
        if (cancelled) return
        onStatus?.(
          'error',
          err instanceof Error ? err.message : 'Falha ao carregar o planner',
        )
      } finally {
        if (!cancelled) setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, onStatus])

  useEffect(() => {
    if (!ready || !hasApiUrl()) return
    if (skipPutRef.current) {
      skipPutRef.current = false
      return
    }

    onStatus?.('saving')
    const timer = window.setTimeout(() => {
      api
        .putPlanner(state)
        .then(() => onStatus?.('synced'))
        .catch((err) =>
          onStatus?.(
            'error',
            err instanceof Error ? err.message : 'Falha ao salvar na API',
          ),
        )
    }, 700)

    return () => window.clearTimeout(timer)
  }, [state, ready, onStatus])

  return null
}
