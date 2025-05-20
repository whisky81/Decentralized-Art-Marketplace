import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PEProvider } from './provider/PEProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PEProvider>
      <App />
    </PEProvider>
  </StrictMode>,
)
