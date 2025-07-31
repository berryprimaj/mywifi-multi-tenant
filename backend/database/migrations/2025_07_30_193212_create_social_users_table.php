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
        Schema::create('social_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('ip');
            $table->string('whatsapp')->nullable();
            $table->string('provider'); // 'Google'/'WhatsApp'
            $table->datetime('connected_at');
            $table->string('session');
            $table->string('data_usage')->default('0');
            $table->string('status')->default('offline'); // 'online'/'offline'
            $table->string('tenant_id'); // foreign key to tenants table
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_users');
    }
};
