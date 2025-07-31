<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MikrotikInterface extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'mac',
        'type',
        'ip',
        'status',
        'rx',
        'tx',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
