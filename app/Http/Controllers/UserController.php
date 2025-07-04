<?php

namespace App\Http\Controllers;

use App\Models\Succursale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['succursale', 'creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'succursales' => Succursale::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'succursales' => Succursale::all(),
            'roles' => ['admin', 'gerant', 'coiffeur', 'caissier', 'aucun'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'avatar' => 'nullable|image|max:2048',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'date_embauche' => 'nullable|date',
            'role' => 'required|in:admin,gerant,coiffeur,caissier,aucun',
            'is_active' => 'boolean',
            'succursale_id' => 'nullable|exists:succursales,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'date_embauche' => $request->date_embauche,
            'role' => $request->role,
            'is_active' => $request->is_active ?? false,
            'succursale_id' => $request->succursale_id,
        ]);

        if ($request->hasFile('avatar')) {
            $user->update([
                'avatar' => $request->file('avatar')->store('avatars', 'public'),
            ]);
        }

        return redirect()->route('utilisateurs.index')->with('success', 'Utilisateur créé avec succès');
    }

    public function show(string $user)
    {
        $user = User::where('ref', $user)->first();
        $user->load(['succursale', 'creator', 'updater']);
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(string $user)
    {
        $user = User::where('ref', $user)->first();
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'succursales' => Succursale::all(),
            'roles' => ['admin', 'gerant', 'coiffeur', 'caissier', 'aucun'],
        ]);
    }

    public function update(Request $request, string $user)
    {
        $user = User::findOrFail($user);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'avatar' => 'nullable|image|max:2048',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'date_embauche' => 'nullable|date',
            'role' => 'required|in:admin,gerant,coiffeur,caissier,aucun',
            'is_active' => 'boolean',
            'succursale_id' => 'nullable|exists:succursales,id',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'date_embauche' => $request->date_embauche,
            'role' => $request->role,
            'is_active' => $request->is_active ?? false,
            'succursale_id' => $request->succursale_id,
        ]);

        if ($request->hasFile('avatar')) {
            $user->update([
                'avatar' => $request->file('avatar')->store('avatars', 'public'),
            ]);
        }

        return redirect()->route('utilisateurs.index')->with('success', 'Utilisateur mis à jour avec succès');
    }

    public function destroy(string $user)
    {
        $user = User::findOrFail($user);
        $user->delete();
        return redirect()->route('utilisateurs.index')->with('success', 'Utilisateur supprimé avec succès');
    }
}