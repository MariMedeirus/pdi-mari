export type SectionId =
  | 'inicio'
  | 'cursos'
  | 'skills-tec'
  | 'skills-beh'
  | 'metas'
  | 'topicos'
  | 'tarefas'

export type CourseStatus = 'realizado' | 'em_andamento' | 'futuro'

export interface Course {
  id: string
  title: string
  platform: string
  status: CourseStatus
  notes: string
  url: string
}

export type SkillCategory = 'tecnica' | 'comportamental'

export interface SkillCheck {
  id: string
  label: string
  detail: string
  done: boolean
  custom?: boolean
}

export interface SkillPillar {
  id: string
  name: string
  description: string
  category: SkillCategory
  color: string
  checks: SkillCheck[]
}

export type GoalHorizon = 'curto' | 'medio' | 'longo'
export type GoalStatus = 'nao_iniciada' | 'em_andamento' | 'concluida'

export interface Goal {
  id: string
  title: string
  description: string
  horizon: GoalHorizon
  status: GoalStatus
  deadline: string
}

export type TopicStatus = 'pendente' | 'pesquisado'

export interface Topic {
  id: string
  term: string
  context: string
  status: TopicStatus
  notes: string
  createdAt: string
  researchedAt: string
}

export type TaskStatus = 'a_fazer' | 'em_andamento' | 'feita'

export interface WorkTask {
  id: string
  title: string
  description: string
  status: TaskStatus
  date: string
  skillIds: string[]
  notes: string
}

export interface PlannerState {
  courses: Course[]
  pillars: SkillPillar[]
  goals: Goal[]
  topics: Topic[]
  tasks: WorkTask[]
  removedCheckIds: string[]
}

export type PlannerAction =
  | { type: 'add-course'; course: Course }
  | { type: 'update-course'; course: Course }
  | { type: 'delete-course'; id: string }
  | { type: 'toggle-check'; pillarId: string; checkId: string }
  | { type: 'add-check'; pillarId: string; check: SkillCheck }
  | { type: 'delete-check'; pillarId: string; checkId: string }
  | { type: 'add-goal'; goal: Goal }
  | { type: 'update-goal'; goal: Goal }
  | { type: 'delete-goal'; id: string }
  | { type: 'add-topic'; topic: Topic }
  | { type: 'update-topic'; topic: Topic }
  | { type: 'delete-topic'; id: string }
  | { type: 'add-task'; task: WorkTask }
  | { type: 'update-task'; task: WorkTask }
  | { type: 'delete-task'; id: string }
  | { type: 'replace-state'; state: PlannerState }
