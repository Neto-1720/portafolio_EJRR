Nuevo mensaje de contacto

Nombre: {{ $contact->name }}
Correo: {{ $contact->email }}
Asunto: {{ $contact->subject ?: '—' }}
Fecha: {{ $contact->created_at?->timezone(config('app.timezone'))->format('Y-m-d H:i') }}

{{ $contact->message }}
