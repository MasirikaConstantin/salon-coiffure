<?php

namespace App\Http\Controllers;

use App\Models\Transfert;
use App\Models\TransfertStock;
use App\Models\Produit;
use App\Models\Succursale;
use App\Models\StockSuccursale;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransfertController extends Controller
{
    public function index(Request $request)
    {
        $query = Transfert::with(['user', 'transfertStocks'])
            ->latest();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ref', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $transferts = $query->paginate(10);

        return inertia('Transferts/Index', [
            'transferts' => $transferts,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return inertia('Transferts/Create', [
            'produits' => Produit::active()->get(),
            'succursales' => Succursale::all(),
            'users' => User::select('id', 'name','ref')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'note' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.succursale_source_id' => 'required|exists:succursales,id',
            'items.*.succursale_destination_id' => 'required|exists:succursales,id|different:items.*.succursale_source_id',
        ]);

        DB::transaction(function() use ($request) {
            $transfert = Transfert::create([
                'note' => $request->note,
                'user_id' => auth()->id(),
            ]);

            foreach ($request->items as $item) {
                // Vérifier le stock disponible
                $stock = StockSuccursale::where('produit_id', $item['produit_id'])
                    ->where('succursale_id', $item['succursale_source_id'])
                    ->first();

                if (!$stock || $stock->quantite < $item['quantite']) {
                    throw new \Exception("Stock insuffisant pour le produit: {$item['produit_id']}");
                }

                TransfertStock::create([
                    'transfert_id' => $transfert->id,
                    'produit_id' => $item['produit_id'],
                    'quantite' => $item['quantite'],
                    'succursale_source_id' => $item['succursale_source_id'],
                    'succursale_destination_id' => $item['succursale_destination_id'],
                    'user_initiateur_id' => auth()->id(),
                    'date_demande' => now(),
                    'statut' => 'en attente',
                ]);
            }
        });

        return redirect()->route('transferts.index')
            ->with('success', 'Transfert créé avec succès');
    }

    public function show(Transfert $transfert)
    {
        return inertia('Transferts/Show', [
            'transfert' => $transfert->load([
                'user',
                'transfertStocks.produit',
                'transfertStocks.succursaleSource',
                'transfertStocks.succursaleDestination',
                'transfertStocks.initiateur',
                'transfertStocks.validateur'
            ]),
        ]);
    }

    public function validateTransfert(Request $request, Transfert $transfert)
    {
        $request->validate([
            'action' => 'required|in:validé,refusé',
        ]);

        DB::transaction(function() use ($request, $transfert) {
            $statut = $request->action;
            $dateValidation = $statut === 'validé' ? now() : null;

            $transfert->transfertStocks()->update([
                'statut' => $statut,
                'date_validation' => $dateValidation,
                'user_validateur_id' => auth()->id(),
            ]);

            if ($statut === 'validé') {
                foreach ($transfert->transfertStocks as $item) {
                    // Diminuer le stock source
                    StockSuccursale::where('produit_id', $item->produit_id)
                        ->where('succursale_id', $item->succursale_source_id)
                        ->decrement('quantite', $item->quantite);

                    // Augmenter le stock destination (ou créer si n'existe pas)
                    StockSuccursale::updateOrCreate(
                        [
                            'produit_id' => $item->produit_id,
                            'succursale_id' => $item->succursale_destination_id,
                        ],
                        [
                            'quantite' => DB::raw("quantite + {$item->quantite}"),
                            'seuil_alerte' => 5, // Valeur par défaut
                            'user_id' => auth()->id(),
                        ]
                    );
                }
            }
        });

        return redirect()->route('transferts.show', $transfert->ref)
            ->with('success', "Transfert {$request->action} avec succès");
    }

    public function destroy(Transfert $transfert)
    {
        if ($transfert->transfertStocks()->where('statut', 'validé')->exists()) {
            return back()->with('error', 'Impossible de supprimer un transfert déjà validé');
        }

        $transfert->delete();

        return redirect()->route('transferts.index')
            ->with('success', 'Transfert supprimé avec succès');
    }
}