<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StockFactory extends Factory
{
    public function definition()
    {
        return [
            'quantite' => $this->faker->numberBetween(0, 100),
            'quantite_alerte' => $this->faker->numberBetween(5, 20),
            'actif' => $this->faker->boolean(90),
            'ref' => Str::uuid(),
            'produit_id' => null,
            'user_id' => null,
        ];
    }
}