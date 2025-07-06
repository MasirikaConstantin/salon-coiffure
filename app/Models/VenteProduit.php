<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VenteProduit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vente_id',
        'produit_id',
        'service_id',
        'quantite',
        'prix_unitaire',
        'remise',
        'montant_total'
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
        'remise' => 'decimal:2',
        'montant_total' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = (string) \Illuminate\Support\Str::uuid();
        });
    }

    public function vente()
    {
        return $this->belongsTo(Vente::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}