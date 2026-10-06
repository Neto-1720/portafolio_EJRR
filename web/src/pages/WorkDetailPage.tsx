import { Link, useParams } from 'react-router'

export function WorkDetailPage() {
  const { slug } = useParams()

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-medium">Detalle de proyecto</h1>
      <p className="text-neutral-600">
        Placeholder de <span className="font-mono">/work/:slug</span>. Slug
        recibido: {slug}
      </p>
      <p>
        <Link className="underline" to="/work">
          Volver al listado
        </Link>
      </p>
    </section>
  )
}
