<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RendezvousFactory extends Factory
{
    public function definition()
    {
        return [
            'date_heure' => $this->faker->dateTimeBetween('now', '+1 month'),
            'duree_prevue' => $this->faker->numberBetween(15, 120),
            'statut' => $this->faker->randomElement(['confirmé', 'annulé', 'terminé', 'no-show']),
            'notes' => $this->faker->paragraph(),
            'ref' => Str::uuid(),
            'client_id' => null,
            'succursale_id' => null,
        ];
    }
}