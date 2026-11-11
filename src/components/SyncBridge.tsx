import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import { useAuth } from '../auth'
import { normalizeImportedState, usePlanner } from '../store'

export type SyncStatus = 'idle' | 'hydrating' | 'synced' | 'saving' | 'error' | 'offline'

type SyncBridgeProps = {
  onStatus?: (status: SyncStatus, detail?: string) => void
}

/**
 * Hidrata o planner a partir da API e faz PUT debounced a cada mudança.
 * Deve ficar dentro de AuthProvider + PlannerProvider.
 */
export function SyncBridge({ onStatus }: SyncBridgeProps) {
  const { status, token, sessionKind } = useAuth()
  const { state, dispatch } = usePlanner()
  const [ready, setReady] = useState(false)
  const skipPutRef = useRef(false)
  const hydrateKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (status !== 'authenticated' || !token) {
      hydrateKeyRef.current = null
      setReady(false)
      onStatus?.(status === 'anonymous' ? 'offline' : 'idle')
      return
    }

    const key = `${token}:${sessionKind ?? 'restore'}`
    if (hydrateKeyRef.current === key) return
    hydrateKeyRef.current = key

    let cancelled = false
    setReady(false)
    onStatus?.('hydrating')

    ;(async () => {
      try {
        if (sessionKind === 'register') {
          // Conta nova: envia o progresso local (não sobrescreve com o seed do servidor)
          skipPutRef.current = true
          await api.putPlanner(token, state)
          if (cancelled) return
          onStatus?.('synced')
        } else {
          const remote = await api.getPlanner(token)
          if (cancelled) return
          skipPutRef.current = true
          dispatch({
            type: 'replace-state',
            state: normalizeImportedState(remote),
          })
          onStatus?.('synced')
        }
      } catch (err) {
        if (cancelled) return
        onStatus?.(
          'error',
          err instanceof Error ? err.message : 'Falha ao sincronizar',
        )
      } finally {
        if (!cancelled) setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
    // state de propósito fora das deps: usamos o snapshot do momento do register
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token, sessionKind, dispatch, onStatus])

  useEffect(() => {
    if (!ready || status !== 'authenticated' || !token) return
    if (skipPutRef.current) {
      skipPutRef.current = false
      return
    }

    onStatus?.('saving')
    const timer = window.setTimeout(() => {
      api
        .putPlanner(token, state)
        .then(() => onStatus?.('synced'))
        .catch((err) =>
          onStatus?.(
            'error',
            err instanceof Error ? err.message : 'Falha ao salvar na API',
          ),
        )
    }, 700)

    return () => window.clearTimeout(timer)
  }, [state, ready, status, token, onStatus])

  return null
}
