<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    /**
     * Upload logo file.
     */
    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'tenant_id' => 'required|string',
        ]);

        $tenantId = $request->tenant_id;
        $file = $request->file('logo');

        // Generate unique filename
        $filename = 'logo_' . $tenantId . '_' . time() . '.' . $file->getClientOriginalExtension();

        // Store file in public/uploads/logos directory
        $path = $file->storeAs('public/uploads/logos', $filename);

        // Generate public URL
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
            'path' => $path,
            'filename' => $filename,
        ]);
    }

    /**
     * Upload background image file.
     */
    public function uploadBackground(Request $request): JsonResponse
    {
        $request->validate([
            'background' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'tenant_id' => 'required|string',
        ]);

        $tenantId = $request->tenant_id;
        $file = $request->file('background');

        // Generate unique filename
        $filename = 'bg_' . $tenantId . '_' . time() . '.' . $file->getClientOriginalExtension();

        // Store file in public/uploads/backgrounds directory
        $path = $file->storeAs('public/uploads/backgrounds', $filename);

        // Generate public URL
        $url = Storage::url($path);

        return response()->json([
            'success' => true,
            'url' => $url,
            'path' => $path,
            'filename' => $filename,
        ]);
    }

    /**
     * Delete uploaded file.
     */
    public function deleteFile(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $path = $request->path;

        if (Storage::exists($path)) {
            Storage::delete($path);
            return response()->json(['success' => true, 'message' => 'File deleted successfully']);
        }

        return response()->json(['success' => false, 'message' => 'File not found'], 404);
    }
}
