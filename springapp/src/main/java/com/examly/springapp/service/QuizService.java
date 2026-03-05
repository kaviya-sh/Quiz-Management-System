package com.examly.springapp.service;
import com.examly.springapp.model.Quiz;
import com.examly.springapp.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;


@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;
    
    public Quiz saveQuiz(Quiz quiz){
        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes(){
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById (Long id) {
        return quizRepository.findById(id);
    }

    public Optional<Quiz> updateQuiz(Long id, Quiz quizDetails){
           return quizRepository.findById(id).map(quiz-> {
            quiz.setTitle(quizDetails.getTitle());
            quiz.setDescription(quizDetails.getDescription());
            return quizRepository.save(quiz);
        });
    }

    public boolean deleteQuiz(Long id){
        return quizRepository.findById(id).map( quiz ->{
            quizRepository.delete(quiz);
            return true;
        }).orElse(false);

    }

    public Page<Quiz> getQuizzesPaginated(Pageable pageable, String title, String description) {
        Specification<Quiz> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (title != null && !title.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")), 
                    "%" + title.toLowerCase() + "%"
                ));
            }
            
            if (description != null && !description.isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")), 
                    "%" + description.toLowerCase() + "%"
                ));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        return quizRepository.findAll(spec, pageable);
    }
}