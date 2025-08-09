<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SocialUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\MikroTikController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ExcelController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes (public)
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Admin & User Management
    Route::apiResource('admins', AdminController::class);

    // Tenant Management
    Route::apiResource('tenants', TenantController::class);

    // Settings routes
    Route::get('/settings/{tenantId?}', [SettingController::class, 'index']);
    Route::post('/settings/{tenantId?}', [SettingController::class, 'store']);

    // Member Management
    Route::apiResource('members', MemberController::class);
    Route::post('/members/import', [MemberController::class, 'import']);
    Route::get('/members/export', [MemberController::class, 'export']);

    // Social Users Management
    Route::apiResource('social-users', SocialUserController::class);
    Route::post('/social-users/delete-range', [SocialUserController::class, 'deleteRange']);
    Route::get('/social-users/export', [SocialUserController::class, 'export']);

    // Dashboard
    Route::get('/dashboard/stats/{tenantId?}', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity/{tenantId?}', [DashboardController::class, 'activity']);
    Route::get('/dashboard/user-activity-chart/{tenantId?}', [DashboardController::class, 'userActivityChart']);
    Route::get('/dashboard/daily-sessions-chart/{tenantId?}', [DashboardController::class, 'dailySessionsChart']);

    // File Upload
    Route::post('/upload/logo', [FileUploadController::class, 'uploadLogo']);
    Route::post('/upload/background', [FileUploadController::class, 'uploadBackground']);
    Route::delete('/upload/file', [FileUploadController::class, 'deleteFile']);

    // MikroTik Router Management
    Route::get('/mikrotik/status/{tenantId?}', [MikroTikController::class, 'getStatus']);
    Route::get('/mikrotik/public-ip/{tenantId?}', [MikroTikController::class, 'getPublicIP']);
    Route::post('/mikrotik/test-connection/{tenantId?}', [MikroTikController::class, 'testConnection']);
    Route::post('/mikrotik/test-ddns', [MikroTikController::class, 'testDDNS']);
    Route::post('/mikrotik/backup/{tenantId?}', [MikroTikController::class, 'createBackup']);
    Route::post('/mikrotik/restart-hotspot/{tenantId?}', [MikroTikController::class, 'restartHotspot']);
    Route::post('/mikrotik/reboot/{tenantId?}', [MikroTikController::class, 'rebootRouter']);
    Route::get('/mikrotik/interfaces/{tenantId?}', [MikroTikController::class, 'getInterfaces']);
    Route::get('/mikrotik/profiles/{tenantId?}', [MikroTikController::class, 'getProfiles']);

    // Advanced Analytics
    Route::get('/analytics/dashboard/{tenantId?}', [AnalyticsController::class, 'getDashboardAnalytics']);
    Route::get('/analytics/realtime/{tenantId?}', [AnalyticsController::class, 'getRealTimeStats']);
    Route::get('/analytics/user-growth/{tenantId?}', [AnalyticsController::class, 'getUserGrowth']);
    Route::get('/analytics/bandwidth/{tenantId?}', [AnalyticsController::class, 'getBandwidthAnalytics']);

    // Excel Import/Export
    Route::get('/excel/export/members/{tenantId?}', [ExcelController::class, 'exportMembers']);
    Route::post('/excel/import/members/{tenantId?}', [ExcelController::class, 'importMembers']);
    Route::get('/excel/template/members', [ExcelController::class, 'downloadTemplate']);

    // Tenant Management
    Route::get('/tenants', [TenantController::class, 'index']);
    Route::post('/tenants', [TenantController::class, 'store']);
    Route::get('/tenants/{id}', [TenantController::class, 'show']);
    Route::put('/tenants/{id}', [TenantController::class, 'update']);
    Route::delete('/tenants/{id}', [TenantController::class, 'destroy']);
    Route::get('/tenants/find-by-domain', [TenantController::class, 'findByDomain']);
    Route::put('/tenants/{id}/settings', [TenantController::class, 'updateSettings']);
});

// Public routes for tenant resolution
Route::get('/tenant/resolve', [TenantController::class, 'findByDomain']);