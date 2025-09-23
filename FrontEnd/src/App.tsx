import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./components/shared/AuthProvider";

function App() {

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "dark");
    }, []);

    return (
        <>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </>
    )
}

export default App;