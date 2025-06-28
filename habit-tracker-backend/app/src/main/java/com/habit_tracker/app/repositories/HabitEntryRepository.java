package com.habit_tracker.app.repositories;

import com.habit_tracker.app.models.HabitEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitEntryRepository extends JpaRepository<HabitEntry, Long> {
    
    Optional<HabitEntry> findByHabitIdAndCompletionDate(Long habitId, LocalDate completionDate);
    
    List<HabitEntry> findByHabitIdAndCompletionDateBetween(Long habitId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT he FROM HabitEntry he WHERE he.habit.id = :habitId AND he.completed = true ORDER BY he.completionDate DESC")
    List<HabitEntry> findCompletedEntriesByHabitId(@Param("habitId") Long habitId);
    
    @Query("SELECT COUNT(he) FROM HabitEntry he WHERE he.habit.id = :habitId AND he.completed = true AND he.completionDate >= :startDate")
    Long countCompletedEntriesSince(@Param("habitId") Long habitId, @Param("startDate") LocalDate startDate);
    
    @Modifying
    @Query("DELETE FROM HabitEntry he WHERE he.habit.id = :habitId")
    void deleteByHabitId(@Param("habitId") Long habitId);
}