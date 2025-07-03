<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rendezvou extends Model
{
    protected $fillable = [
        'client_id',
        'produit_id',
        'date',
        'heure',
        'statut',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
