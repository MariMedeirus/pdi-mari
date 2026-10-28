import { useId } from 'react'

export function LogoMark({
  size = 40,
  title = 'plano.dev',
}: {
  size?: number
  title?: string
}) {
  const uid = useId()
  const glow = `${uid}-glow`
  const ring = `${uid}-ring`
  const ink = `${uid}-ink`

  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={ink} x1="32" y1="24" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5f0ff" />
          <stop offset="1" stopColor="#ddd6fe" />
        </linearGradient>
        <linearGradient id={ring} x1="14" y1="12" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9d5ff" />
          <stop offset=".42" stopColor="#c084fc" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id={glow} cx="74%" cy="16%" r="62%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity=".32" />
          <stop offset="55%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#08080d" />
      <rect width="64" height="64" rx="14" fill={`url(#${glow})`} />
      <rect
        x="1.15"
        y="1.15"
        width="61.7"
        height="61.7"
        rx="12.85"
        stroke="#c084fc"
        strokeOpacity=".42"
        strokeWidth="1.3"
      />
      <circle cx="32" cy="32" r="19" stroke="#2a2740" strokeWidth="2.55" />
      <circle
        cx="32"
        cy="32"
        r="19"
        stroke={`url(#${ring})`}
        strokeWidth="2.55"
        strokeLinecap="round"
        strokeDasharray="100 19.3"
        transform="rotate(128 32 32)"
      />
      <path
        d="M21.4 27.4 17.6 32l3.8 4.6"
        stroke="#c084fc"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.6 27.4 46.4 32l-3.8 4.6"
        stroke="#c084fc"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.2 41.2V25.6L32 37.4l7.8-11.8v15.6"
        stroke={`url(#${ink})`}
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="icon-btn danger"
      onClick={onClick}
      aria-label="Excluir"
      title="Excluir"
    >
      <TrashIcon />
    </button>
  )
}
