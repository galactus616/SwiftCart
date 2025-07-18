import { Routes, Route } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import HomePage from "./pages/user/HomePage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import CategoryPage from "./pages/user/CategoryPage";
import SearchResultPage from './pages/user/SearchResultPage';
import OrdersPage from "./pages/user/OrdersPage";
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import ScrollToTop from './components/user/ScrollToTop';
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AccountPage from "./pages/user/AccountPage";
import React, { useEffect } from "react";
import useStore from "./store/useStore";

function App() {
  const { fetchProfile } = useStore();
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="product/:productId" element={<ProductDetailsPage />} />
          <Route path="account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
