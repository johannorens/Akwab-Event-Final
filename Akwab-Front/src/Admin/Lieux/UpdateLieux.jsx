import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateLieux() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    ville: "",
    adresse: "",
  });

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

        const lieu = data.data || data;

        setForm({
          nom: lieu.nom || "",
          ville: lieu.ville || "",
          adresse: lieu.adresse || "",
        });
      } catch {
        setError("Impossible de charger le lieu.");
      } finally {
        setLoading(false);
      }
    }
    loadLieu();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Requis";
    if (!form.ville.trim()) errs.ville = "Requis";
    if (!form.adresse.trim()) errs.adresse = "Requis";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/lieux/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate(`/dashboard/lieux/${id}`), 1200);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message ?? "Erreur lors de la modification.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-purple-500 font-medium">Chargement...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8 w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/lieux/${id}`)}
            className="text-gray-400 hover:text-purple-500 transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-purple-600 tracking-wide">
            Modifier le lieu
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Lieu mis à jour. Redirection...
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 flex flex-col gap-4"
          >
            <Field
              label="Nom du lieu"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={fieldErrors.nom}
              required
            />
            <Field
              label="Ville"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              error={fieldErrors.ville}
              required
            />
            <Field
              label="Adresse"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              error={fieldErrors.adresse}
              required
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/lieux/${id}`)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
