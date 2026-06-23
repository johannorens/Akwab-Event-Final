import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";
import Register from "./Authentification/Register";
import ResetPassword from "./Authentification/ResetPassword";
import ForgotPassword from "./Authentification/ForgotPassword";
import UtilisateurLayout from "./Utilisateurs/UtilisateurLayout";
import PrivateRoute from "./Authentification/PrivateRoute";

import AdminLayout from "./Admin/adminLayout";
import Dashboard from "./Admin/dashboard";

import ListUtilisateur from "./Admin/Utilisateurs/ListUtilisateur";
// import UpdateUtilisateur from "./Admin/Utilisateurs/UpdateUtilisateur";
import ShowUtilisateur from "./Admin/Utilisateurs/ShowUtilisateur";

import ListOrganisateur from "./Admin/Organisateurs/ListOrganisateur";
import ShowOrganisateur from "./Admin/Organisateurs/ShowOrganisateur";
import CreateOrganisateur from "./Admin/Organisateurs/CreateOrganisateur";
import UpdateOrganisateur from "./Admin/Organisateurs/UpdateOrganisateur";
import Accueil from "./Utilisateurs/Accueil";
import Favoris from "./Utilisateurs/Favoris/Favoris";
import TousEvenements from "./Utilisateurs/Evenements/TousEvenements";
import DetailEvenement from "./Utilisateurs/Evenements/DetailEvenement";
import Paiement from "./Utilisateurs/Paiements/Paiement";
import DetailTicket from "./Utilisateurs/Paiements/DetailTicket";
import HistoriqueTicket from "./Utilisateurs/Paiements/HistoriqueTickets";
import DetailCategorie from "./Utilisateurs/Categories/DetailCategorie";
import UpdateProfil from "./Utilisateurs/Profil/UpdateProfil";
import VueProfil from "./Utilisateurs/Profil/VueProfil";

import ListEvenements from "./Admin/Evenements/ListEvenement";
import ShowEvenement from "./Admin/Evenements/ShowEvenement";
import UpdateEvenement from "./Admin/Evenements/UpdateEvenement";
import CreateEvenement from "./Admin/Evenements/CreateEvenement";


import ListTicket from "./Admin/Tickets/ListTickets";
import ShowTicket from "./Admin/Tickets/ShowTicket";

import CreateLieux from "./Admin/Lieux/CreateLieux";
import ListLieux from "./Admin/Lieux/ListLieux";
import ShowLieux from "./Admin/Lieux/ShowLieux";
import UpdateLieux from "./Admin/Lieux/UpdateLieux";

import CreateCategorie from "./Admin/Categories/CreateCategorie";
import ListCategories from "./Admin/Categories/ListCategorie";
import UpdateCategorie from "./Admin/Categories/UpdateCategorie";

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

        {/* <Route path="/utilisateurs/:id/update" element={<UpdateUtilisateur />}/> */}

        {/* Routes protégées */}
          <Route path="/accueil" element={<Accueil />} />

          <Route path="/categorie/:id" element={<DetailCategorie />} />

          <Route path="/evenements" element={<TousEvenements />} />
          <Route path="/evenements/:id" element={<DetailEvenement />} />

          <Route path="/favoris" element={<Favoris />} />

          <Route path="/paiement" element={<Paiement />} />
          <Route path="/ticket/:id" element={<DetailTicket />} />
          <Route path="/tickets" element={<HistoriqueTicket />} />

          <Route path="/profil" element={<VueProfil />} />
          <Route path="/profil/modifier" element={<UpdateProfil />} />


          {/* admin */}
          <Route element={<PrivateRoute />}>
            <Route path="/Admin" element={<AdminLayout />}>
              <Route index path="Dashboard" element={<Dashboard />} />

              <Route path="utilisateurs" element={<ListUtilisateur />} />
              <Route path="utilisateurs/:id" element={<ShowUtilisateur />} />

              <Route path="organisateurs" element={<ListOrganisateur />} />
              <Route
                path="organisateurs/create"
                element={<CreateOrganisateur />}
              />
              <Route path="organisateurs/:id" element={<ShowOrganisateur />} />
              <Route
                path="organisateurs/:id/modifier"
                element={<UpdateOrganisateur />}
              />

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

              <Route path="categories" element={<ListCategories />} />
              <Route path="categories/create" element={<CreateCategorie />} />
              <Route path="categories/:id/edit" element={<UpdateCategorie />} />
            </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
