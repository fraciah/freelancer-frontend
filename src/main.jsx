import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider.jsx'
import ToasterContext from './components/toasterContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <ToasterContext/>
        <App />
    </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>,
)
