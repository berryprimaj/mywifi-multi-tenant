<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Tenant;
use App\Models\AuditLog;
use App\Http\Requests\StoreTenantRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TenantController extends Controller
{
    /**
     * Display a listing of tenants
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tenant::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('domain', 'like', "%{$search}%")
                  ->orWhere('subdomain', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $tenants = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $tenants
        ]);
    }

    /**
     * Store a newly created tenant
     */
    public function store(StoreTenantRequest $request): JsonResponse
    {
        // Validation handled by StoreTenantRequest

        $tenant = Tenant::create([
            'id' => 'tenant-' . Str::uuid(),
            'name' => $request->name,
            'domain' => $request->domain,
            'subdomain' => $request->subdomain,
            'settings' => $request->settings ?? [],
            'created_by' => $request->user()->id,
            'status' => true,
        ]);

        // Log the action
        AuditLog::createLog('tenant_created', $tenant, null, $tenant->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Tenant created successfully',
            'data' => $tenant
        ], 201);
    }

    /**
     * Display the specified tenant
     */
    public function show(string $id): JsonResponse
    {
        $tenant = Tenant::find($id);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tenant
        ]);
    }

    /**
     * Update the specified tenant
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $tenant = Tenant::find($id);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|min:2|max:100',
            'domain' => [
                'nullable',
                'string',
                Rule::unique('tenants', 'domain')->ignore($tenant->id)
            ],
            'subdomain' => [
                'nullable',
                'string',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('tenants', 'subdomain')->ignore($tenant->id)
            ],
            'status' => 'boolean',
            'settings' => 'nullable|array',
        ]);

        $oldData = $tenant->toArray();

        $tenant->update([
            'name' => $request->name,
            'domain' => $request->domain,
            'subdomain' => $request->subdomain,
            'status' => $request->boolean('status', $tenant->status),
            'settings' => $request->settings ?? $tenant->settings,
        ]);

        // Log the action
        AuditLog::createLog('tenant_updated', $tenant, $oldData, $tenant->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Tenant updated successfully',
            'data' => $tenant
        ]);
    }

    /**
     * Remove the specified tenant
     */
    public function destroy(string $id): JsonResponse
    {
        $tenant = Tenant::find($id);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found'
            ], 404);
        }

        // Check if tenant has users
        if ($tenant->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete tenant with existing users'
            ], 400);
        }

        $oldData = $tenant->toArray();
        $tenant->delete();

        // Log the action
        AuditLog::createLog('tenant_deleted', null, $oldData, null);

        return response()->json([
            'success' => true,
            'message' => 'Tenant deleted successfully'
        ]);
    }

    /**
     * Find tenant by domain
     */
    public function findByDomain(Request $request): JsonResponse
    {
        $domain = $request->get('domain');

        if (!$domain) {
            return response()->json([
                'success' => false,
                'message' => 'Domain parameter is required'
            ], 400);
        }

        $tenant = Tenant::findByDomain($domain);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found for this domain'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tenant
        ]);
    }

    /**
     * Update tenant settings
     */
    public function updateSettings(Request $request, string $id): JsonResponse
    {
        $tenant = Tenant::find($id);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found'
            ], 404);
        }

        $request->validate([
            'settings' => 'required|array',
        ]);

        $oldSettings = $tenant->settings;
        $tenant->updateSettings($request->settings);

        // Log the action
        AuditLog::createLog('tenant_settings_updated', $tenant,
            ['settings' => $oldSettings],
            ['settings' => $tenant->settings]
        );

        return response()->json([
            'success' => true,
            'message' => 'Tenant settings updated successfully',
            'data' => $tenant
        ]);
    }
}
