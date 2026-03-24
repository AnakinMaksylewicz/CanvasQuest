This is the normalized assignment format returned to the UI by CanvasQuest

# Assignment fields
- id: string (unique internal ID; demo IDs allowed)
- title: string
- course_name: string
- due_at: ISO-8601 datetime string (UTC recommended)
- is_completed: boolean
- source: "demo" | "canvas"
- canvas_assignment_id: string | null
- points_possible: number | null
- xp_value: number (int)

#Weekly filtering should use due_at
#Completion toggle updates is_completed (and later can set completed_at in DB)