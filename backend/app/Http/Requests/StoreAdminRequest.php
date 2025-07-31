<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
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
            'username' => 'required|string|min:3|max:50|unique:users,username',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255',
            'role' => 'required|string|in:super_admin,administrator,owner,manager,staff,moderator,viewer',
            'tenant_id' => 'required|string|exists:tenants,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string'
        ];

        // If updating, make username and email unique except for current record
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $adminId = $this->route('admin');
            $rules['username'] = 'required|string|min:3|max:50|unique:users,username,' . $adminId;
            $rules['email'] = 'required|email|max:255|unique:users,email,' . $adminId;
            $rules['password'] = 'nullable|string|min:6|max:255'; // Password optional on update
        }

        return $rules;
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'username.min' => 'Username minimal 3 karakter.',
            'username.unique' => 'Username sudah digunakan.',
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 6 karakter.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role tidak valid.',
            'tenant_id.required' => 'Tenant wajib dipilih.',
            'tenant_id.exists' => 'Tenant tidak ditemukan.',
        ];
    }
}
