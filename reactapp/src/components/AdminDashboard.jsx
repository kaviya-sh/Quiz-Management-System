import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = ({ user, onLogout, subjects, setSubjects, addSubject, updateSubject, deleteSubject }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const [subjectForm, setSubjectForm] = useState({ name: '', description: '' });
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  // Pagination, sorting, and filtering states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [nameFilter, setNameFilter] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');

  const handleAddSubject = () => {
    console.log('Add subject clicked', subjectForm);
    if (subjectForm.name.trim() && subjectForm.description.trim()) {
      const newSubject = {
        id: Date.now(),
        name: subjectForm.name,
        description: subjectForm.description,
        questions: []
      };
      console.log('Adding new subject:', newSubject);
      
      // Calculate position to insert based on current page
      const insertPosition = (currentPage * pageSize) + paginatedSubjects.length;
      const updatedSubjects = [...subjects];
      updatedSubjects.splice(insertPosition, 0, newSubject);
      
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setSubjectForm({ name: '', description: '' });
      setShowModal(false);
    } else {
      alert('Please fill in both subject name and description.');
    }
  };

  const handleEditSubject = (subject) => {
    setEditingItem(subject);
    setSubjectForm({ name: subject.name, description: subject.description });
    setModalType('editSubject');
    setShowModal(true);
  };

  const handleUpdateSubject = () => {
    console.log('Update subject clicked', subjectForm, editingItem);
    if (subjectForm.name.trim() && subjectForm.description.trim()) {
      const updatedSubjects = subjects.map(s => 
        s.id === editingItem.id 
          ? { ...s, name: subjectForm.name, description: subjectForm.description }
          : s
      );
      console.log('Updating subject:', updatedSubjects);
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      setSubjectForm({ name: '', description: '' });
      setEditingItem(null);
      setShowModal(false);
    } else {
      alert('Please fill in both subject name and description.');
    }
  };

  const handleDeleteSubject = (subjectId) => {
    console.log('Delete subject clicked', subjectId);
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const updatedSubjects = subjects.filter(s => s.id !== subjectId);
      console.log('Deleting subject, remaining:', updatedSubjects);
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    }
  };

  const handleAddQuestion = () => {
    if (questionForm.question.trim() && questionForm.options.every(opt => opt.trim())) {
      const newQuestion = {
        id: Date.now(),
        question: questionForm.question,
        options: questionForm.options,
        correctAnswer: questionForm.correctAnswer
      };
      
      const updatedSubjects = subjects.map(s => 
        s.id === selectedSubject.id 
          ? { ...s, questions: [...(s.questions || []), newQuestion] }
          : s
      );
      
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      
      // Update selectedSubject to reflect the new question
      const updatedSelectedSubject = updatedSubjects.find(s => s.id === selectedSubject.id);
      setSelectedSubject(updatedSelectedSubject);
      
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
      setShowModal(false);
    } else {
      alert('Please fill in the question and all options.');
    }
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedSubjects = subjects.map(s => 
        s.id === selectedSubject.id 
          ? { ...s, questions: (s.questions || []).filter(q => q.id !== questionId) }
          : s
      );
      
      setSubjects(updatedSubjects);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      
      // Update selectedSubject to reflect the deleted question
      const updatedSelectedSubject = updatedSubjects.find(s => s.id === selectedSubject.id);
      setSelectedSubject(updatedSelectedSubject);
    }
  };

  const openModal = (type, item = null) => {
    console.log('Opening modal:', type, item);
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    
    if (type === 'editSubject' && item) {
      setSubjectForm({ name: item.name, description: item.description });
    }
    if (type === 'addQuestion' && selectedSubject) {
      console.log('Selected subject for adding question:', selectedSubject);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setSubjectForm({ name: '', description: '' });
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  };

  // Filtered and sorted subjects
  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = subjects.filter(subject => {
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
  }, [subjects, nameFilter, descriptionFilter, sortBy, sortDir]);

  // Paginated subjects
  const paginatedSubjects = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredAndSortedSubjects.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedSubjects, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedSubjects.length / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };



  return (
    <div className="dashboard-container dashboard-admin-bg">
      <motion.div 
        className="sidebar"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeView === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveView('subjects')}
          >
            📚 Manage Subjects
          </button>
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
          <h1 className="welcome-text">Welcome Admin 👋</h1>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </motion.div>

        {activeView === 'dashboard' && (
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
                  <option value={6}>6 per page</option>
                  <option value={9}>9 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={15}>15 per page</option>
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
                  onClick={() => setSelectedSubject(subject)}
                >
                  <h3 className="subject-name">{subject.name}</h3>
                  <p className="subject-description">{subject.description}</p>
                  <div className="card-actions">
                    <button 
                      className="btn-sm btn-primary-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubject(subject);
                        openModal('addQuestion');
                      }}
                    >
                      Add Question
                    </button>
                    <button 
                      className="btn-sm btn-secondary-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSubject(subject);
                      }}
                    >
                      Edit Subject
                    </button>
                    <button 
                      className="btn-sm btn-danger-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(subject.id);
                      }}
                    >
                      Delete Subject
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {/* Add New Subject button - always visible on every page */}
              <motion.div
                className="subject-card"
                style={{ 
                  border: '2px dashed #8b5cf6', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '200px'
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal('addSubject')}
              >
                <div style={{ textAlign: 'center', color: '#8b5cf6' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>+</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>Add New Subject</div>
                </div>
              </motion.div>
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

        {selectedSubject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedSubject(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">{selectedSubject.name} - Questions</h2>
                <button className="btn-close" onClick={() => setSelectedSubject(null)}>×</button>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <button 
                  className="btn-primary"
                  onClick={() => openModal('addQuestion')}
                  style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
                >
                  Add New Question
                </button>
              </div>

              <div>
                {(selectedSubject.questions || []).map((question, index) => (
                  <div key={question.id} style={{ 
                    background: '#f9fafb', 
                    padding: '1.5rem', 
                    borderRadius: '1rem', 
                    marginBottom: '1rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{ marginBottom: '1rem', color: '#1f2937' }}>
                      Q{index + 1}: {question.question}
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} style={{ 
                          padding: '0.5rem', 
                          background: optIndex === question.correctAnswer ? '#dcfce7' : '#ffffff',
                          border: optIndex === question.correctAnswer ? '2px solid #16a34a' : '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem'
                        }}>
                          {String.fromCharCode(65 + optIndex)}: {option}
                          {optIndex === question.correctAnswer && ' ✓'}
                        </div>
                      ))}
                    </div>
                    <button 
                      className="btn-sm btn-danger-sm"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      Delete Question
                    </button>
                  </div>
                ))}
                
                {(!selectedSubject.questions || selectedSubject.questions.length === 0) && (
                  <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    No questions added yet. Click "Add New Question" to get started.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">
                  {modalType === 'addSubject' ? 'Add New Subject' : 
                   modalType === 'editSubject' ? 'Edit Subject' : 'Add New Question'}
                </h2>
                <button className="btn-close" onClick={closeModal}>×</button>
              </div>

              {(modalType === 'addSubject' || modalType === 'editSubject') && (
                <div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Subject Name"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-input"
                      placeholder="Subject Description"
                      rows="3"
                      value={subjectForm.description}
                      onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                    />
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Form button clicked, modalType:', modalType);
                      if (modalType === 'editSubject') {
                        handleUpdateSubject();
                      } else {
                        handleAddSubject();
                      }
                    }}
                  >
                    {modalType === 'editSubject' ? 'Update Subject' : 'Add Subject'}
                  </button>
                </div>
              )}

              {modalType === 'addQuestion' && (
                <div>
                  <div className="form-group">
                    <textarea
                      className="form-input"
                      placeholder="Question"
                      rows="3"
                      value={questionForm.question}
                      onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                    />
                  </div>
                  
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({...questionForm, options: newOptions});
                        }}
                      />
                    </div>
                  ))}
                  
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Correct Answer:
                    </label>
                    <select
                      className="form-input"
                      value={questionForm.correctAnswer}
                      onChange={(e) => setQuestionForm({...questionForm, correctAnswer: parseInt(e.target.value)})}
                    >
                      {questionForm.options.map((_, index) => (
                        <option key={index} value={index}>
                          Option {String.fromCharCode(65 + index)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    className="btn-primary" 
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Add question button clicked');
                      handleAddQuestion();
                    }}
                  >
                    Add Question
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;