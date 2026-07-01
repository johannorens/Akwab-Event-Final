import { API_URL } from "../../config/api";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateEvenement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [lieux, setLieux] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organisateurs, setOrganisateurs] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    description: "",
    date: "",
    id_lieu: "",
    id_categorie: "",
    id_organisateur: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function loadAll() {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [evRes, lieuxRes, catsRes, orgsRes] = await Promise.all([
          fetch(`${API_URL}/api/evenements/${id}`, { headers }).then(
            (r) => r.json(),
          ),
          fetch(API_URL + "/api/lieux", { headers }).then((r) =>
            r.json(),
          ),
          fetch(API_URL + "/api/categories", { headers }).then((r) =>
            r.json(),
          ),
          fetch(API_URL + "/api/organisateurs", { headers }).then(
            (r) => r.json(),
          ),
        ]);
        const ev = evRes.data || evRes;
        setLieux(lieuxRes.data || lieuxRes);
        setCategories(catsRes.data || catsRes);
        setOrganisateurs(orgsRes.data || orgsRes);
        const dateVal = ev.date
          ? new Date(ev.date).toISOString().slice(0, 16)
          : "";
        setForm({
          nom: ev.nom || "",
          description: ev.description || "",
          date: dateVal,
          id_lieu: String(ev.lieux?.id_lieu || ""),
          id_categorie: String(ev.categories?.id_categorie || ""),
          id_organisateur: String(ev.organisateurs?.id_organisateur || ""),
        });
        setImagePreview(ev.image || null);
        setTickets(
          (ev.types_tickets || []).map((t) => ({
            id_type_ticket: t.id_type_ticket,
            libelle: t.libelle || "",
            prix_ticket: t.prix_ticket ?? t.prix ?? "",
            quantite_type_ticket: t.pivot?.quantite_type_ticket || "",
            isNew: false,
          })),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function updateTicket(i, field, value) {
    setTickets((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );
  }

  function addTicket() {
    setTickets((prev) => [
      ...prev,
      { libelle: "", prix_ticket: "", quantite_type_ticket: "", isNew: true },
    ]);
  }

  function removeTicket(i) {
    setTickets((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validate() {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Requis";
    if (!form.description.trim()) errs.description = "Requis";
    if (!form.date) errs.date = "Requis";
    if (!form.id_lieu) errs.id_lieu = "Requis";
    if (!form.id_categorie) errs.id_categorie = "Requis";
    if (!form.id_organisateur) errs.id_organisateur = "Requis";
    tickets.forEach((t, i) => {
      if (!t.libelle.trim()) errs[`ticket_${i}_libelle`] = "Requis";
      if (t.prix_ticket === "" || Number(t.prix_ticket) < 0)
        errs[`ticket_${i}_prix`] = "Requis";
      if (!t.quantite_type_ticket || Number(t.quantite_type_ticket) < 1)
        errs[`ticket_${i}_qte`] = "Requis";
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("nom", form.nom);
    fd.append("description", form.description);
    fd.append("date", form.date);
    fd.append("id_lieu", Number(form.id_lieu));
    fd.append("id_categorie", Number(form.id_categorie));
    fd.append("id_organisateur", Number(form.id_organisateur));
    if (image) fd.append("image", image);
    tickets.forEach((t, i) => {
      if (!t.isNew)
        fd.append(`tickets[${i}][id_type_ticket]`, t.id_type_ticket);
      fd.append(`tickets[${i}][libelle]`, t.libelle);
      fd.append(`tickets[${i}][prix_ticket]`, t.prix_ticket);
      fd.append(`tickets[${i}][quantite_type_ticket]`, t.quantite_type_ticket);
    });
    try {
      const res = await fetch(`${API_URL}/api/evenements/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate(`/admin/evenements/${id}`), 1500);
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

  if (loading)
    return (
      <div
        className="text-center py-16 font-medium"
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
          onClick={() => navigate(`/admin/evenements/${id}`)}
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ color: "#253C96" }}
        >
          Modifier l'événement
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          Événement mis à jour. Redirection...
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* ── Informations ── */}
          <SectionTitle>Informations</SectionTitle>
          <div className="px-4 sm:px-6 pt-4 pb-6 flex flex-col gap-4">
            {/* Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Image
              </label>
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group bg-gray-50"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#253C96")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#e5e7eb")
                }
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">
                        Changer l'image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl mb-1 text-gray-400">+</span>
                    <span className="text-xs text-gray-400">
                      Ajouter une image
                    </span>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                onChange={handleImage}
                className="hidden"
              />
              <p className="text-xs text-gray-400">
                Laisser vide pour conserver l'image actuelle
              </p>
            </div>

            <Field
              label="Nom de l'événement"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              error={fieldErrors.nom}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none transition-colors ${fieldErrors.description ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
              {fieldErrors.description && (
                <p className="text-xs text-red-500">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <Field
              label="Date et heure"
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              error={fieldErrors.date}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Lieu"
                name="id_lieu"
                value={form.id_lieu}
                onChange={handleChange}
                error={fieldErrors.id_lieu}
                required
              >
                <option value="">Sélectionner un lieu</option>
                {lieux.map((l) => (
                  <option key={l.id} value={String(l.id)}>
                    {l.nom} — {l.ville}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Catégorie"
                name="id_categorie"
                value={form.id_categorie}
                onChange={handleChange}
                error={fieldErrors.id_categorie}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.libelle}
                  </option>
                ))}
              </SelectField>
            </div>

            <SelectField
              label="Organisateur"
              name="id_organisateur"
              value={form.id_organisateur}
              onChange={handleChange}
              error={fieldErrors.id_organisateur}
              required
            >
              <option value="">Sélectionner un organisateur</option>
              {organisateurs.map((o) => (
                <option
                  key={o.id_organisateur}
                  value={String(o.id_organisateur)}
                >
                  {o.nom}
                </option>
              ))}
            </SelectField>
          </div>

          {/* ── Tickets ── */}
          <SectionTitle>Types de tickets</SectionTitle>
          <div className="px-4 sm:px-6 pt-4 pb-6 flex flex-col gap-3">
            {tickets.map((ticket, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 flex flex-col gap-3"
                style={{ borderColor: "#253C96", backgroundColor: "#EEF1FB" }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#253C96" }}
                  >
                    {ticket.isNew ? "🆕 Nouveau ticket" : `Ticket ${i + 1}`}
                  </span>
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicket(i)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Libellé <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VIP, Standard, Gold..."
                    value={ticket.libelle}
                    onChange={(e) => updateTicket(i, "libelle", e.target.value)}
                    className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 ${fieldErrors[`ticket_${i}_libelle`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                  />
                  {fieldErrors[`ticket_${i}_libelle`] && (
                    <p className="text-xs text-red-500">
                      {fieldErrors[`ticket_${i}_libelle`]}
                    </p>
                  )}
                </div>

                {/* Prix + Quantité en grid sur sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Prix (FCFA) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Ex: 25000"
                      value={ticket.prix_ticket}
                      onChange={(e) =>
                        updateTicket(i, "prix_ticket", e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 ${fieldErrors[`ticket_${i}_prix`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                    />
                    {fieldErrors[`ticket_${i}_prix`] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[`ticket_${i}_prix`]}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Quantité <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 100"
                      value={ticket.quantite_type_ticket}
                      onChange={(e) =>
                        updateTicket(i, "quantite_type_ticket", e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 ${fieldErrors[`ticket_${i}_qte`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                    />
                    {fieldErrors[`ticket_${i}_qte`] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[`ticket_${i}_qte`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicket}
              className="w-full py-2.5 border-2 border-dashed rounded-xl text-sm font-medium transition-colors"
              style={{ borderColor: "#253C96", color: "#253C96" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#EEF1FB")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              + Ajouter un type de ticket
            </button>
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
            <button
              type="button"
              onClick={() => navigate(`/admin/evenements/${id}`)}
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
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
