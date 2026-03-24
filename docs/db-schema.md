CanvasQuest DB schema (draft)
PK means primary key, or the column that identifies each row in a table, no duplicates allowed.
FK means foreign key, which is a column that points to another table's primary key. creates relationships between rows

## users
- id (PK)
- email (unique)
- password_hash
- created_at

## canvas_tokens
- id (PK)
- user_id (FK -> users.id)
- encrypted_token
- created_at
- updated_at

## assignments
- id (PK)
- user_id (FK -> users.id)
- source ("canvas" | "demo")
- canvas_assignment_id (nullable)
- course_name
- title
- due_at (timestamp)
- is_completed (boolean)
- completed_at (nullable timestamp)
- points_possible (nullable)
- xp-value (int)
- created_at

## user_progress
- user_id (FK -> users.id)
- xp_total (int)
- level (int)
- streak_count (int)
- last_active_date (date)

## Relationships
- users 1—many assignments
- users 1—1 user_progress
- users 1—1 (active) canvas_tokens
