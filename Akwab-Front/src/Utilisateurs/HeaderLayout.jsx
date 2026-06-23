import logo from "../assets/Image/logo.png"
import home from "../assets/icones/home.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/tickets.svg"
import profil from "../assets/icones/account_circle.svg"
import BoutonsNavigation from "./BoutonsNavigation"
import { Link, useNavigate } from "react-router-dom"
import Footer from "./Footer"


function HeaderLayout({ children }) {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    return (
        <header>

            <aside id="logo-sidebar" className="hidden sm:block fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-[#05CDC2] opacity-[80%] ">
                    <Link to="" className="flex items-center ps-2.5 mb-5">
                        <img src={logo} className="w-[200px]" alt="Akwab'Event Logo" />
                    </Link>

                    <ul className="space-y-2 font-medium mt-[50px]">
                        <li>
                            <Link to="/accueil" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={home} alt="icone-home" />
                                <span className="ms-3 text-gray-200 hover:text-purple-900 transition-colors font-bold">Accueil</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/favoris" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={favoris} alt="icone-favoris" />
                                <span className="flex-1 ms-3 text-gray-200 hover:text-purple-900 transition-colors font-bold">Favoris</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tickets" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={ticket} alt="icones-ticket" />
                                <span className="flex-1 ms-3 text-gray-200 hover:text-purple-900 transition-colors font-bold">Tickets</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/profil" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={profil} alt="" />
                                <span className="flex-1 ms-3 text-gray-200 hover:text-purple-900 transition-colors font-bold">Profil</span>
                            </Link>
                        </li>

                        <li className="mt-[150px] bg-[#4D027A] opacity-[80%] rounded-lg border border-2 border-black text-white ">
                            {token ? (

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-1.5 py-2 text-center"
                                >
                                    Se déconnecter
                                </button>

                            ) : (

                                <Link
                                    to="/login"
                                    className="flex items-center px-1.5 py-2"
                                >
                                    <span className="flex-1 text-center">
                                        Se connecter
                                    </span>
                                </Link>

                            )}
                        </li>
                    </ul>
                </div>
            </aside>



            <main className="min-h-screen bg-[#F0ECF1] p-6  sm:ml-64 flex flex-col ">

                <div className="sm:hidden flex  justify-end px-4 pt-4">
                    {token ? (
                        <button onClick={handleLogout} className="px-4 py-2 bg-[#4D027A] text-white text-xs font-semibold rounded-lg shadow-md hover:bg-[#3a0260] transition-colors">
                            Se déconnecter
                        </button>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-[#4D027A] text-white text-xs font-semibold rounded-full shadow-md hover:bg-[#3a0260] transition-colors">
                            Se connecter
                        </Link>
                    )}
                </div>

                {children}


            </main>

            <section className=" bg-[#F0ECF1]  sm:ml-64 flex flex-col ">
                <Footer />

            </section>


            <BoutonsNavigation />

        </header>
    );
}
export default HeaderLayout;