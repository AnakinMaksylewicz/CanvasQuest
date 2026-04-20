"use client";

import { useState, useEffect } from "react";
import AssignmentCard from "../../src/components/AssignmentCard";
import ProgressBar from "../../src/components/ProgressBar";
import CanvasConnect from "../../src/components/CanvasConnect";
import CharacterWidget from "../../src/components/CharacterWidget";

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [gamification, setGamification] = useState({ xp_total: 0, level: 1 });

  const [isSyncing, setIsSyncing] = useState(false);
  
  const [loading, setLoading] = useState(true);

  const handleSync = async () => {
    setIsSyncing(true);
   try {
     const res = await fetch("/api/assignments/sync", { method: "POST" });
     const data = await res.json();

     if (!res.ok) throw new Error(data.error || "Sync failed");

      // Re-fetch the weekly assignments to show the new ones
      await fetchDashboardData();
      alert(`GatorCloud Sync Complete: Found ${data.count ?? 0} assignments.`);
   } catch (err: any) {
     console.error(err);
      alert("Canvas Sync Error: " + err.message);
    } finally {
     setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    
    if (res.ok) {
      // If the backend cleared the session successfully, redirect to login
      window.location.href = '/login'; 
    } else {
      console.error("Failed to log out on the backend.");
    }
  } catch (error) {
    console.error("Error triggering logout:", error);
  }
};

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/assignments/week");
      
      if (res.status === 401) {
        window.location.href = "/login"; // Redirect unauthenticated users
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch data");
      
      const data = await res.json();
      
      setAssignments(data.assignments || []);
      setProgress(data.progress || { total: 0, completed: 0 });
      setGamification(data.gamification || { xp_total: 0, level: 1 });
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    const isNowComplete = !currentStatus;

    setAssignments(prev => prev.map(a => a.id === id ? { ...a, is_completed: isNowComplete } : a));

    try {
      const res = await fetch("/api/assignments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("API failed");
      
      const updatedData = await res.json();
      
      setProgress(updatedData.progress);
      setGamification(updatedData.gamification);

    } catch (error) {
      console.error("Reverting UI due to error:", error);
      fetchDashboardData(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">CanvasQuest</h1>
            <p className="text-lg text-gray-500">Stay on track. Level up your semester.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                isSyncing 
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }`}
            >
              {isSyncing ? "🔄 Syncing..." : "📥 Sync Canvas"}
            </button>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 underline"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Assignments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <ProgressBar completed={progress.completed} total={progress.total} />
              
              <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8">This Week's Quests</h2>
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <span className="text-4xl block mb-2">🎉</span>
                    <p className="text-gray-500 font-medium">No assignments due this week!</p>
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
            </div>
          </div>

          {/* Right Column: Gamification & Settings */}
          <div className="space-y-6 flex flex-col">
            <div className="flex-1">
              <CharacterWidget xpTotal={gamification.xp_total} level={gamification.level} />
            </div>
            
            <CanvasConnect onConnected={fetchDashboardData} />
          </div>

        </div>
      </div>
    </main>
  );
}