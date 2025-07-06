<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vente extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'succursale_id',
        'vendeur_id',
        'remise',
        'montant_total',
        'mode_paiement'
    ];

    protected $casts = [
        'montant_total' => 'decimal:2',
        'remise' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = (string) \Illuminate\Support\Str::uuid();
            if (auth()->check()) {
                $model->vendeur_id = auth()->id();
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function succursale()
    {
        return $this->belongsTo(Succursale::class);
    }

    public function vendeur()
    {
        return $this->belongsTo(User::class, 'vendeur_id');
    }

    public function produits()
    {
        return $this->hasMany(VenteProduit::class)->whereNotNull('produit_id');
    }

    public function services()
    {
        return $this->hasMany(VenteProduit::class)->whereNotNull('service_id');
    }

    public function items()
    {
        return $this->hasMany(VenteProduit::class);
    }
}
