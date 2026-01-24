import { useState, useEffect } from 'react';
import { login, register } from '../api/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      if (isRegisterMode) {
        // Register flow
        await register(username, password);
        setSuccessMessage('Registration successful! Please login.');
        setIsRegisterMode(false);
        setUsername('');
        setPassword('');
      } else {
        // Login flow
        const result = await login(username, password);
        if (result && result.token) {
          localStorage.setItem('token', result.token);
          onLogin(result.token);
        } else {
          setErrorMessage('Invalid username/password');
        }
      }
    } catch (error) {
      if (isRegisterMode) {
        setErrorMessage(error.message || 'Registration failed. Username may already exist.');
      } else {
        setErrorMessage('Invalid username/password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{isRegisterMode ? 'Register' : 'Login'}</h2>
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
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isRegisterMode ? 'Register' : 'Login'}
        </button>
      </form>
      <div style={{ marginTop: '10px' }}>
        {isRegisterMode ? (
          <button 
            type="button" 
            onClick={() => {
              setIsRegisterMode(false);
              setUsername('');
              setPassword('');
            }}
            disabled={isLoading}
          >
            Back to Login
          </button>
        ) : (
          <button 
            type="button" 
            onClick={() => setIsRegisterMode(true)}
            disabled={isLoading}
          >
            Register
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;

