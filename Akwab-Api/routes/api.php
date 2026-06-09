<?php



use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\OrganisateurController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\TypeTicketController;
use Database\Factories\TypeTicketFactory;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\LieuController;


// ROUTES PUBLIQUES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/organisateur', [AuthController::class, 'registerOrganisateur']);
Route::post('/register/admin', [AuthController::class, 'registerAdmin']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/evenements', [EvenementController::class, 'index']);
Route::get('/evenements/{id}', [EvenementController::class, 'show']);

Route::get('/types-tickets', [TypeTicketController::class, 'index']);
Route::get('/types-tickets/{id}', [TypeTicketController::class, 'show']);

Route::get('/lieux', [LieuController::class, 'index']);
Route::get('/lieux/{id}', [LieuController::class, 'show']);



// ROUTES PROTÉGÉES(utilisateurs connectés)

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('categories', CategorieController::class);
    Route::get('/profile', [UtilisateurController::class, 'profile']);
    Route::put('/profileupdate', [UtilisateurController::class, 'updateProfile']);
    Route::get('/mes-tickets', [TicketController::class, 'mesTickets']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);


    // ROUTES ADMIN
    Route::middleware(['admin'])->group(function () {
        Route::apiResource('/organisateurs', OrganisateurController::class);
        Route::apiResource('/evenements', EvenementController::class)->except(['index', 'show']);
        Route::apiResource('/types-tickets', TypeTicketController::class)->except(['index', 'show']);
        Route::apiResource('utilisateurs', UtilisateurController::class)->except(['store']);
        Route::get('/tickets', [TicketController::class, 'index']);
        Route::put('/tickets/{id}', [TicketController::class, 'update']);
        Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
        Route::apiResource('lieux', LieuController::class);
    });
});
