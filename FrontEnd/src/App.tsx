import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./components/shared/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from "./context/ThemeContext";
import { ToastConfig } from "./components/ui/ToastConfig";

function App() {
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <ThemeProvider defaultTheme="dark" defaultColor="blue" storageKey="matchpoint-theme">
                <AuthProvider>
                    <AppRoutes />
                    <ToastConfig />
                </AuthProvider>
            </ThemeProvider>
        </GoogleOAuthProvider>
    )
}

export default App;