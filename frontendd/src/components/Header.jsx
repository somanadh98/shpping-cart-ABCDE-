import { useState, useEffect } from 'react';
import { getCart, checkout, getOrders, logout } from '../api/api';

function Header({ onLogout }) {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cartDetails, setCartDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
    // Clear cart state by dispatching event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleCart = async () => {
    setCartDetails(null);
    setErrorMessage('');
    try {
      const cart = await getCart();
      if (cart.cart_id && cart.items && cart.items.length > 0) {
        setCartDetails(cart);
      } else {
        setErrorMessage('Cart is empty');
      }
    } catch (error) {
      if (error.message === 'Session expired') {
        setErrorMessage('Session expired. Please login again.');
      } else {
        setErrorMessage('Failed to load cart');
      }
    }
  };

  const handleCheckout = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setCartDetails(null);
    try {
      await checkout();
      setSuccessMessage('Order successful');
      // Trigger cart refresh by dispatching custom event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      if (error.message === 'Session expired') {
        setErrorMessage('Session expired. Please login again.');
      } else {
        setErrorMessage('Checkout failed');
      }
    }
  };

  const handleOrderHistory = async () => {
    setOrderHistory(null);
    setErrorMessage('');
    try {
      const orders = await getOrders();
      if (!orders || orders.length === 0) {
        setErrorMessage('No orders found');
        return;
      }
      setOrderHistory(orders.slice(0, 5));
    } catch (error) {
      if (error.message === 'Session expired') {
        setErrorMessage('Session expired. Please login again.');
      } else {
        setErrorMessage('Failed to load orders');
      }
    }
  };

  return (
    <div>
      {successMessage && (
        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleCheckout}>Checkout</button>
        <button onClick={handleCart}>Cart</button>
        <button onClick={handleOrderHistory}>Order History</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {cartDetails && (
        <div style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', color: '#000' }}>
          <h3 style={{ color: '#000' }}>Cart Details (ID: {cartDetails.cart_id})</h3>
          {cartDetails.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: idx < cartDetails.items.length - 1 ? '1px solid #dee2e6' : 'none', color: '#000' }}>
              <div><strong>{item.name}</strong> × {item.quantity}</div>
              <div>Price: ₹{item.price} | Subtotal: ₹{item.subtotal}</div>
            </div>
          ))}
          <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#000' }}>Total: ₹{cartDetails.total}</div>
        </div>
      )}
      {orderHistory && (
        <div style={{ padding: '15px', marginTop: '10px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', color: '#000' }}>
          <h3 style={{ color: '#000' }}>Order History (Last 5 Orders)</h3>
          {orderHistory.map((order, idx) => {
            const date = new Date(order.created_at).toLocaleDateString();
            const orderId = order.order_id || order.id;
            return (
              <div key={idx} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: idx < orderHistory.length - 1 ? '1px solid #dee2e6' : 'none', color: '#000' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000' }}>Order #{orderId} - {date}</div>
                {order.items && order.items.length > 0 ? (
                  <>
                    {order.items.map((item, itemIdx) => (
                      <div key={itemIdx} style={{ marginLeft: '20px', marginBottom: '5px', color: '#000' }}>
                        <div>{item.name} - Quantity: {item.quantity}</div>
                        <div style={{ fontSize: '0.9em', color: '#666' }}>Price: ₹{item.price} | Subtotal: ₹{item.subtotal}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: '5px', fontWeight: 'bold', color: '#000' }}>Order Total: ₹{order.total}</div>
                  </>
                ) : (
                  <div style={{ marginLeft: '20px', color: '#666' }}>No items</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Header;

