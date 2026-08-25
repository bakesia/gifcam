import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@sun-typeface/suit/fonts/variable/woff2/SUIT-Variable.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
