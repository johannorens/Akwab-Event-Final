import home from "../assets/icones/home.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/tickets.svg"
import profil from "../assets/icones/account_circle.svg"
import { Link } from "react-router-dom"

function BoutonsNavigation() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#05CDC2] flex justify-around items-center py-3 sm:hidden">
            <Link to="/accueil">
                <img src={home} alt="icone-home" />

            </Link>

            <Link to="/favoris">
                <img src={favoris} alt="icone-favoris" />

            </Link>

            <Link to="/tickets">
                <img src={ticket} alt="icone-ticket" />

            </Link>
            <Link to="/profil">
                <img src={profil} alt="icone-profil" />

            </Link>
        </nav>
    )
}
export default BoutonsNavigation;