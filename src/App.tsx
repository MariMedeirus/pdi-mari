import { useCallback, useState } from 'react'
import { Activities } from './components/Activities'
import { AuthScreen } from './components/AuthScreen'
import { Courses } from './components/Courses'
import { Dashboard } from './components/Dashboard'
import { Goals } from './components/Goals'
import { Layout } from './components/Layout'
import { SyncBridge, type SyncStatus } from './components/SyncBridge'
import { Tasks } from './components/Tasks'
import { Skills } from './components/Skills'
import { Topics } from './components/Topics'
import { AuthProvider, useAuth } from './auth'
import { PlannerProvider } from './store'
import type { SectionId } from './types'

function Pages() {
  const [section, setSection] = useState<SectionId>('inicio')
  const [menuOpen, setMenuOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [syncDetail, setSyncDetail] = useState<string | undefined>()

  const onSyncStatus = useCallback((status: SyncStatus, detail?: string) => {
    setSyncStatus(status)
    setSyncDetail(detail)
  }, [])

  return (
    <>
      <SyncBridge onStatus={onSyncStatus} />
      <Layout
        section={section}
        onSection={setSection}
        menuOpen={menuOpen}
        onMenu={setMenuOpen}
        syncStatus={syncStatus}
        syncDetail={syncDetail}
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
    </>
  )
}

function Gate() {
  const { status } = useAuth()

  if (status !== 'authenticated') {
    return <AuthScreen />
  }

  return (
    <PlannerProvider>
      <Pages />
    </PlannerProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
