import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentDashboard = ({ user, onLogout, subjects, scores }) => {
  const [activeView, setActiveView] = useState('home');
  const [localSubjects, setLocalSubjects] = useState(subjects);
  const navigate = useNavigate();

  // Sync with localStorage changes from admin dashboard
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setLocalSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Check for localStorage changes every second
  useEffect(() => {
    const interval = setInterval(() => {
      const savedSubjects = localStorage.getItem('subjects');
      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);
        setLocalSubjects(parsedSubjects);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Pagination, sorting, and filtering states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');

  // Score pagination and filtering
  const [scoreCurrentPage, setScoreCurrentPage] = useState(0);
  const [scorePageSize, setScorePageSize] = useState(3);
  const [scoreSortBy, setScoreSortBy] = useState('date');
  const [scoreSortDir, setScoreSortDir] = useState('desc');

  const startQuiz = (subjectId) => {
    navigate(`/quiz/${subjectId}`);
  };

  const getMotivationalMessage = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Outstanding! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent work! Keep it up! 🌟";
    if (percentage >= 70) return "Great job! You're doing well! 👏";
    if (percentage >= 60) return "Good effort! Keep practicing! 💪";
    return "Keep learning and improving! 📚";
  };

  // Filtered and sorted subjects
  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = localSubjects.filter(subject => {
      const nameMatch = !nameFilter || subject.name.toLowerCase().includes(nameFilter.toLowerCase());
      const descMatch = !descriptionFilter || subject.description.toLowerCase().includes(descriptionFilter.toLowerCase());
      return nameMatch && descMatch;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDir === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [localSubjects, nameFilter, descriptionFilter, sortBy, sortDir]);

  // Paginated subjects
  const paginatedSubjects = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredAndSortedSubjects.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedSubjects, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedSubjects.length / pageSize);

  // Sorted and paginated scores
  const sortedAndPaginatedScores = useMemo(() => {
    let sorted = [...scores];
    sorted.sort((a, b) => {
      let aVal, bVal;
      if (scoreSortBy === 'date') {
        aVal = new Date(a.date);
        bVal = new Date(b.date);
      } else if (scoreSortBy === 'percentage') {
        aVal = (a.score / a.total) * 100;
        bVal = (b.score / b.total) * 100;
      } else {
        const subjectA = subjects.find(s => s.id === a.subjectId);
        const subjectB = subjects.find(s => s.id === b.subjectId);
        aVal = subjectA?.name || '';
        bVal = subjectB?.name || '';
      }
      
      if (scoreSortDir === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    const startIndex = scoreCurrentPage * scorePageSize;
    return sorted.slice(startIndex, startIndex + scorePageSize);
  }, [scores, localSubjects, scoreSortBy, scoreSortDir, scoreCurrentPage, scorePageSize]);

  const scoreTotalPages = Math.ceil(scores.length / scorePageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleScorePageChange = (newPage) => {
    setScoreCurrentPage(newPage);
  };

  return (
    <div className="dashboard-container dashboard-student-bg">
      <motion.div 
        className="sidebar"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Student Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            🏠 Home
          </button>
          <button 
            className={`nav-item ${activeView === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveView('quizzes')}
          >
            📝 Available Quizzes
          </button>
          {scores.length > 0 && (
            <button 
              className={`nav-item ${activeView === 'scores' ? 'active' : ''}`}
              onClick={() => setActiveView('scores')}
            >
              📊 View Scores
            </button>
          )}
          <button 
            className="nav-item"
            onClick={onLogout}
          >
            🚪 Logout
          </button>
        </nav>
      </motion.div>

      <div className="main-content">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="welcome-text">Welcome, {user.username} 👋</h1>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </motion.div>

        {activeView === 'home' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '1.5rem', 
              padding: '2rem', 
              marginBottom: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
                🎯 Ready to Challenge Yourself?
              </h2>
              <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Test your knowledge across different subjects. Each quiz is designed to help you learn and improve. 
                Choose a subject below to get started!
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '1rem',
                  textAlign: 'center',
                  minWidth: '120px'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800' }}>{localSubjects.length}</div>
                  <div style={{ fontSize: '0.9rem' }}>Subjects Available</div>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '1rem',
                  textAlign: 'center',
                  minWidth: '120px'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800' }}>{scores.length}</div>
                  <div style={{ fontSize: '0.9rem' }}>Quizzes Completed</div>
                </div>
                {scores.length > 0 && (
                  <div style={{ 
                    background: 'linear-gradient(135deg, #ec4899, #f97316)', 
                    color: 'white', 
                    padding: '1rem', 
                    borderRadius: '1rem',
                    textAlign: 'center',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                      {Math.round(scores.reduce((acc, score) => acc + (score.score / score.total * 100), 0) / scores.length)}%
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>Average Score</div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #e9d5ff, #f5e6d3, #e5e7eb)', padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={nameFilter}
                  onChange={(e) => { setNameFilter(e.target.value); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                />
                <input
                  type="text"
                  placeholder="Filter by description..."
                  value={descriptionFilter}
                  onChange={(e) => { setDescriptionFilter(e.target.value); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                />
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDir(dir);
                    setCurrentPage(0);
                  }}
                  className="form-input"
                  style={{ margin: 0 }}
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="description-asc">Description A-Z</option>
                  <option value="description-desc">Description Z-A</option>
                </select>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                >
                  <option value={2}>2 per page</option>
                  <option value={4}>4 per page</option>
                  <option value={6}>6 per page</option>
                  <option value={8}>8 per page</option>
                </select>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Showing {paginatedSubjects.length} of {filteredAndSortedSubjects.length} subjects
              </div>
            </div>

            <div className="subjects-grid">
              {paginatedSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  className="subject-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-description">{subject.description}</p>
                  <p style={{ color: '#8b5cf6', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {subject.questions.length} questions available
                  </p>
                  <div className="card-actions">
                    <button 
                      className="btn-sm btn-primary-sm"
                      onClick={() => startQuiz(subject.id)}
                      disabled={subject.questions.length === 0}
                    >
                      {subject.questions.length === 0 ? 'No Questions Yet' : 'Start Quiz'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="btn-sm btn-secondary-sm"
                  style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`btn-sm ${currentPage === i ? 'btn-primary-sm' : 'btn-secondary-sm'}`}
                      style={{ minWidth: '40px' }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="btn-sm btn-secondary-sm"
                  style={{ opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeView === 'quizzes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Filter and Sort Controls */}
            <div style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #e9d5ff, #f5e6d3, #e5e7eb)', padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={nameFilter}
                  onChange={(e) => { setNameFilter(e.target.value); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                />
                <input
                  type="text"
                  placeholder="Filter by description..."
                  value={descriptionFilter}
                  onChange={(e) => { setDescriptionFilter(e.target.value); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                />
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDir(dir);
                    setCurrentPage(0);
                  }}
                  className="form-input"
                  style={{ margin: 0 }}
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="description-asc">Description A-Z</option>
                  <option value="description-desc">Description Z-A</option>
                </select>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(0); }}
                  className="form-input"
                  style={{ margin: 0 }}
                >
                  <option value={2}>2 per page</option>
                  <option value={4}>4 per page</option>
                  <option value={6}>6 per page</option>
                  <option value={8}>8 per page</option>
                </select>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Showing {paginatedSubjects.length} of {filteredAndSortedSubjects.length} subjects
              </div>
            </div>

            <div className="subjects-grid">
              {paginatedSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  className="subject-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-description">{subject.description}</p>
                  <p style={{ color: '#8b5cf6', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {subject.questions.length} questions available
                  </p>
                  <div className="card-actions">
                    <button 
                      className="btn-sm btn-primary-sm"
                      onClick={() => startQuiz(subject.id)}
                      disabled={subject.questions.length === 0}
                    >
                      {subject.questions.length === 0 ? 'No Questions Yet' : 'Start Quiz'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="btn-sm btn-secondary-sm"
                  style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`btn-sm ${currentPage === i ? 'btn-primary-sm' : 'btn-secondary-sm'}`}
                      style={{ minWidth: '40px' }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="btn-sm btn-secondary-sm"
                  style={{ opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeView === 'scores' && scores.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '1.5rem', 
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: '#1f2937' }}>
                📊 Your Quiz Results
              </h2>

              {/* Score Sort and Pagination Controls */}
              <div style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #e9d5ff, #f5e6d3, #e5e7eb)', padding: '1.5rem', borderRadius: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <select
                    value={`${scoreSortBy}-${scoreSortDir}`}
                    onChange={(e) => {
                      const [field, dir] = e.target.value.split('-');
                      setScoreSortBy(field);
                      setScoreSortDir(dir);
                      setScoreCurrentPage(0);
                    }}
                    className="form-input"
                    style={{ margin: 0 }}
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="percentage-desc">Highest Score</option>
                    <option value="percentage-asc">Lowest Score</option>
                    <option value="subject-asc">Subject A-Z</option>
                    <option value="subject-desc">Subject Z-A</option>
                  </select>
                  <select
                    value={scorePageSize}
                    onChange={(e) => { setScorePageSize(Number(e.target.value)); setScoreCurrentPage(0); }}
                    className="form-input"
                    style={{ margin: 0 }}
                  >
                    <option value={3}>3 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                  </select>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Showing {sortedAndPaginatedScores.length} of {scores.length} results
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {sortedAndPaginatedScores.map((score, index) => {
                  const percentage = Math.round((score.score / score.total) * 100);
                  const subject = localSubjects.find(s => s.id === score.subjectId);
                  
                  return (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          {subject?.name || 'Unknown Subject'}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          Completed on {new Date(score.date).toLocaleDateString()}
                        </p>
                        <p style={{ color: '#8b5cf6', fontSize: '0.9rem' }}>
                          {getMotivationalMessage(score.score, score.total)}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          fontSize: '2rem', 
                          fontWeight: '800',
                          background: percentage >= 70 ? 'linear-gradient(135deg, #10b981, #059669)' : 
                                     percentage >= 50 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                     'linear-gradient(135deg, #ef4444, #dc2626)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {percentage}%
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                          {score.score}/{score.total} correct
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Score Pagination Controls */}
              {scoreTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  <button
                    onClick={() => handleScorePageChange(scoreCurrentPage - 1)}
                    disabled={scoreCurrentPage === 0}
                    className="btn-sm btn-secondary-sm"
                    style={{ opacity: scoreCurrentPage === 0 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.from({ length: scoreTotalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleScorePageChange(i)}
                        className={`btn-sm ${scoreCurrentPage === i ? 'btn-primary-sm' : 'btn-secondary-sm'}`}
                        style={{ minWidth: '40px' }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleScorePageChange(scoreCurrentPage + 1)}
                    disabled={scoreCurrentPage === scoreTotalPages - 1}
                    className="btn-sm btn-secondary-sm"
                    style={{ opacity: scoreCurrentPage === scoreTotalPages - 1 ? 0.5 : 1 }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;