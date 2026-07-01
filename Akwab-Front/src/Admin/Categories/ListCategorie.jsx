import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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
    fetchCategories(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  async function fetchCategories(page, searchTerm) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page });
      if (searchTerm) params.append("search", searchTerm);
      const res = await fetch(
        `${API_URL}/api/categories?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await res.json();
      setCategories(data.data || []);
      setTotalPages(data.meta?.last_page || 1);
      setTotalItems(data.meta?.total ?? (data.data ? data.data.length : 0));
    } catch {
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Supprimer cette catégorie ?",
      text: "Cette action est irréversible. Les événements liés pourraient être affectés.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59A1E",
      cancelButtonColor: "#253C96",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/categories/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success || res.ok) {
          fetchCategories(currentPage, debouncedSearch);
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
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#F59A1E" }}
          >
            Catégories
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {totalItems} catégorie{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/categories/create")}
          className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          + Créer une catégorie
        </button>
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher par libellé..."
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
          {/* TABLE — sm et plus */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Image
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Libellé
                  </th>
                  <th className="text-right px-4 py-3 text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-gray-400">
                      {debouncedSearch
                        ? "Aucune catégorie ne correspond à votre recherche."
                        : "Aucune catégorie pour le moment."}
                    </td>
                  </tr>
                ) : (
                  categories.map((categorie) => (
                    <tr
                      key={categorie.id_categorie}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div
                          className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center"
                          style={{ backgroundColor: "#EEF1FB" }}
                        >
                          <img
                            src={categorie.image}
                            alt={categorie.libelle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentNode.innerHTML = `<i class="ti ti-photo" style="font-size:20px;color:#253C96"></i>`;
                            }}
                          />
                        </div>
                      </td>
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "#253C96" }}
                      >
                        {categorie.libelle}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/categories/${categorie.id_categorie}/edit`,
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-colors text-white"
                            style={{
                              backgroundColor: "#253C96",
                              borderColor: "#253C96",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#1a2d75")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#253C96")
                            }
                          >
                            <i
                              className="ti ti-edit"
                              style={{ fontSize: 13 }}
                            />
                            Modifier
                          </button>
                          <button
                            onClick={() =>
                              confirmDelete(categorie.id_categorie)
                            }
                            className="px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <i
                              className="ti ti-trash"
                              style={{ fontSize: 13 }}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CARDS — mobile uniquement */}
          <div className="flex flex-col gap-3 sm:hidden">
            {categories.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">
                {debouncedSearch
                  ? "Aucun résultat."
                  : "Aucune catégorie pour le moment."}
              </p>
            ) : (
              categories.map((categorie) => (
                <div
                  key={categorie.id_categorie}
                  className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3"
                >
                  <div
                    className="w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#EEF1FB" }}
                  >
                    <img
                      src={categorie.image}
                      alt={categorie.libelle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<i class="ti ti-photo" style="font-size:22px;color:#253C96"></i>`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-[#F59A1E]">
                      {categorie.libelle}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/categories/${categorie.id_categorie}/edit`,
                        )
                      }
                      className="p-2 rounded-lg border transition-colors text-white"
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
                      aria-label="Modifier"
                    >
                      <i className="ti ti-edit" style={{ fontSize: 16 }} />
                    </button>
                    <button
                      onClick={() => confirmDelete(categorie.id_categorie)}
                      className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      aria-label="Supprimer"
                    >
                      <i className="ti ti-trash" style={{ fontSize: 16 }} />
                    </button>
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
