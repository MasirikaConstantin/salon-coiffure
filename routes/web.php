<?php

use App\Http\Controllers\UtilisateurController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {

    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth', 'verified', 'role:admin,gerant,coiffeur,caissier'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//Route::resource('utilisateurs', UtilisateurController::class)->middleware('role:admin');
Route::middleware('auth','actif','role:admin')->group(function () {
    Route::resource('succursales', \App\Http\Controllers\SuccursaleController::class);
    Route::resource('services', \App\Http\Controllers\ServiceController::class);
    Route::patch('services/{service}/update-status', [\App\Http\Controllers\ServiceController::class, 'updateStatus'])->name('services.update-status');
});

Route::middleware('auth','actif','role:admin,gerant')->group(function () {
    Route::resource('utilisateurs', \App\Http\Controllers\UserController::class);
    Route::resource('stocks', \App\Http\Controllers\StockController::class);
    Route::resource('produits', \App\Http\Controllers\ProduitController::class);    
    Route::patch('produits/{produit}/update-status', [\App\Http\Controllers\ProduitController::class, 'updateStatus'])->name('produits.update-status');
    
// Route supplémentaire pour changer le statut
Route::patch('/stocks/{stock}/toggle-status', [\App\Http\Controllers\StockController::class, 'toggleStatus'])
    ->name('stocks.toggle-status');

    Route::resource('transferts', \App\Http\Controllers\TransfertController::class);

Route::post('/transferts/{transfert}/validate', [\App\Http\Controllers\TransfertController::class, 'validateTransfert'])
    ->name('transferts.validate');
});
Route::middleware('auth','actif','role:admin,gerant,coiffeur')->group(function () {
    Route::resource('clients', \App\Http\Controllers\ClientController::class);
    Route::resource('stock-succursales', \App\Http\Controllers\StockSuccursaleController::class);
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
