import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  document.documentElement.dataset.theme = 'light'
  window.localStorage.clear()
  vi.unstubAllGlobals()
})
