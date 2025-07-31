<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mikrotik_interfaces', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id'); // foreign key to tenants table
            $table->string('name');
            $table->string('mac');
            $table->string('type'); // 'Ethernet'/'Wireless'
            $table->string('ip');
            $table->string('status'); // 'running'/'disabled'
            $table->string('rx');
            $table->string('tx');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mikrotik_interfaces');
    }
};
