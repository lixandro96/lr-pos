import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import OrdersProvider from "./features/orders/context/OrdersProvider";
import ProductsProvider from "./features/products/context/ProductsProvider";
import CategoriesProvider from "./features/categories/context/CategoriesProvider";
import ClientsProvider from "./features/clients/context/ClientsProvider";
import UsersProvider from "./features/users/context/UsersProvider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <CategoriesProvider>
      <ProductsProvider>
        <ClientsProvider>
          <UsersProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </UsersProvider>
        </ClientsProvider>
      </ProductsProvider>
    </CategoriesProvider>
    
</StrictMode>
)
