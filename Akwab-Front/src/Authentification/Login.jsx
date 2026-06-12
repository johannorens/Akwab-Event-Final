import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          mot_de_passe: motDePasse,
        }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("user:", data.user); // ajoute ça
        console.log("id_role:", data.user.id_role, typeof data.user.id_role); // et ça

        if (data.user.id_role === 1) {
          navigate("/Dashboard");
        } else {
          navigate("/header");
        }
      } else {
        setError(data.message || "Email ou mot de passe incorrect.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <img src={logo} alt="Akwab Event" className="w-20 animate-fadeInLeft" />
      <div className="text-center">
        <h2
          className="text-2xl font-bold text-gray-800"
          style={{ fontFamily: "monospace" }}
        >
          Bonjour !!
        </h2>
        <p className="text-sm text-gray-400 mt-1">Bienvenue à Akwab'Event</p>
      </div>

      {error && (
        <p className="text-red-500 text-xs text-center w-full">{error}</p>
      )}

      {/* Utilisation d'une balise form pour une meilleure gestion de la soumission */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="flex items-center justify-between text-xs text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-purple-500" />
            Se souvenir de moi
          </label>
          <Link to="/forgot-password" className="text-purple-500 font-medium">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-sm text-gray-400">
        Vous n'avez pas de compte ?{" "}
        <Link
          to="/register"
          className="text-purple-500 font-medium hover:underline"
        >
          créez votre compte
        </Link>
      </p>
    </AuthLayout>
  );
}
