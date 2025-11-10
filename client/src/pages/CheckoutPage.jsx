import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for shipping address (can be pre-filled from user profile later)
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // Default payment method
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          setError('You must be logged in to checkout.');
          setLoading(false);
          return;
        }
        const response = await api.get('/cart');
        const fetchedCart = response.data.data;

        if (!fetchedCart || fetchedCart.items.length === 0) {
          alert('Your cart is empty. Please add items before checking out.');
          navigate('/cart'); // Redirect to cart if empty
          return;
        }
        setCart(fetchedCart);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart for checkout:', err);
        setError(err.response?.data?.message || 'Failed to load cart for checkout.');
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]); // navigate dependency for redirect

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);

    // Basic validation
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      alert('Please fill in all shipping address fields.');
      setPlacingOrder(false);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const orderData = {
        shippingAddress,
        paymentMethod
      };

      const res = await api.post('/orders', orderData, config);
      console.log('Order placed successfully:', res.data);
      alert('Order placed successfully! Redirecting to your orders.');

      // Redirect to order details or user's orders page
      navigate('/myorders'); // We'll create this page next

    } catch (err) {
      console.error('Error placing order:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };


  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading checkout details...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No items in cart for checkout.</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#fdfdfd', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.5em', color: '#6A1B9A' }}>Checkout</h2>

      {/* Order Summary */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.8em', color: '#424242', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Summary</h3>
        {cart.items.map(item => (
          <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dotted #eee' }}>
            <span style={{ fontSize: '1.1em', color: '#555' }}>{item.product.name} ({item.quantity} x ₹{item.price.toFixed(2)})</span>
            <span style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#333' }}>₹{(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.3em', color: '#6A1B9A' }}>
          <span>Total Cart:</span>
          <span>₹{cart.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        {/* Shipping Address */}
        <h3 style={{ fontSize: '1.8em', color: '#424242', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Shipping Address</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
            <input
              type="text" id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              style={inputStyle} required
            />
          </div>
          <div>
            <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City</label>
            <input
              type="text" id="city"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              style={inputStyle} required
            />
          </div>
          <div>
            <label htmlFor="postalCode" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Postal Code</label>
            <input
              type="text" id="postalCode"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
              style={inputStyle} required
            />
          </div>
          <div>
            <label htmlFor="country" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
            <input
              type="text" id="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              style={inputStyle} required
            />
          </div>
        </div>

        {/* Payment Method */}
        <h3 style={{ fontSize: '1.8em', color: '#424242', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Payment Method</h3>
        <div style={{ marginBottom: '30px' }}>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={inputStyle}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Stripe">Stripe (Integration not implemented)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={placingOrder}
          style={{
            display: 'block',
            width: '100%',
            padding: '15px',
            backgroundColor: placingOrder ? '#A5D6A7' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.3em',
            cursor: placingOrder ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease-in-out'
          }}
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: 'calc(100% - 10px)', // Adjust for padding
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1em'
};

export default CheckoutPage;