import { useState, type FormEvent } from 'react'
import { formatDeadline } from '../dates'
import type { Goal, GoalHorizon, GoalStatus } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const horizons: { id: GoalHorizon; title: string }[] = [
  { id: 'curto', title: 'Curto prazo' },
  { id: 'medio', title: 'Médio prazo' },
  { id: 'longo', title: 'Longo prazo' },
]

const emptyGoal = (): Goal => ({
  id: uid('goal'),
  title: '',
  description: '',
  horizon: 'curto',
  status: 'nao_iniciada',
  deadline: '',
})

const statusLabel: Record<GoalStatus, string> = {
  nao_iniciada: 'Não iniciada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export function Goals() {
  const { state, dispatch } = usePlanner()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Goal>(emptyGoal())

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch({
      type: editing ? 'update-goal' : 'add-goal',
      goal: { ...draft, title: draft.title.trim() },
    })
    setOpen(false)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Direção</p>
          <h1>Metas</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyGoal())
            setEditing(false)
            setOpen(true)
          }}
        >
          Nova meta
        </button>
      </header>

      <div className="goals-grid">
        {horizons.map((horizon) => {
          const items = state.goals.filter((g) => g.horizon === horizon.id)
          return (
            <section key={horizon.id} className="panel">
              <header className="panel-head">
                <h2>{horizon.title}</h2>
                <span className="count">{items.length}</span>
              </header>
              {items.length === 0 ? (
                <EmptyState title="Sem metas neste horizonte" text="Adicione uma para dar forma ao período." />
              ) : (
                items.map((goal) => (
                  <article key={goal.id} className={`goal-card status-${goal.status}`}>
                    <div className="goal-top">
                      <span className={`badge ${goal.status}`}>{statusLabel[goal.status]}</span>
                      {goal.deadline && (
                        <time dateTime={goal.deadline}>
                          até {formatDeadline(goal.deadline)}
                        </time>
                      )}
                    </div>
                    <h3>{goal.title}</h3>
                    {goal.description && <p>{goal.description}</p>}
                    <div className="row-actions">
                      <select
                        value={goal.status}
                        onChange={(e) =>
                          dispatch({
                            type: 'update-goal',
                            goal: { ...goal, status: e.target.value as GoalStatus },
                          })
                        }
                      >
                        <option value="nao_iniciada">Não iniciada</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="concluida">Concluída</option>
                      </select>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => {
                          setDraft(goal)
                          setEditing(true)
                          setOpen(true)
                        }}
                      >
                        Editar
                      </button>
                      <DeleteButton
                        onClick={() => dispatch({ type: 'delete-goal', id: goal.id })}
                      />
                    </div>
                  </article>
                ))
              )}
            </section>
          )
        })}
      </div>

      <Modal open={open} title={editing ? 'Editar meta' : 'Nova meta'} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={save}>
          <Field label="Meta">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Ex.: Explicar um request do sistema de ponta a ponta"
            />
          </Field>
          <Field label="Horizonte">
            <select
              value={draft.horizon}
              onChange={(e) =>
                setDraft({ ...draft, horizon: e.target.value as GoalHorizon })
              }
            >
              <option value="curto">Curto prazo</option>
              <option value="medio">Médio prazo</option>
              <option value="longo">Longo prazo</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as GoalStatus })
              }
            >
              <option value="nao_iniciada">Não iniciada</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </Field>
          <Field label="Prazo (opcional)">
            <input
              type="date"
              value={draft.deadline ?? ''}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            />
          </Field>
          <Field label="Por que isso importa">
            <textarea
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
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
    </div>
  )
}
