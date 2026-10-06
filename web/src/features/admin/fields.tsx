import type { ReactNode } from 'react'

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="font-mono text-mono-label tracking-wide text-text-muted uppercase"
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1 text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
