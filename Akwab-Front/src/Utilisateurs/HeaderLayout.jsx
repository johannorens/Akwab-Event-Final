import logo from "../assets/Image/logo.png"
import home from "../assets/icones/home.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/tickets.svg"
import profil from "../assets/icones/account_circle.svg"
import BoutonsNavigation from "./BoutonsNavigation"
import TopBar from "./TopBar"


function HeaderLayout({ children }) {
    return (
        <header>

            <aside id="logo-sidebar" className="hidden sm:block fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-[#05CDC2] opacity-[80%] ">
                    <a href="https://flowbite.com/" className="flex items-center ps-2.5 mb-5">
                        <img src={logo} className="w-[200px]" alt="Flowbite Logo" />
                    </a>

                    <ul className="space-y-2 font-medium mt-[50px]">
                        <li>
                            <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={home} alt="icone-home" />
                                <span className="ms-3 text-black font-bold">Accueil</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={favoris} alt="icone-favoris" />
                                <span className="flex-1 ms-3 text-black font-bold">Favoris</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={ticket} alt="icones-ticket" />
                                <span className="flex-1 ms-3 text-black font-bold">Tickets</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <img src={profil} alt="" />
                                <span className="flex-1 ms-3 text-black font-bold">Profil</span>
                            </a>
                        </li>

                        <li className="mt-[150px] bg-[#4D027A] opacity-[80%] rounded-lg border border-2 border-black text-white ">
                            <a href="#" className="flex items-center px-1.5 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group">
                                <span className="flex-1 ms-3 text-center">Se connecter</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <TopBar/>

            <main className="min-h-screen p-6 mt-20 sm:ml-64 flex flex-col items-center text-center">
                {children}
            </main>

            <BoutonsNavigation/>

        </header>
    );
}
export default HeaderLayout;