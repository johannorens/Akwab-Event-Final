import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
        const u = data.data;
        setForm({
          nom: u.nom ?? "",
          prenoms: u.prenoms ?? "",
          email: u.email ?? "",
          role: u.role ?? "",
          password: "",
          password_confirmation: "",
        });
      } else {
        setError("Impossible de charger l'utilisateur.");
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
    if (form.password && form.password !== form.password_confirmation) {
      setFieldErrors({
        password_confirmation: "Les mots de passe ne correspondent pas.",
      });
      setSaving(false);
      return;
    }
    const payload = {
      nom: form.nom,
      prenoms: form.prenoms,
      email: form.email,
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }
    try {
      const res = await fetch(`${API_URL}/api/utilisateurs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Utilisateur mis à jour avec succès.");
        setTimeout(() => navigate(`/admin/utilisateurs/${id}`), 1200);
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

  if (loading)
    return (
      <div
        className="text-center py-20 font-medium"
        style={{ color: "#253C96" }}
      >
        Chargement...
      </div>
    );

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/admin/utilisateurs/${id}`)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ color: "#253C96" }}
        >
          Modifier l'utilisateur
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
          {/* Informations personnelles */}
          <SectionTitle>Informations personnelles</SectionTitle>
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
              label="Prénoms"
              name="prenoms"
              value={form.prenoms}
              onChange={handleChange}
              error={fieldErrors.prenoms}
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
              className="sm:col-span-2"
            />
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Rôle
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 bg-white transition-colors"
              >
                <option value="">— Sélectionner un rôle —</option>
                <option value="admin">Admin</option>
                <option value="organisateur">Organisateur</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
              {fieldErrors.role && (
                <p className="text-xs text-red-500">{fieldErrors.role}</p>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <SectionTitle>Changer le mot de passe</SectionTitle>
          <div className="px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p className="text-xs text-gray-400 sm:col-span-2 -mt-1">
              Laissez vide pour ne pas modifier le mot de passe.
            </p>
            <Field
              label="Nouveau mot de passe"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
            <Field
              label="Confirmer"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              error={fieldErrors.password_confirmation}
            />
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(`/admin/utilisateurs/${id}`)}
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
}

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
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
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
