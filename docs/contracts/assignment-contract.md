This is the normalized assignment format returned to the UI by CanvasQuest

## Assignment fields
- id: string (unique internal ID; demo IDs allowed)
- title: string
- course_name: string
- due_at: ISO-8601 datetime string (UTC recommended)
- is_completed: boolean
- completed_at: ISO-8601 datetime string | null
- source: "demo" | "canvas"
- canvas_assignment_id: string | null
- points_possible: number | null
- xp_value: number (int)

## Weekly filtering 
Weekly filtering should use `due_at`

## Completion toggle 
Completion toggle updates `is_completed` and sets/clears `completed_at`

## Gamification fields returned by APIs
The assignment APIs can also return a `gamification` object:

- xp_total: number
- level: number
- next_level_xp: number | null
- xp_to_next_level: number
- character:
  - name: string
  - icon: string
  - description: string