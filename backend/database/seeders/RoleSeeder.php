<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'id' => 'super-admin',
                'name' => 'Super Administrator',
                'value' => 'super_admin',
                'description' => 'Full system access across all tenants',
                'permissions' => ['*'],
                'password_expiry_days' => null,
            ],
            [
                'id' => 'administrator',
                'name' => 'Administrator',
                'value' => 'administrator',
                'description' => 'Full access within tenant',
                'permissions' => ['users.view', 'users.create', 'users.edit', 'users.delete', 'settings.edit', 'members.manage', 'mikrotik.manage'],
                'password_expiry_days' => 90,
            ],
            [
                'id' => 'owner',
                'name' => 'Owner',
                'value' => 'owner',
                'description' => 'Business owner with full tenant access',
                'permissions' => ['users.view', 'users.create', 'users.edit', 'settings.edit', 'members.manage', 'mikrotik.manage'],
                'password_expiry_days' => 90,
            ],
            [
                'id' => 'manager',
                'name' => 'Manager',
                'value' => 'manager',
                'description' => 'Management level access',
                'permissions' => ['users.view', 'settings.view', 'members.manage', 'mikrotik.view'],
                'password_expiry_days' => 60,
            ],
            [
                'id' => 'staff',
                'name' => 'Staff',
                'value' => 'staff',
                'description' => 'Staff level access',
                'permissions' => ['members.view', 'mikrotik.view'],
                'password_expiry_days' => 30,
            ],
            [
                'id' => 'moderator',
                'name' => 'Moderator',
                'value' => 'moderator',
                'description' => 'Moderation access',
                'permissions' => ['members.view', 'members.edit'],
                'password_expiry_days' => 30,
            ],
            [
                'id' => 'viewer',
                'name' => 'Viewer',
                'value' => 'viewer',
                'description' => 'Read-only access',
                'permissions' => ['dashboard.view'],
                'password_expiry_days' => 30,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
