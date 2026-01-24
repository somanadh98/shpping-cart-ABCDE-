const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('token');
}

function handleAuthError() {
  localStorage.removeItem('token');
  window.location.reload();
}

async function handleResponse(response) {
  const data = await response.json();
  
  if (response.status === 401) {
    handleAuthError();
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
}

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  if (!data || !data.token) {
    throw new Error('No token received');
  }

  return data;
};


export const getItems = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/items`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addToCart = async (itemIds) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ item_ids: itemIds }),
  });
  return handleResponse(response);
};

export const getCart = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/carts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const checkout = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const removeFromCart = async (itemId) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/carts/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ item_id: itemId }),
  });
  return handleResponse(response);
};

export const getOrders = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

