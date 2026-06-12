import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";
import Register from "./Authentification/Register";
import ResetPassword from "./Authentification/ResetPassword";
import ForgotPassword from "./Authentification/ForgotPassword";
import UtilisateurLayout from "./Utilisateurs/UtilisateurLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/header" element={<UtilisateurLayout />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
