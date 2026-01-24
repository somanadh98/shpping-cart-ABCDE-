import React, { useState, useEffect } from 'react';
import { getItems, addToCart, removeFromCart } from '../api/api';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.reload();
      return;
    }
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      // Silently fail - items just won't load
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await addToCart([itemId]);
    } catch (error) {
      // Silently fail - user can try again
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      // Silently fail - user can try again
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - ₹{item.price} - {item.status}
            <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
            <button onClick={() => handleRemoveFromCart(item.id)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Items;

