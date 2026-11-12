import { useMemo, useState, type FormEvent } from 'react'
import { formatDeadline } from '../dates'
import type { Book, BookStatus } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const columns: { status: BookStatus; title: string; hint: string }[] = [
  { status: 'em_andamento', title: 'Em andamento', hint: 'O que está na mesa agora.' },
  { status: 'futuro', title: 'Futuros', hint: 'Fila consciente, sem culpa.' },
  { status: 'realizado', title: 'Lidos', hint: 'Já virou repertório.' },
]

const emptyBook = (): Book => ({
  id: uid('book'),
  title: '',
  platform: '',
  status: 'futuro',
  notes: '',
  url: '',
  deadline: '',
})

export function Books() {
  const { state, dispatch } = usePlanner()
  const books = state.books ?? []
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Book>(emptyBook())
  const [editing, setEditing] = useState(false)

  const grouped = useMemo(() => {
    return {
      realizado: books.filter((b) => b.status === 'realizado'),
      em_andamento: books.filter((b) => b.status === 'em_andamento'),
      futuro: books.filter((b) => b.status === 'futuro'),
    }
  }, [books])

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch({
      type: editing ? 'update-book' : 'add-book',
      book: { ...draft, title: draft.title.trim() },
    })
    setOpen(false)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Formação</p>
          <h1>Livros</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyBook())
            setEditing(false)
            setOpen(true)
          }}
        >
          Adicionar livro
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
                text="Adicione um livro ou mova um card mudando o status."
              />
            ) : (
              grouped[column.status].map((book) => (
                <article key={book.id} className="course-card">
                  <h3>{book.title}</h3>
                  <div className="goal-top">
                    <p className="muted">{book.platform || 'Autor / origem livre'}</p>
                    {book.deadline && (
                      <time className="muted" dateTime={book.deadline}>
                        até {formatDeadline(book.deadline)}
                      </time>
                    )}
                  </div>
                  {book.notes && <p>{book.notes}</p>}
                  {book.url && (
                    <a href={book.url} target="_blank" rel="noreferrer">
                      Material
                    </a>
                  )}
                  <div className="row-actions">
                    <label className="sr-only" htmlFor={`book-st-${book.id}`}>
                      Status
                    </label>
                    <select
                      id={`book-st-${book.id}`}
                      value={book.status}
                      onChange={(event) =>
                        dispatch({
                          type: 'update-book',
                          book: {
                            ...book,
                            status: event.target.value as BookStatus,
                          },
                        })
                      }
                    >
                      <option value="em_andamento">Em andamento</option>
                      <option value="futuro">Futuro</option>
                      <option value="realizado">Lido</option>
                    </select>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setDraft(book)
                        setEditing(true)
                        setOpen(true)
                      }}
                    >
                      Editar
                    </button>
                    <DeleteButton
                      label="este livro"
                      onClick={() => dispatch({ type: 'delete-book', id: book.id })}
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
        title={editing ? 'Editar livro' : 'Novo livro'}
        onClose={() => setOpen(false)}
      >
        <form className="form" onSubmit={save}>
          <Field label="Nome">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Ex.: Designing Data-Intensive Applications"
            />
          </Field>
          <Field label="Autor ou origem">
            <input
              value={draft.platform}
              onChange={(e) => setDraft({ ...draft, platform: e.target.value })}
              placeholder="Autor, editora, indicação do time…"
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as BookStatus })
              }
            >
              <option value="em_andamento">Em andamento</option>
              <option value="futuro">Futuro</option>
              <option value="realizado">Lido</option>
            </select>
          </Field>
          <Field label="Prazo (opcional)">
            <input
              type="date"
              value={draft.deadline ?? ''}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            />
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
              placeholder="Por que este livro entra no caminho para júnior?"
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
