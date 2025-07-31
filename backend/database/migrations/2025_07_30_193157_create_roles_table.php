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
        Schema::create('roles', function (Blueprint $table) {
            $table->string('id')->primary(); // string primary key as specified
            $table->string('name');
            $table->string('value')->unique(); // e.g., 'super_admin'
            $table->text('description');
            $table->json('permissions'); // array of strings, e.g., ['users.view', 'settings.edit']
            $table->integer('password_expiry_days')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
