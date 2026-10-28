import { useMemo, useState, type FormEvent } from 'react'
import type { SkillCategory, SkillPillar } from '../types'
import { uid, usePlanner } from '../store'
import { DeleteButton } from './Icons'
import { Field, Modal } from './Modal'
import { ProgressBar } from './Progress'

export function Skills({ category }: { category: SkillCategory }) {
  const { state, dispatch, pillarProgress, categoryProgress } = usePlanner()
  const pillars = state.pillars.filter((p) => p.category === category)
  const [openId, setOpenId] = useState<string | null>(pillars[0]?.id ?? null)
  const [addingFor, setAddingFor] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [detail, setDetail] = useState('')

  const overall = categoryProgress(category)
  const copy =
    category === 'tecnica'
      ? {
        eyebrow: 'Ofício',
        title: 'Skills técnicas',
      }
      : {
        eyebrow: 'Postura',
        title: 'Skills comportamentais',
      }

  const current = pillars.find((p) => p.id === openId) ?? pillars[0]

  function addCheck(event: FormEvent) {
    event.preventDefault()
    if (!addingFor || !label.trim()) return
    dispatch({
      type: 'add-check',
      pillarId: addingFor,
      check: {
        id: uid('check'),
        label: label.trim(),
        detail: detail.trim() || 'Habilidade adicionada por você no dia a dia.',
        done: false,
        custom: true,
      },
    })
    setLabel('')
    setDetail('')
    setAddingFor(null)
  }

  return (
    <div className="stack">
      <header className="section-head">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className="overall-chip">
          <b>{overall}%</b>
          <span>média dos pilares</span>
        </div>
      </header>

      <div className="skills-layout">
        <ul className="pillar-nav">
          {pillars.map((pillar) => {
            const value = pillarProgress(pillar)
            const done = pillar.checks.filter((c) => c.done).length
            return (
              <li key={pillar.id}>
                <button
                  type="button"
                  className={pillar.id === current?.id ? 'is-active' : ''}
                  onClick={() => setOpenId(pillar.id)}
                >
                  <span className="swatch" style={{ background: pillar.color }} />
                  <span className="pillar-nav-copy">
                    <strong>{pillar.name}</strong>
                    <em>
                      {done}/{pillar.checks.length} · {value}%
                    </em>
                  </span>
                  <ProgressBar value={value} color={pillar.color} />
                </button>
              </li>
            )
          })}
        </ul>

        {current && (
          <SkillDetail
            pillar={current}
            progress={pillarProgress(current)}
            onToggle={(checkId) =>
              dispatch({
                type: 'toggle-check',
                pillarId: current.id,
                checkId,
              })
            }
            onDelete={(checkId) =>
              dispatch({
                type: 'delete-check',
                pillarId: current.id,
                checkId,
              })
            }
            onAdd={() => setAddingFor(current.id)}
          />
        )}
      </div>

      <Modal
        open={Boolean(addingFor)}
        title="Nova habilidade do dia a dia"
        onClose={() => setAddingFor(null)}
      >
        <form className="form" onSubmit={addCheck}>
          <Field label="O que você conquistou / quer conquistar">
            <input
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex.: Li o EXPLAIN de uma query lenta do time"
            />
          </Field>
          <Field label="Como você sabe que chegou lá">
            <textarea
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Critério visível, não vago."
            />
          </Field>
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={() => setAddingFor(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn">
              Adicionar check
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function SkillDetail({
  pillar,
  progress,
  onToggle,
  onDelete,
  onAdd,
}: {
  pillar: SkillPillar
  progress: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  const [filter, setFilter] = useState<'todas' | 'abertas' | 'feitas'>('todas')
  const perCheck = pillar.checks.length
    ? Math.round((100 / pillar.checks.length) * 10) / 10
    : 0
  const visible = useMemo(() => {
    if (filter === 'abertas') return pillar.checks.filter((c) => !c.done)
    if (filter === 'feitas') return pillar.checks.filter((c) => c.done)
    return pillar.checks
  }, [filter, pillar.checks])

  return (
    <article className="skill-detail">
      <header>
        <p className="eyebrow" style={{ color: pillar.color }}>
          {perCheck}% por check
        </p>
        <h2>{pillar.name}</h2>
        <p>{pillar.description}</p>
        <div className="skill-progress">
          <div className="skill-meter">
            <strong>{progress}%</strong>
            <span>
              {pillar.checks.filter((c) => c.done).length} de {pillar.checks.length}{' '}
              habilidades
            </span>
          </div>
          <ProgressBar value={progress} color={pillar.color} />
        </div>
        <div className="row-actions wrap">
          <div className="pills">
            {(['todas', 'abertas', 'feitas'] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={filter === id ? 'pill is-on' : 'pill'}
                onClick={() => setFilter(id)}
              >
                {id}
              </button>
            ))}
          </div>
          <button type="button" className="btn" onClick={onAdd}>
            Adicionar habilidade
          </button>
        </div>
      </header>
      <ul className="checks">
        {visible.map((check) => (
          <li key={check.id} className={check.done ? 'is-done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={check.done}
                onChange={() => onToggle(check.id)}
              />
              <span>
                <strong>{check.label}</strong>
                <em>{check.detail}</em>
              </span>
            </label>
            <DeleteButton onClick={() => onDelete(check.id)} />
          </li>
        ))}
      </ul>
    </article>
  )
}
