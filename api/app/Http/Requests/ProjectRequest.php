<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
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
        $required = $creating ? 'required' : 'sometimes';
        /** @var Project|null $project */
        $project = $this->route('project');

        return [
            'title' => [$required, 'filled', 'string', 'max:160'],
            'slug' => [
                $required,
                'filled',
                'string',
                'max:160',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('projects', 'slug')->ignore($project),
            ],
            'subtitle' => ['sometimes', 'nullable', 'string', 'max:180'],
            'summary' => [$creating ? 'required' : 'sometimes', 'filled', 'string', 'max:2000'],
            'context' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'problem' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'solution' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'responsibilities' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'technical_decisions' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'challenges' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'results' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'learnings' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'role' => ['sometimes', 'nullable', 'string', 'max:120'],
            'period' => ['sometimes', 'nullable', 'string', 'max:80'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:10000'],
            'technology_ids' => ['sometimes', 'array'],
            'technology_ids.*' => ['integer', 'distinct', 'exists:technologies,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'title.filled' => 'El título es obligatorio.',
            'slug.required' => 'El slug es obligatorio.',
            'slug.filled' => 'El slug es obligatorio.',
            'summary.filled' => 'El resumen es obligatorio.',
            'slug.unique' => 'Ese slug ya existe.',
            'slug.regex' => 'El slug solo puede usar minúsculas, números y guiones.',
            'summary.required' => 'El resumen es obligatorio.',
            'technology_ids.*.exists' => 'Hay una tecnología que no existe.',
        ];
    }
}
