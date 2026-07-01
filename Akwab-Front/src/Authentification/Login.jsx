import { API_URL } from "../config/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.removeItem("remember_email");
    }

    try {
      const res = await fetch(API_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.id_role === 1) {
          navigate("/Admin/Dashboard");
        } else {
          navigate("/accueil");
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

      {/* Logo */}
      <img src={logo} alt="Akwab Event" className="w-24" />

      {/* Titre */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mt-1">
          Connectez-vous à votre espace
        </p>
      </div>

      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        {/* Mot de passe */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="auth-input"
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember + oublié */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#F59A1E] w-3.5 h-3.5"
            />
            Se souvenir de moi
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold hover:underline transition-colors"
            style={{ color: "#F59A1E" }}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-sm font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
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
              Connexion...
            </span>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <p className="text-sm text-gray-400">
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          className="font-bold hover:underline"
          style={{ color: "#F59A1E" }}
        >
          Créez votre compte
        </Link>
      </p>
    </AuthLayout>
  );
}
