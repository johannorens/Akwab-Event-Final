export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F0ECF1] flex items-center justify-center px-6 py-10 relative overflow-hidden">
      
      {/* Demi-cercle haut droite */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-300 opacity-40" />
      
      {/* Demi-cercle bas gauche */}
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-purple-300 opacity-40" />

      {/* Contenu de la page */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-5 bg-white rounded-2xl shadow-md px-8 py-10">
        {children}
      </div>
    </div>
  );
}