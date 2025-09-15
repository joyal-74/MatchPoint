import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../presentation/styles/index.css'
import App from './App.tsx'
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './providers/ThemeProvider.tsx'
import { Provider } from 'react-redux'
import { store } from '../presentation/store/store.ts'
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
)