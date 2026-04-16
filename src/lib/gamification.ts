export type CharacterState = {
  name: string;
  icon: string;
  description: string;
};

export type GamificationState = {
  xp_total: number;
  level: number;
  next_level_xp: number | null;
  xp_to_next_level: number;
  character: CharacterState;
};

const LEVEL_THRESHOLDS = [0, 100, 200, 350];

export function calculateLevel(xpTotal: number): number {
  if (xpTotal >= LEVEL_THRESHOLDS[3]) return 4;
  if (xpTotal >= LEVEL_THRESHOLDS[2]) return 3;
  if (xpTotal >= LEVEL_THRESHOLDS[1]) return 2;
  return 1;
}

export function getCharacterForLevel(level: number): CharacterState {
  if (level >= 4) {
    return {
      name: "Golden Tree",
      icon: "🌟",
      description: "You're thriving this week! Keep up the great work.",
    };
  }

  if (level === 3) {
    return {
      name: "Tree",
      icon: "🌳",
      description: "Your progress is strong. Keep going!",
    };
  }

  if (level === 2) {
    return {
      name: "Small Plant",
      icon: "🌿",
      description: "You're building steady momentum.",
    };
  }

  return {
    name: "Sapling",
    icon: "🌱",
    description: "Start completing assignments to grow!",
  };
}

export function getNextLevelXp(level: number): number | null {
  if (level >= LEVEL_THRESHOLDS.length) return null;
  return LEVEL_THRESHOLDS[level];
}

export function buildGamificationState(xpTotal: number): GamificationState {
  const safeXpTotal = Math.max(0, xpTotal);
  const level = calculateLevel(safeXpTotal);
  const nextLevelXp = getNextLevelXp(level);

  return {
    xp_total: safeXpTotal,
    level,
    next_level_xp: nextLevelXp,
    xp_to_next_level: nextLevelXp === null ? 0 : Math.max(0, nextLevelXp - safeXpTotal),
    character: getCharacterForLevel(level),
  };
}
