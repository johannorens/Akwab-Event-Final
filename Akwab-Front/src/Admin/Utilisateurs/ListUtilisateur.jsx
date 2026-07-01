import { API_URL } from "../../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListUtilisateur() {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminForm, setAdminForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    mot_de_passe_confirmation: "",
  });
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminErrors, setAdminErrors] = useState({});
  const parPage = 8;

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  async function fetchUtilisateurs() {
    setLoading(true);
    try {
      const res = await fetch(API_URL + "/api/utilisateurs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUtilisateurs([...data.data].reverse());
      } else {
        setError("Impossible de charger les utilisateurs.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete(id) {
    const result = await Swal.fire({
      title: "Supprimer cet utilisateur ?",
      text: "Cette action est irréversible. Toutes les données liées seront supprimées.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59A1E",
      cancelButtonColor: "#253C96",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/utilisateurs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setUtilisateurs((prev) => prev.filter((u) => u.id !== id));
        Swal.fire({
          title: "Supprimé !",
          icon: "success",
          confirmButtonColor: "#F59A1E",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Erreur",
          text: data.message ?? "Erreur lors de la suppression.",
          icon: "error",
          confirmButtonColor: "#253C96",
        });
      }
    } catch {
      Swal.fire({
        title: "Erreur",
        text: "Impossible de contacter le serveur.",
        icon: "error",
        confirmButtonColor: "#253C96",
      });
    }
  }

  async function handleAddAdmin(e) {
    e.preventDefault();
    setAdminErrors({});

    if (adminForm.mot_de_passe !== adminForm.mot_de_passe_confirmation) {
      setAdminErrors({
        mot_de_passe_confirmation: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    setAdminSaving(true);
    try {
      const res = await fetch(API_URL + "/api/register/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(adminForm),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setShowAddAdmin(false);
        setAdminForm({
          nom: "",
          prenoms: "",
          email: "",
          telephone: "",
          mot_de_passe: "",
          mot_de_passe_confirmation: "",
        });
        fetchUtilisateurs();
        Swal.fire({
          title: "Admin créé !",
          icon: "success",
          confirmButtonColor: "#F59A1E",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (data.errors) {
        setAdminErrors(data.errors);
      } else {
        setAdminErrors({
          global: data.message ?? "Erreur lors de la création.",
        });
      }
    } catch {
      setAdminErrors({ global: "Impossible de contacter le serveur." });
    } finally {
      setAdminSaving(false);
    }
  }

  const totalPages = Math.ceil(utilisateurs.length / parPage);
  const pagines = utilisateurs.slice((page - 1) * parPage, page * parPage);

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "#F59A1E" }}
          >
            Liste des participants
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {utilisateurs.length} participant
            {utilisateurs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowAddAdmin(true)}
          className="w-full sm:w-auto px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#F59A1E" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4841a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#F59A1E")
          }
        >
          + Ajouter un admin
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* TABLE — sm et plus */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <p
            className="text-center py-16 font-medium"
            style={{ color: "#253C96" }}
          >
            Chargement...
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr
                className="text-xs uppercase border-b border-gray-100"
                style={{ color: "#F59A1E" }}
              >
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Prénoms</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Évènements aimés</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-400">
                    Aucun participant trouvé.
                  </td>
                </tr>
              ) : (
                pagines.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`border-b border-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#EEF1FB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        i % 2 === 0 ? "white" : "rgba(249,250,251,0.5)")
                    }
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {u.nom}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{u.prenoms}</td>
                    <td className="py-3 px-4 text-gray-500">{u.email}</td>
                    <td className="py-3 px-4 text-center text-gray-500">
                      {u.nb_evenements_aimes ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/Admin/utilisateurs/${u.id}`)
                          }
                          className="px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors text-white"
                          style={{
                            backgroundColor: "#253C96",
                            borderColor: "#253C96",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1a2d75")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#253C96")
                          }
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => confirmDelete(u.id)}
                          className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CARDS — mobile uniquement */}
      <div className="flex flex-col gap-3 sm:hidden">
        {loading ? (
          <p
            className="text-center py-12 font-medium"
            style={{ color: "#253C96" }}
          >
            Chargement...
          </p>
        ) : pagines.length === 0 ? (
          <p className="text-center py-12 text-gray-400 text-sm">
            Aucun participant trouvé.
          </p>
        ) : (
          pagines.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: "#253C96" }}
                >
                  {(u.nom?.[0] ?? "").toUpperCase()}
                  {(u.prenoms?.[0] ?? "").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: "#253C96" }}
                  >
                    {u.prenoms} {u.nom}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {u.nb_evenements_aimes ?? 0} évènement
                  {(u.nb_evenements_aimes ?? 0) > 1 ? "s" : ""} aimé
                  {(u.nb_evenements_aimes ?? 0) > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/Admin/utilisateurs/${u.id}`)}
                  className="flex-1 py-2 text-xs rounded-lg border font-medium transition-colors text-white"
                  style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1a2d75")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#253C96")
                  }
                >
                  Voir le profil
                </button>
                <button
                  onClick={() => confirmDelete(u.id)}
                  className="px-4 py-2 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center sm:justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#1a2d75";
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#253C96";
            }}
          >
            Précédent
          </button>
          <span className="text-sm font-semibold bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-lg">
            {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: "#253C96", borderColor: "#253C96" }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#1a2d75";
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.backgroundColor = "#253C96";
            }}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal ajout admin */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base" style={{ color: "#253C96" }}>
                Ajouter un admin
              </h3>
              <button
                onClick={() => {
                  setShowAddAdmin(false);
                  setAdminErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleAddAdmin}
              className="px-6 py-5 flex flex-col gap-4"
            >
              {adminErrors.global && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {adminErrors.global}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminField
                  label="Nom"
                  name="nom"
                  value={adminForm.nom}
                  onChange={(e) =>
                    setAdminForm((p) => ({ ...p, nom: e.target.value }))
                  }
                  error={adminErrors.nom}
                  required
                />
                <AdminField
                  label="Prénoms"
                  name="prenoms"
                  value={adminForm.prenoms}
                  onChange={(e) =>
                    setAdminForm((p) => ({ ...p, prenoms: e.target.value }))
                  }
                  error={adminErrors.prenoms}
                  required
                />
              </div>

              <AdminField
                label="Email"
                name="email"
                type="email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm((p) => ({ ...p, email: e.target.value }))
                }
                error={adminErrors.email}
                required
              />

              <AdminField
                label="Téléphone"
                name="telephone"
                type="tel"
                value={adminForm.telephone}
                onChange={(e) =>
                  setAdminForm((p) => ({ ...p, telephone: e.target.value }))
                }
                error={adminErrors.telephone}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminField
                  label="Mot de passe"
                  name="mot_de_passe"
                  type="password"
                  value={adminForm.mot_de_passe}
                  onChange={(e) =>
                    setAdminForm((p) => ({
                      ...p,
                      mot_de_passe: e.target.value,
                    }))
                  }
                  error={adminErrors.mot_de_passe}
                  required
                />
                <AdminField
                  label="Confirmer"
                  name="mot_de_passe_confirmation"
                  type="password"
                  value={adminForm.mot_de_passe_confirmation}
                  onChange={(e) =>
                    setAdminForm((p) => ({
                      ...p,
                      mot_de_passe_confirmation: e.target.value,
                    }))
                  }
                  error={adminErrors.mot_de_passe_confirmation}
                  required
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdmin(false);
                    setAdminErrors({});
                  }}
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
                  disabled={adminSaving}
                  className="w-full sm:flex-1 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#F59A1E" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d4841a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F59A1E")
                  }
                >
                  {adminSaving ? "Création..." : "Créer l'admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminField({
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
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
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
