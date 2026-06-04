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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id('id_ticket');
            $table->string('numero_ticket')->unique();
            $table->decimal('prix_total', 10,2);
            $table->date('date_reservation');
            $table->integer('nombre_ticket_pris');

            $table->unsignedBigInteger('id_utilisateur');
            $table->foreign('id_utilisateur')
                ->references('id_utilisateur')
                ->on('utilisateurs')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_evenement');
            $table->foreign('id_evenement')
                ->references('id_evenement')
                ->on('evenements')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_type_ticket');
            $table->foreign('id_type_ticket')
                ->references('id_type_ticket')
                ->on('types_tickets')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
