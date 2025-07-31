<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    private $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get dashboard analytics
     */
    public function getDashboardAnalytics(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $analytics = $this->analyticsService->getDashboardAnalytics($tenantId);

        return response()->json([
            'success' => true,
            'data' => $analytics
        ]);
    }

    /**
     * Get real-time statistics
     */
    public function getRealTimeStats(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $stats = $this->analyticsService->getRealTimeStats($tenantId);

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get user growth analytics
     */
    public function getUserGrowth(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $analytics = $this->analyticsService->getDashboardAnalytics($tenantId);

        return response()->json([
            'success' => true,
            'data' => $analytics['user_growth']
        ]);
    }

    /**
     * Get bandwidth analytics
     */
    public function getBandwidthAnalytics(Request $request, $tenantId = null): JsonResponse
    {
        $tenantId = $tenantId ?? $request->user()->tenant_id;

        $analytics = $this->analyticsService->getDashboardAnalytics($tenantId);

        return response()->json([
            'success' => true,
            'data' => $analytics['bandwidth_usage']
        ]);
    }
}
