import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const fetchProducts = async () => {
    if (!user || !isAdmin) {
      setError('Not authorized. Admin access required.');
      setLoading(false);
      // navigate('/login'); // ProtectedRoute will handle this primary redirect
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const response = await api.get('/products', config); // Fetch all products (admin protected)
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products (Admin):', err);
      setError(err.response?.data?.message || 'Failed to fetch products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, isAdmin, navigate]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      await api.delete(`/products/${productId}`, config); // DELETE /api/products/:id
      alert('Product deleted successfully!');
      fetchProducts(); // Re-fetch products to update the list
    } catch (err) {
      console.error('Error deleting product:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>Loading Products...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#B06500' }}>Admin: Manage Products</h2>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <Link to="/admin/products/add" style={{
          padding: '12px 25px',
          backgroundColor: '#4CAF50', // Green for Add button
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1em',
          fontWeight: 'bold',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#757575' }}>No products found. Add a new product to get started.</div>
      ) : (
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
              <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '5px' }}>
                Category: {product.category ? product.category.name : 'N/A'}
              </p>
              <p style={{ fontSize: '0.9em', color: '#757575', marginBottom: '15px' }}>
                Stock: {product.stock} {/* REMOVED: | Featured: {product.isFeatured ? 'Yes' : 'No'} */}
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    backgroundColor: '#FF6F00',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9em',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E66100'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6F00'}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    backgroundColor: '#D32F2F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9em',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B71C1C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D32F2F'}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;