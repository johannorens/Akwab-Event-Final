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
      const res = await fetch(`http://127.0.0.1:8000/api/organisateurs/${id}`, {
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/organisateurs")}
            className="text-gray-400 hover:text-purple-500 transition-colors"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
            Détail organisateur
          </h1>
        </div>
        <button
          onClick={() => navigate(`/dashboard/organisateurs/${id}/modifier`)}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Modifier
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-100 to-teal-50" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-sm">
              {getInitiales(organisateur?.nom)}
            </div>
            <div className="pb-1">
              <p className="text-xl font-bold text-gray-800">
                {organisateur?.nom}
              </p>
              <p className="text-sm text-gray-400">{organisateur?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label="Nom" value={organisateur?.nom} />
            <InfoCard label="Email" value={organisateur?.email} />
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
