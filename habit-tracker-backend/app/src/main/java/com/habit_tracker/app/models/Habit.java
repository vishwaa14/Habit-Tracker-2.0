package com.habit_tracker.app.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "habits")
public class Habit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "target_frequency", nullable = false)
    private Integer targetFrequency = 1; // Daily by default

    // Make user_id nullable for now
    @Column(name = "user_id", nullable = true)
    private Long userId;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<HabitEntry> entries;

    public Habit() {
        this.createdDate = LocalDate.now();
        this.userId = 1L; // Default user ID for development
    }

    public Habit(String name, String description) {
        this.name = name;
        this.description = description;
        this.createdDate = LocalDate.now();
        this.targetFrequency = 1;
        this.userId = 1L; // Default user ID for development
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }

    public Integer getTargetFrequency() { return targetFrequency; }
    public void setTargetFrequency(Integer targetFrequency) { this.targetFrequency = targetFrequency; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<HabitEntry> getEntries() { return entries; }
    public void setEntries(List<HabitEntry> entries) { this.entries = entries; }
}