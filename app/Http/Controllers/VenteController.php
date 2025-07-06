<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Produit;
use App\Models\Service;
use App\Models\Succursale;
use App\Models\Vente;
use App\Models\VenteProduit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VenteController extends Controller
{
    public function index(Request $request)
    {
        $query = Vente::with(['client', 'succursale', 'vendeur', 'items.produit', 'items.service'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ref', 'like', "%{$search}%")
                  ->orWhereHas('client', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('vendeur', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $ventes = $query->paginate(10);

        return Inertia::render('Ventes/Index', [
            'ventes' => $ventes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Ventes/Create', [
            'clients' => Client::all(),
            'succursales' => Succursale::all(),
            'produits' => Produit::where('actif', true)->get(),
            'services' => Service::where('actif', true)->get(),
            'modes_paiement' => ['espèces', 'carte', 'chèque', 'autre'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'succursale_id' => 'nullable|exists:succursales,id',
            'remise' => 'required|numeric|min:0',
            'montant_total' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:espèces,carte,chèque,autre',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'nullable|required_without:items.*.service_id|exists:produits,id',
            'items.*.service_id' => 'nullable|required_without:items.*.produit_id|exists:services,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_unitaire' => 'required|numeric|min:0',
            'items.*.remise' => 'required|numeric|min:0',
            'items.*.montant_total' => 'required|numeric|min:0',
        ]);

        \DB::transaction(function () use ($request) {
            $vente = Vente::create([
                'client_id' => $request->client_id,
                'succursale_id' => $request->succursale_id,
                'remise' => $request->remise,
                'montant_total' => $request->montant_total,
                'mode_paiement' => $request->mode_paiement,
            ]);

            foreach ($request->items as $item) {
                VenteProduit::create([
                    'vente_id' => $vente->id,
                    'produit_id' => $item['produit_id'],
                    'service_id' => $item['service_id'],
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $item['prix_unitaire'],
                    'remise' => $item['remise'],
                    'montant_total' => $item['montant_total'],
                ]);
            }
        });

        return redirect()->route('ventes.index')->with('success', 'Vente enregistrée avec succès');
    }

    public function show(Vente $vente)
    {
        $vente->load(['client', 'succursale', 'vendeur', 'items.produit', 'items.service']);
        return Inertia::render('Ventes/Show', [
            'vente' => $vente,
        ]);
    }

    public function destroy(Vente $vente)
    {
        $vente->delete();
        return redirect()->route('ventes.index')->with('success', 'Vente supprimée avec succès');
    }
}