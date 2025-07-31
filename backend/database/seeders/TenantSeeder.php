<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default tenant as specified in the guide
        Tenant::create([
            'id' => 'default-tenant',
            'name' => 'Default Hotspot',
            'domain' => null,
            'subdomain' => null,
            'status' => true,
            'settings' => [
                'siteName' => 'Default Hotspot',
                'primaryColor' => '#3B82F6',
                'secondaryColor' => '#8B5CF6',
                'welcomeMessage' => 'Welcome to our WiFi network',
                'themeMode' => 'light',
            ],
            'created_by' => null,
        ]);

        // Create demo tenant for testing
        Tenant::create([
            'id' => 'demo-tenant',
            'name' => 'Demo Cafe WiFi',
            'domain' => 'demo.example.com',
            'subdomain' => 'demo',
            'status' => true,
            'settings' => [
                'siteName' => 'Demo Cafe WiFi',
                'primaryColor' => '#10B981',
                'secondaryColor' => '#F59E0B',
                'welcomeMessage' => 'Welcome to Demo Cafe - Enjoy free WiFi!',
                'themeMode' => 'light',
            ],
            'created_by' => null,
        ]);
    }
}
