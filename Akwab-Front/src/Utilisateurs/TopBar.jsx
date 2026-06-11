import locationIcon from "../assets/icones/location_on.svg"

function TopBar() {

    return (
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center px-4 py-2 sm:hidden text-start">
            <div className="mt-4">
                <p className="text-sm ">Localisation</p>
                <div className="flex">
                    <img src={locationIcon} alt="icone_localisation" className="w-[30px]" />
                    <p>Abidjan, civ</p>
                </div>
            </div>
        </div>
    );

}
export default TopBar;  