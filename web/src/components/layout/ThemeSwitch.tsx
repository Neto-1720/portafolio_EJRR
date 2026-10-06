import { useState } from 'react'
import { cn } from '../../utils/cn.ts'

const storageKey = 'portfolio-theme'

function isNight() {
  return document.documentElement.dataset.theme === 'dark'
}

function applyTheme(night: boolean) {
  document.documentElement.dataset.theme = night ? 'dark' : 'light'
  try {
    localStorage.setItem(storageKey, night ? 'dark' : 'light')
  } catch {
    // La preferencia queda solo en esta visita.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', night ? '#0c0a09' : '#f7f0e7')
}

export function ThemeSwitch() {
  const [night, setNight] = useState(isNight)

  function toggle() {
    const next = !night
    applyTheme(next)
    setNight(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={night}
      aria-label={night ? 'Desactivar modo nocturno' : 'Activar modo nocturno'}
      onClick={toggle}
      className="focus-ring inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-secondary p-0.5 aria-checked:bg-accent-soft"
    >
      <span
        className={cn(
          'size-4 rounded-full bg-text-primary shadow-sm transition-transform duration-150 motion-reduce:transition-none',
          night && 'translate-x-6',
        )}
      />
    </button>
  )
}
