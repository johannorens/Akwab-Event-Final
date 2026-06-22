import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListTickets() {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  // Gains par événement (chargés séparément)
  const [gainsMap, setGainsMap] = useState({});

  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchEvenements(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  async function fetchEvenements(page, searchTerm) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page });
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(`http://127.0.0.1:8000/api/evenements?${params}`, { headers });
      const data = await res.json();
      const evs = data.data || [];
      setEvenements(evs);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? 0);
      // Charger les gains pour ces événements
      fetchGains(evs);
    } catch {
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchGains(evs) {
    // Pour chaque événement on appelle /api/tickets?id_evenement=X&page=1
    // et on récupère gains_total. On fait les appels en parallèle.
    const results = await Promise.all(
      evs.map(async (ev) => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/api/tickets?page=1&id_evenement=${ev.id_evenement}`,
            { headers }
          );
          const data = await res.json();
          return { id: ev.id_evenement, gains: data.gains_total ?? 0 };
        } catch {
          return { id: ev.id_evenement, gains: 0 };
        }
      })
    );
    const map = {};
    results.forEach((r) => { map[r.id] = r.gains; });
    setGainsMap((prev) => ({ ...prev, ...map }));
  }



  function ticketsRestants(ev) {
    return (ev.types_tickets || []).reduce(
      (sum, t) => sum + (t.pivot?.quantite_ticket_restante ?? 0), 0
    );
  }

  function ticketsTotal(ev) {
    return (ev.types_tickets || []).reduce(
      (sum, t) => sum + (t.pivot?.total_ticket_evenement ?? 0), 0
    );
  }

  function formatMontant(montant) {
    return new Intl.NumberFormat("fr-FR").format(montant ?? 0) + " FCFA";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">Tickets</h1>
        <p className="text-sm text-gray-400 mt-1">
          {totalItems} événement{totalItems !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-[#4D027A] rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full shadow-sm"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-purple-500 font-medium">Chargement...</div>
      ) : (
        <>
          {/* Tableau desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">Événement</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide">Lieu</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-center">Tickets restants</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-center">Total</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">Gains</th>
                  <th className="px-5 py-3 text-xs text-gray-500 font-medium uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {evenements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">Aucun événement trouvé.</td>
                  </tr>
                ) : (
                  evenements.map((ev) => {
                    const restants = ticketsRestants(ev);
                    const total = ticketsTotal(ev);
                    const pct = total > 0 ? Math.round((restants / total) * 100) : 0;
                    const couleur = pct > 50 ? "bg-green-400" : pct > 20 ? "bg-orange-400" : "bg-red-400";
                    return (
                      <tr key={ev.id_evenement} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#4D027A]">{ev.nom}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {ev.date ? new Date(ev.date).toLocaleDateString("fr-FR") : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {ev.lieux ? `${ev.lieux.nom} — ${ev.lieux.ville}` : "—"}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="font-semibold text-gray-700">{restants}</span>
                            <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-1.5 rounded-full ${couleur}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-400">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-gray-500">{total}</td>
                        <td className="px-5 py-4 text-right font-semibold text-[#4D027A] whitespace-nowrap">
                          {gainsMap[ev.id_evenement] !== undefined
                            ? formatMontant(gainsMap[ev.id_evenement])
                            : <span className="text-gray-300 text-xs">...</span>}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => navigate(`/dashboard/tickets/${ev.id_evenement}`)}
                            className="text-xs px-3 py-1.5 border border-[#05CDC2] rounded-lg text-[#05CDC2] hover:bg-[#05CDC2]/10 font-medium transition-colors"
                          >
                            Voir tickets
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Cartes mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {evenements.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
                Aucun événement trouvé.
              </div>
            ) : (
              evenements.map((ev) => {
                const restants = ticketsRestants(ev);
                const total = ticketsTotal(ev);
                const pct = total > 0 ? Math.round((restants / total) * 100) : 0;
                const couleur = pct > 50 ? "bg-green-400" : pct > 20 ? "bg-orange-400" : "bg-red-400";
                return (
                  <div key={ev.id_evenement} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-[#4D027A]">{ev.nom}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {ev.lieux ? `${ev.lieux.nom} — ${ev.lieux.ville}` : "—"}
                        </p>
                      </div>
                      {gainsMap[ev.id_evenement] !== undefined && (
                        <span className="text-xs font-bold text-[#4D027A] whitespace-nowrap bg-purple-50 px-2 py-1 rounded-lg">
                          {formatMontant(gainsMap[ev.id_evenement])}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full ${couleur}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {restants} / {total} restants
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/tickets/${ev.id_evenement}`)}
                      className="w-full text-xs py-2 border border-[#05CDC2] rounded-lg text-[#05CDC2] hover:bg-[#05CDC2]/10 font-medium transition-colors"
                    >
                      Voir tickets
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Précédent</button>
              <span className="text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-lg">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Suivant</button>
            </div>
          )}
        </>
      )}

    </div>
  );
}