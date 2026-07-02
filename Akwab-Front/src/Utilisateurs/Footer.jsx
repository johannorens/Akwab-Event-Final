import home from "../assets/icones/home-noir.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/ticket-noir.svg"
import profil from "../assets/icones/account_circle.svg"
import { Link } from "react-router-dom"


function Footer() {
    return (
        <footer className="border-t-1 border-t-black text-[#F36B2E] mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-4 gap-8">


                    <div>
                        <h2 className="text-2xl font-bold">
                            Akwab'Event
                        </h2>

                        <p className="text-sm text-gray-600 mt-3">
                            Réservez vos tickets et participez aux meilleurs
                            événements en Côte d'Ivoire.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">
                            Navigation
                        </h3>

                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#253C96] transition">
                                    <img src={home} alt="Accueil" className="w-3 h-3" />
                                    <span>Accueil</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/favoris"
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#253C96] transition">
                                    <img src={favoris} alt="Favoris" className="w-4 h-4" />
                                    <span>Favoris</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/tickets"
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#253C96] transition">
                                    <img src={ticket} alt="Tickets" className="w-3 h-3" />
                                    <span>Mes tickets</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profil"
                                    className="flex items-center gap-2 text-gray-600 hover:text-[#253C96] transition">
                                    <img src={profil} alt="Profil" className="w-4 h-4" />
                                    <span>Mon profil</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">
                            Contact
                        </h3>

                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2 ">
                                <i class="bi bi-envelope-fill text-gray-500"></i>
                                <span>contact@akwab-event.com</span>
                            </li>
                            <li className="flex gap-2 ">
                                <i class="bi bi-telephone-fill text-green-500"></i>
                                +225 07 00 00 00 00
                            </li>
                            <li className="flex gap-2  ">
                                <i class="bi bi-geo-fill text-red-500"></i>
                                Abidjan, Côte d'Ivoire
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">
                            Réseaux sociaux
                        </h3>

                        <div className="flex gap-4 text-2xl">
                            <a href="#">
                                <i class="bi bi-instagram text-pink-500"></i>
                            </a>
                            <a href="#">
                                <i class="bi bi-whatsapp text-green-500"></i>
                            </a>
                            <a href="#">
                                <i class="bi bi-facebook text-blue-500"></i>
                            </a>
                            <a href="#">
                                <i class="bi bi-tiktok text-gray-800"></i>
                            </a>
                        </div>
                    </div> 

                </div>

                <div className="border-t border-white/20 mb-3 mt-8 pt-4 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} Akwab Event. Tous droits réservés.
                </div>

            </div>
        </footer>
    );
}

export default Footer;