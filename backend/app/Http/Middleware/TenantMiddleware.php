<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;
use Illuminate\Support\Facades\Cache;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = $this->resolveTenant($request);

        if (!$tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant not found or inactive'
            ], 404);
        }

        // Set tenant in request for use in controllers
        $request->attributes->set('tenant', $tenant);

        // Set tenant ID in request for easy access
        $request->merge(['tenant_id' => $tenant->id]);

        return $next($request);
    }

    /**
     * Resolve tenant from request
     */
    private function resolveTenant(Request $request): ?Tenant
    {
        // 1. Check for tenant_id in URL parameter
        if ($request->has('tenant_id')) {
            $tenantId = $request->get('tenant_id');
            return Cache::remember("tenant:{$tenantId}", 300, function() use ($tenantId) {
                return Tenant::where('id', $tenantId)->where('status', true)->first();
            });
        }

        // 2. Check for tenantId in URL parameter (alternative naming)
        if ($request->has('tenantId')) {
            $tenantId = $request->get('tenantId');
            return Cache::remember("tenant:{$tenantId}", 300, function() use ($tenantId) {
                return Tenant::where('id', $tenantId)->where('status', true)->first();
            });
        }

        // 3. Check for domain/subdomain resolution
        $host = $request->getHost();

        // Remove www. prefix if present
        $host = preg_replace('/^www\./', '', $host);

        return Cache::remember("tenant:domain:{$host}", 300, function() use ($host) {
            return Tenant::findByDomain($host);
        });
    }

    /**
     * Get tenant from request (helper method for controllers)
     */
    public static function getTenant(Request $request): ?Tenant
    {
        return $request->attributes->get('tenant');
    }
}
