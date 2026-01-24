import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Items from './components/Items';
import Header from './components/Header';
import './styles.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    } else {
      setToken(null);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header onLogout={handleLogout} />
      <Items />
    </div>
  );
}

export default App;

