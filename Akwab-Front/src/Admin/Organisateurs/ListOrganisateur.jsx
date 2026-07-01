import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListOrganisateur() {
  const navigate = useNavigate();
  const [organisateurs, setOrganisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const parPage = 8;

  useEffect(() => {
    fetchOrganisateurs();
  }, []);

  async function fetchOrganisateurs() {
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/organisateurs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.data) {
        setOrganisateurs(data.data);
      } else {
        setError("Impossible de charger les organisateurs.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/organisateurs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setOrganisateurs(organisateurs.filter((o) => o.id_organisateur !== id));
        setDeleteConfirm(null);
      } else {
        setError(data.message ?? "Erreur lors de la suppression.");
        setDeleteConfirm(null);
      }
    } catch {
      setError("Erreur lors de la suppression.");
      setDeleteConfirm(null);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.ceil(organisateurs.length / parPage);
  const pagines = organisateurs.slice((page - 1) * parPage, page * parPage);

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Supprimer cet organisateur ?",
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
      const res = await fetch(`${API_URL}/api/organisateurs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setOrganisateurs((prev) =>
          prev.filter((o) => o.id_organisateur !== id),
        );
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
            style={{ color: "#F59A1E" }}
          >
            Liste des organisateurs
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {organisateurs.length} organisateur
            {organisateurs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/organisateurs/create")}
          className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          + Nouvel organisateur
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* TABLE — sm et plus */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p
            className="text-center py-16 font-medium"
            style={{ color: "#253C96" }}
          >
            Chargement...
          </p>
        ) : pagines.length === 0 ? (
          <p className="text-center py-16 text-gray-400">
            Aucun organisateur trouvé.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr
                className="text-xs uppercase border-b border-gray-100"
                style={{ color: "#253C96" }}
              >
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagines.map((o, i) => (
                <tr
                  key={o.id_organisateur}
                  className={`border-b border-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#EEF1FB")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      i % 2 === 0 ? "white" : "rgba(249,250,251,0.5)")
                  }
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {o.nom}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{o.email}</td>
                  <td className="py-3 px-4 text-gray-400 max-w-xs truncate">
                    {o.description ?? "—"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/Admin/organisateurs/${o.id_organisateur}`)
                        }
                        className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors text-white"
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
                        Voir
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/Admin/organisateurs/${o.id_organisateur}/modifier`,
                          )
                        }
                        className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors text-white"
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
                        onClick={() => confirmDelete(o.id_organisateur)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CARDS — mobile uniquement */}
      <div className="flex flex-col gap-3 sm:hidden">
        {loading ? (
          <p
            className="text-center py-12 font-medium"
            style={{ color: "#253C96" }}
          >
            Chargement...
          </p>
        ) : pagines.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">
            Aucun organisateur trouvé.
          </p>
        ) : (
          pagines.map((o) => (
            <div
              key={o.id_organisateur}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: "#253C96" }}
                >
                  {(o.nom?.[0] ?? "").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: "#253C96" }}
                  >
                    {o.nom}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{o.email}</p>
                </div>
              </div>
              {o.description && (
                <p className="text-xs text-gray-400 line-clamp-2">
                  {o.description}
                </p>
              )}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() =>
                    navigate(`/Admin/organisateurs/${o.id_organisateur}`)
                  }
                  className="flex-1 py-2 text-xs rounded-lg border font-medium transition-colors text-white"
                  style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1a2d75")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#253C96")
                  }
                >
                  Voir
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/Admin/organisateurs/${o.id_organisateur}/modifier`,
                    )
                  }
                  className="flex-1 py-2 text-xs rounded-lg border font-medium transition-colors text-white"
                  style={{ backgroundColor: "#F59A1E", borderColor: "#F59A1E" }}
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
                  onClick={() => confirmDelete(o.id_organisateur)}
                  className="px-3 py-2 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <i className="ti ti-trash" style={{ fontSize: 14 }} />
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
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
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
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
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
    </div>
  );
}
