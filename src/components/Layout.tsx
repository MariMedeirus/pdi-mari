import type { ReactNode } from 'react'
import portrait from '../assets/mariana.png'
import type { SectionId } from '../types'
import { BackupBar } from './Backup'
import { LogoMark } from './Icons'
import type { SyncStatus } from './SyncBridge'

const nav: { id: SectionId; label: string; kicker: string }[] = [
  { id: 'inicio', label: 'Início', kicker: 'Visão geral' },
  { id: 'cursos', label: 'Cursos', kicker: 'Formação' },
  { id: 'livros', label: 'Livros', kicker: 'Leitura' },
  { id: 'skills-tec', label: 'Skills técnicas', kicker: 'Ofício' },
  { id: 'skills-beh', label: 'Comportamentais', kicker: 'Postura' },
  { id: 'metas', label: 'Metas', kicker: 'Direção' },
  { id: 'topicos', label: 'Tópicos', kicker: 'Pesquisar' },
  { id: 'tarefas', label: 'Tarefas', kicker: 'Dia a dia' },
  { id: 'atividades', label: 'Atividades', kicker: 'Prática' },
]

function syncLabel(status: SyncStatus) {
  switch (status) {
    case 'hydrating':
      return 'Sincronizando…'
    case 'saving':
      return 'Salvando na API…'
    case 'synced':
      return 'Sincronizado'
    case 'error':
      return 'Erro na sync'
    case 'offline':
      return 'Só neste navegador'
    default:
      return 'API'
  }
}

export function Layout({
  section,
  onSection,
  menuOpen,
  onMenu,
  syncStatus = 'idle',
  syncDetail,
  children,
}: {
  section: SectionId
  onSection: (id: SectionId) => void
  menuOpen: boolean
  onMenu: (open: boolean) => void
  syncStatus?: SyncStatus
  syncDetail?: string
  children: ReactNode
}) {
  function go(id: SectionId) {
    onSection(id)
    onMenu(false)
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="app-mark">
          <LogoMark />
          <div>
            <strong>
              <span className="tok-fn">plano</span>
              <span className="tok-punc">.</span>
              dev
            </strong>
            <span className="app-mark-kicker">estágio → júnior</span>
          </div>
        </div>
        <div className="brand">
          <img
            className="brand-photo"
            src={portrait}
            alt="Mariana Medeiros"
          />
          <div className="text-start">
            <strong>Mariana Medeiros</strong>
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
        <div className="sidebar-foot">
          <div className="sync-box">
            <span
              className={`sync-pill is-${syncStatus}`}
              title={syncDetail}
            >
              {syncLabel(syncStatus)}
            </span>
          </div>
          <BackupBar />
          <p className="sidebar-note">
            Alterações sincronizam com a API e também ficam neste navegador.
            Backup local continua disponível.
          </p>
        </div>
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
          <LogoMark size={32} />
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
