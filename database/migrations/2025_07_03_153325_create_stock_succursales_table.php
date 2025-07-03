<?php

use App\Models\Produit;
use App\Models\Succursale;
use App\Models\User;
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
        Schema::create('stock_succursales', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Produit::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Succursale::class)->nullable()->constrained()->nullOnDelete();
            $table->integer('quantite')->default(0);
            $table->integer('seuil_alerte')->default(5);
            $table->uuid('ref')->unique();
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->softDeletesTz();
            $table->timestamps();
            $table->unique(['produit_id', 'succursale_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_succursales');
    }
};
