import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

const STEP_INFO = 1;
const STEP_TICKETS = 2;

const emptyTicket = () => ({
  libelle: "",
  prix_ticket: "",
  quantite_type_ticket: "",
  description_ticket: "",
});

export default function CreateEvenement() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [step, setStep] = useState(STEP_INFO);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
  const [tickets, setTickets] = useState([emptyTicket()]);

  useEffect(() => {
    async function loadOptions() {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [lieuxRes, catsRes, orgsRes] = await Promise.all([
          fetch(`${API_URL}/api/lieux`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/categories`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/organisateurs`, { headers }).then((r) =>
            r.json(),
          ),
        ]);
        setLieux(lieuxRes.data || lieuxRes);
        setCategories(catsRes.data || catsRes);
        setOrganisateurs(orgsRes.data || orgsRes);
      } catch {
        setError("Impossible de charger les options.");
      }
    }
    loadOptions();
  }, []);

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
    setFieldErrors((prev) => ({ ...prev, image: "" }));
  }

  function validateStep1() {
    const errs = {};
    if (!form.nom.trim()) errs.nom = "Requis";
    if (!form.description.trim()) errs.description = "Requis";
    if (!form.date) errs.date = "Requis";
    if (!form.id_lieu) errs.id_lieu = "Requis";
    if (!form.id_categorie) errs.id_categorie = "Requis";
    if (!form.id_organisateur) errs.id_organisateur = "Requis";
    if (!image) errs.image = "Une image est requise";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    const errs = {};
    tickets.forEach((t, i) => {
      if (!t.libelle.trim()) errs[`ticket_${i}_libelle`] = "Requis";
      if (!t.prix_ticket || Number(t.prix_ticket) < 0)
        errs[`ticket_${i}_prix`] = "Requis";
      if (!t.quantite_type_ticket || Number(t.quantite_type_ticket) < 1)
        errs[`ticket_${i}_qte`] = "Requis";
    });
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep1()) setStep(STEP_TICKETS);
  }

  function updateTicket(i, field, value) {
    setTickets((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );
  }

  async function handleSubmit() {
    if (!validateStep2()) return;
    setSaving(true);
    setError("");

    const fd = new FormData();
    fd.append("nom", form.nom);
    fd.append("description", form.description);
    fd.append("date", form.date);
    fd.append("id_lieu", form.id_lieu);
    fd.append("id_categorie", form.id_categorie);
    fd.append("id_organisateur", form.id_organisateur);
    fd.append("image", image);
    tickets.forEach((t, i) => {
      fd.append(`tickets[${i}][libelle]`, t.libelle);
      fd.append(`tickets[${i}][prix_ticket]`, t.prix_ticket);
      fd.append(`tickets[${i}][quantite_type_ticket]`, t.quantite_type_ticket);
    });

    try {
      const res = await fetch(`${API_URL}/api/evenements`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        navigate("/admin/evenements");
      } else if (data.errors) {
        setFieldErrors(data.errors);
        setStep(STEP_INFO);
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
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            step === STEP_TICKETS
              ? setStep(STEP_INFO)
              : navigate("/admin/evenements")
          }
          className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
        >
          ←
        </button>
        <h1
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ color: "#253C96" }}
        >
          Créer un événement
        </h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {[
          { num: 1, label: "Informations" },
          { num: 2, label: "Types de tickets" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors text-white"
                style={{
                  backgroundColor: step >= s.num ? "#253C96" : "#e5e7eb",
                  color: step >= s.num ? "white" : "#9ca3af",
                }}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{ color: step >= s.num ? "#253C96" : "#9ca3af" }}
              >
                {s.label}
              </span>
            </div>
            {i === 0 && (
              <div
                className="flex-1 h-0.5 mx-3 transition-colors"
                style={{ backgroundColor: step > 1 ? "#253C96" : "#e5e7eb" }}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* ── STEP 1 : Informations ── */}
        {step === STEP_INFO && (
          <>
            <SectionTitle>Informations de l'événement</SectionTitle>
            <div className="px-4 sm:px-6 pt-4 pb-6 flex flex-col gap-4">
              {/* Image upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Image <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                    fieldErrors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  style={
                    !fieldErrors.image ? { "--hover-border": "#253C96" } : {}
                  }
                  onMouseEnter={(e) => {
                    if (!fieldErrors.image)
                      e.currentTarget.style.borderColor = "#253C96";
                  }}
                  onMouseLeave={(e) => {
                    if (!fieldErrors.image)
                      e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
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
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImage}
                  className="hidden"
                />
                {fieldErrors.image && (
                  <p className="text-xs text-red-500">{fieldErrors.image}</p>
                )}
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
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none transition-colors ${
                    fieldErrors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
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
                    <option key={l.id || l.id_lieu} value={l.id || l.id_lieu}>
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
                    <option
                      key={c.id || c.id_categorie}
                      value={c.id || c.id_categorie}
                    >
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
                  <option key={o.id_organisateur} value={o.id_organisateur}>
                    {o.nom}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={() => navigate("/admin/evenements")}
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
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
                style={{ backgroundColor: "#F59A1E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d4841a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F59A1E")
                }
              >
                Suivant →
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 : Tickets ── */}
        {step === STEP_TICKETS && (
          <>
            <SectionTitle>Types de tickets</SectionTitle>
            <div className="px-4 sm:px-6 pt-4 pb-6 flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Ajoutez les différents types de tickets pour cet événement.
              </p>

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
                      Ticket {i + 1}
                    </span>
                    {tickets.length > 1 && (
                      <button
                        onClick={() =>
                          setTickets((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                        className="text-red-400 hover:text-red-600 text-lg leading-none"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Libellé du ticket <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VIP, Standard, Gold..."
                      value={ticket.libelle}
                      onChange={(e) =>
                        updateTicket(i, "libelle", e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 transition-colors ${
                        fieldErrors[`ticket_${i}_libelle`]
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200"
                      }`}
                    />
                    {fieldErrors[`ticket_${i}_libelle`] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[`ticket_${i}_libelle`]}
                      </p>
                    )}
                  </div>

                  {/* Prix + Quantité côte à côte sur sm+ */}
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
                        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 transition-colors ${
                          fieldErrors[`ticket_${i}_prix`]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
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
                        min={1}
                        placeholder="Ex: 100"
                        value={ticket.quantite_type_ticket}
                        onChange={(e) =>
                          updateTicket(
                            i,
                            "quantite_type_ticket",
                            e.target.value,
                          )
                        }
                        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 transition-colors ${
                          fieldErrors[`ticket_${i}_qte`]
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200"
                        }`}
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

              {/* Total tickets */}
              <div
                className="rounded-xl p-4 flex items-center justify-between"
                style={{
                  backgroundColor: "#EEF1FB",
                  border: "1px solid #253C96",
                }}
              >
                <span
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: "#253C96" }}
                >
                  Nombre total de tickets
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#253C96" }}
                >
                  {tickets.reduce(
                    (sum, t) => sum + (Number(t.quantite_type_ticket) || 0),
                    0,
                  )}
                </span>
              </div>

              {/* Ajouter un ticket */}
              <button
                onClick={() => setTickets((prev) => [...prev, emptyTicket()])}
                className="w-full py-2.5 border-2 border-dashed rounded-xl text-sm font-medium transition-colors"
                style={{ borderColor: "#253C96", color: "#253C96" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#EEF1FB")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                + Ajouter un autre type de ticket
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={() => setStep(STEP_INFO)}
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
                onClick={handleSubmit}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#F59A1E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d4841a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F59A1E")
                }
              >
                {saving ? "Création..." : "Créer l'événement"}
              </button>
            </div>
          </>
        )}
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
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
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
        className={`border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
