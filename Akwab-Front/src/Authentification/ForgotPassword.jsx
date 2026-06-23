import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Un lien de réinitialisation a été envoyé à votre email.");
      } else {
        setError(data.message || "Une erreur est survenue.");
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
        to="/login"
        className="self-start text-purple-500 text-sm font-medium"
      >
        ← Retour
      </Link>

      <img src={logo} alt="Akwab Event" className="w-20" />

      <div className="text-center">
        <h2
          className="text-xl font-bold text-gray-800"
          style={{ fontFamily: "monospace" }}
        >
          Mot de passe oublié ?
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Réinitialisez votre mot de passe
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-xs text-center w-full">{error}</p>
      )}
      {success && (
        <p className="text-green-500 text-xs text-center w-full">{success}</p>
      )}

      <div className="w-full flex flex-col gap-3">
        <input
          type="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
        </button>
      </div>
    </AuthLayout>
  );
}
