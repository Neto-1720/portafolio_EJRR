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
            if (Project::query()->where('slug', $definition['slug'])->exists()) {
                continue;
            }

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

            foreach ($this->imagesFor($project) as $image) {
                $project->images()->create($image);
            }
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function imagesFor(Project $project): array
    {
        if ($project->slug === 'multichannel-notifications') {
            return [
                [
                    'path' => '/projects/notifications/cover.webp',
                    'alt_text' => 'Vista general del sistema de notificaciones multicanal con métricas y configuración.',
                    'caption' => 'Vista general del sistema de notificaciones multicanal, con métricas, configuración de eventos y administración de canales desde una sola interfaz.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => '/projects/notifications/01-event-configuration.webp',
                    'alt_text' => 'Configuración de eventos y canales de notificación.',
                    'caption' => 'Configuración de eventos y canales para controlar qué comunicaciones se envían durante cada etapa de la operación.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/02-notification-center.webp',
                    'alt_text' => 'Centro de notificaciones con eventos agrupados por categoría.',
                    'caption' => 'Centro de notificaciones que centraliza eventos operativos y mensajes relacionados con envíos, pagos y seguimiento.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/03-whatsapp.webp',
                    'alt_text' => 'Notificación transaccional de seguimiento enviada por WhatsApp.',
                    'caption' => 'Ejemplo de notificación transaccional enviada por WhatsApp durante el seguimiento de un envío.',
                    'sort_order' => 4,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/notifications/04-email.webp',
                    'alt_text' => 'Correo transaccional con información y progreso de un envío.',
                    'caption' => 'Plantilla de correo transaccional con estado del envío y representación visual de su recorrido.',
                    'sort_order' => 5,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug === 'white-label-tracking') {
            return [[
                'path' => '/projects/tracking/cover.webp',
                'alt_text' => 'Portal de rastreo con el resultado de una guía, línea de estado y banner publicitario.',
                'caption' => 'Portal de rastreo con marca configurable: búsqueda de guías, estado del envío, historial de eventos y un espacio para publicidad propia de cada marca.',
                'sort_order' => 1,
                'is_cover' => true,
            ]];
        }

        if ($project->slug === 'customer-support-desk') {
            return [
                [
                    'path' => '/projects/support/cover.webp',
                    'alt_text' => 'Vista principal de una mesa de atención con lista de conversaciones, chat y panel de información.',
                    'caption' => 'Vista principal de la mesa de atención, diseñada para concentrar conversaciones, contexto del cliente y herramientas operativas en una sola interfaz.',
                    'sort_order' => 1,
                    'is_cover' => true,
                ],
                [
                    'path' => '/projects/support/01-chat-dark.webp',
                    'alt_text' => 'Mesa de atención en modo oscuro con conversación y panel lateral.',
                    'caption' => 'La misma experiencia operativa en modo oscuro, manteniendo jerarquía visual y legibilidad durante sesiones prolongadas de atención.',
                    'sort_order' => 2,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/02-profile.webp',
                    'alt_text' => 'Vista de perfil del asesor dentro de la mesa de atención.',
                    'caption' => 'Perfil del asesor integrado dentro del mismo entorno, con información básica y controles de sesión.',
                    'sort_order' => 3,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/03-notes.webp',
                    'alt_text' => 'Sección de notas internas de la mesa de atención.',
                    'caption' => 'Espacio de notas internas para registrar contexto personal y apuntes relacionados con la atención.',
                    'sort_order' => 4,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/04-calendar.webp',
                    'alt_text' => 'Calendario y recordatorios dentro de la mesa de atención.',
                    'caption' => 'Calendario operativo para organizar recordatorios y tareas asociadas al seguimiento de atención.',
                    'sort_order' => 5,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/05-evaluations.webp',
                    'alt_text' => 'Panel de evaluaciones y métricas de atención.',
                    'caption' => 'Vista de evaluaciones y métricas de atención para consultar actividad, tiempos y resultados del asesor.',
                    'sort_order' => 6,
                    'is_cover' => false,
                ],
                [
                    'path' => '/projects/support/06-settings.webp',
                    'alt_text' => 'Pantalla de ajustes y personalización de la mesa de atención.',
                    'caption' => 'Configuración personal de la interfaz, incluyendo preferencias visuales y opciones de cuenta.',
                    'sort_order' => 7,
                    'is_cover' => false,
                ],
            ];
        }

        if ($project->slug !== 'settings-spa-modernization') {
            return [[
                'path' => "projects/{$project->slug}/cover.webp",
                'alt_text' => $project->title,
                'caption' => null,
                'sort_order' => 0,
                'is_cover' => true,
            ]];
        }

        return [
            [
                'path' => '/projects/settings-spa/cover.webp',
                'alt_text' => 'Vista general de la sección Settings SPA con accesos de configuración.',
                'caption' => 'Vista general de la sección de configuración modernizada como SPA, con acceso centralizado a múltiples módulos.',
                'sort_order' => 1,
                'is_cover' => true,
            ],
            [
                'path' => '/projects/settings-spa/02-module-detail.webp',
                'alt_text' => 'Vista interna de un módulo integrado dentro de la sección Settings SPA.',
                'caption' => 'Módulo interno integrado bajo el mismo sistema visual, con resumen, filtros y listado en una sola vista.',
                'sort_order' => 2,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/03-search-discovery.webp',
                'alt_text' => 'Buscador de configuraciones y navegación entre módulos en Settings SPA.',
                'caption' => 'Buscador y sistema de descubrimiento para acceder rápidamente a herramientas y configuraciones dentro de la SPA.',
                'sort_order' => 3,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/04-feature-view.webp',
                'alt_text' => 'Sección de perfil dentro de Settings SPA, con navegación lateral de ajustes.',
                'caption' => 'Vista de cuenta dentro de la misma navegación, con secciones agrupadas y una vista previa del perfil.',
                'sort_order' => 4,
                'is_cover' => false,
            ],
            [
                'path' => '/projects/settings-spa/05-package-list.webp',
                'alt_text' => 'Listado en tabla de una funcionalidad de configuración.',
                'caption' => 'Listado de plantillas en una vista de tabla, dentro del mismo flujo de configuración.',
                'sort_order' => 5,
                'is_cover' => false,
            ],
        ];
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
                'is_published' => false,
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
                'is_published' => false,
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
