<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Models\Member;

class MemberController extends Controller
{
    /**
     * Display a listing of members.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $members = Member::where('tenant_id', $user->tenant_id)
                        ->with('tenant')
                        ->get();

        return response()->json($members);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'username' => 'required|string|unique:members',
            'name' => 'required|string',
            'email' => 'required|email',
            'department' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $member = Member::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'department' => $request->department,
            'password' => Hash::make($request->password),
            'status' => $request->status ?? 'active',
            'tenant_id' => $request->user()->tenant_id,
        ]);

        return response()->json($member, 201);
    }

    /**
     * Display the specified member.
     */
    public function show(string $id): JsonResponse
    {
        $member = Member::with('tenant')->findOrFail($id);
        return response()->json($member);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $member = Member::findOrFail($id);

        $request->validate([
            'username' => 'required|string|unique:members,username,' . $id,
            'name' => 'required|string',
            'email' => 'required|email',
            'department' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);

        $updateData = [
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'department' => $request->department,
            'status' => $request->status,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $member->update($updateData);

        return response()->json($member);
    }

    /**
     * Remove the specified member.
     */
    public function destroy(string $id): JsonResponse
    {
        $member = Member::findOrFail($id);
        $member->delete();

        return response()->json(['message' => 'Member deleted successfully']);
    }

    /**
     * Import members from Excel file.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // TODO: Implement Excel import logic
        return response()->json(['message' => 'Import functionality to be implemented']);
    }

    /**
     * Export members to Excel/CSV.
     */
    public function export(Request $request): JsonResponse
    {
        // TODO: Implement Excel export logic
        return response()->json(['message' => 'Export functionality to be implemented']);
    }
}
