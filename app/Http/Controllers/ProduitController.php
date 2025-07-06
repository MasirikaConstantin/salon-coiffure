<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        $query = Produit::with(['user'])
            ->orderBy('name', 'asc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $produits = $query->paginate(10);

        return Inertia::render('Produits/Index', [
            'produits' => $produits,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Produits/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'avatar' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'prix_achat' => 'required|numeric|min:0',
            'prix_vente' => 'required|numeric|min:0',
            'actif' => 'boolean',
        ]);

        $produit = Produit::create($validated);

        if ($request->hasFile('avatar')) {
            $produit->update([
                'avatar' => $request->file('avatar')->store('produits', 'public'),
            ]);
        }

        return redirect()->route('produits.index')->with('success', 'Produit créé avec succès');
    }

    public function show(string $produit)
    {
        $produit = Produit::where('ref', $produit)->first();
        $produit->load(['user']);
        return Inertia::render('Produits/Show', [
            'produit' => $produit,
        ]);
    }

    public function edit(string $produit)
    {
        $produit = Produit::where('ref', $produit)->first();
        return Inertia::render('Produits/Edit', [
            'produit' => $produit,
        ]);
    }

    public function update(Request $request, Produit $produit)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'avatar' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'prix_achat' => 'required|numeric|min:0',
            'prix_vente' => 'required|numeric|min:0',
            'actif' => 'required|boolean',
        ]);
    
    } catch (\Exception $e) {
        dd($e);
        return redirect()->back()->withErrors($e->getMessage());
    }
    // Mettre à jour les champs standards
    $produit->name = $validated['name'];
    $produit->description = $validated['description'];
    $produit->prix_achat = $validated['prix_achat'];
    $produit->prix_vente = $validated['prix_vente'];
    $produit->actif = $validated['actif'];

    // Gérer l'image séparément
    if ($request->hasFile('avatar')) {
        // Supprimer l'ancienne image si elle existe
        if ($produit->avatar) {
            Storage::disk('public')->delete($produit->avatar);
        }
        
        $path = $request->file('avatar')->store('produits', 'public');
        $produit->avatar = $path;
    }

    $produit->save();

    return redirect()->route('produits.index')->with([
        'success' => 'Produit mis à jour avec succès',
        // Conserver les données du formulaire en cas de redirection
        'data' => $request->except('avatar')
    ]);
}

    public function destroy(string $produit)
    {
        $produit = Produit::where('ref', $produit)->first();
        if($produit->avatar){
            Storage::delete($produit->avatar);
        }
        $produit->delete();

        return redirect()->route('produits.index')->with('success', 'Produit supprimé avec succès');
    }
    
    public function updateStatus(Request $request, Produit $produit)
    {
        $produit->update([
            'actif' => $request->actif,
        ]);
        return redirect()->route('produits.index')->with('success', 'Statut du produit mis à jour avec succès');
    }
}