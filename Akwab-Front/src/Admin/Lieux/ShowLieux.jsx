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
        const res = await fetch(`http://127.0.0.1:8000/api/lieux/${id}`, {
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
      const res = await fetch(`http://127.0.0.1:8000/api/lieux/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        navigate("/dashboard/lieux");
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
          onClick={() => navigate("/dashboard/lieux")}
          className="text-sm text-gray-400 hover:text-purple-500 transition-colors"
        >
          ← Retour à la liste
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 w-full">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div className="flex items-center gap-3 self-start sm:self-center sm:w-full">
          <button
            onClick={() => navigate("/dashboard/lieux")}
            className="text-gray-400 hover:text-purple-500 transition-colors flex-shrink-0"
          >
            ←
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-purple-600 tracking-wide">
            Détails du lieu
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm w-full">
          <div className="h-32 sm:h-40 bg-purple-50 flex items-center justify-center">
            <img
              src="/location.svg"
              alt=""
              className="w-10 h-10 sm:w-12 sm:h-12 opacity-60"
            />
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-4 items-center text-center sm:items-stretch sm:text-left">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">
                Nom
              </p>
              <p className="text-lg font-bold text-[#4D027A] break-words">
                {lieu.nom}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
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

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100 mt-2 w-full">
              <button
                onClick={() => navigate(`/dashboard/lieux/${id}/edit`)}
                className="flex-1 text-sm py-2.5 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 font-medium transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="py-2.5 px-4 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <img src="/bin.svg" alt="" className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => setDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
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
