import { API_URL } from "../../config/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCategorie() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [libelle, setLibelle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    if (!imageFile) errs.image = "Requis";
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
      formData.append("image", imageFile);

      const res = await fetch(API_URL + "/api/categories", {
        method: "POST",
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
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide text-center"
          style={{ color: "#F59A1E" }}
        >
          Créer une catégorie
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Catégorie créée. Redirection...
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
                Image <span className="text-red-400">*</span>
              </label>

              {/* Zone de drop / clic */}
              <label
                className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  fieldErrors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="h-full w-full object-contain rounded-lg p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <i className="ti ti-upload" style={{ fontSize: 28 }} />
                    <span className="text-xs">
                      Cliquez pour choisir une image
                    </span>
                    <span className="text-xs text-gray-300">
                      PNG, JPG, WEBP — max 2 Mo
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Bouton changer si déjà une image */}
              {imagePreview && (
                <label
                  className="text-xs text-center cursor-pointer"
                  style={{ color: "#253C96" }}
                >
                  Changer l'image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

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
                {saving ? "Création..." : "Créer la catégorie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
