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
import ScrollToTop from './components/layout/ScrollToTop';

// Core routes imported statically for instant response and zero chunk errors
import PrescriptionUpload from './pages/PrescriptionUpload';
import Consultation from './pages/Consultation';
import AdminLogin from './pages/admin/AdminLogin';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Resilient lazy import that auto-reloads if a chunk fails due to new deployment
function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error: any) {
      const isChunkError = 
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Importing a module script failed') ||
        error?.name === 'ChunkLoadError';

      if (isChunkError && typeof window !== 'undefined') {
        const lastReload = sessionStorage.getItem('chunk_retry_reload');
        if (!lastReload || Date.now() - Number(lastReload) > 10000) {
          sessionStorage.setItem('chunk_retry_reload', String(Date.now()));
          window.location.reload();
          return new Promise(() => {}) as Promise<{ default: T }>;
        }
      }
      throw error;
    }
  });
}

// Lazy loaded secondary routes with auto-retry
const AccountDashboard = lazyWithRetry(() => import('./pages/account/Dashboard'));
const Orders = lazyWithRetry(() => import('./pages/account/Orders'));
const Profile = lazyWithRetry(() => import('./pages/account/Profile'));
const Wishlist = lazyWithRetry(() => import('./pages/account/Wishlist'));

const AdminDashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'));
const AdminOrders = lazyWithRetry(() => import('./pages/admin/Orders'));
const AdminProducts = lazyWithRetry(() => import('./pages/admin/Products'));
const AdminCustomers = lazyWithRetry(() => import('./pages/admin/Customers'));
const AdminBlog = lazyWithRetry(() => import('./pages/admin/Blog'));
const AdminCMS = lazyWithRetry(() => import('./pages/admin/CMS'));
const AIChatWidget = lazy(() => import('./components/ui/AIChatWidget'));

const Contact = lazyWithRetry(() => import('./pages/Contact'));
const HealthTools = lazyWithRetry(() => import('./pages/HealthTools'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'));
const Services = lazyWithRetry(() => import('./pages/Services'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const Categories = lazyWithRetry(() => import('./pages/Categories'));
const About = lazyWithRetry(() => import('./pages/About'));
const InfoPage = lazyWithRetry(() => import('./pages/InfoPage'));

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
      <ScrollToTop />
      <Toaster position="top-center" />
      <Suspense fallback={null}>
        <AIChatWidget />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Dedicated Admin Portal Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="login" element={<AdminLogin />} />
          </Route>
          
          {/* Dedicated Admin Login & Dashboard Aliases */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

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
            <Route path="privacy" element={<InfoPage />} />
            <Route path="terms" element={<InfoPage />} />
            <Route path="terms-and-conditions" element={<InfoPage />} />
            <Route path="terms-of-service" element={<InfoPage />} />
            <Route path="refund-policy" element={<InfoPage />} />
            <Route path="refunds" element={<InfoPage />} />
            <Route path="refund" element={<InfoPage />} />
            <Route path="returns" element={<InfoPage />} />
            <Route path="return-policy" element={<InfoPage />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="checkout/success" element={<CheckoutSuccess />} />
            
            {/* Public Prescription Upload routes & comprehensive aliases */}
            <Route path="prescription" element={<PrescriptionUpload />} />
            <Route path="prescriptions" element={<PrescriptionUpload />} />
            <Route path="upload-prescription" element={<PrescriptionUpload />} />
            <Route path="prescription-upload" element={<PrescriptionUpload />} />
            <Route path="upload_prescription" element={<PrescriptionUpload />} />
            <Route path="prescription_upload" element={<PrescriptionUpload />} />
            <Route path="prescription/upload" element={<PrescriptionUpload />} />
            <Route path="prescription-assistance" element={<PrescriptionUpload />} />
            <Route path="upload" element={<PrescriptionUpload />} />
            <Route path="rx" element={<PrescriptionUpload />} />
            <Route path="rx-upload" element={<PrescriptionUpload />} />
            <Route path="services/prescription" element={<PrescriptionUpload />} />
            <Route path="services/prescriptions" element={<PrescriptionUpload />} />
            <Route path="services/prescription-management" element={<PrescriptionUpload />} />
            <Route path="services/upload-prescription" element={<PrescriptionUpload />} />
            
            {/* Public Telepharmacy Consultation routes & comprehensive aliases */}
            <Route path="consultation" element={<Consultation />} />
            <Route path="consultations" element={<Consultation />} />
            <Route path="telepharmacy" element={<Consultation />} />
            <Route path="telepharmacy-consultation" element={<Consultation />} />
            <Route path="telepharmacy_consultation" element={<Consultation />} />
            <Route path="telepharmacy-consultations" element={<Consultation />} />
            <Route path="tele-pharmacy" element={<Consultation />} />
            <Route path="telepharmacy/consultation" element={<Consultation />} />
            <Route path="consult" element={<Consultation />} />
            <Route path="book-consultation" element={<Consultation />} />
            <Route path="talk-to-a-pharmacist" element={<Consultation />} />
            <Route path="consult-pharmacist" element={<Consultation />} />
            <Route path="services/telepharmacy" element={<Consultation />} />
            <Route path="services/consultation" element={<Consultation />} />
            <Route path="services/telepharmacy-consultation" element={<Consultation />} />
            <Route path="services/telepharmacy-consultations" element={<Consultation />} />
            <Route path="services/holistic-counseling" element={<Consultation />} />
            
            <Route path="health-tools" element={<HealthTools />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="services" element={<Services />} />
            
            {/* Customer Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="customer-login" element={<Login />} />
            <Route path="user-login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="user-signup" element={<Signup />} />
            <Route path="customer-signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* Direct Admin Access - only accessible via /admin or /admin/login */}
            <Route path="admin/login" element={<AdminLogin />} />

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

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
