<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransfertStock extends Model
{
    protected $fillable = [
        'transfert_id',
        'stock_id',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
