<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Succursale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::with(['succursale', 'enregistrePar'=>function($query){
            $query->select('id', 'name');
        }])
            ->orderBy('created_at', 'desc');

        // Ajout de la recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('succursale', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $clients = $query->paginate(15);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'succursales' => Succursale::all(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create', [
            'succursales' => Succursale::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'notes' => 'nullable|string',
            'succursale_id' => 'nullable|exists:succursales,id',
        ]);

        Client::create($validated);

        return redirect()->route('clients.index')->with('success', 'Client créé avec succès');
    }

    public function show(string $ref)
    {
        $client = Client::where('ref', $ref)->first();
        $client->load(['succursale', 'enregistrePar'=>function($query){
            $query->select('id', 'name','ref');
        }]);
        //dd($client);
        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    public function edit(string $ref)
    {
        $client = Client::where('ref', $ref)->first();
        return Inertia::render('Clients/Edit', [
            'client' => $client,
            'succursales' => Succursale::all(),
        ]);
    }

    public function update(Request $request, string $ref)
    {
        $client = Client::where('ref', $ref)->first();
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'telephone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'notes' => 'nullable|string',
            'succursale_id' => 'nullable|exists:succursales,id',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')->with('success', 'Client mis à jour avec succès');
    }

    public function destroy(string $ref)
    {
        $client = Client::where('ref', $ref)->first();
        $client->delete();
        return redirect()->route('clients.index')->with('success', 'Client supprimé avec succès');
    }
}