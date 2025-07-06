<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::with(['produit', 'user'])
            ->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('produit', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $stocks = $query->paginate(10);

        return inertia('Stocks/Index', [
            'stocks' => $stocks,
            'produits' => Produit::active()->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return inertia('Stocks/Create', [
            'produits' => Produit::active()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:0',
            'quantite_alerte' => 'required|integer|min:1',
            'actif' => 'boolean',
        ]);

        DB::transaction(function() use ($request) {
            $stock = Stock::create([
                'produit_id' => $request->produit_id,
                'quantite' => $request->quantite,
                'quantite_alerte' => $request->quantite_alerte,
                'actif' => $request->actif ?? true,
                'ref' => Str::uuid(),
                'user_id' => auth()->id(),
            ]);

            // Mettre à jour le stock global du produit si nécessaire
            $produit = Produit::find($request->produit_id);
            $produit->updateStock();
        });

        return redirect()->route('stocks.index')
            ->with('success', 'Stock créé avec succès');
    }

    public function show(string $stock)
    {
        $stock = Stock::where('ref', $stock)->first();
        return inertia('Stocks/Show', [
            'stock' => $stock->load(['produit', 'user']),
        ]);
    }

    public function edit(string $stock)
    {
        $stock = Stock::where('ref', $stock)
            ->with('produit')
            ->firstOrFail();

        return inertia('Stocks/Edit', [
        'stock' => [
            ...$stock->toArray(),
            'produit_id' => $stock->produit_id // Assurez-vous que cette valeur est bien envoyée
        ],
        'produits' => Produit::active()->get(),
    ]);
}

    public function update(Request $request, string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:0',
            'quantite_alerte' => 'required|integer|min:1',
            'actif' => 'boolean',
        ]);

        DB::transaction(function() use ($request, $stock) {
            $stock->update([
                'produit_id' => $request->produit_id,
                'quantite' => $request->quantite,
                'quantite_alerte' => $request->quantite_alerte,
                'actif' => $request->actif ?? $stock->actif,
            ]);

            // Mettre à jour le stock global du produit si nécessaire
            $produit = Produit::find($request->produit_id);
            $produit->updateStock();
        });

        return redirect()->route('stocks.show', $stock->ref)
            ->with('success', 'Stock mis à jour avec succès');
    }

    public function destroy(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        DB::transaction(function() use ($stock) {
            $produit = $stock->produit;
            $stock->delete();
            
            // Mettre à jour le stock global du produit
            if ($produit) {
                $produit->updateStock();
            }
        });

        return redirect()->route('stocks.index')
            ->with('success', 'Stock supprimé avec succès');
    }

    public function toggleStatus(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        $stock->update(['actif' => !$stock->actif]);

        return back()->with('success', 'Statut du stock mis à jour');
    }
}