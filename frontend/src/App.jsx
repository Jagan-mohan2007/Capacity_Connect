import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginCard from './LoginCard.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{color: '#ff4444', padding: '40px', textAlign: 'center', background: '#111', height: '100vh', zIndex: 9999, position: 'relative'}}>
        <h1>Application Error</h1>
        <p>{this.state.error?.toString()}</p>
        <p>Please check the console for details.</p>
      </div>
    );
    return this.props.children;
  }
}

// A simple landing fallback just in case someone hits the root path in React 
// (though index.html handles the main landing)
function EmptyLanding() {
  return <div style={{ display: 'none' }}></div>;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Background styling for the React side */}
          <div className="background-canvas"></div>
          
          <Routes>
            <Route path="/trainer-login" element={<LoginCard role="trainer" themeColor="#00d4bb" />} />
            <Route path="/trainee-login" element={<LoginCard role="trainee" themeColor="#50d0c8" />} />
            <Route path="/admin-login" element={<LoginCard role="admin" themeColor="#f3a14e" />} />
            
            {/* The root path "/" is handled natively by index.html's cinematic intro, 
                so React just stays invisible here until navigation happens. */}
            <Route path="/" element={<EmptyLanding />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
