import { useRef, useState, type ChangeEvent } from 'react'
import type { PlannerState } from '../types'
import { buildBackup, normalizeImportedState, usePlanner } from '../store'
import { Modal } from './Modal'

export function BackupBar() {
  const { state, dispatch } = usePlanner()
  const inputRef = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [pending, setPending] = useState<PlannerState | null>(null)

  function download() {
    const payload = buildBackup(state)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const stamp = new Date().toISOString().slice(0, 10)
    const link = document.createElement('a')
    link.href = url
    link.download = `mariana-plano-backup-${stamp}.json`
    link.click()
    URL.revokeObjectURL(url)
    setFeedback('Backup baixado.')
  }

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        setPending(normalizeImportedState(JSON.parse(String(reader.result))))
        setFeedback(null)
      } catch {
        setFeedback('Arquivo inválido. Use um JSON deste plano.')
      }
    }
    reader.readAsText(file)
  }

  function applyPending() {
    if (!pending) return
    dispatch({ type: 'replace-state', state: pending })
    setPending(null)
    setFeedback('Backup carregado.')
  }

  return (
    <div className="backup-bar">
      <button type="button" className="btn ghost sm" onClick={download}>
        Baixar backup
      </button>
      <button
        type="button"
        className="btn ghost sm"
        onClick={() => inputRef.current?.click()}
      >
        Carregar dados
      </button>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="application/json,.json"
        onChange={onFile}
      />
      {feedback && <p className="backup-feedback">{feedback}</p>}
      <Modal
        open={Boolean(pending)}
        title="Carregar backup"
        onClose={() => setPending(null)}
      >
        <p className="muted">
          Isso substitui todos os dados salvos neste navegador. Cursos, skills,
          metas, tópicos e tarefas passam a ser os do arquivo.
        </p>
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={() => setPending(null)}>
            Cancelar
          </button>
          <button type="button" className="btn" onClick={applyPending}>
            Carregar
          </button>
        </div>
      </Modal>
    </div>
  )
}
