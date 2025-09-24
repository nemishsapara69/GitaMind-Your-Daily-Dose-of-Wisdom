// client/src/App.jsx

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
import ProtectedRoute from './components/ProtectedRoute';


function App() { // Or const App = () => { ... }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<h2 style={{ textAlign: 'center', padding: '50px' }}>Welcome to Gitamind! Home Page content goes here.</h2>} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="chapters" element={<ChaptersPage />} />
        <Route path="chapters/:chapterNumber" element={<ChapterDetailPage />} />

        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* Protected User Routes */}
        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="myorders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />


        {/* Protected Admin Routes */}
        <Route path="admin/orders" element={<ProtectedRoute requiredRoles={['admin']}><AdminOrdersPage /></ProtectedRoute>} />


        {/* Fallback for unknown routes */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '50px', color: 'red' }}>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}

export default App; // <--- THIS LINE IS CRUCIAL AND MUST BE PRESENT EXACTLY LIKE THIS