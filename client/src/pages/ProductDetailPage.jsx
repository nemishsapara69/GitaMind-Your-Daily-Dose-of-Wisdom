import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching product ${id}:`, err);
        setError(err.response?.data?.message || `Failed to fetch Product`);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!product) return;
      if (!user || !user.token) {
        alert('Please log in to add items to your cart.');
        return;
      }

      if (quantity > product.stock) {
        alert(`Only ${product.stock} items of ${product.name} are available in stock.`);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const res = await api.post('/cart', { productId: product.id, quantity }, config);
      console.log('Item added to cart:', res.data);
      alert(`${quantity} of ${product.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#603900' }}>Loading Product...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '1.2em' }}>Error: {error}</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2em', color: '#757575' }}>Product not found.</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Link to="/products" style={{ position: 'absolute', top: '100px', left: '20px', textDecoration: 'none', color: '#B06500', fontWeight: 'bold', fontSize: '1.1em' }}>
        &larr; Back to Products
      </Link>

      <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px' }}>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          />
        ) : (
          <div style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', marginBottom: '15px' }}>
            No Image
          </div>
        )}
      </div>

      <div style={{ flex: '2', minWidth: '350px' }}>
        <h2 style={{ fontSize: '2.5em', marginBottom: '15px', color: '#B06500' }}>{product.name}</h2>
        <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#B06500', marginBottom: '20px' }}>
          ₹{product.price.toFixed(2)} {/* UPDATED: Rupee symbol */}
        </p>
        <p style={{ fontSize: '1.1em', color: '#603900', lineHeight: '1.8', marginBottom: '25px' }}>
          {product.description}
        </p>
        <p style={{ fontSize: '1em', color: '#555555', marginBottom: '10px' }}>
          <strong>Category:</strong> {product.category ? product.category.name : 'N/A'}
        </p>
        {/* REMOVED: Stock and Featured status line */}
        {/* <p style={{ fontSize: '1em', color: '#555555', marginBottom: '20px' }}>
          <strong>Availability:</strong> {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </p> */}

        {product.stock > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
            <label htmlFor="quantity" style={{ fontSize: '1.1em', color: '#603900', fontWeight: 'bold' }}>Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
              style={{ width: '60px', padding: '8px', borderRadius: '5px', border: '1px solid #FFDDBC', backgroundColor: 'white', color: '#603900', outline: 'none' }}
            />
            <button
              onClick={handleAddToCart}
              style={{
                padding: '12px 25px',
                backgroundColor: '#B06500',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9A5700'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B06500'}
            >
              Add to Cart
            </button>
          </div>
        )}
        {product.stock === 0 && <p style={{ color: '#D32F2F', fontWeight: 'bold', marginTop: '20px', fontSize: '1.1em' }}>This item is currently out of stock.</p>}

      </div>
    </div>
  );
};

export default ProductDetailPage;