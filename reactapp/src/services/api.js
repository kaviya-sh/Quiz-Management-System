import axios from "axios";

const API_URL = "https://8081-ebdfdcbdadedffbccbadffdacabc.premiumproject.examly.io/api/quizzes";
const USER_URL = "https://8081-ebdfdcbdadedffbccbadffdacabc.premiumproject.examly.io";

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Quiz CRUD operations
export const getQuizzes = async () => {
  try {
    console.log('Making API call to:', API_URL);
    const response = await axios.get(API_URL);
    console.log('API response status:', response.status);
    console.log('API response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
};

export const addQuiz = async (quiz) => {
  try {
    const response = await axios.post(API_URL, quiz);
    return response.data;
  } catch (error) {
    console.error('Error adding quiz:', error);
    throw error;
  }
};

export const updateQuiz = async (id, quiz) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, quiz);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

export const deleteQuiz = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

export const getQuizById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by id:', error);
    throw error;
  }
};

// User operations
export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${USER_URL}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${USER_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};