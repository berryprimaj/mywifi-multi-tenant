<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'username' => 'required|string|min:3|max:50|unique:members,username',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:255',
            'department' => 'required|string|min:2|max:100',
            'password' => 'required|string|min:6|max:255',
            'status' => 'nullable|in:active,inactive'
        ];

        // If updating, make username unique except for current record
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $memberId = $this->route('member');
            $rules['username'] = 'required|string|min:3|max:50|unique:members,username,' . $memberId;
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
            'department.required' => 'Departemen wajib diisi.',
            'department.min' => 'Departemen minimal 2 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 6 karakter.',
            'status.in' => 'Status harus active atau inactive.',
        ];
    }
}
