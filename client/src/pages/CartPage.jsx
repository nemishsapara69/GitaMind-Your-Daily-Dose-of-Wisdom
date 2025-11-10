import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setError('You must be logged in to view your cart.');
        setLoading(false);
        return;
      }

      const response = await api.get('/cart');
      setCart(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []); // Fetch cart on component mount

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId); // If quantity goes to 0 or less, remove it
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await api.put(`/cart/${productId}`, { quantity: newQuantity }, config);
      setCart(res.data.data); // Update cart state with new data
      console.log('Cart item quantity updated:', res.data);
    } catch (err) {
      console.error('Error updating cart quantity:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to update item quantity.');
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await api.delete(`/cart/${productId}`, config);
      setCart(res.data.data); // Update cart state with new data
      console.log('Cart item removed:', res.data);
    } catch (err) {
      console.error('Error removing cart item:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to remove item from cart.');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await api.delete('/cart', config);
      setCart(res.data.data); // Update cart state with empty cart
      console.log('Cart cleared:', res.data);
    } catch (err) {
      console.error('Error clearing cart:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to clear cart.');
    }
  };

  const handleCheckout = () => {
    if (cart && cart.items.length > 0) {
      navigate('/checkout'); // We'll create this page next
    } else {
      alert('Your cart is empty. Please add items before checking out.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Cart...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2em', marginBottom: '20px', color: '#6A1B9A' }}>Your Cart</h2>
        <p style={{ fontSize: '1.2em', color: '#757575', marginBottom: '30px' }}>Your cart is empty.</p>
        <Link to="/products" style={{
          display: 'inline-block',
          padding: '12px 25px',
          backgroundColor: '#FF9800',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          fontSize: '1.1em',
          transition: 'background-color 0.2s ease-in-out'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FB8C00'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
        >
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#6A1B9A' }}>Your Shopping Cart</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '30px' }}>
        {cart.items.map((item) => (
          <div key={item.product.id} style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <img
              src={item.product.images && item.product.images.length > 0 ? item.product.images[0].url : 'https://via.placeholder.com/100?text=No+Image'}
              alt={item.product.name}
              style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '4px' }}
            />
            <div style={{ flexGrow: 1 }}>
              <Link to={`/products/${item.product.id}`} style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#424242', textDecoration: 'none' }}>
                {item.product.name}
              </Link>
              <p style={{ fontSize: '1.1em', color: '#757575' }}>₹{item.price.toFixed(2)} each</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                style={{ background: '#FFC107', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '1.2em' }}
              >-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                style={{ width: '50px', textAlign: 'center', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                min="1"
              />
              <button
                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                style={{ background: '#8BC34A', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '1.2em' }}
              >+</button>
            </div>
            <button
              onClick={() => handleRemoveItem(item.product.id)}
              style={{ background: '#F44336', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 15px', cursor: 'pointer', marginLeft: '10px' }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e0e0e0', paddingTop: '20px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.8em', color: '#333' }}>Total: ₹{cart.totalPrice.toFixed(2)}</h3>
        <div>
          <button
            onClick={handleClearCart}
            style={{
              padding: '12px 25px',
              backgroundColor: '#9E9E9E',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1em',
              cursor: 'pointer',
              marginRight: '15px',
              transition: 'background-color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#757575'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9E9E9E'}
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            style={{
              padding: '12px 25px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1.1em',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;