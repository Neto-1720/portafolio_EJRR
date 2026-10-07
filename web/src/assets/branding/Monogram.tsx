type MonogramProps = {
  size?: number
}

export function Monogram({ size = 32 }: MonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="shrink-0 text-text-primary"
    >
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="8"
        fill="var(--color-surface)"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8 9.25h6.4M8 16h4.6M8 22.75h6.4M8 9.25v13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M17.1 22.75V9.25h4.15a3.05 3.05 0 0 1 0 6.1H17.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15.35 23.35 22.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect
        x="25.1"
        y="4.6"
        width="2.3"
        height="2.3"
        rx="0.5"
        fill="var(--color-accent)"
      />
    </svg>
  )
}
