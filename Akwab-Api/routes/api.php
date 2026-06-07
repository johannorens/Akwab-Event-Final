<?php

 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganisateurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategorieController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/organisateur', [AuthController::class, 'registerOrganisateur']);
Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('categories', CategorieController::class);
});
