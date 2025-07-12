import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";
import UserLayout from "./components/Layouts/UserLayout";
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetails />} />"
     <Route path="checkout" element={<CheckoutPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
