import { useState } from 'react'
import { Activities } from './components/Activities'
import { Courses } from './components/Courses'
import { Dashboard } from './components/Dashboard'
import { Goals } from './components/Goals'
import { Layout } from './components/Layout'
import { Tasks } from './components/Tasks'
import { Skills } from './components/Skills'
import { Topics } from './components/Topics'
import { PlannerProvider } from './store'
import type { SectionId } from './types'

function Pages() {
  const [section, setSection] = useState<SectionId>('inicio')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Layout
      section={section}
      onSection={setSection}
      menuOpen={menuOpen}
      onMenu={setMenuOpen}
    >
      {section === 'inicio' && <Dashboard onNavigate={setSection} />}
      {section === 'cursos' && <Courses />}
      {section === 'skills-tec' && <Skills category="tecnica" />}
      {section === 'skills-beh' && <Skills category="comportamental" />}
      {section === 'metas' && <Goals />}
      {section === 'topicos' && <Topics />}
      {section === 'tarefas' && <Tasks />}
      {section === 'atividades' && <Activities />}
    </Layout>
  )
}

export default function App() {
  return (
    <PlannerProvider>
      <Pages />
    </PlannerProvider>
  )
}
