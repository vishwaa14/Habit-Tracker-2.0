package com.habit_tracker.app.services;

import com.habit_tracker.app.dto.HabitWithStatsDTO;
import com.habit_tracker.app.models.Habit;
import com.habit_tracker.app.models.HabitEntry;
import com.habit_tracker.app.repositories.HabitRepository;
import com.habit_tracker.app.repositories.HabitEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HabitService {
    @Autowired
    private HabitRepository habitRepository;
    
    @Autowired
    private HabitEntryRepository habitEntryRepository;

    public List<HabitWithStatsDTO> getAllHabitsWithStats() {
        List<Habit> habits = habitRepository.findAll();
        return habits.stream()
                .map(this::calculateHabitStats)
                .collect(Collectors.toList());
    }

    public Habit addHabit(Habit habit) {
        return habitRepository.save(habit);
    }

    public HabitEntry toggleHabitCompletion(Long habitId, LocalDate date) {
        Optional<HabitEntry> existingEntry = habitEntryRepository.findByHabitIdAndCompletionDate(habitId, date);
        
        if (existingEntry.isPresent()) {
            HabitEntry entry = existingEntry.get();
            entry.setCompleted(!entry.getCompleted());
            return habitEntryRepository.save(entry);
        } else {
            Habit habit = habitRepository.findById(habitId)
                    .orElseThrow(() -> new RuntimeException("Habit not found"));
            HabitEntry newEntry = new HabitEntry(habit, date, true);
            return habitEntryRepository.save(newEntry);
        }
    }

    public HabitWithStatsDTO getHabitWithStats(Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        return calculateHabitStats(habit);
    }

    private HabitWithStatsDTO calculateHabitStats(Habit habit) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());
        
        // Get all entries for this month
        List<HabitEntry> monthlyEntries = habitEntryRepository.findByHabitIdAndCompletionDateBetween(
                habit.getId(), monthStart, monthEnd);
        
        // Create monthly completions map
        Map<LocalDate, Boolean> monthlyCompletions = new HashMap<>();
        for (LocalDate date = monthStart; !date.isAfter(monthEnd); date = date.plusDays(1)) {
            monthlyCompletions.put(date, false);
        }
        
        for (HabitEntry entry : monthlyEntries) {
            monthlyCompletions.put(entry.getCompletionDate(), entry.getCompleted());
        }
        
        // Calculate streaks
        List<HabitEntry> allCompletedEntries = habitEntryRepository.findCompletedEntriesByHabitId(habit.getId());
        Integer currentStreak = calculateCurrentStreak(allCompletedEntries);
        Integer longestStreak = calculateLongestStreak(allCompletedEntries);
        
        // Calculate completion rate for this month
        long completedDays = monthlyEntries.stream()
                .mapToLong(entry -> entry.getCompleted() ? 1 : 0)
                .sum();
        long totalDaysInMonth = monthEnd.getDayOfMonth();
        Double completionRate = totalDaysInMonth > 0 ? (double) completedDays / totalDaysInMonth * 100 : 0.0;
        
        // Total completions
        Integer totalCompletions = allCompletedEntries.size();
        
        return new HabitWithStatsDTO(habit, currentStreak, longestStreak, completionRate, 
                                   monthlyCompletions, totalCompletions);
    }

    private Integer calculateCurrentStreak(List<HabitEntry> completedEntries) {
        if (completedEntries.isEmpty()) return 0;
        
        // Sort by date descending
        completedEntries.sort((a, b) -> b.getCompletionDate().compareTo(a.getCompletionDate()));
        
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        
        // Check if today or yesterday was completed
        LocalDate lastCompletedDate = completedEntries.get(0).getCompletionDate();
        if (!lastCompletedDate.equals(today) && !lastCompletedDate.equals(yesterday)) {
            return 0;
        }
        
        int streak = 0;
        LocalDate expectedDate = lastCompletedDate;
        
        for (HabitEntry entry : completedEntries) {
            if (entry.getCompletionDate().equals(expectedDate)) {
                streak++;
                expectedDate = expectedDate.minusDays(1);
            } else {
                break;
            }
        }
        
        return streak;
    }

    private Integer calculateLongestStreak(List<HabitEntry> completedEntries) {
        if (completedEntries.isEmpty()) return 0;
        
        // Sort by date ascending
        completedEntries.sort((a, b) -> a.getCompletionDate().compareTo(b.getCompletionDate()));
        
        int longestStreak = 1;
        int currentStreak = 1;
        
        for (int i = 1; i < completedEntries.size(); i++) {
            LocalDate prevDate = completedEntries.get(i - 1).getCompletionDate();
            LocalDate currentDate = completedEntries.get(i).getCompletionDate();
            
            if (currentDate.equals(prevDate.plusDays(1))) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        return longestStreak;
    }
}