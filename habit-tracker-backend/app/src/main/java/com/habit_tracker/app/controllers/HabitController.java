package com.habit_tracker.app.controllers;

import com.habit_tracker.app.dto.HabitWithStatsDTO;
import com.habit_tracker.app.models.Habit;
import com.habit_tracker.app.models.HabitEntry;
import com.habit_tracker.app.models.User;
import com.habit_tracker.app.repositories.UserRepository;
import com.habit_tracker.app.security.services.UserPrincipal;
import com.habit_tracker.app.services.HabitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@CrossOrigin(origins = "http://localhost:3000")
public class HabitController {
    @Autowired
    private HabitService habitService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<HabitWithStatsDTO> getAllHabitsWithStats() {
        User currentUser = getCurrentUser();
        return habitService.getAllHabitsWithStatsByUser(currentUser.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Habit> addHabit(@RequestBody Habit habit) {
        User currentUser = getCurrentUser();
        habit.setUser(currentUser);
        Habit savedHabit = habitService.addHabit(habit);
        return ResponseEntity.ok(savedHabit);
    }

    @PostMapping("/{habitId}/toggle")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HabitEntry> toggleHabitCompletion(
            @PathVariable Long habitId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        User currentUser = getCurrentUser();
        HabitEntry entry = habitService.toggleHabitCompletion(habitId, date, currentUser.getId());
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/{habitId}/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<HabitWithStatsDTO> getHabitWithStats(@PathVariable Long habitId) {
        User currentUser = getCurrentUser();
        HabitWithStatsDTO stats = habitService.getHabitWithStats(habitId, currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}