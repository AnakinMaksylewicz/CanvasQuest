const CANVAS_BASE_URL = "https://canvas.instructure.com/api/v1";

function calculateXP(pointsPossible: number | null | undefined): number {
  if (!pointsPossible || pointsPossible <= 0) return 10; 

  const rawXP = Math.round(pointsPossible * 2);

  // Keep XP balanced: Minimum 10 XP, Maximum 250 XP per assignment
  return Math.min(250, Math.max(10, rawXP));
}

export async function fetchCanvasAssignments(token: string) {
  const cleanToken = token.trim();

  // Get all active courses
  const coursesRes = await fetch(
    `${CANVAS_BASE_URL}/courses?enrollment_state=active&access_token=${cleanToken}`
  );

  if (!coursesRes.ok) {
    throw new Error("Canvas API rejected the course fetch.");
  }

  const courses = await coursesRes.json();
  let allAssignments: any[] = [];

  for (const course of courses) {
    if (!course.id) continue;

    const assignRes = await fetch(
      `${CANVAS_BASE_URL}/courses/${course.id}/assignments?access_token=${cleanToken}`
    );

    if (assignRes.ok) {
      const courseAssignments = await assignRes.json();
      
      // Map them to the CanvasQuest format immediately
      const mapped = courseAssignments.map((a: any) => ({
        id: String(a.id),
        course_name: course.course_code || course.name || "Canvas Course",
        title: a.name,
        // Fallback to today if there is no due date so it shows up in UI
        due_at: a.due_at || new Date().toISOString(),
        xp_value: calculateXP(a.points_possible)
      }));

      // Add this course's assignments to master list
      allAssignments = [...allAssignments, ...mapped];
    }
  }

  console.log(`Successfully forced Canvas to return ${allAssignments.length} assignments.`);
  return allAssignments;
}