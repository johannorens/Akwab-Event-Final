import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListLieux() {
  const navigate = useNavigate();
  const [lieux, setLieux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    fetchLieux(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  async function fetchLieux(page, searchTerm) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page });
      if (searchTerm) params.append("search", searchTerm);

      const res = await fetch(
        `http://127.0.0.1:8000/api/lieux?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();

      setLieux(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? (data.data ? data.data.length : 0));
    } catch {
      setError("Impossible de charger les lieux.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lieux/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setDeleteConfirm(null);
        fetchLieux(currentPage, debouncedSearch);
      } else {
        alert(data.message ?? "Erreur lors de la suppression.");
      }
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
            Lieux
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} lieu{totalItems !== 1 ? "x" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/lieux/create")}
          className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
        >
          Créer un lieu
        </button>
      </div>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, ville, adresse..."
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

      {/* Liste des lieux */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lieux.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400">
                {debouncedSearch
                  ? "Aucun lieu ne correspond à votre recherche."
                  : "Aucun lieu pour le moment."}
              </div>
            ) : (
              lieux.map((lieu) => (
                <div
                  key={lieu.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Icône lieu */}
                  <div className="h-28 bg-purple-50 flex items-center justify-center">
                    <img
                      src="/location.svg"
                      alt=""
                      className="w-10 h-10 opacity-60"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-[#4D027A] text-sm line-clamp-1">
                      {lieu.nom}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {lieu.ville}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem]">
                      {lieu.adresse}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                      <button
                        onClick={() => navigate(`/dashboard/lieux/${lieu.id}`)}
                        className="flex-1 text-xs py-2 border border-[#05CDC2] rounded-lg text-[#05CDC2] hover:bg-[#05CDC2]/10 font-medium transition-colors"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/lieux/${lieu.id}/edit`)
                        }
                        className="flex-1 text-xs py-2 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(lieu.id)}
                        className="py-2 px-3 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                      >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
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

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Supprimer ce lieu ?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Cette action est irréversible. Les événements liés à ce lieu
              pourraient être affectés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
