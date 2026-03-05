import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import WelcomePage from "./components/WelcomePage";
import AdminLogin from "./components/AdminLogin";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import QuizView from "./components/QuizView";
import { getQuizzes, addQuiz, updateQuiz, deleteQuiz, getUsers } from "./services/api";
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  // Initialize subjects from localStorage or use defaults
  const getInitialSubjects = () => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      return JSON.parse(savedSubjects);
    }
    return [
      {
        id: 1,
        name: "Mathematics",
        description: "Basic arithmetic and algebra questions",
        questions: [
          {
            id: 1,
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "What is 5 × 3?",
            options: ["12", "15", "18", "20"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "What is 10 ÷ 2?",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "What is 7 + 8?",
            options: ["14", "15", "16", "17"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is 9 - 4?",
            options: ["4", "5", "6", "7"],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 2,
        name: "Science",
        description: "General science and physics questions",
        questions: [
          {
            id: 1,
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "H2SO4"],
            correctAnswer: 0
          },
          {
            id: 2,
            question: "What planet is closest to the Sun?",
            options: ["Venus", "Mercury", "Earth", "Mars"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "What gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "How many bones are in the human body?",
            options: ["196", "206", "216", "226"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is the speed of light?",
            options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
            correctAnswer: 0
          }
        ]
      },
      {
        id: 3,
        name: "History",
        description: "World history and important events",
        questions: [
          {
            id: 1,
            question: "In which year did World War II end?",
            options: ["1944", "1945", "1946", "1947"],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "In which year did the Berlin Wall fall?",
            options: ["1987", "1988", "1989", "1990"],
            correctAnswer: 2
          },
          {
            id: 4,
            question: "Which empire was ruled by Julius Caesar?",
            options: ["Greek Empire", "Roman Empire", "Persian Empire", "Egyptian Empire"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "In which year did the Titanic sink?",
            options: ["1910", "1911", "1912", "1913"],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 4,
        name: "Geography",
        description: "World geography and countries",
        questions: [
          {
            id: 1,
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
          },
          {
            id: 2,
            question: "Which is the largest continent?",
            options: ["Africa", "Asia", "North America", "Europe"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "What is the longest river in the world?",
            options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "Which country has the most time zones?",
            options: ["USA", "Russia", "China", "Canada"],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
            correctAnswer: 1
          }
        ]
      }
    ];
  };

  const [subjects, setSubjects] = useState(getInitialSubjects);
  const [students, setStudents] = useState([]);
  // Initialize scores from localStorage
  const getInitialScores = () => {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
      return JSON.parse(savedScores);
    }
    return [];
  };

  const [scores, setScores] = useState(getInitialScores);

  // Load data from backend and localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    const savedStudents = localStorage.getItem('students');
    const savedSubjects = localStorage.getItem('subjects');
    const savedScores = localStorage.getItem('scores');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    // Subjects already loaded from localStorage in getInitialSubjects
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
    
    // Load subjects and users from backend only if no localStorage data
    if (!savedSubjects) {
      loadSubjects();
    }
    loadUsers();
  }, []);

  // Save subjects to localStorage whenever subjects change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    }
  }, [subjects]);

  // Save scores to localStorage whenever scores change
  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

  // Disabled auto-refresh to preserve localStorage changes
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadSubjects();
  //     loadUsers();
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, []);

  const loadSubjects = async () => {
    try {
      console.log('Fetching subjects from backend...');
      const quizzes = await getQuizzes();
      console.log('Backend response:', quizzes);
      
      if (quizzes && Array.isArray(quizzes)) {
        // Transform backend quiz data to match frontend subject structure
        const backendSubjects = quizzes.map(quiz => ({
          id: quiz.id,
          name: quiz.title,
          description: quiz.description,
          questions: quiz.questions || []
        }));
        
        console.log('Transformed backend subjects:', backendSubjects);
        
        // Add all backend subjects, avoiding duplicates
        setSubjects(prevSubjects => {
          const existingIds = prevSubjects.map(s => s.id);
          const newSubjects = backendSubjects.filter(bs => !existingIds.includes(bs.id));
          
          if (newSubjects.length > 0) {
            console.log('Adding new subjects:', newSubjects);
            return [...prevSubjects, ...newSubjects];
          }
          
          // Also check if any existing subjects need updates
          const updatedSubjects = prevSubjects.map(prevSubject => {
            const backendSubject = backendSubjects.find(bs => bs.id === prevSubject.id);
            return backendSubject || prevSubject;
          });
          
          return updatedSubjects;
        });
      } else {
        console.log('No quizzes received or invalid format');
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      // Keep existing subjects if API fails
    }
  };

  const loadUsers = async () => {
    try {
      const users = await getUsers();
      if (users && users.length > 0) {
        // Transform backend user data to match frontend student structure
        const backendUsers = users.map(user => ({
          id: user.id,
          username: user.username || user.name,
          email: user.email,
          password: user.password
        }));
        
        // Only add new users from backend, keep existing ones
        setStudents(prevStudents => {
          const existingEmails = prevStudents.map(s => s.email);
          const newUsers = backendUsers.filter(bu => !existingEmails.includes(bu.email));
          if (newUsers.length > 0) {
            console.log('New users added from backend:', newUsers);
            const updatedStudents = [...prevStudents, ...newUsers];
            localStorage.setItem('students', JSON.stringify(updatedStudents));
            return updatedStudents;
          }
          return prevStudents;
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Keep existing students if API fails
    }
  };

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  const addStudent = (studentData) => {
    const newStudent = { ...studentData, id: Date.now() };
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  // Backend-synced subject operations
  const addSubjectToBackend = async (subjectData) => {
    try {
      const quizData = {
        title: subjectData.name,
        description: subjectData.description
      };
      await addQuiz(quizData);
      loadSubjects(); // Refresh from backend
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const updateSubjectInBackend = async (id, subjectData) => {
    try {
      const quizData = {
        title: subjectData.name,
        description: subjectData.description
      };
      await updateQuiz(id, quizData);
      loadSubjects(); // Refresh from backend
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const deleteSubjectFromBackend = async (id) => {
    try {
      await deleteQuiz(id);
      loadSubjects(); // Refresh from backend
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const addScore = (scoreData) => {
    const newScore = { ...scoreData, id: Date.now(), date: new Date() };
    const updatedScores = [...scores, newScore];
    setScores(updatedScores);
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  };

  return (
    <Router>
      <motion.div 
        className="App"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/admin/login" element={
            user && userType === 'admin' ? <Navigate to="/admin/dashboard" /> : 
            <AdminLogin onLogin={login} />
          } />
          <Route path="/student/login" element={
            user && userType === 'student' ? <Navigate to="/student/dashboard" /> : 
            <StudentLogin onLogin={login} students={students} />
          } />
          <Route path="/student/signup" element={<StudentSignup onSignup={addStudent} />} />
          <Route path="/admin/dashboard" element={
            user && userType === 'admin' ? 
            <AdminDashboard 
              user={user} 
              onLogout={logout} 
              subjects={subjects} 
              setSubjects={setSubjects}
              addSubject={addSubjectToBackend}
              updateSubject={updateSubjectInBackend}
              deleteSubject={deleteSubjectFromBackend}
            /> : 
            <Navigate to="/admin/login" />
          } />
          <Route path="/student/dashboard" element={
            user && userType === 'student' ? 
            <StudentDashboard user={user} onLogout={logout} subjects={subjects} scores={scores.filter(s => s.studentId === user.id)} /> : 
            <Navigate to="/student/login" />
          } />
          <Route path="/quiz/:subjectId" element={
            user && userType === 'student' ? 
            <QuizView subjects={subjects} user={user} onAddScore={addScore} /> : 
            <Navigate to="/student/login" />
          } />
        </Routes>
      </motion.div>
    </Router>
  );
};

export default App;