import home from "../assets/icones/home.svg"
import favoris from "../assets/icones/favorite.svg"
import ticket from "../assets/icones/tickets.svg"
import profil from "../assets/icones/account_circle.svg"

function BoutonsNavigation() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#05CDC2] flex justify-around items-center py-3 sm:hidden">
            <img src={home} alt="" />
            <img src={favoris} alt="" />
            <img src={ticket} alt="" />
            <img src={profil} alt="" />
        </nav>
    )
}
export default BoutonsNavigation;