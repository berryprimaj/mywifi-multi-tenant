<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\MikroTikService;
use App\Models\Setting;

class MikroTikController extends Controller
{
    private $mikrotikService;

    public function __construct()
    {
        // Initialize MikroTik service with default or tenant-specific settings
        $this->mikrotikService = new MikroTikService();
    }

    /**
     * Get router status and statistics
     */
    public function getStatus(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        // Get MikroTik settings for this tenant
        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured for this tenant'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $status = $mikrotik->getRouterStatus();
        return response()->json($status);
    }

    /**
     * Test connection to MikroTik router
     */
    public function testConnection(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->testConnection();
        return response()->json($result);
    }

    /**
     * Create backup of router configuration
     */
    public function createBackup(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->createBackup();
        return response()->json($result);
    }

    /**
     * Restart hotspot service
     */
    public function restartHotspot(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->restartHotspot();
        return response()->json($result);
    }

    /**
     * Reboot router
     */
    public function rebootRouter(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->rebootRouter();
        return response()->json($result);
    }

    /**
     * Get network interfaces
     */
    public function getInterfaces(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->getInterfaces();
        return response()->json($result);
    }

    /**
     * Get hotspot profiles
     */
    public function getProfiles(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $settings = $this->getMikroTikSettings($tenantId);

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'MikroTik settings not configured'
            ], 400);
        }

        $mikrotik = new MikroTikService(
            $settings['mikrotikHost'],
            $settings['mikrotikPort'],
            $settings['mikrotikUsername'],
            $settings['mikrotikPassword']
        );

        $result = $mikrotik->getHotspotProfiles();
        return response()->json($result);
    }

    /**
     * Get MikroTik settings for a tenant
     */
    private function getMikroTikSettings($tenantId): ?array
    {
        $setting = Setting::where('tenant_id', $tenantId)
                          ->where('key', 'apiKeys')
                          ->first();

        if (!$setting || !$setting->value) {
            return null;
        }

        $apiKeys = $setting->value;

        if (empty($apiKeys['mikrotikHost']) || empty($apiKeys['mikrotikUsername'])) {
            return null;
        }

        return $apiKeys;
    }
}
