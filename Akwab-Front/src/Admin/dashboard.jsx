import { API_URL } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = API_URL + "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function fetchAll(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    utilisateurs: "-",
    evenements: "-",
    categories: "-",
    lieux: "-",
    organisateurs: "-",
    gains: "-",
  });
  const [dernierEvenements, setDernierEvenements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          utilisateurs,
          evenements,
          categories,
          lieux,
          organisateurs,
          tickets,
        ] = await Promise.all([
          fetchAll(`${API}/utilisateurs`),
          fetchAll(`${API}/evenements`),
          fetchAll(`${API}/categories`),
          fetchAll(`${API}/lieux`),
          fetchAll(`${API}/organisateurs`),
          fetchAll(`${API}/tickets`),
        ]);

        const evList = evenements.data || [];
        const ticketList = tickets.data || [];

        // Gains = somme des prix_total de tous les tickets vendus
        const gains = ticketList.reduce((acc, ticket) => {
          return acc + parseFloat(ticket.prix_total || 0);
        }, 0);

        setStats({
          utilisateurs:
            utilisateurs.meta?.total ?? utilisateurs.data?.length ?? "-",
          evenements: evenements.meta?.total ?? evList.length,
          categories: categories.meta?.total ?? categories.data?.length ?? "-",
          lieux: lieux.meta?.total ?? lieux.data?.length ?? "-",
          organisateurs:
            organisateurs.meta?.total ?? organisateurs.data?.length ?? "-",
          gains: gains > 0 ? gains.toLocaleString("fr-FR") + " F" : "0 F",
        });

        // 5 derniers événements
        const sorted = [...evList].slice(-5).reverse();
        setDernierEvenements(sorted);
      } catch (e) {
        console.error("Erreur chargement dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cartes = [
    {
      label: "Utilisateurs",
      value: stats.utilisateurs,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Évènements",
      value: stats.evenements,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Gains",
      value: stats.gains,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Lieux",
      value: stats.lieux,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Catégories",
      value: stats.categories,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
    {
      label: "Organisateurs",
      value: stats.organisateurs,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-8 h-8"
          stroke="#F36B2E"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">Bienvenue,</p>
          <h1
            className="text-3xl font-bold tracking-wide"
            style={{ color: "#F36B2E" }}
          >
            {user.nom || user.prenoms || user.name || "Admin"}
          </h1>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: "#F36B2E" }}
        >
          {(user.nom || user.prenoms || "A")[0].toUpperCase()}
        </div>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cartes.map((carte) => (
          <div
            key={carte.label}
            className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex flex-col gap-3"
          >
            {carte.icon}
            <div>
              <p className="text-gray-400 text-xs">{carte.label}</p>
              <p className="text-2xl font-bold" style={{ color: "#F36B2E" }}>
                {loading ? "..." : carte.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau derniers événements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Derniers évènements enregistrés
        </h2>

        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Chargement...
          </div>
        ) : (
          <>
            {/* TABLE desktop */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="pb-3 text-left w-8">#</th>
                    <th className="pb-3 text-left">Nom</th>
                    <th className="pb-3 text-left">Organisateur</th>
                    <th className="pb-3 text-left">Lieu</th>
                    <th className="pb-3 text-left">Date</th>
                    <th className="pb-3 text-left">Tickets restants</th>
                    <th className="pb-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dernierEvenements.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-10 text-gray-400"
                      >
                        Aucun évènement.
                      </td>
                    </tr>
                  ) : (
                    dernierEvenements.map((ev, i) => {
                      const ticketsRestants = (ev.types_tickets || []).reduce(
                        (acc, t) =>
                          acc + (t.pivot?.quantite_ticket_restante || 0),
                        0,
                      );
                      return (
                        <tr
                          key={ev.id_evenement}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td
                            className="py-3 font-bold"
                            style={{ color: "#F36B2E" }}
                          >
                            {i + 1}
                          </td>
                          <td className="py-3 text-gray-700 font-medium">
                            {ev.nom}
                          </td>
                          <td className="py-3 text-gray-500">
                            {ev.organisateurs?.nom ?? "—"}
                          </td>
                          <td className="py-3 text-gray-500">
                            {ev.lieux?.nom ?? "—"}
                          </td>
                          <td className="py-3 text-gray-500">
                            {ev.date
                              ? new Date(ev.date).toLocaleDateString("fr-FR")
                              : "—"}
                          </td>
                          <td className="py-3 text-gray-500">
                            {ticketsRestants}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() =>
                                navigate(`/admin/evenements/${ev.id_evenement}`)
                              }
                              className="text-xs font-semibold hover:underline"
                              style={{ color: "#F36B2E" }}
                            >
                              Voir
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* CARDS mobile */}
            <div className="flex flex-col gap-3 sm:hidden">
              {dernierEvenements.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">
                  Aucun évènement.
                </p>
              ) : (
                dernierEvenements.map((ev, i) => {
                  const ticketsRestants = (ev.types_tickets || []).reduce(
                    (acc, t) => acc + (t.pivot?.quantite_ticket_restante || 0),
                    0,
                  );
                  return (
                    <div
                      key={ev.id_evenement}
                      className="border border-gray-100 rounded-lg p-3 flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-bold text-sm"
                          style={{ color: "#F36B2E" }}
                        >
                          {i + 1}. {ev.nom}
                        </span>
                        <button
                          onClick={() =>
                            navigate(`/admin/evenements/${ev.id_evenement}`)
                          }
                          className="text-xs font-semibold"
                          style={{ color: "#F36B2E" }}
                        >
                          Voir
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {ev.organisateurs?.nom ?? "—"} · {ev.lieux?.nom ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {ev.date
                          ? new Date(ev.date).toLocaleDateString("fr-FR")
                          : "—"}{" "}
                        · {ticketsRestants} tickets restants
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
