import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateOrganisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
      const o = data.data ?? data;
      if (o.id_organisateur) {
        setForm({
          nom: o.nom ?? "",
          email: o.email ?? "",
          description: o.description ?? "",
        });
      } else {
        setError("Impossible de charger l'organisateur.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      const res = await fetch(`${API_URL}/api/organisateurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.data?.id_organisateur || data.id_organisateur) {
        setSuccess("Organisateur mis à jour avec succès.");
        setTimeout(() => navigate(`/admin/organisateurs/${id}`), 1200);
      } else if (data.errors) {
        setFieldErrors(data.errors);
      } else {
        setError(data.message ?? "Erreur lors de la mise à jour.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-center text-gray-400 py-20">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/admin/organisateurs/${id}`)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ color: "#F59A1E" }}
        >
          Modifier l'organisateur
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <SectionTitle>Informations</SectionTitle>
          <div className="px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors resize-none ${
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

          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/admin/organisateurs/${id}`)}
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
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  function SectionTitle({ children }) {
    return (
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "#253C96" }}
        >
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
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={name}
          className="text-xs text-gray-500 font-medium uppercase tracking-wide"
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
            error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
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
