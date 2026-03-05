import React, { useState } from "react";
import { motion } from "framer-motion";

const QuizForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    onAdd({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="quiz-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
        Add New Subject
      </h2>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Subject Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-input"
          placeholder="Subject Description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <motion.button 
        type="submit" 
        className="btn-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Add Subject
      </motion.button>
    </motion.form>
  );
};

export default QuizForm;