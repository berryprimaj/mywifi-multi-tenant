<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default admin user as specified in the guide
        User::create([
            'username' => 'admin',
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'),
            'role' => 'super_admin',
            'tenant_id' => 'default-tenant',
            'permissions' => null,
        ]);
    }
}
