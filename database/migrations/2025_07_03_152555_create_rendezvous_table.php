<?php

use App\Models\Client;
use App\Models\Succursale;
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
        Schema::create('rendezvous', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Client::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Succursale::class)->nullable()->constrained()->nullOnDelete();
            $table->dateTime('date_heure');
            $table->integer('duree_prevue');
            $table->enum('statut', ['confirmé', 'annulé', 'terminé', 'no-show'])->default('confirmé');
            $table->text('notes')->nullable();
            $table->uuid('ref')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendezvous');
    }
};
