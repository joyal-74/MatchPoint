import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./components/shared/AuthProvider";
import { ToastContainer } from "react-toastify";

function App() {

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "dark");
    }, []);

    return (
        <>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>

            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
            />
        </>
    )
}

export default App;