// import { StrictMode } from 'react'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import { createRoot } from 'react-dom/client'
import '@/styles/main.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { ApiProvider } from '@/providers/ApiProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import App from '@/App.jsx'
import { Toaster } from 'react-hot-toast';
import { Confirmer } from '@/lib/react-hot-confirmation'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <App />
          <Toaster position="bottom-center" />
          <Confirmer />
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>,
  </ThemeProvider>
)

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <ApiProvider>
//           <App />
//           <ToastProvider />
//         </ApiProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>,
// )
