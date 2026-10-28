import { useEffect, useState, type CSSProperties } from 'react'

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value))
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const to = clampPercent(target)
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || to === 0) {
      setCurrent(to)
      return
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setCurrent(to * easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    setCurrent(0)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return current
}

export function ProgressBar({
  value,
  color,
}: {
  value: number
  color?: string
}) {
  return (
    <div className="bar" aria-hidden="true">
      <span
        style={{
          width: `${clampPercent(value)}%`,
          background: color ?? 'var(--accent)',
        }}
      />
    </div>
  )
}

export function ProgressRing({
  value,
  label,
  size = 108,
}: {
  value: number
  label: string
  size?: number
}) {
  const clamped = clampPercent(value)
  const displayed = useCountUp(clamped)
  const shown = Math.round(displayed)

  return (
    <div className="ring-wrap">
      <div
        className="ring"
        style={
          {
            width: size,
            height: size,
            '--ring-deg': `${displayed * 3.6}deg`,
            background:
              'conic-gradient(var(--accent) var(--ring-deg), var(--ring-track) 0deg)',
          } as CSSProperties
        }
      >
        <div className="ring-inner">
          <strong>{shown}%</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}
