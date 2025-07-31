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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('department');
            $table->string('password');
            $table->string('status')->default('active'); // 'active'/'inactive'
            $table->datetime('last_login')->nullable();
            $table->string('data_usage')->default('0');
            $table->string('session_time')->default('0');
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
        Schema::dropIfExists('members');
    }
};
