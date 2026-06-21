import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ShowEvenement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evenement, setEvenement] = useState(null);
  const [gains, setGains] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvenement() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/evenements/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setEvenement(data.data || data);
        setGains(data.gains_total ?? 0);
      } catch {
        setError("Événement introuvable.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvenement();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Supprimer cet événement ?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/evenements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        navigate("/dashboard/evenements");
      }
    } catch {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading)
    return (
      <div className="text-center py-16 text-purple-500 font-medium">
        Chargement...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-medium">{error}</div>
    );
  if (!evenement) return null;

  const ev = evenement;

  const totalRestants =
    ev.types_tickets?.reduce(
      (s, t) => s + (t.pivot?.quantite_ticket_restante ?? 0),
      0,
    ) ?? 0;

  const totalVendus =
    ev.types_tickets?.reduce(
      (s, t) =>
        s +
        ((t.pivot?.total_ticket_evenement ?? 0) -
          (t.pivot?.quantite_ticket_restante ?? 0)),
      0,
    ) ?? 0;

  return (
    <div className="flex flex-col gap-6 max-w-4xl p-4 md:p-0">
      
      <button
        onClick={() => navigate("/dashboard/evenements")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-500 transition-colors w-fit"
      >
        Retour aux événements
      </button>

      <div className="w-full h-64 rounded-xl overflow-hidden bg-purple-50 relative flex items-center justify-center">
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
            className="w-16 h-16 text-purple-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375 3.75 0 1 1-.75 0 .375 3.75 0 0 1 .75 0Z"
            />
          </svg>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       
        <div className="md:col-span-2 flex flex-col gap-4">
         
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {ev.categories && (
              <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                {ev.categories.libelle}
              </span>
            )}
            <h1 className="text-2xl font-bold text-[#4D027A] mb-4">{ev.nom}</h1>

            <div className="flex flex-col gap-3 text-sm text-gray-500">
              {ev.date && (
                <div className="flex items-center gap-2">
                  <img
                    src="/calendar.svg"
                    alt="Calendrier"
                    className="w-4 h-4 shrink-0"
                  />
                  <span>
                    {new Date(ev.date).toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}
              {ev.lieux && (
                <div className="flex items-center gap-2">
                  <img
                    src="/location.svg"
                    alt="Localisation"
                    className="w-4 h-4 shrink-0"
                  />
                  <span>
                    {ev.lieux.nom}, {ev.lieux.ville}
                  </span>
                </div>
              )}
            </div>
          </div>

          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-3">
              Description
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {ev.description}
            </p>
          </div>

          {ev.organisateurs && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-3">
                Organisateur
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {ev.organisateurs.nom?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {ev.organisateurs.nom}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ev.organisateurs.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

 
        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2">
            <button
              onClick={() => navigate(`/dashboard/evenements/${id}/edit`)}
              className="w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Supprimer
            </button>
          </div>

       
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-teal-600 font-medium mb-1">
                Gains totaux
              </p>
              <p className="text-xl font-bold text-teal-700">
                {Number(gains).toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 shadow-sm">
                <p className="text-xs text-purple-600 font-medium mb-1">
                  Restants
                </p>
                <p className="text-base font-bold text-purple-700">
                  {totalRestants}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">Vendus</p>
                <p className="text-base font-bold text-gray-700">
                  {totalVendus}
                </p>
              </div>
            </div>
          </div>

         
          {ev.types_tickets?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-3">
                Types de tickets
              </p>
              <div className="flex flex-col divide-y divide-gray-100">
                {ev.types_tickets.map((t, i) => {
                  const restants = t.pivot?.quantite_ticket_restante ?? 0;
                  const total = t.pivot?.total_ticket_evenement ?? 0;
                  const pct = total > 0 ? restants / total : 0;
                  const badge =
                    restants === 0
                      ? { label: "Épuisé", cls: "bg-red-50 text-red-600" }
                      : pct < 0.3
                        ? { label: "Faible", cls: "bg-amber-50 text-amber-700" }
                        : {
                            label: "Disponible",
                            cls: "bg-teal-50 text-teal-700",
                          };

                  return (
                    <div
                      key={i}
                      className="py-2.5 flex justify-between items-center gap-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {t.libelle}
                        </p>
                        <p className="text-xs text-gray-400">
                          {Number(t.prix_ticket).toLocaleString("fr-FR")} FCFA ·{" "}
                          {total} initial
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-gray-500 font-medium">
                          {restants} restants
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {ev.lieux && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-3">
                Détails du lieu
              </p>
              <p className="text-sm font-medium text-gray-800">
                {ev.lieux.nom}
              </p>
              <p className="text-xs text-gray-400 mt-1">{ev.lieux.adresse}</p>
              <p className="text-xs text-gray-400">{ev.lieux.ville}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
