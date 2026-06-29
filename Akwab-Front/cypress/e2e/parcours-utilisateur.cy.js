
/* eslint-disable */
/* global cy, expect, describe, it, beforeEach */

describe("Parcours complet d'un utilisateur", () => {

    beforeEach(() => {
        cy.visit("http://localhost:5173/login");
    });

    it("Connexion -> Accueil -> Consultation de l'évènement -> Paiement -> Ticket -> Retour accueil", () => {

        cy.get('input[type="email"]').type("elvirema2026@gmail.com", { delay: 120 });
        cy.wait(800);
        cy.get('input[type="password"]').type("Akpesso1@", { delay: 120 });
        cy.wait(1000);
        cy.contains("Se connecter")
            .trigger("mouseover")
            .wait(600)
            .click();

        // en attendant la réponse de l'api
        cy.wait(500);
        cy.scrollTo("bottom", { duration: 800 });
        cy.scrollTo("top", { duration: 800 });
        cy.wait(1000);



        cy.contains("Activer la localisation").should("be.visible");
        cy.wait(1500);
        cy.contains("button", "Activer")
            .trigger("mouseover")
            .wait(500)
            .click();
        cy.contains("Activer la localisation").should("not.exist");



        // en attendant la réponse de l'api
        cy.scrollTo("bottom", { duration: 1200 });
        cy.wait(800);
        cy.scrollTo("top", { duration: 1000 });
        cy.wait(1500);




        cy.intercept("GET", "**/api/evenements/**").as("getEvenement");

        cy.get('[data-cy="card-evenement"]')
            .first()
            .scrollIntoView({ duration: 600 })
            .wait(600)
            .trigger("mouseover")
            .wait(400)
            .click();

        cy.url().should("include", "/evenements/");



        // en attendant la réponse api
        cy.scrollTo("bottom", { duration: 1000 });
        cy.wait(600);
        cy.scrollTo("top", { duration: 1000 });

        cy.wait("@getEvenement");
        cy.wait(2000);




        cy.contains("CHOISISSEZ VOS TICKETS")
            .scrollIntoView({ duration: 800 })
            .should("be.visible");
        cy.wait(1200);

        // attente + scroll vers le haut

        cy.get('[data-cy="btn-increment"]')
            .first()
            .trigger("mouseover")
            .wait(600)
            .click()
            .wait(400)
            .click()
            .wait(400)
            .click();
        cy.wait(800);

        cy.contains("Votre commande").should("be.visible");
        cy.wait(1200);


        // attente + scroll
        cy.get('[data-cy="btn-paiement"]')
            .scrollIntoView({ duration: 600 })
            .trigger("mouseover")
            .wait(600)
            .click();

        cy.url().should("include", "/paiement");


        // en attente de la réponse de l'api
        cy.scrollTo("bottom", { duration: 1000 });
        cy.wait(800);
        cy.scrollTo("top", { duration: 800 });
        cy.wait(1500);




        cy.intercept("POST", "**/api/tickets").as("postTicket");

        cy.get('[data-cy="btn-payer"]')
            .scrollIntoView({ duration: 600 })
            .trigger("mouseover")
            .wait(800)
            .click();

        // en attendant la réponse de l'api
        cy.scrollTo("bottom", { duration: 800 });
        cy.wait(600);
        cy.scrollTo("top", { duration: 800 });

        cy.wait("@postTicket");
        cy.wait(1000);




        cy.get(".swal2-popup", { timeout: 8000 }).should("be.visible");
        cy.get(".swal2-title").should("contain", "Paiement confirmé");
        cy.wait(2500);

        cy.get(".swal2-confirm")
            .trigger("mouseover")
            .wait(600)
            .click();
        cy.wait(1500);




        cy.url().should("include", "/ticket/");
        cy.contains("Mon ticket").should("be.visible");

        // temps pour lecture de tickets
        cy.scrollTo("bottom", { duration: 1200 });
        cy.wait(1000);
        cy.scrollTo("top", { duration: 1000 });
        cy.wait(1000);

        cy.get('[data-cy="btn-download-ticket"]')
            .scrollIntoView({ duration: 600 })
            .trigger("mouseover")
            .wait(600)
            .click();
        cy.wait(2000);




        cy.intercept("GET", "**/api/mes-tickets").as("getMesTickets");

        cy.visit("http://localhost:5173/tickets");


        // en attendant la réponse de l'api
        cy.scrollTo("bottom", { duration: 1000 });
        cy.wait(600);
        cy.scrollTo("top", { duration: 1000 });

        cy.wait("@getMesTickets");
        cy.wait(1500);

        cy.contains("Historique des tickets").should("be.visible");

        // tremps pour lecture de l'historique des tickets
        cy.scrollTo("bottom", { duration: 1500 });
        cy.wait(1000);
        cy.scrollTo("top", { duration: 1000 });

        cy.get('[data-cy="ticket-card"]')
            .should("have.length.greaterThan", 0);
        cy.wait(2000);



        cy.visit("http://localhost:5173/accueil");
        cy.scrollTo("bottom", { duration: 1500 });
        cy.wait(1000);
        cy.scrollTo("top", { duration: 1000 });
        cy.wait(2000);
    });
}); 