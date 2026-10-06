<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $creating = $this->isMethod('POST');

        return [
            'name' => [$creating ? 'required' : 'sometimes', 'filled', 'string', 'max:180'],
            'issuer' => ['sometimes', 'nullable', 'string', 'max:180'],
            'issued_at' => ['sometimes', 'nullable', 'date'],
            'credential_url' => ['sometimes', 'nullable', 'string', 'max:500', 'url'],
            'image_path' => ['sometimes', 'nullable', 'string', 'max:500'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.filled' => 'El nombre es obligatorio.',
            'credential_url.url' => 'La URL de la credencial no es válida.',
            'issued_at.date' => 'La fecha no es válida.',
        ];
    }
}
