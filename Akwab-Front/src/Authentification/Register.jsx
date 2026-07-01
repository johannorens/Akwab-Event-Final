import { API_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

function getPasswordStrength(password) {
  if (password.length === 0) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1)
    return { label: "Faible", color: "bg-red-500", width: "w-1/4" };
  if (score === 2)
    return { label: "Moyen", color: "bg-orange-400", width: "w-2/4" };
  if (score === 3)
    return { label: "Bon", color: "bg-yellow-400", width: "w-3/4" };
  return { label: "Fort", color: "bg-green-500", width: "w-full" };
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    mot_de_passe_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(form.mot_de_passe);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");
    if (form.mot_de_passe !== form.mot_de_passe_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (strength && strength.label === "Faible") {
      setError("Le mot de passe est trop faible.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/login");
      } else {
        const msgs = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message;
        setError(msgs || "Une erreur est survenue.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <style>{`
        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          font-size: 14px;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .auth-input:focus {
          border-color: #F59A1E;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(245,154,30,0.12);
        }
        .auth-input::placeholder { color: #9ca3af; }
      `}</style>

      <img src={logo} alt="Akwab Event" className="w-20" />

      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          Créer un compte
        </h2>
        <p className="text-sm text-gray-400 mt-1">Rejoignez Akwab'Event</p>
      </div>

      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 text-center">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col gap-3">
        {/* Nom + Prénoms */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Nom
            </label>
            <input
              name="nom"
              type="text"
              placeholder="Doe"
              value={form.nom}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Prénoms
            </label>
            <input
              name="prenoms"
              type="text"
              placeholder="John"
              value={form.prenoms}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="votre@email.com"
            value={form.email}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Téléphone
          </label>
          <input
            name="telephone"
            type="tel"
            placeholder="+225 00 00 00 00 00"
            value={form.telephone}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Mot de passe
          </label>
          <input
            name="mot_de_passe"
            type="password"
            placeholder="••••••••"
            value={form.mot_de_passe}
            onChange={handleChange}
            className="auth-input"
          />
          {strength && (
            <div className="flex flex-col gap-1 px-1 mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  strength.label === "Faible"
                    ? "text-red-500"
                    : strength.label === "Moyen"
                      ? "text-orange-400"
                      : strength.label === "Bon"
                        ? "text-yellow-500"
                        : "text-green-500"
                }`}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Confirmer le mot de passe
          </label>
          <input
            name="mot_de_passe_confirmation"
            type="password"
            placeholder="••••••••"
            value={form.mot_de_passe_confirmation}
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-1 py-3 rounded-xl text-white text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-60"
          style={{
            backgroundColor: "#F59A1E",
            boxShadow: "0 4px 14px rgba(245,154,30,0.35)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Inscription...
            </span>
          ) : (
            "S'inscrire"
          )}
        </button>
      </div>

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <p className="text-sm text-gray-400">
        Vous avez un compte ?{" "}
        <Link
          to="/login"
          className="font-bold hover:underline"
          style={{ color: "#F59A1E" }}
        >
          Connectez-vous
        </Link>
      </p>
    </AuthLayout>
  );
}
