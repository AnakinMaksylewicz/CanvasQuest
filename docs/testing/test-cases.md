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
