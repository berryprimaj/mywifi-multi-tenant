<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTenantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|min:2|max:100',
            'domain' => 'nullable|string|max:255|unique:tenants,domain',
            'subdomain' => 'nullable|string|max:50|unique:tenants,subdomain|regex:/^[a-z0-9-]+$/',
            'settings' => 'nullable|array',
            'settings.siteName' => 'nullable|string|max:100',
            'settings.primaryColor' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'settings.secondaryColor' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'settings.welcomeMessage' => 'nullable|string|max:500',
            'settings.themeMode' => 'nullable|in:light,dark',
        ];

        // If updating, make domain and subdomain unique except for current record
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $tenantId = $this->route('tenant');
            $rules['domain'] = 'nullable|string|max:255|unique:tenants,domain,' . $tenantId;
            $rules['subdomain'] = 'nullable|string|max:50|unique:tenants,subdomain,' . $tenantId . '|regex:/^[a-z0-9-]+$/';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama tenant wajib diisi.',
            'name.min' => 'Nama tenant minimal 2 karakter.',
            'name.max' => 'Nama tenant maksimal 100 karakter.',
            'domain.unique' => 'Domain sudah digunakan oleh tenant lain.',
            'subdomain.unique' => 'Subdomain sudah digunakan oleh tenant lain.',
            'subdomain.regex' => 'Subdomain hanya boleh mengandung huruf kecil, angka, dan tanda hubung.',
            'settings.primaryColor.regex' => 'Warna primer harus dalam format hex (#RRGGBB).',
            'settings.secondaryColor.regex' => 'Warna sekunder harus dalam format hex (#RRGGBB).',
            'settings.themeMode.in' => 'Mode tema harus light atau dark.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert subdomain to lowercase
        if ($this->has('subdomain')) {
            $this->merge([
                'subdomain' => strtolower($this->subdomain)
            ]);
        }

        // Convert domain to lowercase
        if ($this->has('domain')) {
            $this->merge([
                'domain' => strtolower($this->domain)
            ]);
        }
    }
}
