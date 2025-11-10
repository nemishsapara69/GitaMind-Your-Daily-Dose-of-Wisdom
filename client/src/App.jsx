import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChaptersPage from './pages/ChaptersPage';
import ChapterDetailPage from './pages/ChapterDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductForm from './components/ProductForm';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="chapters" element={<ChaptersPage />} />
        <Route path="chapters/:chapterNumber" element={<ChapterDetailPage />} />
        <Route path="chapters/:chapterNumber/verses/:verseNumber" element={<ChapterDetailPage />} />

        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />


        {/* Protected User Routes */}
        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="myorders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />


        {/* Protected Admin Routes */}
        <Route path="admin/orders" element={<ProtectedRoute requiredRoles={['admin']}><AdminOrdersPage /></ProtectedRoute>} />
        <Route path="orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
        <Route path="admin/products" element={<ProtectedRoute requiredRoles={['admin']}><AdminProductsPage /></ProtectedRoute>} /> {/* <--- ADDED AdminProductsPage route */}
        <Route path="admin/products/add" element={<ProtectedRoute requiredRoles={['admin']}><ProductForm /></ProtectedRoute>} /> {/* <--- ADDED Add Product route */}
        <Route path="admin/products/edit/:id" element={<ProtectedRoute requiredRoles={['admin']}><ProductForm /></ProtectedRoute>} /> {/* <--- ADDED Edit Product route */}


        {/* Fallback for unknown routes */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '50px', color: 'red' }}>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App;