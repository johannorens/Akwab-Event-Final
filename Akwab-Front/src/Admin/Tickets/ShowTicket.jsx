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

  // Charger les infos de l'événement
  useEffect(() => {
    async function loadEvenement() {
      setLoadingEv(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/evenements/${id}`, {
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
      const res = await fetch(`http://127.0.0.1:8000/api/tickets?${params}`, {
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
        <p className="text-purple-500 font-medium">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4 p-4 max-w-xl mx-auto">
        <button
          onClick={() => navigate("/dashboard/tickets")}
          className="text-gray-400 hover:text-purple-500 w-fit text-sm"
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
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/tickets")}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-purple-600 tracking-wide">
            {evenement?.nom ?? "Détails tickets"}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {evenement?.lieux
              ? `${evenement.lieux.nom} — ${evenement.lieux.ville}`
              : ""}
          </p>
        </div>
      </div>

      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-[#4D027A] rounded-xl p-5 text-white">
          <p className="text-xs text-purple-200 uppercase tracking-wide font-medium mb-1">
            Gains totaux
          </p>
          <p className="text-2xl font-bold">{formatMontant(gainsTotal)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
            Tickets vendus
          </p>
          <p className="text-2xl font-bold text-[#4D027A]">{vendus}</p>
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
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
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

      {/* Liste des acheteurs */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Acheteurs ({totalItems})
          </p>
        </div>

        {loadingTickets ? (
          <div className="text-center py-12 text-purple-500 font-medium">
            Chargement...
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
            Aucun achat pour le moment.
          </div>
        ) : (
          <>
            {/* Tableau desktop */}
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
                      Montant
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
                      className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors"
                    >
                      <td className="px-5 py-3 text-[#4D027A] font-medium text-xs whitespace-nowrap">
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

            {/* Cartes mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4D027A]">
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
                    <span className="text-sm font-bold text-purple-600">
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
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
