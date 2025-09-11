import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './presentation/styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from './app/providers/ThemeProvider.tsx'
import { Provider } from 'react-redux'
import { store } from './state/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
