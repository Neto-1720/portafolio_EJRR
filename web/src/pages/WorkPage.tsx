import { Link } from 'react-router'

export function WorkPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Proyectos</h1>
      <p className="text-neutral-600">
        El listado de case studies todavía no está.
      </p>
      <p>
        <Link className="underline" to="/work/ejemplo">
          Abrir una ruta de detalle
        </Link>
      </p>
    </section>
  )
}
