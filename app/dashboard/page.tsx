"use client";

import { useState, useEffect } from "react";
import AssignmentCard from "../../src/components/AssignmentCard";
import ProgressBar from "../../src/components/ProgressBar";

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Fetch data on load
  const fetchWeekData = async () => {
    try {
      const res = await fetch("/api/assignments/week");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      
      setAssignments(data.assignments);
      setProgress(data.progress);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekData();
  }, []);

  // 2. Handle the checkbox toggle
  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    const isNowComplete = !currentStatus;

    // OPTIMISTIC UPDATE: Update UI instantly before the DB responds
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, is_completed: isNowComplete } : a
    ));
    setProgress(prev => ({
      total: prev.total,
      completed: prev.completed + (isNowComplete ? 1 : -1)
    }));

    try {
      // Send the update to the database using the POST route
      const res = await fetch("/api/assignments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
    } catch (error) {
      console.error("API error, reverting UI:", error);
      // Revert the UI if the backend failed for some reason
      fetchWeekData(); 
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl font-bold animate-pulse">Loading CanvasQuest...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Weekly Dashboard</h1>
      <p className="text-gray-600 mb-8">Stay on track. Level up.</p>
      
      <ProgressBar completed={progress.completed} total={progress.total} />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No assignments due this week! 🎉</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <AssignmentCard 
              key={assignment.id} 
              assignment={assignment} 
              onToggle={handleToggleComplete} 
            />
          ))
        )}
      </div>
    </main>
  );
}