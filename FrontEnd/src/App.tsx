import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "dark");
    }, []);

    return (
        <>
            <AppRoutes />
        </>
    )
}

export default App;