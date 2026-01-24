import { useState, useEffect } from 'react';
import { getItems, addToCart, removeFromCart, getCart } from '../api/api';

function Items() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.reload();
      return;
    }
    loadItems();
    loadCart();
    
    // Listen for cart update events (e.g., after checkout)
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);



  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      // Silently fail - items just won't load
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      // Silently fail
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await addToCart([itemId]);
      await loadCart();
    } catch (error) {
      // Silently fail - user can try again
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      // Silently fail - user can try again
    }
  };

  const getItemQuantity = (itemId) => {
    if (!cart || !cart.items) return 0;
    const cartItem = cart.items.find(item => item.item_id === itemId || item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div>
      <h2>Items</h2>
      {cart && cart.total !== undefined && (
        <div style={{ color: 'black' }} className='cart-total'>
          <h3>Cart Total: ₹{cart.total}</h3>
        </div>
      )}
      <ul>
        {items.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <li key={item.id}>
              {item.name} - ₹{item.price} - {item.status}
              {quantity > 0 && <span> (In cart: {quantity})</span>}
              <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
              <button onClick={() => handleRemoveFromCart(item.id)}>Remove from Cart</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Items;

