<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockSuccursale extends Model
{
    protected $fillable = [
        'stock_id',
        'succursale_id',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
