import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layouts/userLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";


function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetails />} />" 
        {/* <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
