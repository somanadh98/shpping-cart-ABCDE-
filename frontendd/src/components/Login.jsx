import { useState } from 'react';
import { login, register } from '../api/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegisterMode) {
        // Register flow
        await register(username, password);
        window.alert('Registration successful! Please login.');
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
          window.alert('Invalid username/password');
        }
      }
    } catch (error) {
      if (isRegisterMode) {
        window.alert(error.message || 'Registration failed. Username may already exist.');
      } else {
        window.alert('Invalid username/password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{isRegisterMode ? 'Register' : 'Login'}</h2>
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

