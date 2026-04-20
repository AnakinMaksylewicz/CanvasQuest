"use client";

export default function CharacterWidget({ xpTotal, level }: { xpTotal: number, level: number }) {
  const getCharacter = (currentLevel: number) => {
    if (currentLevel >= 4) return { emoji: "🌟", name: "Golden Tree", color: "bg-yellow-100 text-yellow-800" };
    if (currentLevel === 3) return { emoji: "🌳", name: "Tree", color: "bg-green-200 text-green-900" };
    if (currentLevel === 2) return { emoji: "🌿", name: "Small Plant", color: "bg-green-100 text-green-800" };
    return { emoji: "🌱", name: "Sapling", color: "bg-emerald-50 text-emerald-700" };
  };

  const character = getCharacter(level);
  
  // Calculate progress to next level (assuming 100 XP per level)
  const xpCurrentLevel = xpTotal % 100;
  const xpNeeded = 100 - xpCurrentLevel;
  const xpPercentage = Math.round((xpCurrentLevel / 100) * 100);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
      <div className="text-7xl mb-4 hover:scale-110 transition-transform cursor-default">
        {character.emoji}
      </div>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-1">Level {level}</h2>
      <span className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-6 ${character.color}`}>
        {character.name}
      </span>
      
      <div className="w-full mt-auto">
        <div className="flex justify-between text-sm text-gray-500 font-bold mb-2">
          <span>Total: {xpTotal} XP</span>
          <span>{xpNeeded} XP to Next</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}