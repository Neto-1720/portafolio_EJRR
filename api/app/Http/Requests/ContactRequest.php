<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120', $this->plainText()],
            'email' => ['required', 'string', 'email', 'max:180'],
            'subject' => ['nullable', 'string', 'max:160', $this->plainText()],
            'message' => ['required', 'string', 'min:10', 'max:5000', $this->plainText()],
            'status' => ['prohibited'],
            'ip_address' => ['prohibited'],
            'user_agent' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre es demasiado largo.',
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El correo no es válido.',
            'email.max' => 'El correo es demasiado largo.',
            'subject.max' => 'El asunto es demasiado largo.',
            'message.required' => 'El mensaje es obligatorio.',
            'message.min' => 'El mensaje es demasiado corto.',
            'message.max' => 'El mensaje es demasiado largo.',
        ];
    }

    private function plainText(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (is_string($value) && $value !== strip_tags($value)) {
                $fail('No se puede incluir HTML.');
            }
        };
    }
}
