import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListEvenements() {
  const navigate = useNavigate();
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timeout);
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

      const res = await fetch(
        `http://127.0.0.1:8000/api/evenements?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();

      setEvenements(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? (data.data ? data.data.length : 0));
    } catch {
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/evenements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setDeleteConfirm(null);
        fetchEvenements(currentPage, debouncedSearch);
      }
    } catch {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
            Événements
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} événement{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/evenements/create")}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          Créer un événement
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-[#4D027A] rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full shadow-sm"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-purple-500 font-medium">
          Chargement...
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {evenements.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                Aucun événement trouvé.
              </div>
            ) : (
              evenements.map((ev) => (
                <div
                  key={ev.id_evenement}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-purple-50 overflow-hidden relative flex items-center justify-center">
                    {ev.image ? (
                      <img
                        src={ev.image}
                        alt={ev.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 text-purple-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 3.75 0 1 1-.75 0 .375 3.75 0 0 1 .75 0Z"
                        />
                      </svg>
                    )}
                    {ev.categories && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                        {ev.categories.libelle}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-[#4D027A] text-sm line-clamp-1">
                      {ev.nom}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-8">
                      {ev.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-gray-400 mt-auto pt-2">
                      {ev.date && (
                        <span className="flex items-center gap-1">
                          {/* Corrigé : Remplacement de la variable par la chaîne du dossier public */}
                          <img
                            src="/calendar.svg"
                            alt="Date"
                            className="w-4 h-4 shrink-0"
                          />
                          {new Date(ev.date).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {ev.lieux && (
                        <span className="flex items-center gap-1">
                          {/* Corrigé : Remplacement de la variable par la chaîne du dossier public */}
                          <img
                            src="/location.svg"
                            alt="Lieu"
                            className="w-4 h-4 shrink-0"
                          />
                          {ev.lieux.ville}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/evenements/${ev.id_evenement}`)
                        }
                        className="flex-1 text-xs py-2 border border-[#05CDC2] rounded-lg text-[#05CDC2] hover:bg-[#05CDC2]/10 font-medium transition-colors"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/evenements/${ev.id_evenement}/edit`,
                          )
                        }
                        className="flex-1 text-xs py-2 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(ev.id_evenement)}
                        className="py-2 px-3 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                      >
                        {/* Corrigé : Remplacement de la variable par la chaîne du dossier public */}
                        <img
                          src="/bin.svg"
                          alt="Supprimer"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-8 pt-4 border-t border-gray-100 px-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <span className="text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-lg shadow-sm">
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

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Supprimer l'événement ?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
