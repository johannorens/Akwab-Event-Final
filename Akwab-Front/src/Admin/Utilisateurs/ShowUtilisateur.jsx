import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ShowUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUtilisateur();
  }, [id]);

  async function fetchUtilisateur() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/utilisateurs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUtilisateur(data.data);
      } else {
        setError("Impossible de charger l'utilisateur.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  function getInitiales(nom, prenoms) {
    return ((nom?.[0] ?? "") + (prenoms?.[0] ?? "")).toUpperCase();
  }

  if (loading)
    return (
      <div
        className="text-center py-20 font-medium"
        style={{ color: "#253C96" }}
      >
        Chargement...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500 text-sm">{error}</div>
    );

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/utilisateurs")}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ color: "#F59A1E" }}
        >
          Détail participant
        </h1>
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
              style={{ backgroundColor: "#F59A1E" }}
            >
              {getInitiales(utilisateur?.nom, utilisateur?.prenoms)}
            </div>
            <div className="pb-1">
              <p className="text-lg sm:text-xl font-bold text-gray-800">
                {utilisateur?.prenoms} {utilisateur?.nom}
              </p>
              <p className="text-sm text-gray-400">{utilisateur?.email}</p>
            </div>
            <div className="sm:ml-auto">
              <button
                onClick={() => navigate(`/admin/utilisateurs/${id}/edit`)}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoCard label="Nom" value={utilisateur?.nom} />
            <InfoCard label="Prénoms" value={utilisateur?.prenoms} />
            <InfoCard label="Email" value={utilisateur?.email} />
            <InfoCard label="Téléphone" value={utilisateur?.telephone} />
            <InfoCard label="Rôle" value={utilisateur?.role ?? "Utilisateur"} />
            <InfoCard
              label="Évènements aimés"
              value={utilisateur?.nb_evenements_aimes ?? 0}
              highlight
            />
            {utilisateur?.created_at && (
              <InfoCard
                label="Inscrit le"
                value={new Date(utilisateur.created_at).toLocaleDateString(
                  "fr-FR",
                  { day: "2-digit", month: "long", year: "numeric" },
                )}
              />
            )}
          </div>
        </div>
      </div>

      {/* Évènements aimés */}
      {utilisateur?.evenements_aimes?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: "#253C96" }}
            >
              Évènements aimés
            </h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {utilisateur.evenements_aimes.map((ev) => (
              <li
                key={ev.id}
                className="px-4 sm:px-6 py-4 flex items-center justify-between gap-2 transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EEF1FB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span className="text-sm font-medium text-gray-700 truncate">
                  {ev.titre ?? ev.nom ?? `Évènement #${ev.id}`}
                </span>
                {ev.date_debut && (
                  <span
                    className="text-xs font-semibold flex-shrink-0"
                    style={{ color: "#253C96" }}
                  >
                    {new Date(ev.date_debut).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value, highlight }) {
  return (
    <div
      className="rounded-lg px-4 py-3 border"
      style={
        highlight
          ? { backgroundColor: "#EEF1FB", borderColor: "#253C96" }
          : { backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }
      }
    >
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className="text-sm font-semibold"
        style={{ color: highlight ? "#253C96" : "#374151" }}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}
