import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- ADDED 'Link' here
import api from '../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllOrders = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token || !user.user.roles.includes('admin')) {
        setError('Not authorized. Admin access required.');
        setLoading(false);
        // Optionally redirect to login or a "not authorized" page
        navigate('/login'); // Redirect if not admin
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const response = await api.get('/orders', config); // Fetch ALL orders (admin endpoint)
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching all orders (Admin):', err);
      setError(err.response?.data?.message || 'Failed to fetch all orders.');
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Functions to update order status (e.g., mark as paid/delivered)
  const handleUpdateOrderStatus = async (orderId, statusType) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${statusType}?`)) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      let res;
      if (statusType === 'Paid') {
        res = await api.put(`/orders/${orderId}/pay`, { /* paymentResult details would go here in real app */ id: 'manual_admin_pay', status: 'COMPLETED', update_time: new Date().toISOString(), email_address: user.user.email }, config);
      } else if (statusType === 'Delivered') {
        res = await api.put(`/orders/${orderId}/deliver`, {}, config);
      } else {
        return alert('Invalid status update type.');
      }

      if (res.data.success) {
        alert(`Order ${orderId.substring(orderId.length - 6)} marked as ${statusType}.`);
        fetchAllOrders(); // Re-fetch orders to update the list
      }
    } catch (err) {
      console.error(`Error updating order ${orderId} to ${statusType}:`, err.response?.data || err);
      alert(err.response?.data?.message || `Failed to update order status to ${statusType}.`);
    }
  };


  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading All Orders...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2em', marginBottom: '20px', color: '#6A1B9A' }}>All Orders</h2>
        <p style={{ fontSize: '1.2em', color: '#757575', marginBottom: '30px' }}>No orders found in the system.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5em', color: '#6A1B9A' }}>Admin: All Orders</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
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
              Order ID: #{order._id.substring(order._id.length - 6)}
              <span style={{ float: 'right', fontSize: '0.9em', color: '#9E9E9E' }}>
                User: {order.user ? order.user.username : 'N/A'} ({order.user ? order.user.email : 'N/A'})
              </span>
            </h3>
            <p style={{ fontSize: '1.2em', color: '#6A1B9A', fontWeight: 'bold', marginBottom: '15px' }}>
              Total: ₹{order.totalPrice.toFixed(2)}
              <span style={{ marginLeft: '20px', color: '#4CAF50' }}>Status: {order.orderStatus}</span>
              <span style={{ marginLeft: '20px', color: order.isPaid ? 'green' : 'red' }}>Paid: {order.isPaid ? 'Yes' : 'No'}</span>
              <span style={{ marginLeft: '20px', color: order.isDelivered ? 'green' : 'red' }}>Delivered: {order.isDelivered ? 'Yes' : 'No'}</span>
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
                  <span style={{ flexGrow: 1, color: '#424242' }}>
                    {item.name}
                  </span>
                  <span style={{ color: '#757575' }}>{item.quantity} x ₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dotted #eee', paddingTop: '15px', marginTop: '15px' }}>
              <h4 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#555' }}>Shipping Address:</h4>
              <p style={{ color: '#757575' }}>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              <p style={{ color: '#757575' }}>Payment Method: {order.paymentMethod}</p>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!order.isPaid && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Paid')}
                  style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Mark as Paid
                </button>
              )}
              {!order.isDelivered && (
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                  style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Mark as Delivered
                </button>
              )}
              <Link to={`/orders/${order.id}`} style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#FF9800',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '1em',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FB8C00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
              >
                View Full Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;