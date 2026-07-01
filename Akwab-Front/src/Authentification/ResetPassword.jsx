import { API_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");
    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: searchParams.get("token"),
          email: searchParams.get("email"),
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });
      const data = await res.json();
      if (res.ok) {
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
      <Link
        to="/forgot-password"
        className="self-start text-purple-500 text-sm font-medium"
      >
        ← Retour
      </Link>

      <img src={logo} alt="Akwab Event" className="w-20" />

      <p className="text-sm text-gray-500 text-center">
        Entrez votre nouveau mot de passe
      </p>

      {error && (
        <p className="text-red-500 text-xs text-center w-full">{error}</p>
      )}

      <div className="w-full flex flex-col gap-3">
        <input
          name="password"
          type="password"
          placeholder="Nouveau mot de passe"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.password_confirmation}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Validation..." : "Valider"}
        </button>
      </div>
    </AuthLayout>
  );
}
