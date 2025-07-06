<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StockSuccursaleFactory extends Factory
{
    public function definition()
    {
        return [
            'quantite' => $this->faker->numberBetween(0, 50),
            'seuil_alerte' => $this->faker->numberBetween(2, 10),
            'ref' => Str::uuid(),
            'produit_id' => null,
            'succursale_id' => null,
            'user_id' => null,
        ];
    }
}