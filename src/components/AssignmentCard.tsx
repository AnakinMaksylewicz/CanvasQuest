"use client";

export default function AssignmentCard({ assignment, onToggle }: { assignment: any, onToggle: (id: string, currentStatus: boolean) => void }) {
  // Format the date nicely for the UI
  const dueDate = new Date(assignment.due_at).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  return (
    <div className={`p-4 border rounded-lg mb-4 flex items-center justify-between transition-colors ${assignment.is_completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div>
        <h3 className={`font-bold text-lg ${assignment.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {assignment.title}
        </h3>
        <p className="text-sm text-gray-600">{assignment.course_name}</p>
        <p className="text-xs text-gray-500 mt-1">Due: {dueDate}</p>
      </div>
      <div>
        <input 
          type="checkbox" 
          className="w-6 h-6 cursor-pointer accent-green-600"
          checked={assignment.is_completed}
          onChange={() => onToggle(assignment.id, assignment.is_completed)}
        />
      </div>
    </div>
  );
}