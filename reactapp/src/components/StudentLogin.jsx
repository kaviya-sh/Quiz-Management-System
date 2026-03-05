import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentLogin = ({ onLogin, students }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      onLogin(student, 'student');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="auth-container student-bg" style={{
      backgroundImage: 'url(https://img.freepik.com/free-psd/3d-rendering-questions-background_23-2151455640.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <motion.div 
        className="auth-card floating"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="auth-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Student Portal
        </motion.h1>
        <p className="auth-subtitle">Ready to test your knowledge? 🎓</p>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: '#fee2e2', 
              color: '#dc2626', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              border: '1px solid #fecaca'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button 
            type="submit" 
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>
        </form>

        <div className="auth-link">
          New user? <Link to="/student/signup">Create Account</Link>
        </div>

        <div className="auth-link" style={{ marginTop: '1rem' }}>
          <Link to="/admin/login">Login as Admin instead</Link>
        </div>
        
        <div className="auth-link" style={{ marginTop: '0.5rem' }}>
          <Link to="/welcome">← Back to Welcome</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLogin;