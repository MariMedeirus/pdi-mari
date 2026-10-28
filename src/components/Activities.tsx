import { useMemo, useState, type FormEvent } from 'react'
import type { PracticeActivity, SkillPillar } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { EmptyState, Field, Modal } from './Modal'

const emptyActivity = (): PracticeActivity => ({
  id: uid('act'),
  title: '',
  context: '',
  period: '',
  description: '',
  skillsNote: '',
  skillIds: [],
})

function todayPeriod() {
  return new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Activities() {
  const { state, dispatch } = usePlanner()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'todas' | 'tecnica' | 'comportamental'>('todas')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<PracticeActivity>(emptyActivity())

  const techPillars = state.pillars.filter((pillar) => pillar.category === 'tecnica')
  const behPillars = state.pillars.filter((pillar) => pillar.category === 'comportamental')

  const list = useMemo(() => {
    return state.activities.filter((activity) => {
      const blob =
        `${activity.title} ${activity.context} ${activity.description} ${activity.skillsNote}`.toLowerCase()
      if (!blob.includes(query.toLowerCase())) return false
      if (filter === 'todas') return true
      return activity.skillIds.some((id) => {
        const pillar = state.pillars.find((item) => item.id === id)
        return pillar?.category === filter
      })
    })
  }, [filter, query, state.activities, state.pillars])

  function save(event: FormEvent) {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch({
      type: editing ? 'update-activity' : 'add-activity',
      activity: {
        ...draft,
        title: draft.title.trim(),
        context: draft.context.trim(),
        period: draft.period.trim(),
        description: draft.description.trim(),
        skillsNote: draft.skillsNote.trim(),
      },
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

  function pillarsOf(activity: PracticeActivity, category: SkillPillar['category']) {
    return activity.skillIds
      .map((id) => state.pillars.find((pillar) => pillar.id === id))
      .filter((pillar): pillar is SkillPillar => pillar?.category === category)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">Evidência</p>
          <h1>Atividades práticas</h1>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setDraft(emptyActivity())
            setEditing(false)
            setOpen(true)
          }}
        >
          Nova atividade
        </button>
      </header>

      <div className="toolbar">
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar título, contexto, o que você fez ou skills"
        />
        <div className="pills">
          {(
            [
              ['todas', 'todas'],
              ['tecnica', 'técnicas'],
              ['comportamental', 'comportamentais'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={filter === id ? 'pill is-on' : 'pill'}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Nenhuma atividade por aqui"
          text="Registre uma tarefa real em que você participou — o portfólio cresce com evidência, não com vitrine."
        />
      ) : (
        <ul className="activity-list">
          {list.map((activity) => {
            const tech = pillarsOf(activity, 'tecnica')
            const beh = pillarsOf(activity, 'comportamental')
            return (
              <li key={activity.id}>
                <article className="activity-card">
                  <div className="goal-top">
                    {activity.context && (
                      <span className="badge em_andamento">{activity.context}</span>
                    )}
                    {activity.period && <span className="muted">{activity.period}</span>}
                  </div>
                  <h3>{activity.title}</h3>
                  {activity.description && <p>{activity.description}</p>}
                  {activity.skillsNote && (
                    <p className="highlights">{activity.skillsNote}</p>
                  )}
                  {(tech.length > 0 || beh.length > 0) && (
                    <div className="activity-skills">
                      {tech.length > 0 && (
                        <div>
                          <p className="eyebrow">Skills técnicas</p>
                          <ul className="tags">
                            {tech.map((pillar) => (
                              <li
                                key={pillar.id}
                                style={{
                                  background: `${pillar.color}22`,
                                  color: pillar.color,
                                }}
                              >
                                {pillar.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {beh.length > 0 && (
                        <div>
                          <p className="eyebrow">Comportamentais</p>
                          <ul className="tags">
                            {beh.map((pillar) => (
                              <li
                                key={pillar.id}
                                style={{
                                  background: `${pillar.color}22`,
                                  color: pillar.color,
                                }}
                              >
                                {pillar.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="row-actions">
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        setDraft(activity)
                        setEditing(true)
                        setOpen(true)
                      }}
                    >
                      Editar
                    </button>
                    <DeleteButton
                      onClick={() =>
                        dispatch({ type: 'delete-activity', id: activity.id })
                      }
                    />
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={open}
        title={editing ? 'Editar atividade' : 'Nova atividade prática'}
        onClose={() => setOpen(false)}
        wide
      >
        <form className="form" onSubmit={save}>
          <Field label="Atividade">
            <input
              required
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Ex.: Investigar 500 no endpoint de listagem"
            />
          </Field>
          <div className="form-grid">
            <Field label="Onde / contexto">
              <input
                value={draft.context}
                onChange={(event) => setDraft({ ...draft, context: event.target.value })}
                placeholder="Estágio, faculdade, projeto pessoal…"
              />
            </Field>
            <div className="field">
              <span>Período</span>
              <div className="field-row">
                <input
                  aria-label="Período"
                  value={draft.period}
                  onChange={(event) => setDraft({ ...draft, period: event.target.value })}
                  placeholder="Outubro 2026, 1º semestre…"
                />
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setDraft({ ...draft, period: todayPeriod() })}
                >
                  Hoje
                </button>
              </div>
            </div>
          </div>
          <Field label="O que você fez">
            <textarea
              required
              rows={4}
              value={draft.description}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
              placeholder="O caminho concreto: o que pegou, o que mudou, com quem, o que saiu."
            />
          </Field>
          <Field label="Skills envolvidas nessa tarefa">
            <textarea
              rows={3}
              value={draft.skillsNote}
              onChange={(event) =>
                setDraft({ ...draft, skillsNote: event.target.value })
              }
              placeholder="EX.: logs, EXPLAIN, review de contrato, alinhamento com o time…"
            />
          </Field>
          <fieldset className="skill-picker">
            <legend>Skills técnicas cadastradas</legend>
            <p className="hint">Marque os pilares técnicos que essa atividade exercitou.</p>
            <div className="picker-grid">
              {techPillars.map((pillar) => (
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
          <fieldset className="skill-picker">
            <legend>Skills comportamentais cadastradas</legend>
            <p className="hint">Marque os pilares de postura que essa atividade puxou.</p>
            <div className="picker-grid">
              {behPillars.map((pillar) => (
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
