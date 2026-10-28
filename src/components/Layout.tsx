import type { ReactNode } from 'react'
import portrait from '../assets/mariana.png'
import type { SectionId } from '../types'

const nav: { id: SectionId; label: string; kicker: string }[] = [
  { id: 'inicio', label: 'Início', kicker: 'Visão geral' },
  { id: 'cursos', label: 'Cursos', kicker: 'Formação' },
  { id: 'skills-tec', label: 'Skills técnicas', kicker: 'Ofício' },
  { id: 'skills-beh', label: 'Comportamentais', kicker: 'Postura' },
  { id: 'metas', label: 'Metas', kicker: 'Direção' },
  { id: 'topicos', label: 'Tópicos', kicker: 'Pesquisar' },
  { id: 'tarefas', label: 'Tarefas', kicker: 'Dia a dia' },
]

export function Layout({
  section,
  onSection,
  menuOpen,
  onMenu,
  children,
}: {
  section: SectionId
  onSection: (id: SectionId) => void
  menuOpen: boolean
  onMenu: (open: boolean) => void
  children: ReactNode
}) {
  function go(id: SectionId) {
    onSection(id)
    onMenu(false)
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <img
            className="brand-photo"
            src={portrait}
            alt="Mariana Mederios"
          />
          <div className='text-start'>
            <strong>Mariana Mederios</strong>
            <span>Backend · Estágio</span>
          </div>
        </div>
        <nav>
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={section === item.id ? 'is-active' : ''}
              onClick={() => go(item.id)}
            >
              <em>{item.kicker}</em>
              {item.label}
            </button>
          ))}
        </nav>
        <p className="sidebar-note">
          Tudo fica salvo neste navegador (Local Storage).
        </p>
      </aside>
      {menuOpen && (
        <button
          type="button"
          className="scrim"
          aria-label="Fechar menu"
          onClick={() => onMenu(false)}
        />
      )}
      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="menu-btn"
            onClick={() => onMenu(!menuOpen)}
            aria-label="Abrir menu"
          >
            <span />
            <span />
          </button>
          <p>Plano de desenvolvimento · Mariana</p>
        </header>
        <main>
          <div className="page-enter" key={section}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
