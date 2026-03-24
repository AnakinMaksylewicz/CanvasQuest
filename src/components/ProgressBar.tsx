export default function ProgressBar({ completed, total }: { completed: number, total: number }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm font-medium mb-2">
        <span>Weekly Progress</span>
        <span>{percentage}% ({completed}/{total})</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
        <div 
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}