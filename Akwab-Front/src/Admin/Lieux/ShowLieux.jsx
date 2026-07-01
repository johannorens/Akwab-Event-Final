import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ShowLieux() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lieu, setLieu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadLieu() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/api/lieux/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (!res.ok || data.success === false) {
          setError(data.message ?? "Lieu non trouvé.");
          return;
        }

        setLieu(data.data || data);
      } catch {
        setError("Impossible de charger le lieu.");
      } finally {
        setLoading(false);
      }
    }
    loadLieu();
  }, [id]);

  async function handleDelete() {
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
        navigate("/admin/lieux");
      } else {
        alert(data.message ?? "Erreur lors de la suppression.");
        setDeleting(false);
      }
    } catch {
      alert("Erreur lors de la suppression.");
      setDeleting(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-purple-500 font-medium">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 w-full max-w-md mx-auto text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 w-full">
          {error}
        </div>
        <button
          onClick={() => navigate("/admin/lieux")}
          className="text-sm text-gray-400 hover:text-purple-500 transition-colors"
        >
          ← Retour à la liste
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8 w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/lieux")}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold flex-shrink-0"
          >
            ←
          </button>
          <h1
            className="text-xl sm:text-2xl font-bold tracking-wide"
            style={{ color: "#253C96" }}
          >
            Détails du lieu
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
          <div
            className="h-32 sm:h-40 flex items-center justify-center"
            style={{ backgroundColor: "#EEF1FB" }}
          >
            <img
              src="/location.svg"
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 opacity-60"
            />
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                Nom
              </p>
              <p
                className="text-lg font-bold break-words"
                style={{ color: "#253C96" }}
              >
                {lieu.nom}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                  Ville
                </p>
                <p className="text-sm text-gray-700">{lieu.ville}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                  Adresse
                </p>
                <p className="text-sm text-gray-700 break-words">
                  {lieu.adresse}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100 mt-2">
              <button
                onClick={() => navigate(`/admin/lieux/${id}/edit`)}
                className="flex-1 text-sm py-2.5 rounded-lg border font-medium transition-colors text-white"
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
                onClick={() => confirmDelete()}
                className="py-2.5 px-4 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <img src="/bin.svg" alt="" className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Remplacez handleDelete et deleteConfirm par SweetAlert2 :
  async function confirmDelete() {
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
        await Swal.fire({
          title: "Supprimé !",
          icon: "success",
          confirmButtonColor: "#F59A1E",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/admin/lieux");
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
}
