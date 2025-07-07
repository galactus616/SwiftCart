import { createBrowserRouter } from "react-router-dom";
import App from "../App"; // মূল App কম্পোনেন্ট (Contexts এর জন্য)
import Layout from "../components/Layout"; // Navbar/Footer সহ Layout

// সব পেজ ইম্পোর্ট করুন
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderConfirmationPage from "../pages/OrderConfirmationPage";
import CategoryProductsPage from "../pages/CategoryProductsPage";
import UserDashboardPage from "../pages/UserDashboardPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import NoPageFound from "../pages/NoPageFound";
import ProductDetails from './../components/ProductDetails';
import ProductDetailsPage from "./../components/ProductDetails";
import CategoriesPage from './../pages/CategoriesPage';


// রাউটার কনফিগারেশন
export const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App কম্পোনেন্ট Contexts প্রদান করবে
    errorElement: <NoPageFound />,
    children: [
      // Layout সহ পেজ (যেগুলোতে Navbar/Footer থাকবে)
      {
        element: <Layout />,
        children: [
          {
            index: true, // ডিফল্ট পেজ (path: "/")
            element: <HomePage />,
          },
          {
            path:'categories',
            element:<CategoriesPage/>
          },

          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "order-confirmation",
            element: <OrderConfirmationPage />,
          },
          {
            path: "dashboard",
            element: <UserDashboardPage />,
          },
          {
            path: "order-history",
            element: <OrderHistoryPage />,
          },
          {
            // ডায়নামিক রাউট: প্রোডাক্ট আইডি দিয়ে
            path: "product/:id",
            element: <ProductDetailsPage />,
          },
          {
            // ডায়নামিক রাউট: প্রোডাক্ট আইডি দিয়ে
            path: "product/details",
            element: <ProductDetails/>,
          },
          {
            // ডায়নামিক রাউট: ক্যাটাগরি নাম দিয়ে
            path: "category/:categoryName",
            element: <CategoryProductsPage />,
          },
        ],
      },
      // Layout ছাড়া পেজ (যেগুলোতে Navbar/Footer থাকবে না)
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);
