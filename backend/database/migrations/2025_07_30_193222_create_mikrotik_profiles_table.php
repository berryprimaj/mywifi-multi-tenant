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
        Schema::create('mikrotik_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id'); // foreign key to tenants table
            $table->string('name');
            $table->string('session_timeout');
            $table->string('idle_timeout');
            $table->integer('shared_users');
            $table->string('rate_limit');
            $table->string('status')->default('active'); // 'active'/'inactive'
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mikrotik_profiles');
    }
};
