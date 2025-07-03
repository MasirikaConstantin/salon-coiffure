<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VenteProduit extends Model
{
    protected $fillable = [
        'vente_id',
        'produit_id',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
