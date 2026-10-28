import { useMemo, useState, type FormEvent } from 'react'
import type { Topic, TopicStatus } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const emptyTopic = (): Topic => ({
  id: uid('topic'),
  term: '',
  context: '',
  status: 'pendente',
  notes: '',
  createdAt: new Date().toISOString(),
  researchedAt: '',
})

export function Topics() {
  const { state, dispatch } = usePlanner()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'todos' | TopicStatus>('todos')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Topic>(emptyTopic())
  const [study, setStudy] = useState<Topic | null>(null)

  const list = useMemo(() => {
    return state.topics.filter((topic) => {
      const matchesTab = tab === 'todos' || topic.status === tab
      const blob = `${topic.term} ${topic.context} ${topic.notes}`.toLowerCase()
      return matchesTab && blob.includes(query.toLowerCase())
    })
  }, [query, state.topics, tab])

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.term.trim()) return
    dispatch({
      type: editing ? 'update-topic' : 'add-topic',
      topic: { ...draft, term: draft.term.trim() },
    })
    setOpen(false)
  }

  function saveStudy(event: FormEvent) {
    event.preventDefault()
    if (!study) return
    dispatch({
      type: 'update-topic',
      topic: {
        ...study,
        researchedAt:
          study.status === 'pesquisado'
            ? study.researchedAt || new Date().toISOString()
            : '',
      },
    })
    setStudy(null)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Vocabulário do ofício</p>
          <h1>Tópicos para pesquisar</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyTopic())
            setEditing(false)
            setOpen(true)
          }}
        >
          Novo tópico
        </button>
      </header>

      <div className="toolbar">
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar termo, contexto ou anotação"
        />
        <div className="pills">
          {(['todos', 'pendente', 'pesquisado'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={tab === id ? 'pill is-on' : 'pill'}
              onClick={() => setTab(id)}
            >
              {id === 'todos' ? 'todos' : id === 'pendente' ? 'pendentes' : 'pesquisados'}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Nenhum tópico neste recorte"
          text="Quando surgir um termo na daily, na PR ou no log, capture aqui."
        />
      ) : (
        <ul className="topic-list">
          {list.map((topic) => (
            <li key={topic.id} className="topic-card">
              <div className="topic-head">
                <h3>{topic.term}</h3>
                <span className={`badge ${topic.status}`}>
                  {topic.status === 'pendente' ? 'A pesquisar' : 'Pesquisado'}
                </span>
              </div>
              {topic.context && (
                <p>
                  <span className="muted">Onde apareceu: </span>
                  {topic.context}
                </p>
              )}
              {topic.notes ? (
                <div className="learned">
                  <p className="eyebrow">O que eu aprendi</p>
                  <p>{topic.notes}</p>
                </div>
              ) : (
                <p className="muted">Ainda sem anotação — abra para registrar a pesquisa.</p>
              )}
              <div className="row-actions">
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => setStudy(topic)}
                >
                  {topic.notes ? 'Editar o que aprendi' : 'Registrar pesquisa'}
                </button>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() => {
                    setDraft(topic)
                    setEditing(true)
                    setOpen(true)
                  }}
                >
                  Editar tópico
                </button>
                <DeleteButton
                  onClick={() => dispatch({ type: 'delete-topic', id: topic.id })}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        title={editing ? 'Editar tópico' : 'Capturar tópico'}
        onClose={() => setOpen(false)}
      >
        <form className="form" onSubmit={save}>
          <Field label="Termo">
            <input
              required
              value={draft.term}
              onChange={(e) => setDraft({ ...draft, term: e.target.value })}
              placeholder="Ex.: outbox, p99, BFF"
            />
          </Field>
          <Field label="Onde isso apareceu">
            <textarea
              rows={3}
              value={draft.context}
              onChange={(e) => setDraft({ ...draft, context: e.target.value })}
              placeholder="Daily, review, log, conversa de arquitetura…"
            />
          </Field>
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn">
              Salvar
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(study)}
        title={study ? `Pesquisar: ${study.term}` : ''}
        onClose={() => setStudy(null)}
        wide
      >
        {study && (
          <form className="form" onSubmit={saveStudy}>
            <p className="muted">
              Escreva com as suas palavras. Tutorial colado não conta como aprendizado —
              se você explica, você ficou com o conceito.
            </p>
            <Field label="O que esse termo significa, no meu contexto">
              <textarea
                rows={10}
                value={study.notes}
                onChange={(e) =>
                  setStudy({
                    ...study,
                    notes: e.target.value,
                    status: e.target.value.trim()
                      ? 'pesquisado'
                      : study.status,
                  })
                }
                placeholder="Definição, exemplo no sistema do estágio, analogia, cuidados…"
              />
            </Field>
            <label className="inline-check">
              <input
                type="checkbox"
                checked={study.status === 'pesquisado'}
                onChange={(e) =>
                  setStudy({
                    ...study,
                    status: e.target.checked ? 'pesquisado' : 'pendente',
                  })
                }
              />
              Marcar como pesquisado
            </label>
            <div className="form-actions">
              <button type="button" className="btn ghost" onClick={() => setStudy(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn">
                Anexar aprendizado
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
