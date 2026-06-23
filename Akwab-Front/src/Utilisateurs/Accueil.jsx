import ListeCategories from "./Categories/ListeCategories";
import TopBar from "./Categories/TopBar";
import ListeEvenement from "./Evenements/ListeEvenement";
import HeaderLayout from "./HeaderLayout";

function Accueil() {

    
    return (

        <HeaderLayout>
            <TopBar />
            <ListeCategories  />
            <ListeEvenement />
        </HeaderLayout>



    );
}
export default Accueil;