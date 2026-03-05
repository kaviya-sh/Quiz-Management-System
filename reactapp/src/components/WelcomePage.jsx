import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <motion.div 
        className="welcome-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="welcome-title"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Welcome to Quiz Master
        </motion.h1>
        
        <motion.p 
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Choose your role to get started
        </motion.p>

        <motion.div 
          className="role-cards"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="role-card admin-card"
          >
            <Link to="/admin/login" className="role-link">
              <div className="role-icon">👨‍💼</div>
              <h3 className="role-title">Admin</h3>
              <p className="role-description">
                Manage subjects, create questions, and oversee the quiz system
              </p>
              <div className="role-features">
                <span>✓ Create Subjects</span>
                <span>✓ Add Questions</span>
                <span>✓ Manage Content</span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            className="role-card student-card"
          >
            <Link to="/student/login" className="role-link">
              <div className="role-icon">🎓</div>
              <h3 className="role-title">Student</h3>
              <p className="role-description">
                Take quizzes, track your progress, and improve your knowledge
              </p>
              <div className="role-features">
                <span>✓ Take Quizzes</span>
                <span>✓ View Scores</span>
                <span>✓ Track Progress</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="welcome-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>Ready to test your knowledge? Let's get started! 🚀</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;