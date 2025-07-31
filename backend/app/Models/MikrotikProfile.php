<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MikrotikProfile extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'session_timeout',
        'idle_timeout',
        'shared_users',
        'rate_limit',
        'status',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
