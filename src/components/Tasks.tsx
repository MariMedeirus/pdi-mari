import { useMemo, useState, type FormEvent } from 'react'
import type { TaskStatus, WorkTask } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const columns: { status: TaskStatus; title: string; hint: string }[] = [
  { status: 'em_andamento', title: 'Em andamento', hint: 'O que está na mesa hoje.' },
  { status: 'a_fazer', title: 'A fazer', hint: 'Fila da semana de trabalho.' },
  { status: 'feita', title: 'Feitas', hint: 'Já virou evidência.' },
]

const emptyTask = (): WorkTask => ({
  id: uid('task'),
  title: '',
  description: '',
  status: 'a_fazer',
  date: '',
  skillIds: [],
  notes: '',
})

const statusLabel: Record<TaskStatus, string> = {
  a_fazer: 'A fazer',
  em_andamento: 'Em andamento',
  feita: 'Feita',
}

export function Tasks() {
  const { state, dispatch } = usePlanner()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<WorkTask>(emptyTask())

  const grouped = useMemo(
    () => ({
      a_fazer: state.tasks.filter((task) => task.status === 'a_fazer'),
      em_andamento: state.tasks.filter((task) => task.status === 'em_andamento'),
      feita: state.tasks.filter((task) => task.status === 'feita'),
    }),
    [state.tasks],
  )

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch({
      type: editing ? 'update-task' : 'add-task',
      task: { ...draft, title: draft.title.trim() },
    })
    setOpen(false)
  }

  function toggleSkill(id: string) {
    setDraft((current) => ({
      ...current,
      skillIds: current.skillIds.includes(id)
        ? current.skillIds.filter((item) => item !== id)
        : [...current.skillIds, id],
    }))
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Dia a dia</p>
          <h1>Tarefas do trabalho</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyTask())
            setEditing(false)
            setOpen(true)
          }}
        >
          Nova tarefa
        </button>
      </header>

      <div className="kanban">
        {columns.map((column) => (
          <section key={column.status} className="kanban-col">
            <header>
              <h2>{column.title}</h2>
              <span>{grouped[column.status].length}</span>
            </header>
            <p className="hint">{column.hint}</p>
            {grouped[column.status].length === 0 ? (
              <EmptyState
                title="Nada por aqui"
                text="Adicione uma tarefa do expediente ou mude o status de um card."
              />
            ) : (
              grouped[column.status].map((task) => (
                <article key={task.id} className={`task-card status-${task.status}`}>
                  <div className="goal-top">
                    <span className={`badge ${task.status}`}>
                      {statusLabel[task.status]}
                    </span>
                    {task.date && <span className="muted">{task.date}</span>}
                  </div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  {task.notes && <p className="highlights">{task.notes}</p>}
                  <ul className="tags">
                    {task.skillIds.map((id) => {
                      const pillar = state.pillars.find((item) => item.id === id)
                      if (!pillar) return null
                      return (
                        <li
                          key={id}
                          style={{
                            background: `${pillar.color}22`,
                            color: pillar.color,
                          }}
                        >
                          {pillar.name}
                        </li>
                      )
                    })}
                  </ul>
                  <div className="row-actions">
                    <select
                      value={task.status}
                      onChange={(event) =>
                        dispatch({
                          type: 'update-task',
                          task: {
                            ...task,
                            status: event.target.value as TaskStatus,
                          },
                        })
                      }
                    >
                      <option value="a_fazer">A fazer</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="feita">Feita</option>
                    </select>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setDraft(task)
                        setEditing(true)
                        setOpen(true)
                      }}
                    >
                      Editar
                    </button>
                    <DeleteButton
                      onClick={() => dispatch({ type: 'delete-task', id: task.id })}
                    />
                  </div>
                </article>
              ))
            )}
          </section>
        ))}
      </div>

      <Modal
        open={open}
        title={editing ? 'Editar tarefa' : 'Nova tarefa do trabalho'}
        onClose={() => setOpen(false)}
        wide
      >
        <form className="form" onSubmit={save}>
          <Field label="Tarefa">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Ex.: Investigar timeout no endpoint de pagamento"
            />
          </Field>
          <div className="form-grid">
            <Field label="Quando">
              <input
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                placeholder="Hoje, ontem, esta semana…"
              />
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as TaskStatus })
                }
              >
                <option value="a_fazer">A fazer</option>
                <option value="em_andamento">Em andamento</option>
                <option value="feita">Feita</option>
              </select>
            </Field>
          </div>
          <Field label="O que você fez / está fazendo">
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
          <Field label="O que aprendi nisso">
            <textarea
              rows={3}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />
          </Field>
          <fieldset className="skill-picker">
            <legend>Skills trabalhadas</legend>
            <p className="hint">Marque os pilares que essa tarefa exercitou de verdade.</p>
            <div className="picker-grid">
              {state.pillars.map((pillar) => (
                <label key={pillar.id} className="picker-item">
                  <input
                    type="checkbox"
                    checked={draft.skillIds.includes(pillar.id)}
                    onChange={() => toggleSkill(pillar.id)}
                  />
                  <span className="swatch" style={{ background: pillar.color }} />
                  {pillar.name}
                </label>
              ))}
            </div>
          </fieldset>
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
