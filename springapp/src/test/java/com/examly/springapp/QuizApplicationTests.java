package com.examly.springapp;

import com.examly.springapp.controller.QuizController;
import com.examly.springapp.model.Quiz;
import com.examly.springapp.service.QuizService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QuizController.class)
@Import(QuizApplicationTests.TestSecurityConfig.class)
public class QuizApplicationTests {

    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.csrf().disable()
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuizService quizService;

    private ObjectMapper mapper = new ObjectMapper();

    private Quiz quiz1, quiz2;

    @BeforeEach
    void setup() {
        quiz1 = new Quiz("Math Quiz", "Basic math questions");
        quiz1.setId(1L);
        quiz2 = new Quiz("Science Quiz", "Basic science questions");
        quiz2.setId(2L);
    }

    // 1. Model test - getters and setters
    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_testQuizModel() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Test Quiz");
        quiz.setDescription("Test Description");

        assertNull(quiz.getId());
        assertEquals("Test Quiz", quiz.getTitle());
        assertEquals("Test Description", quiz.getDescription());
    }

    // 2. Service layer tests - saveQuiz
    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_testSaveQuizService() {
        Mockito.when(quizService.saveQuiz(Mockito.any(Quiz.class))).thenReturn(quiz1);
        Quiz saved = quizService.saveQuiz(quiz1);
        assertNotNull(saved);
        assertEquals("Math Quiz", saved.getTitle());
    }

    // 3. Service layer tests - getAllQuizzes
    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_testGetAllQuizzesService() {
        List<Quiz> quizzes = Arrays.asList(quiz1, quiz2);
        Mockito.when(quizService.getAllQuizzes()).thenReturn(quizzes);

        List<Quiz> result = quizService.getAllQuizzes();

        assertEquals(2, result.size());
        assertEquals("Science Quiz", result.get(1).getTitle());
    }

    // 4. Controller endpoint - POST /api/quizzes
    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testAddQuizEndpoint() throws Exception {
        Mockito.when(quizService.saveQuiz(Mockito.any(Quiz.class))).thenReturn(quiz1);

        mockMvc.perform(post("/api/quizzes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(quiz1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Math Quiz"))
                .andExpect(jsonPath("$.description").value("Basic math questions"));

        Mockito.verify(quizService, Mockito.times(1)).saveQuiz(Mockito.any(Quiz.class));
    }

    // 5. Controller endpoint - GET /api/quizzes with data
    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testGetAllQuizzesEndpoint() throws Exception {
        List<Quiz> quizzes = Arrays.asList(quiz1, quiz2);
        Mockito.when(quizService.getAllQuizzes()).thenReturn(quizzes);

        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("Math Quiz")))
                .andExpect(jsonPath("$[1].description", is("Basic science questions")));

        Mockito.verify(quizService, Mockito.times(1)).getAllQuizzes();
    }

    // 6. Controller endpoint - GET /api/quizzes with empty list
    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testGetAllQuizzesEndpointEmpty() throws Exception {
        Mockito.when(quizService.getAllQuizzes()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/quizzes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        Mockito.verify(quizService, Mockito.times(1)).getAllQuizzes();
    }

    // --- Additional Test Cases ---

    // 7. POST /api/quizzes with empty title (check accepts empty title)
    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testAddQuizWithEmptyTitle() throws Exception {
        Quiz quiz = new Quiz("", "Description with empty title");
        Mockito.when(quizService.saveQuiz(Mockito.any(Quiz.class))).thenReturn(quiz);

        mockMvc.perform(post("/api/quizzes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(quiz)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(""));

        Mockito.verify(quizService, Mockito.times(1)).saveQuiz(Mockito.any(Quiz.class));
    }

    // 8. POST /api/quizzes with malformed JSON returns HTTP 400 Bad Request
    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testAddQuizMalformedJson() throws Exception {
        String invalidJson = "{\"title\":\"Incomplete Quiz\""; // Missing closing brace

        mockMvc.perform(post("/api/quizzes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());

        Mockito.verify(quizService, Mockito.never()).saveQuiz(Mockito.any(Quiz.class));
    }

   // 9. POST /api/quizzes with null description (check accepts null description)
@Test
void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testAddQuizWithNullDescription() throws Exception {
    Quiz quiz = new Quiz("Null Desc Quiz", null);
    Mockito.when(quizService.saveQuiz(Mockito.any(Quiz.class))).thenReturn(quiz);

    mockMvc.perform(post("/api/quizzes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(quiz)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Null Desc Quiz"))
            .andExpect(jsonPath("$.description").doesNotExist());

    Mockito.verify(quizService, Mockito.times(1)).saveQuiz(Mockito.any(Quiz.class));
}

// 10. GET /api/quizzes returns quizzes with expected fields
@Test
void SpringBoot_DevelopCoreAPIsAndBusinessLogic_testGetAllQuizzesEndpointCheckFields() throws Exception {
    Quiz quiz = new Quiz("History Quiz", "Basic history questions");
    quiz.setId(3L);
    List<Quiz> quizzes = Arrays.asList(quiz);

    Mockito.when(quizService.getAllQuizzes()).thenReturn(quizzes);

    mockMvc.perform(get("/api/quizzes"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id").value(3))
            .andExpect(jsonPath("$[0].title").value("History Quiz"))
            .andExpect(jsonPath("$[0].description").value("Basic history questions"));

    Mockito.verify(quizService, Mockito.times(1)).getAllQuizzes();
}
}
