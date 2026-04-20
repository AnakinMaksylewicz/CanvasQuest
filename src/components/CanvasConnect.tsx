"use client";

import { useState } from "react";

export default function CanvasConnect({ onConnected }: { onConnected: () => void }) {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setStatus("loading");
    setMessage("Verifying token with Canvas...");

    try {
      const res = await fetch("/api/canvas-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error("Invalid token");

      setStatus("success");
      setMessage("Canvas connected successfully! Loading your assignments...");
      
      // Tell the dashboard to refresh its data
      setTimeout(() => {
        onConnected();
      }, 1500);

    } catch (error) {
      setStatus("error");
      setMessage("Failed to connect. Please make sure your token is correct.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-bold mb-2 text-gray-800">Connect Canvas</h2>
      <p className="text-sm text-gray-600 mb-4">Paste your Canvas API Access Token to sync your weekly assignments.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="password"
          placeholder="7~vnyC..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success" || !token}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Connecting..." : status === "success" ? "Connected" : "Sync Canvas"}
        </button>
      </form>
      
      {message && (
        <p className={`mt-3 text-sm font-medium ${status === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}