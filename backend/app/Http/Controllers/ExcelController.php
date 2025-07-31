<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MembersExport;
use App\Imports\MembersImport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExcelController extends Controller
{
    /**
     * Export members to Excel
     */
    public function exportMembers(Request $request, $tenantId = null): BinaryFileResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $filename = 'members_' . date('Y-m-d_H-i-s') . '.xlsx';

        return Excel::download(new MembersExport($tenantId), $filename);
    }

    /**
     * Import members from Excel
     */
    public function importMembers(Request $request, $tenantId = null): JsonResponse
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        $tenantId = $tenantId ?? $request->user()->tenant_id;

        try {
            $import = new MembersImport($tenantId);
            Excel::import($import, $request->file('file'));

            $stats = $import->getImportStats();
            $failures = $import->failures();

            return response()->json([
                'success' => true,
                'message' => 'Import completed successfully',
                'data' => [
                    'imported' => $stats['imported'],
                    'skipped' => $stats['skipped'],
                    'failed' => $stats['failed'],
                    'failures' => $failures
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download sample Excel template
     */
    public function downloadTemplate(): BinaryFileResponse
    {
        $headers = [
            'username',
            'name',
            'email',
            'department',
            'password',
            'status'
        ];

        $sampleData = [
            [
                'john_doe',
                'John Doe',
                'john@example.com',
                'IT Department',
                'password123',
                'active'
            ],
            [
                'jane_smith',
                'Jane Smith',
                'jane@example.com',
                'HR Department',
                'password123',
                'active'
            ]
        ];

        // Create simple CSV template
        $filename = 'members_template.csv';
        $handle = fopen('php://temp', 'w+');

        // Add headers
        fputcsv($handle, $headers);

        // Add sample data
        foreach ($sampleData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
