package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz,Long>, JpaSpecificationExecutor<Quiz> {
    
}
