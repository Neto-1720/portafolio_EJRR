<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectImageRequest extends FormRequest
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
            'image' => [
                $creating ? 'required' : 'exclude',
                'file',
                'max:5120',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
            ],
            'alt_text' => ['sometimes', 'nullable', 'string', 'max:180'],
            'caption' => ['sometimes', 'nullable', 'string', 'max:300'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'is_cover' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Selecciona una imagen.',
            'image.mimes' => 'La imagen debe ser JPG, PNG o WebP.',
            'image.mimetypes' => 'La imagen debe ser JPG, PNG o WebP.',
            'image.max' => 'La imagen no puede pasar de 5 MB.',
        ];
    }
}
