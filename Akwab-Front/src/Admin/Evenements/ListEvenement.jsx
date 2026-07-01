import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListEvenements() {
  const navigate = useNavigate();
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
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
        `${API_URL}/api/evenements?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Supprimer l'événement ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59A1E",
      cancelButtonColor: "#253C96",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/evenements/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success || res.ok) {
          fetchEvenements(currentPage, debouncedSearch);
          Swal.fire({
            title: "Supprimé !",
            icon: "success",
            confirmButtonColor: "#F59A1E",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Erreur",
            text: data.message ?? "Erreur lors de la suppression.",
            icon: "error",
            confirmButtonColor: "#253C96",
          });
        }
      } catch {
        Swal.fire({
          title: "Erreur",
          text: "Impossible de contacter le serveur.",
          icon: "error",
          confirmButtonColor: "#253C96",
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#253C96" }}
          >
            Événements
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} événement{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/evenements/create")}
          className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          + Créer un événement
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 w-full transition-colors"
        style={{ borderColor: "#253C96" }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div
          className="text-center py-16 font-medium"
          style={{ color: "#253C96" }}
        >
          Chargement...
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Grille de cards */}
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
                  {/* Image */}
                  <div
                    className="h-40 overflow-hidden relative flex items-center justify-center"
                    style={{ backgroundColor: "#EEF1FB" }}
                  >
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
                        className="w-12 h-12"
                        style={{ color: "#253C96", opacity: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    )}
                    {ev.categories && (
                      <span
                        className="absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: "#253C96" }}
                      >
                        {ev.categories.libelle}
                      </span>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3
                      className="font-bold text-sm line-clamp-1"
                      style={{ color: "#253C96" }}
                    >
                      {ev.nom}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 min-h-8">
                      {ev.description}
                    </p>

                    <div className="flex flex-col gap-1 text-xs text-gray-400 mt-auto pt-2">
                      {ev.date && (
                        <span className="flex items-center gap-1">
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
                          <img
                            src="/location.svg"
                            alt="Lieu"
                            className="w-4 h-4 shrink-0"
                          />
                          {ev.lieux.ville}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/evenements/${ev.id_evenement}`)
                        }
                        className="flex-1 text-xs py-2 rounded-lg border font-medium transition-colors text-white"
                        style={{
                          backgroundColor: "#253C96",
                          borderColor: "#253C96",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#1a2d75")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#253C96")
                        }
                      >
                        Détails
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/evenements/${ev.id_evenement}/edit`)
                        }
                        className="flex-1 text-xs py-2 rounded-lg border transition-colors text-white"
                        style={{
                          backgroundColor: "#F59A1E",
                          borderColor: "#F59A1E",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#d4841a")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#F59A1E")
                        }
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => confirmDelete(ev.id_evenement)}
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
  );
}
