import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import OrdersProvider from "./features/orders/context/OrdersProvider";
import ProductsProvider from "./features/products/context/ProductsProvider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ProductsProvider>
    <OrdersProvider>
      <App />
    </OrdersProvider>
  </ProductsProvider>
</StrictMode>
)
