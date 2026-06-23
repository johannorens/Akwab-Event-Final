import { Outlet } from "react-router-dom";
import HeaderLayout from "./HeaderLayout";

function UtilisateurLayout() {
    return (
        <HeaderLayout>
            <main>
                <Outlet />
            </main>
        </HeaderLayout >
    );

}
export default UtilisateurLayout;