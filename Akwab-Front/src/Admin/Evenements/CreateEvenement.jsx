import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  const [typesTickets, setTypesTickets] = useState([]);

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
        const [lieuxRes, catsRes, orgsRes, ttRes] = await Promise.all([
          fetch("/api/lieux", { headers }).then((r) => r.json()),
          fetch("/api/categories", { headers }).then((r) => r.json()),
          fetch("/api/organisateurs", { headers }).then((r) => r.json()),
         
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

    const totalTicketsEvenement = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket.quantite_type_ticket) || 0),
      0,
    );

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
      const res = await fetch("/api/evenements", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      console.log("STATUS:", res.status);
      console.log("RESPONSE:", data);
      if (data.success) {
        navigate("/dashboard/evenements");
      } else if (data.errors) {
        setFieldErrors(data.errors);
        setStep(STEP_INFO);
      } else {
        setError(data.message ?? "Erreur lors de la création.");
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            step === STEP_TICKETS
              ? setStep(STEP_INFO)
              : navigate("/dashboard/evenements")
          }
          className="text-gray-400 hover:text-purple-500 transition-colors"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold text-purple-600 tracking-wide">
          Créer un événement
        </h1>
      </div>

      <div className="flex items-center gap-0">
        {[
          { num: 1, label: "Informations" },
          { num: 2, label: "Types de tickets" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s.num
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </div>
              <span
                className={`text-sm font-medium ${
                  step >= s.num ? "text-purple-600" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i === 0 && (
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors ${
                  step > 1 ? "bg-purple-600" : "bg-gray-200"
                }`}
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
        {step === STEP_INFO && (
          <>
            <SectionTitle>Informations de l'événement</SectionTitle>
            <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Image <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                    fieldErrors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
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

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none transition-colors ${
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

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </>
        )}

        {step === STEP_TICKETS && (
          <>
            <SectionTitle>Types de tickets</SectionTitle>
            <div className="px-6 pt-4 pb-6 flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Ajoutez les différents types de tickets pour cet événement.
              </p>

              {tickets.map((ticket, i) => (
                <div
                  key={i}
                  className="border border-purple-100 rounded-xl p-4 bg-purple-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
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

                  {/* Nom du ticket */}
                  <div className="flex flex-col gap-1">
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
                      className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  {/* Prix */}
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
                      className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>

                  {/* Quantité */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Quantité <span className="text-red-400">*</span>
                    </label>

                    <input
                      type="number"
                      min={1}
                      placeholder="Ex: 100"
                      value={ticket.quantite_type_ticket}
                      onChange={(e) =>
                        updateTicket(i, "quantite_type_ticket", e.target.value)
                      }
                      className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                        fieldErrors[`ticket_${i}_qte`]
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    />

                    {fieldErrors[`ticket_${i}_qte`] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[`ticket_${i}_qte`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <div className="border border-teal-200 rounded-xl p-4 bg-teal-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
                  Nombre Total de Ticket
                </span>
                <span className="text-lg font-bold text-teal-700">
                  {tickets.reduce(
                    (sum, t) => sum + (Number(t.quantite_type_ticket) || 0),
                    0,
                  )}
                </span>
              </div>

              <button
                onClick={() => setTickets((prev) => [...prev, emptyTicket()])}
                className="w-full py-2.5 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors"
              >
                + Ajouter un autre type de ticket
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => setStep(STEP_INFO)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-teal-500 text-white text-sm font-semibold rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
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
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
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
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        }`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
