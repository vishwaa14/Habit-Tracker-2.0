package com.habit_tracker.app.dto;

import com.habit_tracker.app.models.Habit;
import java.time.LocalDate;
import java.util.Map;

public class HabitWithStatsDTO {
    private Habit habit;
    private Integer currentStreak;
    private Integer longestStreak;
    private Double completionRate;
    private Map<LocalDate, Boolean> monthlyCompletions;
    private Integer totalCompletions;

    public HabitWithStatsDTO() {}

    public HabitWithStatsDTO(Habit habit, Integer currentStreak, Integer longestStreak, 
                           Double completionRate, Map<LocalDate, Boolean> monthlyCompletions, 
                           Integer totalCompletions) {
        this.habit = habit;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.completionRate = completionRate;
        this.monthlyCompletions = monthlyCompletions;
        this.totalCompletions = totalCompletions;
    }

    // Getters and Setters
    public Habit getHabit() { return habit; }
    public void setHabit(Habit habit) { this.habit = habit; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }

    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }

    public Map<LocalDate, Boolean> getMonthlyCompletions() { return monthlyCompletions; }
    public void setMonthlyCompletions(Map<LocalDate, Boolean> monthlyCompletions) { this.monthlyCompletions = monthlyCompletions; }

    public Integer getTotalCompletions() { return totalCompletions; }
    public void setTotalCompletions(Integer totalCompletions) { this.totalCompletions = totalCompletions; }
}