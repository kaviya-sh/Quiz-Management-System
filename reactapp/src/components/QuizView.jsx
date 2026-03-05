import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const QuizView = ({ subjects, user, onAddScore }) => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const subject = subjects.find(s => s.id === parseInt(subjectId));

  useEffect(() => {
    if (!subject || subject.questions.length === 0) {
      navigate('/student/dashboard');
    }
  }, [subject, navigate]);

  if (!subject) return null;

  const currentQuestion = subject.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === subject.questions.length - 1;
  const hasAnswered = selectedAnswers[currentQuestion?.id] !== undefined;

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    subject.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setShowResults(true);

    // Add score to student's records
    onAddScore({
      studentId: user.id,
      subjectId: subject.id,
      score: correctAnswers,
      total: subject.questions.length
    });
  };

  const getMotivationalMessage = () => {
    const percentage = (score / subject.questions.length) * 100;
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent work! Keep it up! 🌟";
    if (percentage >= 70) return "Great job! You're doing well! 👏";
    if (percentage >= 60) return "Good effort! Keep practicing! 💪";
    return "Keep learning and improving! 📚";
  };

  const handleBackToDashboard = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="quiz-container dashboard-student-bg">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="quiz"
            className="quiz-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                {subject.name} Quiz
              </h1>
              <button 
                onClick={() => navigate('/student/dashboard')}
                style={{
                  background: 'none',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontWeight: '500'
                }}
              >
                Exit Quiz
              </button>
            </div>

            <div className="question-number">
              Question {currentQuestionIndex + 1} of {subject.questions.length}
            </div>

            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="question-text">{currentQuestion.question}</h2>

              <ul className="options-list">
                {currentQuestion.options.map((option, index) => (
                  <motion.li 
                    key={index} 
                    className="option-item"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label 
                      className="option-label"
                      style={{
                        borderColor: selectedAnswers[currentQuestion.id] === index ? '#8b5cf6' : '#e5e7eb',
                        background: selectedAnswers[currentQuestion.id] === index ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={selectedAnswers[currentQuestion.id] === index}
                        onChange={() => handleAnswerSelect(index)}
                        className="option-input"
                      />
                      <span>{String.fromCharCode(65 + index)}. {option}</span>
                    </label>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <div className="quiz-actions">
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {Object.keys(selectedAnswers).length} of {subject.questions.length} answered
              </div>
              <motion.button
                className="btn-next"
                onClick={handleNext}
                disabled={!hasAnswered}
                whileHover={hasAnswered ? { scale: 1.05 } : {}}
                whileTap={hasAnswered ? { scale: 0.95 } : {}}
              >
                {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: '#e5e7eb', 
              borderRadius: '4px', 
              marginTop: '2rem',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  borderRadius: '4px'
                }}
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentQuestionIndex + 1) / subject.questions.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="quiz-card results-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
                Quiz Complete! 🎉
              </h1>
              
              <motion.div
                className="score-display"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                {Math.round((score / subject.questions.length) * 100)}%
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>
                  You scored {score} out of {subject.questions.length} questions correctly
                </p>
                
                <p className="motivational-message">
                  {getMotivationalMessage()}
                </p>
              </motion.div>

              <motion.div
                style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <button
                  className="btn-primary"
                  onClick={handleBackToDashboard}
                  style={{ width: 'auto', padding: '1rem 2rem' }}
                >
                  Back to Dashboard
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswers({});
                    setShowResults(false);
                    setScore(0);
                  }}
                  style={{ 
                    width: 'auto', 
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)'
                  }}
                >
                  Retake Quiz
                </button>
              </motion.div>
            </motion.div>

            {/* Confetti-like animation */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    borderRadius: '50%',
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    rotate: 360,
                    y: [0, -100, 100]
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizView;