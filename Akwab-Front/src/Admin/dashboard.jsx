import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const stats = [
    { label: "Utilisateurs", value: "05" },
    { label: "Evènements", value: "05" },
    { label: "Gains", value: "100000F" },
    { label: "Lieux", value: "05" },
    { label: "Catégories", value: "05" },
  ];

  const tendances = [
    {
      nom: "Himra Concert",
      organisateur: "1X",
      lieu: "Stade Abidjan",
      tickets: 10000,
    },
    {
      nom: "Himra Concert",
      organisateur: "1X",
      lieu: "Stade Abidjan",
      tickets: 10000,
    },
    {
      nom: "Himra Concert",
      organisateur: "1X",
      lieu: "Stade Abidjan",
      tickets: 10000,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">Bienvenue admin,</p>
          <h1 className="text-3xl font-bold text-purple-600 tracking-wide">
            DASHBOARD
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl cursor-pointer">
          👤
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 px-8 py-5 flex flex-col gap-2 min-w-[160px]"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-purple-500 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tableau tendances */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Evènements en tendance
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
              <th className="pb-3 text-left w-8">#</th>
              <th className="pb-3 text-left">Nom de l'évènement</th>
              <th className="pb-3 text-left">Organisateur</th>
              <th className="pb-3 text-left">Lieu</th>
              <th className="pb-3 text-left">Ticket restant</th>
              <th className="pb-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {tendances.map((e, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 text-purple-500 font-bold">{i + 1}</td>
                <td className="py-3 text-gray-700">{e.nom}</td>
                <td className="py-3 text-gray-500">{e.organisateur}</td>
                <td className="py-3 text-gray-500">{e.lieu}</td>
                <td className="py-3 text-gray-500">{e.tickets}</td>
                <td className="py-3">
                  <button className="text-purple-500 font-semibold hover:underline text-xs">
                    voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
