import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/providers/AuthProvider'
import { ApiProvider } from '@/providers/ApiProvider'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ApiProvider>
        <App />
        <Toaster position='bottom-center' />
      </ApiProvider>
    </AuthProvider>
  </BrowserRouter>,
)
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <ApiProvider>
//           <App />
//           <Toaster position='bottom-center' />
//         </ApiProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>,
// )
