<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       // Créer 5 succursales
//\App\Models\Succursale::factory()->count(5)->create();
/*
// Créer 10 utilisateurs avec une succursale aléatoire
\App\Models\User::factory()->count(10)->create([
    'succursale_id' => \App\Models\Succursale::inRandomOrder()->first()->id
]);
*//*
// Créer 50 clients avec une succursale et un utilisateur aléatoire
\App\Models\Client::factory()->count(50)->create([
    'succursale_id' => \App\Models\Succursale::inRandomOrder()->first()->id,
    'enregistrer_par_id' => \App\Models\User::inRandomOrder()->first()->id
]);*/

    }
}
