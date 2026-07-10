import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import OrdersProvider from "./features/orders/context/OrdersProvider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <OrdersProvider>
    <App />
  </OrdersProvider>
</StrictMode>
)
