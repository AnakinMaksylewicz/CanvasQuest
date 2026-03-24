# Weekly Assignments API Response

## GET /api/assignments/week
Returns weekly assignments for the demo user and summary progress.

If you do http://localhost:3000/api/assignments/week and get a blank, default response, it's likely because the assignments in mock-assignments.json are not in this current week. To fix this, change the due_at field for the assignments you want to retrieve in the mock-assignments.json file, and then reseed the database by doing 'npm run seed'. Then, you can run the app and it should retrieve the assignments in this current week.

Return JSON example:
```json
{
  "assignments": [
    {
      "id": "demo-001",
      "title": "OS Project 3 Checkpoint",
      "course_name": "COP4600 Operating Systems",
      "due_at": "2026-03-05T23:59:00.000Z",
      "is_completed": false,
      "source": "demo",
      "canvas_assignment_id": null,
      "points_possible": 100,
      "xp_value": 50
    }
  ],
  "progress": {
    "total": 5,
    "completed": 2
  }
}

# Mark assignment complete API response

## POST /api/assignments/complete
Toggles one assignment's completion status

#Request body
{
    "id": "demo-001"
}

Return JSON example:
```json
{
    "message": "Assignment updated",
    "assignment": {
        "id": "demo-001"
        "is_completed" = true,
        "completed_at": "2026-03-10T12:34:56.789Z"
    }
}
