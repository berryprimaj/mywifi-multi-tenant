<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SecurityService
{
    /**
     * Log security event
     */
    public function logSecurityEvent($action, $model = null, $oldValues = null, $newValues = null): void
    {
        AuditLog::createLog($action, $model, $oldValues, $newValues);
    }

    /**
     * Check for suspicious login activity
     */
    public function checkSuspiciousActivity($user, $request): array
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        
        // Check for multiple failed attempts
        $failedAttempts = Cache::get("failed_login_attempts:{$user->id}", 0);
        
        // Check for login from new IP
        $lastKnownIp = Cache::get("last_ip:{$user->id}");
        $isNewIp = $lastKnownIp && $lastKnownIp !== $ipAddress;
        
        // Check for login from new device
        $lastKnownAgent = Cache::get("last_agent:{$user->id}");
        $isNewDevice = $lastKnownAgent && $lastKnownAgent !== $userAgent;
        
        $suspiciousFactors = [];
        
        if ($failedAttempts >= 3) {
            $suspiciousFactors[] = 'Multiple failed login attempts';
        }
        
        if ($isNewIp) {
            $suspiciousFactors[] = 'Login from new IP address';
        }
        
        if ($isNewDevice) {
            $suspiciousFactors[] = 'Login from new device';
        }
        
        $isSuspicious = count($suspiciousFactors) > 0;
        
        if ($isSuspicious) {
            $this->logSecurityEvent('suspicious_login', $user, null, [
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'factors' => $suspiciousFactors
            ]);
        }
        
        // Update last known IP and device
        Cache::put("last_ip:{$user->id}", $ipAddress, 86400); // 24 hours
        Cache::put("last_agent:{$user->id}", $userAgent, 86400);
        
        return [
            'is_suspicious' => $isSuspicious,
            'factors' => $suspiciousFactors
        ];
    }

    /**
     * Record failed login attempt
     */
    public function recordFailedLogin($identifier, $request): void
    {
        $key = "failed_login_attempts:{$identifier}";
        $attempts = Cache::get($key, 0) + 1;
        
        Cache::put($key, $attempts, 900); // 15 minutes
        
        $this->logSecurityEvent('failed_login', null, null, [
            'identifier' => $identifier,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'attempts' => $attempts
        ]);
        
        // Lock account after 5 failed attempts
        if ($attempts >= 5) {
            $this->lockAccount($identifier);
        }
    }

    /**
     * Lock user account
     */
    public function lockAccount($identifier): void
    {
        $user = User::where('username', $identifier)
                   ->orWhere('email', $identifier)
                   ->first();
        
        if ($user) {
            Cache::put("account_locked:{$user->id}", true, 1800); // 30 minutes
            
            $this->logSecurityEvent('account_locked', $user, null, [
                'reason' => 'Multiple failed login attempts',
                'locked_until' => Carbon::now()->addMinutes(30)->toISOString()
            ]);
        }
    }

    /**
     * Check if account is locked
     */
    public function isAccountLocked($userId): bool
    {
        return Cache::has("account_locked:{$userId}");
    }

    /**
     * Unlock account
     */
    public function unlockAccount($userId): void
    {
        Cache::forget("account_locked:{$userId}");
        Cache::forget("failed_login_attempts:{$userId}");
        
        $user = User::find($userId);
        if ($user) {
            $this->logSecurityEvent('account_unlocked', $user);
        }
    }

    /**
     * Generate secure password
     */
    public function generateSecurePassword($length = 12): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        $password = '';
        
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[random_int(0, strlen($characters) - 1)];
        }
        
        return $password;
    }

    /**
     * Validate password strength
     */
    public function validatePasswordStrength($password): array
    {
        $errors = [];
        
        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long';
        }
        
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter';
        }
        
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter';
        }
        
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = 'Password must contain at least one number';
        }
        
        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            $errors[] = 'Password must contain at least one special character';
        }
        
        return [
            'is_strong' => empty($errors),
            'errors' => $errors,
            'score' => $this->calculatePasswordScore($password)
        ];
    }

    /**
     * Calculate password strength score
     */
    private function calculatePasswordScore($password): int
    {
        $score = 0;
        
        // Length bonus
        $score += min(strlen($password) * 2, 20);
        
        // Character variety bonus
        if (preg_match('/[a-z]/', $password)) $score += 5;
        if (preg_match('/[A-Z]/', $password)) $score += 5;
        if (preg_match('/[0-9]/', $password)) $score += 5;
        if (preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) $score += 10;
        
        // Complexity bonus
        if (strlen($password) >= 12) $score += 10;
        if (preg_match('/[a-z].*[A-Z]|[A-Z].*[a-z]/', $password)) $score += 5;
        
        return min($score, 100);
    }

    /**
     * Get security dashboard data
     */
    public function getSecurityDashboard($tenantId): array
    {
        $last24Hours = Carbon::now()->subDay();
        $last7Days = Carbon::now()->subWeek();
        
        return [
            'failed_logins_24h' => AuditLog::where('tenant_id', $tenantId)
                ->where('action', 'failed_login')
                ->where('created_at', '>=', $last24Hours)
                ->count(),
            
            'suspicious_activities_7d' => AuditLog::where('tenant_id', $tenantId)
                ->where('action', 'suspicious_login')
                ->where('created_at', '>=', $last7Days)
                ->count(),
            
            'locked_accounts' => 0, // Placeholder for locked accounts count
            
            'recent_activities' => AuditLog::where('tenant_id', $tenantId)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($log) {
                    return [
                        'id' => $log->id,
                        'action' => $log->action,
                        'user' => $log->user ? $log->user->name : 'System',
                        'ip_address' => $log->ip_address,
                        'created_at' => $log->created_at->toISOString(),
                    ];
                })
        ];
    }
}
