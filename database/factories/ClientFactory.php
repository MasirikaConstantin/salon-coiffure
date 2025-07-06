<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ClientFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'telephone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'notes' => $this->faker->paragraph(),
            'ref' => Str::uuid(),
            'succursale_id' => null,
            'enregistrer_par_id' => null,
        ];
    }
}