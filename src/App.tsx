/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AccountLayout } from './components/account/AccountLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import AIChatWidget from './components/ui/AIChatWidget';

// Lazy loaded routes for maximum performance & fast mobile loading (< 3s)
const Login = lazy(() => import('./pages/auth/Login'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const AccountDashboard = lazy(() => import('./pages/account/Dashboard'));
const Orders = lazy(() => import('./pages/account/Orders'));
const Profile = lazy(() => import('./pages/account/Profile'));
const Wishlist = lazy(() => import('./pages/account/Wishlist'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
const AdminBlog = lazy(() => import('./pages/admin/Blog'));
const AdminCMS = lazy(() => import('./pages/admin/CMS'));

const PrescriptionUpload = lazy(() => import('./pages/PrescriptionUpload'));
const Consultation = lazy(() => import('./pages/Consultation'));
const Contact = lazy(() => import('./pages/Contact'));
const HealthTools = lazy(() => import('./pages/HealthTools'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Services = lazy(() => import('./pages/Services'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  const initialize = useAuth((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AIChatWidget />
      <Suspense fallback={<PageLoader />}>
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
            <Route path="payment-information" element={<InfoPage />} />
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
            <Route path="customer-login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* Account Routes */}
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

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
