import React, { useState } from 'react';
import { loginWithGoogle, resetPassword, firebaseStatus } from './firebase-config.js';
import axios from 'axios';

const LoginCard = ({ role, themeColor }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fallback UI if Firebase didn't load properly (e.g. invalid API key)
  if (!firebaseStatus.ok) {
    return (
      <div className="login-container" style={{ position: 'relative', zIndex: 5, '--theme-color': '#ff4444' }}>
        <div className="glass-card" style={{ borderColor: 'rgba(255, 68, 68, 0.4)' }}>
          <h2 style={{ color: '#ff4444' }}>Configuration Error</h2>
          <p style={{ color: '#ffaaaa', fontSize: '0.9rem', marginBottom: '20px' }}>
            Firebase failed to initialize. 
            <br/><br/>
            <strong>Error:</strong> {firebaseStatus.error}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#fff' }}>
            Please check your <code>.env</code> file, restart your Vite dev server, and refresh this page.
          </p>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setMessage('Opening Google Login...');
      
      const firebaseUser = await loginWithGoogle();
      
      setMessage('Authenticating with server...');

      // Ensure we have a fallback if backend URL is missing
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendUrl}/api/auth/google`, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoUrl: firebaseUser.photoURL,
        role: role || 'user'
      });

      if (response.data.user) {
        setMessage('Login Successful! Redirecting...');
      }

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address first to reset password.');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative', zIndex: 5, '--theme-color': themeColor || '#00d4bb' }}>
      <div className="glass-card">
        <h2>{role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'User'} Login</h2>
        
        {message && <p className="status-message" style={{ color: themeColor || '#00d4bb' }}>{message}</p>}

        <form onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
          />
          
          <button className="glass-button submit-btn" disabled={loading}>
            Sign In
          </button>
          
          <div className="login-options">
            <button type="button" className="forgot-btn" onClick={handleForgotPassword} disabled={loading}>
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="divider"><span>OR</span></div>

        <button type="button" className="google-btn glass-button" onClick={handleGoogleLogin} disabled={loading}>
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginCard;
