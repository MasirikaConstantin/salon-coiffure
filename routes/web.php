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

Route::resource('utilisateurs', UtilisateurController::class)->middleware('role:admin');
Route::middleware('auth','actif','role:admin')->group(function () {
    Route::resource('succursales', \App\Http\Controllers\SuccursaleController::class);
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
