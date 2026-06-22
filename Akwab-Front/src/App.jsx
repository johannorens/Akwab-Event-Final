import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";
import Register from "./Authentification/Register";
import ResetPassword from "./Authentification/ResetPassword";
import ForgotPassword from "./Authentification/ForgotPassword";
import UtilisateurLayout from "./Utilisateurs/UtilisateurLayout";

import AdminLayout from "./Admin/adminLayout";
import Dashboard from "./Admin/dashboard";

import ListUtilisateur from "./Admin/Utilisateurs/ListUtilisateur";
import UpdateUtilisateur from "./Admin/Utilisateurs/UpdateUtilisateur";
import ShowUtilisateur from "./Admin/Utilisateurs/ShowUtilisateur";

import ListOrganisateur from "./Admin/Organisateurs/ListOrganisateur";
import ShowOrganisateur from "./Admin/Organisateurs/ShowOrganisateur";
import CreateOrganisateur from "./Admin/Organisateurs/CreateOrganisateur";
import UpdateOrganisateur from "./Admin/Organisateurs/UpdateOrganisateur";

import ListEvenements from "./Admin/Evenements/ListEvenement";
import ShowEvenement from "./Admin/Evenements/ShowEvenement";
import UpdateEvenement from "./Admin/Evenements/UpdateEvenement";
import CreateEvenement from "./Admin/Evenements/CreateEvenement";

import ListTicket from "./Admin/Tickets/ListTickets";
import ShowTicket from "./Admin/Tickets/ShowTicket";

import CreateLieux from "./Admin/Lieux/CreateLieux";
import ListLieux from "./Admin/Lieux/ListLieux";
import ShowLieux  from "./Admin/Lieux/ShowLieux";
import  UpdateLieux from "./Admin/Lieux/UpdateLieux"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/header" element={<UtilisateurLayout />} />

        {/* Utilisateurs */}
        <Route
          path="/utilisateurs/:id/update"
          element={<UpdateUtilisateur />}
        />

        {/* Administration */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Gestion des utilisateurs */}
          <Route path="utilisateurs" element={<ListUtilisateur />} />
          <Route path="utilisateurs/:id" element={<ShowUtilisateur />} />

          {/* Gestion des organisateurs */}
          <Route path="organisateurs" element={<ListOrganisateur />} />
          <Route path="organisateurs/create" element={<CreateOrganisateur />} />
          <Route path="organisateurs/:id" element={<ShowOrganisateur />} />
          <Route
            path="organisateurs/:id/modifier"
            element={<UpdateOrganisateur />}
          />

          {/* Gestion des événements */}
          <Route path="evenements" element={<ListEvenements />} />
          <Route path="evenements/create" element={<CreateEvenement />} />
          <Route path="evenements/:id" element={<ShowEvenement />} />
          <Route path="evenements/:id/edit" element={<UpdateEvenement />} />

           <Route path="lieux" element={<ListLieux />} />
          <Route path="lieux/create" element={<CreateLieux />} />
          <Route path="lieux/:id" element={<ShowLieux />} />
          <Route path="lieux/:id/edit" element={<UpdateLieux />} />


          <Route path="tickets" element={<ListTicket />} />
          <Route path="tickets/:id" element={<ShowTicket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
