<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RendezvousService extends Model
{
    protected $fillable = [
        'rendezvous_id',
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
