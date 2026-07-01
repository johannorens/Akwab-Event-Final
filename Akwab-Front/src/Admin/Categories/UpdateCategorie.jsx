import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCategorie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [libelle, setLibelle] = useState("");
  const [imageFile, setImageFile] = useState(null); // nouveau fichier choisi
  const [imagePreview, setImagePreview] = useState(null); // aperçu (URL blob ou URL existante)

  useEffect(() => {
    fetchCategorie();
  }, [id]);

  async function fetchCategorie() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) {
        const cat = data.data ?? data;
        setLibelle(cat.libelle ?? "");
        setImagePreview(cat.image ?? null); // URL existante depuis le serveur
      } else {
        setError(data.message ?? "Catégorie introuvable.");
      }
    } catch {
      setError("Impossible de charger la catégorie.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFieldErrors((prev) => ({ ...prev, image: "" }));
  }

  function validate() {
    const errs = {};
    if (!libelle.trim()) errs.libelle = "Requis";
    // L'image est optionnelle en update (on garde l'ancienne si pas de nouveau fichier)
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("libelle", libelle);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // Laravel ne supporte pas PUT avec FormData — on utilise POST + _method
      formData.append("_method", "PUT");

      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "POST", // POST avec _method=PUT pour le spoofing Laravel
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      const data = await res.json();

      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/categories"), 1200);
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

  if (loading) {
    return (
      <div
        className="text-center py-16 font-medium"
        style={{ color: "#253C96" }}
      >
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-6 md:py-12 w-full">
      <div className="flex flex-col gap-6 max-w-xl w-full">
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide text-center"
          style={{ color: "#253C96" }}
        >
          Modifier la catégorie
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Catégorie mise à jour. Redirection...
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="px-4 py-5 sm:px-6 sm:py-6 flex flex-col gap-5"
          >
            {/* Libellé */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Libellé <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={libelle}
                onChange={(e) => {
                  setLibelle(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, libelle: "" }));
                }}
                placeholder="Ex: Musique, Sport, Art..."
                className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.libelle
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              />
              {fieldErrors.libelle && (
                <p className="text-xs text-red-500">{fieldErrors.libelle}</p>
              )}
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Image
                <span className="text-gray-400 normal-case font-normal ml-1">
                  (laisser vide pour garder l'actuelle)
                </span>
              </label>

              {/* Aperçu image actuelle ou nouvelle */}
              {imagePreview && (
                <div
                  className="w-full h-36 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200"
                  style={{ backgroundColor: "#EEF1FB" }}
                >
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="h-full w-full object-contain p-1"
                  />
                </div>
              )}

              {/* Zone clic pour changer */}
              <label
                className={`flex flex-col items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  fieldErrors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <i className="ti ti-upload" style={{ fontSize: 18 }} />
                  <span className="text-xs">
                    {imageFile ? imageFile.name : "Choisir une nouvelle image"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {fieldErrors.image && (
                <p className="text-xs text-red-500">{fieldErrors.image}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors text-center"
                style={{ color: "#253C96", borderColor: "#253C96" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EEF1FB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Retour
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
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
