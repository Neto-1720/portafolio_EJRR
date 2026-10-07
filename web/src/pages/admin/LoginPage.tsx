import { useState, type FormEvent } from 'react'
import { Monogram } from '../../assets/branding/Monogram.tsx'
import { Navigate, useNavigate } from 'react-router'
import { Button } from '../../components/ui/Button.tsx'
import { ThemeSwitch } from '../../components/layout/ThemeSwitch.tsx'
import { ApiError } from '../../services/api.ts'
import { FieldErrors } from '../../services/admin/http.ts'
import { Field } from '../../features/admin/fields.tsx'
import { adminField } from '../../features/admin/form.ts'
import { useAuth } from '../../features/admin/useAuth.ts'
import { usePageMeta } from '../../seo/usePageMeta.ts'

export function LoginPage() {
  const { user, status, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  usePageMeta({
    title: 'Iniciar sesión — Admin',
    description: 'Acceso privado del administrador del portafolio.',
    path: '/admin/login',
  })

  if (status === 'ready' && user) {
    return <Navigate to="/admin" replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setPending(true)

    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (caught) {
      if (caught instanceof FieldErrors) {
        setError(
          caught.fields.email ?? caught.fields.password ?? caught.message,
        )
      } else if (caught instanceof ApiError) {
        setError(caught.message)
      } else {
        setError('No se pudo iniciar sesión.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16 text-text-primary">
      <a href="#contenido" className="skip-link focus-ring">
        Saltar al contenido
      </a>
      <div className="mx-auto flex max-w-sm justify-end">
        <ThemeSwitch />
      </div>
      <main id="contenido">
        <form
          className="mx-auto mt-8 max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm"
          onSubmit={(event) => void onSubmit(event)}
        >
          <div className="mb-5 text-text-primary">
            <Monogram size={40} />
          </div>
          <h1 className="text-h3">Iniciar sesión</h1>
          <p className="mt-2 text-small text-text-secondary">
            Acceso del administrador del portafolio.
          </p>
          <div className="mt-6 space-y-4">
            <Field label="Correo" htmlFor="email">
              <input
                id="email"
                className={adminField}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <input
                id="password"
                className={adminField}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
          </div>
          {error ? (
            <p className="mt-4 text-small text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <Button className="mt-6 w-full" type="submit" disabled={pending}>
            {pending ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </main>
    </div>
  )
}
