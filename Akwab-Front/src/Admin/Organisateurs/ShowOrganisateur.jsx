import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ShowOrganisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organisateur, setOrganisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrganisateur();
  }, [id]);

  async function fetchOrganisateur() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/organisateurs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.data) {
        setOrganisateur(data.data);
      } else if (data.id_organisateur) {
        setOrganisateur(data);
      } else {
        setError("Impossible de charger l'organisateur.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  function getInitiales(nom) {
    if (!nom) return "?";
    const parts = nom.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : nom.slice(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center text-gray-400 py-20">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/organisateurs")}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
          >
            ←
          </button>
          <h1
            className="text-xl md:text-2xl font-bold tracking-wide"
            style={{ color: "#F59A1E" }}
          >
            Détail organisateur
          </h1>
        </div>
        <button
          onClick={() => navigate(`/admin/organisateurs/${id}/modifier`)}
          className="w-full sm:w-auto px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          Modifier
        </button>
      </div>

      {/* Carte profil */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div
          className="h-20 sm:h-24"
          style={{ background: "linear-gradient(to right, #EEF1FB, #e0f2fe)" }}
        />
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-8 sm:-mt-10 mb-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold border-4 border-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: "#253C96" }}
            >
              {getInitiales(organisateur?.nom)}
            </div>
            <div className="pb-1">
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {organisateur?.nom}
              </p>
              <p className="text-sm text-gray-400">{organisateur?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard label="Nom" value={organisateur?.nom} />
            <InfoCard label="Email" value={organisateur?.email} />
            {organisateur?.telephone && (
              <InfoCard label="Téléphone" value={organisateur.telephone} />
            )}
            <InfoCard
              label="Description"
              value={organisateur?.description}
              full
            />
          </div>
        </div>
      </div>
    </div>
  );

  function InfoCard({ label, value, full }) {
    return (
      <div
        className={`rounded-lg px-4 py-3 border border-gray-100 bg-gray-50 ${full ? "sm:col-span-2" : ""}`}
      >
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-700">{value ?? "—"}</p>
      </div>
    );
  }
}

function InfoCard({ label, value, full }) {
  return (
    <div
      className={`rounded-lg px-4 py-3 border border-gray-100 bg-gray-50 ${full ? "md:col-span-2" : ""}`}
    >
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700">{value ?? "—"}</p>
    </div>
  );
}
