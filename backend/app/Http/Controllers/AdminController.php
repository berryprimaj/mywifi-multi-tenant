<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Http\Requests\StoreAdminRequest;

class AdminController extends Controller
{
    /**
     * Display a listing of admins.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Super admin can see all users, others only see users in their tenant
        $query = User::with('tenant');

        if ($user->role !== 'super_admin') {
            $query->where('tenant_id', $user->tenant_id);
        }

        $admins = $query->get();

        return response()->json($admins);
    }

    /**
     * Store a newly created admin.
     */
    public function store(StoreAdminRequest $request): JsonResponse
    {
        // Validation handled by StoreAdminRequest

        $admin = User::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'tenant_id' => $request->tenant_id,
            'permissions' => $request->permissions,
        ]);

        return response()->json($admin, 201);
    }

    /**
     * Display the specified admin.
     */
    public function show(string $id): JsonResponse
    {
        $admin = User::with('tenant')->findOrFail($id);
        return response()->json($admin);
    }

    /**
     * Update the specified admin.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $admin = User::findOrFail($id);

        $request->validate([
            'username' => 'required|string|unique:users,username,' . $id,
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string',
            'tenant_id' => 'required|string|exists:tenants,id',
        ]);

        $updateData = [
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'tenant_id' => $request->tenant_id,
            'permissions' => $request->permissions,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $admin->update($updateData);

        return response()->json($admin);
    }

    /**
     * Remove the specified admin.
     */
    public function destroy(string $id): JsonResponse
    {
        $admin = User::findOrFail($id);
        $admin->delete();

        return response()->json(['message' => 'Admin deleted successfully']);
    }
}
