<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Technology;
use Illuminate\Database\Seeder;
use RuntimeException;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->projects() as $definition) {
            $technologySlugs = $definition['technologies'];
            unset($definition['technologies']);

            $project = Project::query()->create($definition);

            $technologyIds = Technology::query()
                ->whereIn('slug', $technologySlugs)
                ->pluck('id');

            if ($technologyIds->count() !== count($technologySlugs)) {
                throw new RuntimeException("Faltan tecnologías para {$project->slug}.");
            }

            $project->technologies()->sync($technologyIds);

            $project->images()->create([
                'path' => "projects/{$project->slug}/cover.webp",
                'alt_text' => $project->title,
                'caption' => null,
                'sort_order' => 0,
                'is_cover' => true,
            ]);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            [
                'slug' => 'saas-logistics-platform',
                'title' => 'SaaS Logistics Platform',
                'subtitle' => 'Cotización, guías y rastreo',
                'summary' => 'Plataforma SaaS para cotizar un servicio, generar la guía y consultar el estado del envío.',
                'context' => 'El caso reúne el ciclo operativo de un envío en un solo producto.',
                'problem' => 'Cotización, creación de la guía y rastreo no compartían un flujo común.',
                'solution' => 'Backend Laravel con API REST e interfaz React para el recorrido principal.',
                'responsibilities' => 'Modelo de datos, API y pantallas del flujo de envío.',
                'technical_decisions' => 'Laravel para el dominio y React con TypeScript para la interfaz.',
                'challenges' => 'Mostrar el flujo completo sin convertir el caso en un sistema de paquetería.',
                'results' => 'Queda documentada la arquitectura, de la base de datos a la interfaz.',
                'learnings' => 'Conviene separar el dominio del envío de las integraciones con transportistas.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'postgresql', 'rest-apis', 'playwright'],
            ],
            [
                'slug' => 'multichannel-notifications',
                'title' => 'Multichannel Notification System',
                'subtitle' => 'Avisos por correo y WhatsApp',
                'summary' => 'Sistema para registrar avisos de producto por correo y WhatsApp.',
                'context' => 'El caso modela un aviso disparado por un evento y su estado de entrega.',
                'problem' => 'Cada canal registraba el aviso de una forma distinta.',
                'solution' => 'Un registro común del evento, el canal, el destinatario y el estado.',
                'responsibilities' => 'Modelo del aviso y la relación con los eventos del producto.',
                'technical_decisions' => 'Laravel para el registro del aviso y React para consultarlo.',
                'challenges' => 'Representar el canal sin depender de un envío real.',
                'results' => 'El caso deja listo el registro del aviso para una cola posterior.',
                'learnings' => 'El estado del aviso debe existir aunque el canal todavía no envíe.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 2,
                'technologies' => ['laravel', 'php', 'react', 'whatsapp-cloud-api', 'rest-apis'],
            ],
            [
                'slug' => 'white-label-tracking',
                'title' => 'White-Label Tracking Portal',
                'subtitle' => 'Rastreo con marca configurable',
                'summary' => 'Portal de rastreo que cambia de marca según una configuración.',
                'context' => 'El mismo recorrido de rastreo debía presentarse con distintas marcas.',
                'problem' => 'Cada marca pedía una vista propia para consultar una guía.',
                'solution' => 'Una interfaz React que lee la configuración de marca y el estado del envío.',
                'responsibilities' => 'Estructura de la interfaz y la configuración que cambia la presentación.',
                'technical_decisions' => 'React, TypeScript y Vite, con Firebase como soporte de configuración.',
                'challenges' => 'Cambiar la marca sin duplicar la pantalla.',
                'results' => 'El caso muestra una sola interfaz adaptable, sin un producto de rastreo completo.',
                'learnings' => 'La marca vive en configuración, no en componentes copiados.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
                'technologies' => ['react', 'typescript', 'tailwind-css', 'vite', 'firebase'],
            ],
            [
                'slug' => 'customer-support-desk',
                'title' => 'Customer Support Desk',
                'subtitle' => 'Bandeja de conversaciones',
                'summary' => 'Mesa de atención con la lista de conversaciones y el hilo de mensajes.',
                'context' => 'El caso cubre la bandeja que usa un equipo para seguir un caso.',
                'problem' => 'La lista de casos y la conversación abierta no compartían un estado claro.',
                'solution' => 'API REST y una interfaz que conserva la conversación seleccionada.',
                'responsibilities' => 'Modelo de conversación, mensajes y la estructura de la bandeja.',
                'technical_decisions' => 'Laravel y React con TypeScript para separar datos y presentación.',
                'challenges' => 'Mantener el hilo legible sin construir un helpdesk completo.',
                'results' => 'El caso deja conversaciones y mensajes listos para la interfaz.',
                'learnings' => 'El estado de la conversación y el del mensaje no deben mezclarse.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 4,
                'technologies' => ['laravel', 'react', 'typescript', 'rest-apis', 'tailwind-css', 'pest'],
            ],
            [
                'slug' => 'legacy-modernization',
                'title' => 'Legacy Platform Modernization',
                'subtitle' => 'Migración progresiva de una pantalla',
                'summary' => 'Caso de una pantalla legacy que pasa por partes a React.',
                'context' => 'La vista original seguía en servicio mientras se reemplazaban piezas.',
                'problem' => 'Marcado, jQuery y presentación estaban en el mismo lugar.',
                'solution' => 'La pieza nueva vive en React y Vite, junto a lo que aún no se migra.',
                'responsibilities' => 'Corte de la pantalla y la convivencia entre la vista anterior y la nueva.',
                'technical_decisions' => 'Laravel se mantiene y la interfaz nueva entra con Vite.',
                'challenges' => 'Migrar una parte sin apagar el resto de la pantalla.',
                'results' => 'El caso ilustra una migración progresiva, no un reescrito total.',
                'learnings' => 'El límite entre lo legacy y lo nuevo tiene que ser explícito.',
                'role' => 'Full Stack Developer',
                'period' => null,
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 5,
                'technologies' => ['laravel', 'php', 'react', 'typescript', 'vite', 'mysql', 'git'],
            ],
            [
                'slug' => 'settings-spa-modernization',
                'title' => 'Settings SPA Modernization',
                'subtitle' => 'Ajustes en una sola navegación',
                'summary' => 'Modernización de una sección de ajustes que reúne módulos y flujos operativos en una experiencia más consistente.',
                'context' => 'Una sección de configuración concentraba varias herramientas, módulos y flujos. Necesitaba ser más rápida, más consistente y más fácil de mantener.',
                'problem' => 'La navegación estaba fragmentada entre vistas legacy. Cambiar de módulo recargaba la página y los estilos no se mantenían al crecer el número de módulos. La experiencia tenía que mejorar sin reescribir toda la plataforma.',
                'solution' => 'La sección nueva usa React, TypeScript y Tailwind. El cambio de módulo no recarga la página. Los módulos comparten componentes y conviven con las vistas Laravel que siguen en legacy.',
                'responsibilities' => 'Modernización progresiva, navegación SPA, integración de varios módulos, componentes reutilizables, diseño consistente, estados de carga, responsive, light y dark mode, accesos rápidos, compatibilidad con el backend existente y decisiones de producto.',
                'technical_decisions' => 'La migración es progresiva. Los componentes se reutilizan. La navegación es de una SPA. El backend existente se conserva. El sistema visual es compartido y las responsabilidades quedan separadas: Laravel sigue entregando los datos y React presenta la sección.',
                'challenges' => 'Sumar módulos sin romper las vistas que aún no migran, y sostener una interfaz consistente mientras conviven los dos estilos.',
                'results' => 'La sección queda como una migración por partes: la plataforma sigue, la navegación es continua y hay una base de componentes compartidos.',
                'learnings' => 'El límite entre lo nuevo y lo legacy tiene que ser explícito. La demo de Legacy Platform Modernization muestra ese corte en una pantalla más pequeña; este caso no la duplica.',
                'role' => 'Full Stack Developer / Product-focused Developer',
                'period' => null,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 6,
                'technologies' => ['react', 'typescript', 'laravel', 'tailwind-css', 'vite'],
            ],
        ];
    }
}
