# Canvas API Spike & Documentation

## Base URL
`https://ufl.instructure.com/api/v1`

## Authentication
All requests must include an Authorization header with a valid user token.
`Authorization: Bearer <TOKEN>`

## Endpoints We Will Use

### 1. Get Active Courses
- **Endpoint:** `GET /users/self/courses?enrollment_state=active`
- **Purpose:** Retrieves the list of courses the user is currently taking so we can fetch assignments for them.
- **Example Response Payload:**
  ```json
  [
    {
      "id": 1234567,
      "name": "CEN3031: Software Engineering",
      "course_code": "CEN3031",
      "enrollment_term_id": 111
    }
  ]