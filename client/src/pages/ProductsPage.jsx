import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Your API client
import { Link } from 'react-router-dom'; // For linking to individual product pages

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); // Fetch all products (public endpoint)
        setProducts(response.data.data); // Assuming backend sends { success, count, data: [...] }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Products...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No products found.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#6A1B9A' }}>Our Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {products.map((product) => (
          <div key={product.id} style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt}
                style={{ maxWidth: '100%', height: '200px', objectFit: 'contain', borderRadius: '4px', marginBottom: '15px' }}
              />
            )}
            <h3 style={{ fontSize: '1.6em', marginBottom: '10px', color: '#424242', flexGrow: 1 }}>
              {product.name}
            </h3>
            <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#6A1B9A', marginBottom: '10px' }}>
              ${product.price.toFixed(2)}
            </p>
            <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '15px' }}>
              Category: {product.category ? product.category.name : 'N/A'}
            </p>
            <Link
              to={`/products/${product.id}`} // Link to individual product detail page
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                backgroundColor: '#FF9800', // A nice orange color
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '0.9em',
                textAlign: 'center',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FB8C00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
            >
              View Details
            </Link>
            {/* You'd add an Add to Cart button here later */}
            {/* <button style={{ marginTop: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add to Cart</button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;