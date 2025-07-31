<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting; // Import the new Setting model

class SettingsController extends Controller
{
    public function getSettings()
    {
        // Fetch all settings from the database
        $settings = Setting::pluck('value', 'key')->toArray();

        // Define default settings if not found in DB
        $defaultHotspot = [
            'siteName' => 'MyHotspot-WiFi',
            'primaryColor' => '#3B82F6',
            'secondaryColor' => '#8B5CF6',
            'logo' => null,
            'backgroundImage' => null,
            'welcomeMessage' => 'Welcome to MyHotspot Free WiFi',
        ];

        $defaultAdmin = [
            'siteName' => 'MYHOTSPOT',
            'primaryColor' => '#1E3A8A',
            'secondaryColor' => '#475569',
            'logo' => null,
            'backgroundImage' => null,
            'welcomeMessage' => 'Administrator Panel',
        ];

        $defaultApiKeys = [
            'fonteApiKey' => '',
            'fonteDeviceId' => '',
            'googleClientId' => '',
            'googleClientSecret' => '',
            'googleRedirectUri' => 'https://yourdomain.com/auth/google/callback',
        ];

        // Merge fetched settings with defaults to ensure all keys exist
        $hotspotSettings = array_merge($defaultHotspot, $settings['hotspot'] ?? []);
        $adminSettings = array_merge($defaultAdmin, $settings['admin'] ?? []);
        $apiKeysSettings = array_merge($defaultApiKeys, $settings['apiKeys'] ?? []);

        return response()->json([
            'hotspot' => $hotspotSettings,
            'admin' => $adminSettings,
            'apiKeys' => $apiKeysSettings,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $validatedData = $request->validate([
            'hotspot.siteName' => 'required|string|max:255',
            'hotspot.primaryColor' => 'required|string|max:7',
            'hotspot.secondaryColor' => 'required|string|max:7',
            'hotspot.logo' => 'nullable|string',
            'hotspot.backgroundImage' => 'nullable|string',
            'hotspot.welcomeMessage' => 'required|string|max:500',
            'admin.siteName' => 'required|string|max:255',
            'admin.primaryColor' => 'required|string|max:7',
            'admin.secondaryColor' => 'required|string|max:7',
            'admin.logo' => 'nullable|string',
            'admin.backgroundImage' => 'nullable|string',
            'admin.welcomeMessage' => 'required|string|max:500',
            'apiKeys.fonteApiKey' => 'nullable|string|max:255',
            'apiKeys.fonteDeviceId' => 'nullable|string|max:255',
            'apiKeys.googleClientId' => 'nullable|string|max:255',
            'apiKeys.googleClientSecret' => 'nullable|string|max:255',
            'apiKeys.googleRedirectUri' => 'nullable|url|max:255',
        ]);

        // Save each top-level setting group as a separate entry in the 'settings' table
        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings saved successfully!']);
    }
}