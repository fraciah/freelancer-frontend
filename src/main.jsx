import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider.jsx'
import ToasterContext from './components/toasterContext.jsx'
import { ChatProvider } from './providers/ChatProvider.jsx'
import { OrderProvider } from './providers/OrderProvider.jsx'
import { NotificationProvider } from './providers/NotificationProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <OrderProvider>
      <ChatProvider>
    <NotificationProvider>
    <ToasterContext/>
        <App />
    </NotificationProvider>
    </ChatProvider>
    </OrderProvider>
    </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>,
)
