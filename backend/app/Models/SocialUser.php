<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialUser extends Model
{
    protected $fillable = [
        'name',
        'email',
        'ip',
        'whatsapp',
        'provider',
        'connected_at',
        'session',
        'data_usage',
        'status',
        'tenant_id',
    ];

    protected $casts = [
        'connected_at' => 'datetime',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
