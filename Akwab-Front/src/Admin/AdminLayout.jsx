import { Link, useNavigate, Outlet } from "react-router-dom";
import logo from "../assets/Image/logo.png";

function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F0ECF1]">
      {/* Sidebar */}
      <aside className="w-40 bg-teal-400 flex flex-col items-center py-8 gap-8 fixed h-full">
        <img src={logo} alt="Akwab Event" className="w-16" />

        <nav className="flex flex-col items-center gap-6 w-full mt-4">
          {[
            { label: "Utilisateurs", path: "/dashboard/utilisateurs" },
            { label: "Evènements", path: "/dashboard/evenements" },
            { label: "Catégories", path: "/dashboard/categories" },
            { label: "Lieu", path: "/dashboard/lieux" },
            { label: "Gains", path: "/dashboard/gains" },
            { label: "Evènement en tendance", path: "/dashboard" },
          ].map(item => (
            <Link key={item.path} to={item.path}
              className="text-white text-sm font-medium hover:text-purple-900 transition-colors text-center px-2">
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout}
          className="mt-auto mb-4 w-28 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-all">
          Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="ml-40 flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default  AdminLayout;