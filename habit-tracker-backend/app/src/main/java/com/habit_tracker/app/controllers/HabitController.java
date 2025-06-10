package com.habit_tracker.app.controllers;

import com.habit_tracker.app.dto.HabitWithStatsDTO;
import com.habit_tracker.app.models.Habit;
import com.habit_tracker.app.models.HabitEntry;
import com.habit_tracker.app.services.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "http://localhost:3000")
public class HabitController {
    @Autowired
    private HabitService habitService;

    @GetMapping
    public List<HabitWithStatsDTO> getAllHabitsWithStats() {
        return habitService.getAllHabitsWithStats();
    }

    @PostMapping
    public Habit addHabit(@RequestBody Habit habit) {
        return habitService.addHabit(habit);
    }

    @PostMapping("/{habitId}/toggle")
    public HabitEntry toggleHabitCompletion(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return habitService.toggleHabitCompletion(habitId, date);
    }

    @GetMapping("/{habitId}/stats")
    public HabitWithStatsDTO getHabitWithStats(@PathVariable Long habitId) {
        return habitService.getHabitWithStats(habitId);
    }
}