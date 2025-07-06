<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'telephone',
        'email',
        'notes',
        'succursale_id',
        'enregistrer_par_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = (string) \Illuminate\Support\Str::uuid();
            if (auth()->check()) {
                $model->enregistrer_par_id = auth()->id();
            }
        });
    }

    public function succursale()
    {
        return $this->belongsTo(Succursale::class);
    }

    public function enregistrePar()
    {
        return $this->belongsTo(User::class, 'enregistrer_par_id');
    }
}
