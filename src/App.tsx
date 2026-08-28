/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/AdminLogin';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AccountLayout } from './components/account/AccountLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import AccountDashboard from './pages/account/Dashboard';
import Orders from './pages/account/Orders';
import Profile from './pages/account/Profile';
import Wishlist from './pages/account/Wishlist';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminBlog from './pages/admin/Blog';
import AdminCMS from './pages/admin/CMS';
import PrescriptionUpload from './pages/PrescriptionUpload';
import Consultation from './pages/Consultation';
import Contact from './pages/Contact';
import HealthTools from './pages/HealthTools';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Services from './pages/Services';
import NotFound from './pages/NotFound';
import Categories from './pages/Categories';
import About from './pages/About';
import InfoPage from './pages/InfoPage';
import AIChatWidget from './components/ui/AIChatWidget';

export default function App() {
  const initialize = useAuth((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AIChatWidget />
      <Routes>
        {/* Admin Routes */}
                <Route path="admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="customers" element={<AdminCustomers />} />
        </Route>

        {/* Storefront Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="categories" element={<Categories />} />
          <Route path="about" element={<About />} />
          <Route path="delivery-information" element={<InfoPage />} />
          <Route path="faq" element={<InfoPage />} />
          <Route path="privacy-policy" element={<InfoPage />} />
          <Route path="terms" element={<InfoPage />} />
          <Route path="refund-policy" element={<InfoPage />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="upload-prescription" element={<Navigate to="/prescription" replace />} />
          <Route path="prescription" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />
          <Route path="consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
          <Route path="health-tools" element={<HealthTools />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPost />} />
          <Route path="services" element={<Services />} />
          
          {/* Auth Routes */}
          <Route path="login" element={<AdminLogin />} />
          <Route path="user-login" element={<Login />} />
          <Route path="user-signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Protected Account Routes */}
          <Route path="account" element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

