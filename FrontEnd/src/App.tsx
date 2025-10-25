import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./components/shared/AuthProvider";
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "dark");
    }, []);

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    return (
        <>
            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </GoogleOAuthProvider>

            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '16px',
                    },
                }}
            />
        </>
    )
}

export default App;