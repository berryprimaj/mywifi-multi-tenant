<?php

namespace App\Exports;

use App\Models\Member;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MembersExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $tenantId;

    public function __construct($tenantId)
    {
        $this->tenantId = $tenantId;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Member::where('tenant_id', $this->tenantId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Username',
            'Name',
            'Email',
            'Department',
            'Status',
            'Created At',
            'Last Login',
        ];
    }

    /**
     * @param Member $member
     * @return array
     */
    public function map($member): array
    {
        return [
            $member->id,
            $member->username,
            $member->name,
            $member->email,
            $member->department,
            $member->status,
            $member->created_at->format('Y-m-d H:i:s'),
            $member->last_login ? $member->last_login->format('Y-m-d H:i:s') : 'Never',
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1 => ['font' => ['bold' => true]],
        ];
    }
}
