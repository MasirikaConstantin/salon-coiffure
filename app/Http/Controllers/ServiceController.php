<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with(['user'=>function($query){
            $query->select('id','name');
        }])
            ->orderBy('name', 'asc');

        // Ajout de la recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $services = $query->paginate(10);

        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'duree_minutes' => 'required|integer|min:1',
            'prix' => 'required|numeric|min:0',
            'actif' => 'boolean',
        ]);

        Service::create($validated);

        return redirect()->route('services.index')->with('success', 'Service créé avec succès');
    }

    public function show(Service $service)
    {
        $service->load(['user'=>function($query){
            $query->select('id','name','ref');
        }]);
        return Inertia::render('Services/Show', [
            'service' => $service,
        ]);
    }

    public function edit(string $ref)
    {
        $service = Service::where('ref', $ref)->first();
        return Inertia::render('Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'duree_minutes' => 'required|integer|min:1',
            'prix' => 'required|numeric|min:0',
            'actif' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->route('services.index')->with('success', 'Service mis à jour avec succès');
    }

    public function updateStatus(Request $request, Service $service)
    {
        $validated = $request->validate([
            'actif' => 'boolean',
        ]);

        $service->update([
            'actif' => $validated['actif'],
        ]);

        return redirect()->route('services.index')->with('success', 'Statut du service mis à jour avec succès');
    }
    
    public function destroy(string $ref)
    {
        $service = Service::where('ref', $ref)->first();
        $service->delete();
        return redirect()->route('services.index')->with('success', 'Service supprimé avec succès');
    }
}