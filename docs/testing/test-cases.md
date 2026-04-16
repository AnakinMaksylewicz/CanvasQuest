# CanvasQuest – Test Cases (Sprint 1)

# TC-01: Load Weekly Assignments
Description: Verify assignments are fetched and displayed.

Steps:
1. Start application
2. Navigate to dashboard
3. Observe assignment list

Expected Result: Assignments due this week are displayed

# TC-02: Assignment Structure Valid

Description: Verify assignment correctly show

Steps:
1. Inspect displayed assignments
2. Check title, course, due date, etc.

Expected Result: All fields match expected format

# TC-03: Toggle Assignment Completion

Description: Verify completion toggle works

Steps:
1. Click completion checkbox
2. Notice UI change

Expected Result: Assignment changes to completed state

# TC-04: Database Update on Completion

Description Verify database updates after completion

Steps:
1. Mark assignment complete
2. Query database or refresh API

Expected Result: is_completed field is updated


# TC-05: Progress Calculation

Description: Verify progress updates correctly

Steps:
1. Mark assignment complete
2. Observe progress bar change

Expected Result: Completed count increases


# TC-06: Persistence After Refresh

Description: Verify state persists after reload

Steps:
1. Mark assignment complete
2. Refresh page

Expected Result: Assignment remains completed


# TC-07: API Endpoint – GET Weekly Assignments

Description: Validate GET API response

Steps:
1. Call /api/assignments/week
2. Inspect JSON response

Expected Result: Returns assignments and progress fields

# TC-08: API Endpoint – POST Completion

Description: Validate POST completion endpoint

Steps:
1. Send POST request with assignment ID
2. Inspect response

Expected Result: Returns updated assignment

# TC-09: XP Updates on Assignment Completion

Description: Verify XP changes when an assignment is marked complete or incomplete.

Steps:
1. Load the dashboard.
2. Note the current XP total.
3. Mark an incomplete assignment complete.
4. Observe the returned gamification data or dashboard display.

Expected Result: XP total increases by the assignment's `xp_value`.

# TC-10: XP Does Not Double Count

Description: Verify repeated toggling does not incorrectly duplicate XP.

Steps:
1. Mark an assignment complete.
2. Mark the same assignment incomplete.
3. Mark it complete again.

Expected Result: XP increases when completed and decreases when marked incomplete. The same assignment does not permanently add XP multiple times.

# TC-11: Level and Character Update

Description: Verify the level and character match the user's XP total.

Steps:
1. Complete enough assignments to cross a level threshold.
2. Check the returned `gamification` object.

Expected Result: `level` changes according to the XP thresholds, and `character` matches the current level.
