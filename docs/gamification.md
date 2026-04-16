# CanvasQuest Gamification Rules

## XP rule
Each assignment has an `xp_value` field. When a user marks an assignment complete, that assignment's XP is added to the user's total XP

When a user marks a completed assignment incomplete, that assignment's XP is subtracted from the user's total XP. XP cannot go below 0

## Level thresholds
- Level 1: 0–99 XP
- Level 2: 100–199 XP
- Level 3: 200–349 XP
- Level 4: 350+ XP

## Character mapping
- Level 1: Sapling (`🌱`)
- Level 2: Small Plant (`🌿`)
- Level 3: Tree (`🌳`)
- Level 4: Golden Tree (`🌟`)

## Backend response shape
The backend returns a `gamification` object with:

```json
{
  "xp_total": 80,
  "level": 1,
  "next_level_xp": 100,
  "xp_to_next_level": 20,
  "character": {
    "name": "Sapling",
    "icon": "🌱",
    "description": "Start completing assignments to grow."
  }
}
```

## Demo-user limitation
For now, the gamification backend uses the seeded demo user (`demo@canvasquest.local`). denny, please replace this later with authenticated-user logic.
