package com.examly.springapp.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.service.QuizService;

@RestController
@CrossOrigin(origins="*")
public class QuizController {

    @Autowired
    private QuizService quizService;


    @PostMapping("/api/quizzes")
    public ResponseEntity<Quiz> addquiz(@RequestBody Quiz quiz){
        Quiz savedQuiz = quizService.saveQuiz(quiz);
        return ResponseEntity.ok(savedQuiz);
    }
    @GetMapping("/api/quizzes")
    public ResponseEntity<List<Quiz>> getAllQuizzes(){
        List<Quiz> quizzes=quizService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/api/quizzes/paginated")
    public ResponseEntity<Page<Quiz>> getQuizzesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Quiz> quizzes = quizService.getQuizzesPaginated(pageable, title, description);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/api/quizzes/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id){
        return quizService.getQuizById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/quizzes/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id,@RequestBody Quiz quizDetails){
        return quizService.updateQuiz(id, quizDetails)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/quizzes/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id){
        if (quizService. deleteQuiz(id)) {
            return ResponseEntity.noContent().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

}
