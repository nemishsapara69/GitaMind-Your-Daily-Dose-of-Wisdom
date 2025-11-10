import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        setError('Not authorized. Please login.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      const response = await api.get(`/orders/${orderId}`, config);
      setOrder(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, navigate]);

  // Function to update order status (admin only)
  const handleUpdateOrderStatus = async (statusType) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${statusType}?`)) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      let res;
      if (statusType === 'Paid') {
        res = await api.put(`/orders/${orderId}/pay`, { 
          id: 'manual_admin_pay', 
          status: 'COMPLETED', 
          update_time: new Date().toISOString(), 
          email_address: user.user.email 
        }, config);
      } else if (statusType === 'Delivered') {
        res = await api.put(`/orders/${orderId}/deliver`, {}, config);
      } else {
        return alert('Invalid status update type.');
      }

      if (res.data.success) {
        alert(`Order marked as ${statusType}.`);
        fetchOrderDetails(); // Re-fetch order to update details
      }
    } catch (err) {
      console.error(`Error updating order to ${statusType}:`, err.response?.data || err);
      alert(err.response?.data?.message || `Failed to update order status to ${statusType}.`);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Order Details...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!order) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Order not found.</div>;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.user.roles && user.user.roles.includes('admin');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px', 
          fontSize: '2.5em', 
          color: '#6A1B9A' 
        }}>
          Order Details
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div>
            <h3 style={{ color: '#424242', marginBottom: '10px' }}>Order Information</h3>
            <p><strong>Order ID:</strong> #{order._id.substring(order._id.length - 6)}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}</p>
            <p><strong>Status:</strong> 
              <span style={{ 
                color: order.orderStatus === 'Delivered' ? '#4CAF50' : '#FF9800',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {order.orderStatus}
              </span>
            </p>
            <p><strong>Payment Status:</strong> 
              <span style={{ 
                color: order.isPaid ? '#4CAF50' : '#f44336',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>
            </p>
            <p><strong>Delivery Status:</strong> 
              <span style={{ 
                color: order.isDelivered ? '#4CAF50' : '#f44336',
                fontWeight: 'bold',
                marginLeft: '5px'
              }}>
                {order.isDelivered ? 'Delivered' : 'Not Delivered'}
              </span>
            </p>
            {order.deliveredAt && (
              <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
            )}
          </div>

          <div>
            <h3 style={{ color: '#424242', marginBottom: '10px' }}>Customer Information</h3>
            <p><strong>User:</strong> {order.user ? order.user.username : 'N/A'}</p>
            <p><strong>Email:</strong> {order.user ? order.user.email : 'N/A'}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#424242', marginBottom: '15px' }}>Shipping Address</h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#424242', marginBottom: '15px' }}>Order Items</h3>
          <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', overflow: 'hidden' }}>
            {order.orderItems.map((item, index) => (
              <div key={item.product} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                borderBottom: index < order.orderItems.length - 1 ? '1px solid #e9ecef' : 'none',
                backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
              }}>
                <img
                  src={item.image || 'https://via.placeholder.com/80?text=No+Image'}
                  alt={item.name}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    objectFit: 'contain', 
                    borderRadius: '8px',
                    marginRight: '15px'
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#424242' }}>{item.name}</h4>
                  <p style={{ margin: '0', color: '#757575' }}>
                    Quantity: {item.quantity} × ₹{item.price.toFixed(2)} = ₹{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#424242', marginBottom: '15px' }}>Admin Actions</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {!order.isPaid && (
                <button
                  onClick={() => handleUpdateOrderStatus('Paid')}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#2196F3', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontSize: '1em'
                  }}
                >
                  Mark as Paid
                </button>
              )}
              {!order.isDelivered && (
                <button
                  onClick={() => handleUpdateOrderStatus('Delivered')}
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontSize: '1em'
                  }}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;