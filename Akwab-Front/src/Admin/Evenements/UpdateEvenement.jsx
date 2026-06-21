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
          fetch(`http://127.0.0.1:8000/api/evenements/${id}`, { headers }).then(
            (r) => r.json(),
          ),
          fetch("http://127.0.0.1:8000/api/lieux", { headers }).then((r) =>
            r.json(),
          ),
          fetch("http://127.0.0.1:8000/api/categories", { headers }).then((r) =>
            r.json(),
          ),
          fetch("http://127.0.0.1:8000/api/organisateurs", { headers }).then(
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
        // console.log("ev complet:", ev);
        // console.log("ev.lieux:", ev.lieux);
        // console.log("ev.categories:", ev.categories);
        // console.log("lieux disponibles:", lieuxRes.data || lieuxRes);

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
        console.error("LOAD ERROR:", err.message, err.stack);
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
    console.log("FORM AU SUBMIT:", form);
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
      if (!t.isNew) {
        fd.append(`tickets[${i}][id_type_ticket]`, t.id_type_ticket);
      }
      fd.append(`tickets[${i}][libelle]`, t.libelle);
      fd.append(`tickets[${i}][prix_ticket]`, t.prix_ticket);
      fd.append(`tickets[${i}][quantite_type_ticket]`, t.quantite_type_ticket);
    });

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/evenements/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      console.log("ERRORS:", data.errors);

      if (data.success || res.ok) {
        setSuccess(true);
        setTimeout(() => navigate(`/dashboard/evenements/${id}`), 1500);
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
      <div className="text-center py-16 text-purple-500">Chargement...</div>
    );

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/evenements/${id}`)}
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          
        </button>
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
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
          <SectionTitle>Informations</SectionTitle>
          <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Image
              </label>
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 transition-colors overflow-hidden relative group bg-gray-50"
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
                    <span className="text-2xl mb-1">+</span>
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

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none transition-colors ${fieldErrors.description ? "border-red-300 bg-red-50" : "border-gray-200"}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Tickets */}
          <SectionTitle>Types de tickets</SectionTitle>
          <div className="px-6 pt-4 pb-6 flex flex-col gap-3">
            {tickets.map((ticket, i) => (
              <div
                key={i}
                className="border border-purple-100 rounded-xl p-4 bg-purple-50 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
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

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Libellé <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VIP, Standard, Gold..."
                    value={ticket.libelle}
                    onChange={(e) => updateTicket(i, "libelle", e.target.value)}
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${fieldErrors[`ticket_${i}_libelle`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                  />
                  {fieldErrors[`ticket_${i}_libelle`] && (
                    <p className="text-xs text-red-500">
                      {fieldErrors[`ticket_${i}_libelle`]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
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
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${fieldErrors[`ticket_${i}_prix`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                  />
                  {fieldErrors[`ticket_${i}_prix`] && (
                    <p className="text-xs text-red-500">
                      {fieldErrors[`ticket_${i}_prix`]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
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
                    className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${fieldErrors[`ticket_${i}_qte`] ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                  />
                  {fieldErrors[`ticket_${i}_qte`] && (
                    <p className="text-xs text-red-500">
                      {fieldErrors[`ticket_${i}_qte`]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTicket}
              className="w-full py-2.5 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors"
            >
              + Ajouter un type de ticket
            </button>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/evenements/${id}`)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
    <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
      <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
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
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
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
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
