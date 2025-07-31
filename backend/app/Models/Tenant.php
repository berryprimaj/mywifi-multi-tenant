<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'domain',
        'subdomain',
        'status',
        'settings',
        'created_by',
    ];

    protected $casts = [
        'settings' => 'array',
        'status' => 'boolean',
    ];

    protected $attributes = [
        'status' => true,
        'settings' => '{}',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function socialUsers(): HasMany
    {
        return $this->hasMany(SocialUser::class);
    }

    public function mikrotikInterfaces(): HasMany
    {
        return $this->hasMany(MikrotikInterface::class);
    }

    public function mikrotikProfiles(): HasMany
    {
        return $this->hasMany(MikrotikProfile::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Get tenant by domain or subdomain
     */
    public static function findByDomain($domain): ?self
    {
        return static::where('domain', $domain)
                    ->orWhere('subdomain', $domain)
                    ->where('status', true)
                    ->first();
    }

    /**
     * Check if tenant is active
     */
    public function isActive(): bool
    {
        return $this->status;
    }

    /**
     * Get tenant settings with defaults
     */
    public function getSettings($key = null, $default = null)
    {
        $settings = $this->settings ?? [];

        if ($key) {
            return $settings[$key] ?? $default;
        }

        return $settings;
    }

    /**
     * Update tenant settings
     */
    public function updateSettings(array $newSettings): bool
    {
        $currentSettings = $this->settings ?? [];
        $this->settings = array_merge($currentSettings, $newSettings);
        return $this->save();
    }
}
