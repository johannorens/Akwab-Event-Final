import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ShowTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evenement, setEvenement] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [gainsTotal, setGainsTotal] = useState(0);
  const [loadingEv, setLoadingEv] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    async function loadEvenement() {
      setLoadingEv(true);
      try {
        const res = await fetch(`${API_URL}/api/evenements/${id}`, {
          headers,
        });
        const data = await res.json();
        setEvenement(data.data || null);
      } catch {
        setError("Impossible de charger l'événement.");
      } finally {
        setLoadingEv(false);
      }
    }
    loadEvenement();
  }, [id]);

  // Charger les tickets paginés
  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage, id]);

  async function fetchTickets(page) {
    setLoadingTickets(true);
    try {
      const params = new URLSearchParams({ page, id_evenement: id });
      const res = await fetch(`${API_URL}/api/tickets?${params}`, {
        headers,
      });
      const data = await res.json();
      setTickets(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? 0);
      setGainsTotal(data.gains_total ?? 0);
    } catch {
      setError("Impossible de charger les tickets.");
    } finally {
      setLoadingTickets(false);
    }
  }

  function formatMontant(montant) {
    return new Intl.NumberFormat("fr-FR").format(montant ?? 0) + " FCFA";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function ticketsRestants(ev) {
    return (ev?.types_tickets || []).reduce(
      (sum, t) => sum + (t.pivot?.quantite_ticket_restante ?? 0),
      0,
    );
  }

  function ticketsTotal(ev) {
    return (ev?.types_tickets || []).reduce(
      (sum, t) => sum + (t.pivot?.total_ticket_evenement ?? 0),
      0,
    );
  }

  if (loadingEv)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text[#F59A1E] font-medium">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto">
        <button
          onClick={() => navigate("/admin/tickets")}
          className="text-gray-400  w-fit text-sm"
        >
          ← Retour
        </button>
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      </div>
    );

  const restants = ticketsRestants(evenement);
  const total = ticketsTotal(evenement);
  const vendus = total - restants;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/tickets")}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold shrink-0"
        >
          ←
        </button>
        <div className="min-w-0">
          <h1
            className="text-lg sm:text-2xl font-bold tracking-wide truncate"
            style={{ color: "#F59A1E  " }}
          >
            {evenement?.nom ?? "Détails tickets"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {evenement?.lieux
              ? `${evenement.lieux.nom} — ${evenement.lieux.ville}`
              : ""}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-5 text-white bg-[#F59A1E]"

        >
          <p
            className="text-xs uppercase tracking-wide font-medium mb-1"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Gains totaux
          </p>
          <p className="text-2xl font-bold">{formatMontant(gainsTotal)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Tickets vendus
          </p>
          <p className="text-2xl font-bold" style={{ color: "#253C96" }}>
            {vendus}
          </p>
          <p className="text-xs text-gray-400 mt-1">sur {total} au total</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Tickets restants
          </p>
          <p
            className={`text-2xl font-bold ${restants === 0 ? "text-red-500" : restants < total * 0.2 ? "text-orange-500" : "text-green-500"}`}
          >
            {restants}
          </p>
          <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${restants === 0 ? "bg-red-400" : restants < total * 0.2 ? "bg-orange-400" : "bg-green-400"}`}
              style={{
                width:
                  total > 0 ? `${Math.round((restants / total) * 100)}%` : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Types de tickets */}
      {evenement?.types_tickets?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#253C96" }}
            >
              Types de tickets
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">
                    Prix
                  </th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">
                    Vendus
                  </th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">
                    Restants
                  </th>
                </tr>
              </thead>
              <tbody>
                {evenement.types_tickets.map((t) => (
                  <tr
                    key={t.id_type_ticket}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-gray-700">
                      {t.libelle}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600">
                      {formatMontant(t.prix_ticket)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">
                      {t.pivot?.quantite_type_ticket ?? 0}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`font-semibold ${(t.pivot?.quantite_ticket_restante ?? 0) === 0 ? "text-red-500" : "text-green-600"}`}
                      >
                        {t.pivot?.quantite_ticket_restante ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Acheteurs */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold" style={{ color: "#253C96" }}>
          Acheteurs ({totalItems})
        </p>

        {loadingTickets ? (
          <div
            className="text-center py-12 font-medium"
            style={{ color: "#253C96" }}
          >
            Chargement...
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
            Aucun achat pour le moment.
          </div>
        ) : (
          <>
            {/* TABLE — md et plus */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      N° Ticket
                    </th>
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Utilisateur
                    </th>
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Type
                    </th>
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-center">
                      Qté
                    </th>
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">
                      Montant payé
                    </th>
                    <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 last:border-0 transition-colors"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#EEF1FB")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td
                        className="px-5 py-3 font-medium text-xs whitespace-nowrap"
                        style={{ color: "#253C96" }}
                      >
                        {t.numero_ticket}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        <p className="font-medium">
                          {t.utilisateur
                            ? `${t.utilisateur.nom} ${t.utilisateur.prenoms ?? ""}`
                            : "—"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t.utilisateur?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {t.type_ticket?.libelle ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-700">
                        {t.nombre_ticket_pris}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                        {formatMontant(t.prix_total)}
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(t.date_reservation)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARDS — mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#253C96" }}
                    >
                      {t.numero_ticket}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(t.date_reservation)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {t.utilisateur
                      ? `${t.utilisateur.nom} ${t.utilisateur.prenoms ?? ""}`
                      : "—"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t.utilisateur?.email ?? ""}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
                    <span className="text-xs text-gray-500">
                      {t.type_ticket?.libelle ?? "—"} · Qté{" "}
                      {t.nombre_ticket_pris}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#253C96" }}
                    >
                      {formatMontant(t.prix_total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center sm:justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.backgroundColor = "#1a2d75";
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.backgroundColor = "#253C96";
                  }}
                >
                  Précédent
                </button>
                <span className="text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-lg">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.backgroundColor = "#1a2d75";
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled)
                      e.currentTarget.style.backgroundColor = "#253C96";
                  }}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
