import { API_URL } from "../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateLieux() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    ville: "",
    adresse: "",
  });

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
      const res = await fetch(API_URL + "/api/lieux", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/lieux"), 1200);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message ?? "Erreur lors de la création.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-6 md:py-12 w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
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
            Créer un lieu
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Lieu créé. Redirection...
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 py-5 flex flex-col gap-4"
          >
            <Field
              label="Nom du lieu"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={fieldErrors.nom}
              placeholder="Ex: Palais de la Culture"
              required
            />
            <Field
              label="Ville"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              error={fieldErrors.ville}
              placeholder="Ex: Abidjan"
              required
            />
            <Field
              label="Adresse"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              error={fieldErrors.adresse}
              placeholder="Ex: Avenue Terrasson de Fougères"
              required
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/lieux")}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors text-center"
                style={{ color: "#253C96", borderColor: "#253C96" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EEF1FB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#F59A1E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d4841a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F59A1E")
                }
              >
                {saving ? "Création..." : "Créer le lieu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function Field({
    label,
    name,
    value,
    onChange,
    error,
    required,
    placeholder,
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
}
