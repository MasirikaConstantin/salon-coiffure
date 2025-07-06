<?php

use App\Models\Produit;
use App\Models\Transfert;
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
        Schema::create('transfert_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Produit::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Transfert::class)->nullable()->constrained()->nullOnDelete();
            $table->integer('quantite');
            $table->foreignId('succursale_source_id')->constrained('succursales');
            $table->foreignId('succursale_destination_id')->constrained('succursales');
            $table->foreignId('user_initiateur_id')->constrained('users');
            $table->foreignId('user_validateur_id')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('date_demande');
            $table->dateTime('date_validation')->nullable();
            $table->enum('statut', ['en attente', 'validé', 'refusé'])->default('en attente');
            $table->uuid('ref')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfert_stocks');
    }
};
