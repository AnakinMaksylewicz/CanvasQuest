# Test Plan







Objective: Verify that the system for assignments works correctly including loading assignments, marking them complete, and updating progress







# Scope



The following features will be tested:



- Dashboard loading



- Assignment display



- Assignment completion



- Progress calculation







Testing Approach: Testing will be performed manually using a web browser and local development server







Success Criteria: Assignments load correctly, database updates, progress accurately updates, UI is functional (no major errors)





## Sprint 2 Additions

The following Sprint 2 gamification behavior should also be tested:

- XP increases when an assignment changes from incomplete to complete.
- XP decreases when an assignment changes from complete to incomplete.
- XP does not go below 0.
- Level is recalculated when XP changes.
- Character/icon state matches the user's current level.