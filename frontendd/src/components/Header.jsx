import { getCart, checkout, getOrders } from '../api/api';

function Header({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
    window.location.reload();
  };

  const handleCart = async () => {
    try {
      const cart = await getCart();
      if (cart.cart_id && cart.items && cart.items.length > 0) {
        let message = `Cart ID: ${cart.cart_id}\n\nItems:\n`;
        cart.items.forEach((item) => {
          message += `${item.name} × ${item.quantity}\n`;
          message += `Price: ₹${item.price}\n`;
          message += `Subtotal: ₹${item.subtotal}\n\n`;
        });
        message += `Total: ₹${cart.total}`;
        window.alert(message);
      } else {
        window.alert('Cart is empty');
      }
    } catch (error) {
      if (error.message === 'Session expired') {
        window.alert('Session expired. Please login again.');
      } else {
        window.alert('Failed to load cart');
      }
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      window.alert('Order successful');
      window.location.reload();
    } catch (error) {
      if (error.message === 'Session expired') {
        window.alert('Session expired. Please login again.');
      } else {
        window.alert('Checkout failed');
      }
    }
  };

  const handleOrderHistory = async () => {
    try {
      const orders = await getOrders();
      if (!orders || orders.length === 0) {
        window.alert('No orders found');
        return;
      }
      
      // Show last 5 orders
      const last5Orders = orders.slice(0, 5);
      
      let message = 'Order History (Last 5 Orders):\n\n';
      message += '='.repeat(50) + '\n\n';
      
      last5Orders.forEach((order, index) => {
        const date = new Date(order.created_at).toLocaleDateString();
        const orderId = order.order_id || order.id;
        message += `Order #${orderId} - ${date}\n`;
        message += '-'.repeat(50) + '\n';
        
        if (order.items && order.items.length > 0) {
          order.items.forEach((item) => {
            message += `  ${item.name}\n`;
            message += `    Quantity: ${item.quantity}\n`;
            message += `    Price: ₹${item.price}\n`;
            message += `    Subtotal: ₹${item.subtotal}\n\n`;
          });
          message += `  Order Total: ₹${order.total}\n`;
        } else {
          message += '  No items\n';
        }
        
        if (index < last5Orders.length - 1) {
          message += '\n' + '='.repeat(50) + '\n\n';
        }
      });
      
      window.alert(message);
    } catch (error) {
      if (error.message === 'Session expired') {
        window.alert('Session expired. Please login again.');
      } else {
        window.alert('Failed to load orders');
      }
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
      <button onClick={handleCart}>Cart</button>
      <button onClick={handleOrderHistory}>Order History</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Header;

