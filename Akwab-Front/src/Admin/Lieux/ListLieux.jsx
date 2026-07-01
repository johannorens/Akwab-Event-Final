import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 import Swal from "sweetalert2";
 
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
        `${API_URL}/api/lieux?${params.toString()}`,
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
      const res = await fetch(`${API_URL}/api/lieux/${id}`, {
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

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Supprimer ce lieu ?",
      text: "Cette action est irréversible. Les événements liés pourraient être affectés.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59A1E",
      cancelButtonColor: "#253C96",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/lieux/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        fetchLieux(currentPage, debouncedSearch);
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
          text: data.message ?? "Erreur.",
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

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#253C96" }}
          >
            Lieux
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} lieu{totalItems !== 1 ? "x" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/lieux/create")}
          className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          + Créer un lieu
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, ville, adresse..."
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
                  {/* Icône */}
                  <div
                    className="h-28 flex items-center justify-center"
                    style={{ backgroundColor: "#EEF1FB" }}
                  >
                    <img
                      src="/location.svg"
                      alt=""
                      className="w-10 h-10 opacity-60"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3
                      className="font-bold text-sm line-clamp-1"
                      style={{ color: "#253C96" }}
                    >
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
                        onClick={() => navigate(`/admin/lieux/${lieu.id}`)}
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
                        onClick={() => navigate(`/admin/lieux/${lieu.id}/edit`)}
                        className="flex-1 text-xs py-2 rounded-lg border font-medium transition-colors text-white"
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
                        onClick={() => confirmDelete(lieu.id)}
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
