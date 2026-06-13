import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";
import Register from "./Authentification/Register";
import ResetPassword from "./Authentification/ResetPassword";
import ForgotPassword from "./Authentification/ForgotPassword";
import UtilisateurLayout from "./Utilisateurs/UtilisateurLayout";
import AdminLayout from "./Admin/adminLayout";
import Dashboard from "./Admin/dashboard";
import ListUtilisateur from "./Admin/utilisateurs/ListUtilisateur";
import UpdateUtilisateur from "./Admin/Utilisateurs/UpdateUtilisateur";
import ShowUtilisateur from "./Admin/Utilisateurs/ShowUtilisateur";
import ListOrganisateur from "./Admin/Organisateurs/ListOrganisateur";
import ShowOrganisateur from "./Admin/Organisateurs/ShowOrganisateur";
import CreateOrganisateur from "./Admin/Organisateurs/CreateOrganisateur";
import UpdateOrganisateur from "./Admin/Organisateurs/UpdateOrganisateur";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/header" element={<UtilisateurLayout />} />
        <Route
          path="utilisateurs/:id/modifier"
          element={<UpdateUtilisateur />}
        />
        {/* admin */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="utilisateurs" element={<ListUtilisateur />} />
          <Route path="utilisateurs/:id" element={<ShowUtilisateur />} />
          <Route path="organisateurs" element={<ListOrganisateur />} />
          <Route path="organisateurs/creer" element={<CreateOrganisateur />} />
          <Route path="organisateurs/:id" element={<ShowOrganisateur />} />
          <Route
            path="organisateurs/:id/modifier"
            element={<UpdateOrganisateur />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
