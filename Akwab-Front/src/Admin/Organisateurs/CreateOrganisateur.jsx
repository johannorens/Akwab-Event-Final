import { API_URL } from "../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateOrganisateur() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch(API_URL + "/api/organisateurs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        navigate("/Admin/organisateurs");
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
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#F59A1E] tracking-wide text-center">
        Nouvel organisateur
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <SectionTitle>Informations</SectionTitle>
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Field
              label="Nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={fieldErrors.nom}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
            />
            <Field
              label="Téléphone"
              name="telephone"
              type="tel"
              value={form.telephone}
              onChange={handleChange}
              error={fieldErrors.telephone}
              required
            />
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors resize-none ${
                  fieldErrors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              />
              {fieldErrors.description && (
                <p className="text-xs text-red-500">
                  {fieldErrors.description}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <button
              type="button"
              onClick={() => navigate("/Admin/organisateurs")}
              className="px-4 py-2 text-sm text-[#F59A1E] font-medium border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#F59A1E] text-white text-sm font-semibold rounded-lg  transition-colors disabled:opacity-50"
            >
              {saving ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
      <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
        {children}
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-xs text-gray-500 font-medium uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
