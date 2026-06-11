import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import Login from "./Authentification/Login";
import UtilisateurLayout from "./Utilisateurs/UtilisateurLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/header" element={<UtilisateurLayout />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
