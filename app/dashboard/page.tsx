export default function DashboardPage() {
  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Weekly Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholders for your future components */}
        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">Assignment Cards Will Go Here</h2>
        </div>
        <div className="border p-6 rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-2">Progress Bar Will Go Here</h2>
        </div>
      </div>
    </main>
  );
}