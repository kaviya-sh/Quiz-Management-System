import React from "react";
import { motion } from "framer-motion";

const QuizList = ({ quizzes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '2rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '1.5rem', 
        color: '#1f2937',
        textAlign: 'center'
      }}>
        Available Subjects
      </h2>
      
      {quizzes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          padding: '2rem',
          fontSize: '1.1rem'
        }}>
          No subjects available yet. Add your first subject above!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                padding: '1.5rem',
                borderLeft: '4px solid #8b5cf6'
              }}
            >
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '0.5rem' 
              }}>
                {quiz.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
                {quiz.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default QuizList;