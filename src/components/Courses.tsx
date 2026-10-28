import { useMemo, useState, type FormEvent } from 'react'
import type { Course, CourseStatus } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const columns: { status: CourseStatus; title: string; hint: string }[] = [
  { status: 'em_andamento', title: 'Em andamento', hint: 'O que está na mesa agora.' },
  { status: 'futuro', title: 'Futuros', hint: 'Fila consciente, sem culpa.' },
  { status: 'realizado', title: 'Realizados', hint: 'Já virou repertório.' },
]

const emptyCourse = (): Course => ({
  id: uid('course'),
  title: '',
  platform: '',
  status: 'futuro',
  notes: '',
  url: '',
})

export function Courses() {
  const { state, dispatch } = usePlanner()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Course>(emptyCourse())
  const [editing, setEditing] = useState(false)

  const grouped = useMemo(() => {
    return {
      realizado: state.courses.filter((c) => c.status === 'realizado'),
      em_andamento: state.courses.filter((c) => c.status === 'em_andamento'),
      futuro: state.courses.filter((c) => c.status === 'futuro'),
    }
  }, [state.courses])

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch({
      type: editing ? 'update-course' : 'add-course',
      course: { ...draft, title: draft.title.trim() },
    })
    setOpen(false)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Formação</p>
          <h1>Cursos</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyCourse())
            setEditing(false)
            setOpen(true)
          }}
        >
          Adicionar curso
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
                text="Adicione um curso ou mova um card mudando o status."
              />
            ) : (
              grouped[column.status].map((course) => (
                <article key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p className="muted">{course.platform || 'Plataforma livre'}</p>
                  {course.notes && <p>{course.notes}</p>}
                  {course.url && (
                    <a href={course.url} target="_blank" rel="noreferrer">
                      Material
                    </a>
                  )}
                  <div className="row-actions">
                    <label className="sr-only" htmlFor={`st-${course.id}`}>
                      Status
                    </label>
                    <select
                      id={`st-${course.id}`}
                      value={course.status}
                      onChange={(event) =>
                        dispatch({
                          type: 'update-course',
                          course: {
                            ...course,
                            status: event.target.value as CourseStatus,
                          },
                        })
                      }
                    >
                      <option value="em_andamento">Em andamento</option>
                      <option value="futuro">Futuro</option>
                      <option value="realizado">Realizado</option>
                    </select>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setDraft(course)
                        setEditing(true)
                        setOpen(true)
                      }}
                    >
                      Editar
                    </button>
                    <DeleteButton
                      onClick={() => dispatch({ type: 'delete-course', id: course.id })}
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
        title={editing ? 'Editar curso' : 'Novo curso'}
        onClose={() => setOpen(false)}
      >
        <form className="form" onSubmit={save}>
          <Field label="Nome">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Ex.: Observabilidade na prática"
            />
          </Field>
          <Field label="Plataforma ou origem">
            <input
              value={draft.platform}
              onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
              placeholder="Alura, YouTube, time, livro…"
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as CourseStatus })
              }
            >
              <option value="em_andamento">Em andamento</option>
              <option value="futuro">Futuro</option>
              <option value="realizado">Realizado</option>
            </select>
          </Field>
          <Field label="Link (opcional)">
            <input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://"
            />
          </Field>
          <Field label="Notas">
            <textarea
              rows={4}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="Por que este curso entra no caminho para júnior?"
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
