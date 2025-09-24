import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom'; // For nested routes

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet /> {/* This is where nested routes will render */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;