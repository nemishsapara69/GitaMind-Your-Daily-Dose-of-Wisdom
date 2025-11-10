import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
          setError('You must be logged in to view your orders.');
          setLoading(false);
          navigate('/login'); // Redirect to login if not logged in
          return;
        }

        const response = await api.get('/orders/myorders'); // Fetch user's orders
        setOrders(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching my orders:', err);
        setError(err.response?.data?.message || 'Failed to fetch your orders.');
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [navigate]); // navigate dependency for redirect

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Your Orders...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2em', marginBottom: '20px', color: '#6A1B9A' }}>Your Orders</h2>
        <p style={{ fontSize: '1.2em', color: '#757575', marginBottom: '30px' }}>You haven't placed any orders yet.</p>
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
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#6A1B9A' }}>Your Order History</h2>

      {orders.map((order) => (
        <div key={order.id} style={{
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.8em', marginBottom: '10px', color: '#424242' }}>
            Order #{order._id.substring(order._id.length - 6)} {/* Display last 6 chars of ID for brevity */}
            <span style={{ float: 'right', fontSize: '0.9em', color: '#9E9E9E' }}>
              Placed on: {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </h3>
          <p style={{ fontSize: '1.2em', color: '#6A1B9A', fontWeight: 'bold', marginBottom: '15px' }}>
            Total: ₹{order.totalPrice.toFixed(2)}
            <span style={{ marginLeft: '20px', color: '#4CAF50' }}>Status: {order.orderStatus}</span>
          </p>

          <div style={{ borderTop: '1px dotted #eee', paddingTop: '15px', marginTop: '15px' }}>
            <h4 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#555' }}>Items:</h4>
            {order.orderItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '5px 0', borderBottom: '1px solid #fafafa' }}>
                <img
                  src={item.image || 'https://via.placeholder.com/50?text=No+Image'}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }}
                />
                <Link to={`/products/${item.product}`} style={{ flexGrow: 1, textDecoration: 'none', color: '#424242' }}>
                  {item.name}
                </Link>
                <span style={{ color: '#757575' }}>{item.quantity} x ₹{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px dotted #eee', paddingTop: '15px', marginTop: '15px' }}>
            <h4 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#555' }}>Shipping Address:</h4>
            <p style={{ color: '#757575' }}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <p style={{ color: '#757575' }}>Payment Method: {order.paymentMethod}</p>
          </div>
          <Link to={`/orders/${order.id}`} style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#6A1B9A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '1em',
            transition: 'background-color 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A148C'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A1B9A'}
          >
            View Order Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;