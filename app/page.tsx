import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        
        {/* text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to <span className="text-blue-600">CanvasQuest</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Level up your semester. Sync your assignments directly from Canvas, earn XP for completing tasks, and watch your character grow as you conquer your to-do list.
          </p>
        </div>

        {/* login */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-lg"
          >
            Log In
          </Link>
          
          {/* Signup */}
          <Link 
            href="/register" 
            className="bg-white text-blue-600 border-2 border-gray-200 px-8 py-3 rounded-lg font-bold hover:border-blue-600 hover:bg-gray-50 transition-all shadow-sm text-lg"
          >
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}