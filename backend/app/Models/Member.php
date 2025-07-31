<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Member extends Model
{
    protected $fillable = [
        'username',
        'name',
        'email',
        'department',
        'password',
        'status',
        'last_login',
        'data_usage',
        'session_time',
        'tenant_id',
    ];

    protected $casts = [
        'last_login' => 'datetime',
    ];

    protected $hidden = [
        'password',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
