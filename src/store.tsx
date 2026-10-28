import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { SEED_VERSION, seedState } from './data/seed'
import type {
  PlannerAction,
  PlannerState,
  SkillCheck,
  SkillPillar,
} from './types'

const STORAGE_KEY = 'mariana-mederios-planner'
const VERSION_KEY = 'mariana-mederios-planner-version'

function mergePillars(
  saved: SkillPillar[],
  seed: SkillPillar[],
  removedCheckIds: string[],
): SkillPillar[] {
  const removed = new Set(removedCheckIds)
  const savedById = new Map(saved.map((pillar) => [pillar.id, pillar]))
  return seed.map((seedPillar) => {
    const current = savedById.get(seedPillar.id)
    if (!current) return seedPillar
    const checkById = new Map(current.checks.map((check) => [check.id, check]))
    const mergedChecks: SkillCheck[] = seedPillar.checks
      .filter((seedCheck) => !removed.has(seedCheck.id))
      .map((seedCheck) => {
        const existing = checkById.get(seedCheck.id)
        return existing
          ? { ...seedCheck, done: existing.done }
          : seedCheck
      })
    const extras = current.checks.filter(
      (check) =>
        !removed.has(check.id) &&
        !mergedChecks.some((merged) => merged.id === check.id),
    )
    return {
      ...seedPillar,
      checks: [...mergedChecks, ...extras],
    }
  })
}

function loadState(): PlannerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState
    const saved = JSON.parse(raw) as PlannerState
    const removedCheckIds = saved.removedCheckIds ?? []
    return {
      courses: saved.courses ?? seedState.courses,
      goals: saved.goals ?? seedState.goals,
      topics: saved.topics ?? seedState.topics,
      tasks: saved.tasks ?? seedState.tasks,
      activities: saved.activities ?? seedState.activities,
      removedCheckIds,
      pillars: mergePillars(
        saved.pillars ?? [],
        seedState.pillars,
        removedCheckIds,
      ),
    }
  } catch {
    return seedState
  }
}

function reducer(state: PlannerState, action: PlannerAction): PlannerState {
  switch (action.type) {
    case 'add-course':
      return { ...state, courses: [action.course, ...state.courses] }
    case 'update-course':
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.course.id ? action.course : course,
        ),
      }
    case 'delete-course':
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.id),
      }
    case 'toggle-check':
      return {
        ...state,
        pillars: state.pillars.map((pillar) =>
          pillar.id !== action.pillarId
            ? pillar
            : {
                ...pillar,
                checks: pillar.checks.map((check) =>
                  check.id === action.checkId
                    ? { ...check, done: !check.done }
                    : check,
                ),
              },
        ),
      }
    case 'add-check':
      return {
        ...state,
        removedCheckIds: (state.removedCheckIds ?? []).filter(
          (id) => id !== action.check.id,
        ),
        pillars: state.pillars.map((pillar) =>
          pillar.id !== action.pillarId
            ? pillar
            : { ...pillar, checks: [...pillar.checks, action.check] },
        ),
      }
    case 'delete-check':
      return {
        ...state,
        removedCheckIds: (state.removedCheckIds ?? []).includes(action.checkId)
          ? (state.removedCheckIds ?? [])
          : [...(state.removedCheckIds ?? []), action.checkId],
        pillars: state.pillars.map((pillar) =>
          pillar.id !== action.pillarId
            ? pillar
            : {
                ...pillar,
                checks: pillar.checks.filter(
                  (check) => check.id !== action.checkId,
                ),
              },
        ),
      }
    case 'add-goal':
      return { ...state, goals: [action.goal, ...state.goals] }
    case 'update-goal':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.goal.id ? action.goal : goal,
        ),
      }
    case 'delete-goal':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.id),
      }
    case 'add-topic':
      return { ...state, topics: [action.topic, ...state.topics] }
    case 'update-topic':
      return {
        ...state,
        topics: state.topics.map((topic) =>
          topic.id === action.topic.id ? action.topic : topic,
        ),
      }
    case 'delete-topic':
      return {
        ...state,
        topics: state.topics.filter((topic) => topic.id !== action.id),
      }
    case 'add-task':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'update-task':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.task.id ? action.task : task,
        ),
      }
    case 'delete-task':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      }
    case 'add-activity':
      return { ...state, activities: [action.activity, ...state.activities] }
    case 'update-activity':
      return {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.activity.id ? action.activity : activity,
        ),
      }
    case 'delete-activity':
      return {
        ...state,
        activities: state.activities.filter((activity) => activity.id !== action.id),
      }
    case 'replace-state':
      return action.state
    default:
      return state
  }
}

interface PlannerContextValue {
  state: PlannerState
  dispatch: (action: PlannerAction) => void
  pillarProgress: (pillar: SkillPillar) => number
  categoryProgress: (category: SkillPillar['category']) => number
  juniorReadiness: number
}

const PlannerContext = createContext<PlannerContextValue | null>(null)

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    localStorage.setItem(VERSION_KEY, String(SEED_VERSION))
  }, [state])

  const pillarProgress = useCallback((pillar: SkillPillar) => {
    if (pillar.checks.length === 0) return 0
    const done = pillar.checks.filter((check) => check.done).length
    return Math.round((done / pillar.checks.length) * 100)
  }, [])

  const categoryProgress = useCallback(
    (category: SkillPillar['category']) => {
      const group = state.pillars.filter((pillar) => pillar.category === category)
      if (group.length === 0) return 0
      const total = group.reduce((sum, pillar) => sum + pillarProgress(pillar), 0)
      return Math.round(total / group.length)
    },
    [pillarProgress, state.pillars],
  )

  const juniorReadiness = useMemo(() => {
    const tech = categoryProgress('tecnica')
    const beh = categoryProgress('comportamental')
    const coursesDone = state.courses.filter((c) => c.status === 'realizado').length
    const courseScore =
      state.courses.length === 0
        ? 0
        : Math.round((coursesDone / state.courses.length) * 100)
    return Math.round(tech * 0.6 + beh * 0.3 + courseScore * 0.1)
  }, [categoryProgress, state.courses])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      pillarProgress,
      categoryProgress,
      juniorReadiness,
    }),
    [state, pillarProgress, categoryProgress, juniorReadiness],
  )

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  )
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider')
  return ctx
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function buildBackup(state: PlannerState) {
  return {
    app: 'mariana-mederios-planner',
    exportedAt: new Date().toISOString(),
    seedVersion: SEED_VERSION,
    state,
  }
}

export function normalizeImportedState(raw: unknown): PlannerState {
  if (!raw || typeof raw !== 'object') throw new Error('invalid')
  const data = raw as Record<string, unknown>
  const inner =
    data.state && typeof data.state === 'object'
      ? (data.state as Record<string, unknown>)
      : data

  if (
    !Array.isArray(inner.courses) ||
    !Array.isArray(inner.pillars) ||
    !Array.isArray(inner.goals) ||
    !Array.isArray(inner.topics)
  ) {
    throw new Error('invalid')
  }

  const removedCheckIds = Array.isArray(inner.removedCheckIds)
    ? inner.removedCheckIds.filter((id): id is string => typeof id === 'string')
    : []

  return {
    courses: inner.courses,
    goals: inner.goals,
    topics: inner.topics,
    tasks: Array.isArray(inner.tasks) ? inner.tasks : seedState.tasks,
    activities: Array.isArray(inner.activities)
      ? inner.activities
      : seedState.activities,
    removedCheckIds,
    pillars: mergePillars(inner.pillars, seedState.pillars, removedCheckIds),
  }
}
