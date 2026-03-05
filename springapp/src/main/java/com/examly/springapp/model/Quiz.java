package com.examly.springapp.model;


import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;


@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Quiz {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Title cannot be empty")
    private String title;

    @NotBlank(message="Description cannot be empty")
    private String description;

    public Quiz() {

    }
    
    public Quiz(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    public Quiz (String title, String description) {
        this.title = title;
        this.description = description;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
