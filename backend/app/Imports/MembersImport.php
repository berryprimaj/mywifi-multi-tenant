<?php

namespace App\Imports;

use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class MembersImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    protected $tenantId;
    protected $importedCount = 0;
    protected $skippedCount = 0;

    public function __construct($tenantId)
    {
        $this->tenantId = $tenantId;
    }

    /**
     * @param array $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Check if member already exists
        $existingMember = Member::where('username', $row['username'])
            ->where('tenant_id', $this->tenantId)
            ->first();

        if ($existingMember) {
            $this->skippedCount++;
            return null;
        }

        $this->importedCount++;

        return new Member([
            'tenant_id' => $this->tenantId,
            'username' => $row['username'],
            'name' => $row['name'],
            'email' => $row['email'],
            'department' => $row['department'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'status' => $row['status'] ?? 'active',
        ]);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|min:3|max:50',
            'name' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:255',
            'department' => 'required|string|min:2|max:100',
            'password' => 'nullable|string|min:6',
            'status' => 'nullable|in:active,inactive',
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'username.min' => 'Username minimal 3 karakter.',
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'department.required' => 'Departemen wajib diisi.',
            'department.min' => 'Departemen minimal 2 karakter.',
            'password.min' => 'Password minimal 6 karakter.',
            'status.in' => 'Status harus active atau inactive.',
        ];
    }

    /**
     * Get import statistics
     */
    public function getImportStats(): array
    {
        return [
            'imported' => $this->importedCount,
            'skipped' => $this->skippedCount,
            'failed' => count($this->failures()),
        ];
    }
}
