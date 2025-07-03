<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Succursale extends Model
{
    protected $fillable = [
        'name',
        'address',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
