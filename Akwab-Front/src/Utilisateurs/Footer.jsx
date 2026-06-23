import home from "../assets/icones/home.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/tickets.svg"
import profil from "../assets/icones/account_circle.svg"
import { Link } from "react-router-dom"


function Footer() {
    return (
        <footer className="bg-gray-400 text-white mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-4 gap-8">


                    <div>
                        <h2 className="text-2xl font-bold">
                            Akwab'Event
                        </h2>

                        <p className="text-sm text-gray-300 mt-3">
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
                                    to="/accueil"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#05CDC2] transition">
                                    <img src={home} alt="Accueil" className="w-4 h-4" />
                                    <span>Accueil</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/favoris"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#05CDC2] transition">
                                    <img src={favoris} alt="Favoris" className="w-4 h-4" />
                                    <span>Favoris</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/tickets"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#05CDC2] transition">
                                    <img src={ticket} alt="Tickets" className="w-4 h-4" />
                                    <span>Mes tickets</span>
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profil"
                                    className="flex items-center gap-2 text-gray-300 hover:text-[#05CDC2] transition">
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

                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>
                                📧
                                contact@akwab-event.com
                            </li>
                            <li>
                                📞
                                +225 07 00 00 00 00
                            </li>
                            <li>
                                📍
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
                                📘
                            </a>
                            <a href="#">
                                📸
                            </a>
                            <a href="#">
                                🎵
                            </a>
                            <a href="#"
                            >💼
                            </a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-gray-300">
                    © {new Date().getFullYear()} Akwab Event. Tous droits réservés.
                </div>

            </div>
        </footer>
    );
}

export default Footer;