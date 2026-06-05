<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id('id_evenement');
            $table->string('nom');
            $table->date('date');
            $table->text('description');
            $table->string('image');
            $table->integer('quantite_ticket_totale');
            $table->integer('quantite_ticket_restante');

            $table->unsignedBigInteger('id_categorie');
            $table->foreign('id_categorie')
                ->references('id_categorie')
                ->on('categories')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_lieu');
            $table->foreign('id_lieu')
                ->references('id_lieu')
                ->on('lieux')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_organisateur');
            $table->foreign('id_organisateur')
                ->references('id_organisateur')
                ->on('organisateurs')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
