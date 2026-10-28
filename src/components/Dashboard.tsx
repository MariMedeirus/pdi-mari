import type { GoalStatus, SectionId } from '../types'
import { usePlanner } from '../store'
import { EmptyState } from './Modal'
import { ProgressBar, ProgressRing } from './Progress'

const weekStatus: Record<GoalStatus, string> = {
  nao_iniciada: 'Não iniciada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export function Dashboard({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void
}) {
  const { state, pillarProgress, categoryProgress, juniorReadiness } = usePlanner()
  const tech = categoryProgress('tecnica')
  const beh = categoryProgress('comportamental')
  const pendingTopics = state.topics.filter((t) => t.status === 'pendente').length
  const doingCourses = state.courses.filter((c) => c.status === 'em_andamento').length
  const openGoals = state.goals.filter((g) => g.status !== 'concluida').length
  const weekGoals = state.goals.filter((g) => g.horizon === 'curto')
  const weekDone = weekGoals.filter((g) => g.status === 'concluida').length

  const techPillars = state.pillars.filter((p) => p.category === 'tecnica')

  return (
    <div className="stack">
      <section className="hero-card">
        <p className="eyebrow code-eyebrow">
          <span className="tok-cmt">// plano.deenvolvimento.ts</span>
        </p>
        <h1>
          <span className="tok-tag">&lt;</span>
          Mariana Mederios
          <span className="tok-tag"> /&gt;</span>
        </h1>
        <p className="lede">
          Estagiária em{' '}
          <span className="tok-type">Engenharia de Software</span>
          <span className="tok-punc">;</span> foco em{' '}
          <span className="tok-fn">backend</span>
          <span className="tok-punc">.</span>
        </p>
        <div className="hero-meta">
          <span className="tok-tag">&lt;Backend /&gt;</span>
          <span>
            <span className="tok-kw">from</span> estágio{' '}
            <span className="tok-punc">-&gt;</span> júnior
          </span>
          <span className="tok-fn">prática.deliberada()</span>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card featured">
          <ProgressRing value={juniorReadiness} label="prontidão" />
          <div>
            <p className="eyebrow code-eyebrow">
              <span className="tok-cmt">// rumo à vaga júnior</span>
            </p>
            <h2 className="code-title">
              <span className="tok-kw">const</span>{' '}
              <span className="tok-fn">prontidão</span>{' '}
              <span className="tok-punc">= {'{'}</span>
            </h2>
            <p className="code-line">
              <span>
                <span className="tok-prop">tech</span>
                <span className="tok-punc">:</span>{' '}
                <span className="tok-num">60%</span>
                <span className="tok-punc">,</span>
              </span>
              <span>
                <span className="tok-prop">soft</span>
                <span className="tok-punc">:</span>{' '}
                <span className="tok-num">30%</span>
                <span className="tok-punc">,</span>
              </span>
              <span>
                <span className="tok-prop">cursos</span>
                <span className="tok-punc">:</span>{' '}
                <span className="tok-num">10%</span>
                <span className="tok-punc">,</span>
              </span>
              <span className="tok-punc">{'};'}</span>
            </p>
          </div>
        </article>
        <button type="button" className="stat-card" onClick={() => onNavigate('skills-tec')}>
          <strong>{tech}%</strong>
          <span>Skills técnicas</span>
        </button>
        <button type="button" className="stat-card" onClick={() => onNavigate('skills-beh')}>
          <strong>{beh}%</strong>
          <span>Comportamentais</span>
        </button>
        <button type="button" className="stat-card" onClick={() => onNavigate('cursos')}>
          <strong>
            {doingCourses}/{state.courses.length}
          </strong>
          <span>Cursos em andamento</span>
        </button>
        <button type="button" className="stat-card" onClick={() => onNavigate('topicos')}>
          <strong>{pendingTopics}</strong>
          <span>Tópicos para pesquisar</span>
        </button>
        <button type="button" className="stat-card" onClick={() => onNavigate('metas')}>
          <strong>{openGoals}</strong>
          <span>Metas abertas</span>
        </button>
        <button type="button" className="stat-card" onClick={() => onNavigate('tarefas')}>
          <strong>
            {state.tasks.filter((task) => task.status !== 'feita').length}
          </strong>
          <span>Tarefas abertas</span>
        </button>
      </section>

      <section className="split">
        <article className="panel">
          <header className="panel-head">
            <h2>
              <span className="tok-tag">&lt;</span>
              pilares
              <span className="tok-tag"> /&gt;</span>
            </h2>
            <button type="button" className="text-btn" onClick={() => onNavigate('skills-tec')}>
              Abrir skills
            </button>
          </header>
          <ul className="pillar-mini">
            {techPillars.map((pillar) => {
              const value = pillarProgress(pillar)
              return (
                <li key={pillar.id}>
                  <div>
                    <span>{pillar.name}</span>
                    <b>{value}%</b>
                  </div>
                  <ProgressBar value={value} color={pillar.color} />
                </li>
              )
            })}
          </ul>
        </article>
        <article className="panel">
          <header className="panel-head">
            <h2>
              <span className="tok-fn">metas</span>
              <span className="tok-punc">.</span>
              semana
              <span className="tok-punc">(<span className="tok-kw">curtoPrazo</span>);</span>
            </h2>
            <button type="button" className="text-btn" onClick={() => onNavigate('metas')}>
              Ver todas
            </button>
          </header>
          {weekGoals.length === 0 ? (
            <EmptyState
              title="Nenhuma meta de curto prazo"
              text="Cadastre em Metas o que precisa sair nesta semana."
            />
          ) : (
            <ul className="week-goals">
              {weekGoals.map((goal) => (
                <li key={goal.id} className={goal.status === 'concluida' ? 'is-done' : ''}>
                  <span className={`badge ${goal.status}`}>{weekStatus[goal.status]}</span>
                  <div>
                    <strong>{goal.title}</strong>
                    {goal.description && <p className="muted">{goal.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {weekGoals.length > 0 && (
            <p className="footnote">
              {weekDone} de {weekGoals.length}{' '}
              {weekGoals.length === 1 ? 'concluída' : 'concluídas'} nesta semana.
            </p>
          )}
        </article>
      </section>
    </div>
  )
}
