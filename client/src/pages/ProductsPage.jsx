import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>Loading Products...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#757575' }}>No products found.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#B06500' }}>Our Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        {products.map((product) => (
          <div key={product.id} style={{
            backgroundColor: 'white',
            border: '1px solid #FFDDBC',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.images[0].alt}
                style={{ maxWidth: '100%', height: '200px', objectFit: 'contain', borderRadius: '4px', marginBottom: '15px' }}
              />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '15px' }}>
                No Image
              </div>
            )}
            <h3 style={{ fontSize: '1.6em', marginBottom: '10px', color: '#603900', flexGrow: 1 }}>
              {product.name}
            </h3>
            <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#B06500', marginBottom: '10px' }}>
              ₹{product.price.toFixed(2)} {/* UPDATED: Rupee symbol */}
            </p>
            <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '15px' }}>
              Category: {product.category ? product.category.name : 'N/A'}
            </p>
            {/* REMOVED: Stock and Featured status line */}
            {/* <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '15px' }}>
              Stock: {product.stock} | Featured: {product.isFeatured ? 'Yes' : 'No'}
            </p> */}

            <Link
              to={`/products/${product.id}`}
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                backgroundColor: '#B06500',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '0.9em',
                textAlign: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9A5700'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B06500'}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;