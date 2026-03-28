export type TileType = {
  id: string;
  symbol: string;
  group: string;
  row: number;
  col: number;
  layer: number;
  matched: boolean;
  selected: boolean;
};

export type LayoutCell = [number, number, number]; // [row, col, layer]

// 20 layouts (row, col, layer)
export const LAYOUTS: { name: string; cells: LayoutCell[] }[] = [
  // 1. Черепаха (классика)
  {
    name: "Черепаха",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [3, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [5, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [2, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [6, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [1, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [7, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [4, c, 1] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [3, c, 1] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [5, c, 1] as LayoutCell),
      ...[4,5,6,7].map(c => [4, c, 2] as LayoutCell),
      [[4, 5, 3]],
    ].flat(),
  },
  // 2. Пирамида
  {
    name: "Пирамида",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [7, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [6, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [5, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [4, c, 0] as LayoutCell),
      ...[4,5,6,7].map(c => [3, c, 0] as LayoutCell),
      ...[5,6].map(c => [2, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [7, c, 1] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [6, c, 1] as LayoutCell),
      ...[4,5,6,7].map(c => [5, c, 1] as LayoutCell),
      ...[5,6].map(c => [4, c, 1] as LayoutCell),
    ],
  },
  // 3. Крест
  {
    name: "Крест",
    cells: [
      ...[3,4,5,6,7,8].map(c => [0, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [1, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [7, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [8, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [4, c, 1] as LayoutCell),
    ],
  },
  // 4. Башни
  {
    name: "Башни",
    cells: [
      ...([0,1,2,3,4,5,6,7].flatMap(r => [0,1,2,3,8,9,10,11].map(c => [r, c, 0] as LayoutCell))),
      ...([2,3,4,5].flatMap(r => [0,1,2,3,8,9,10,11].map(c => [r, c, 1] as LayoutCell))),
      ...([3,4].flatMap(r => [0,1,2,3,8,9,10,11].map(c => [r, c, 2] as LayoutCell))),
    ],
  },
  // 5. Бабочка
  {
    name: "Бабочка",
    cells: [
      ...[0,1,2,3,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [3, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [5, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [2, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [6, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [4, c, 1] as LayoutCell),
      ...[4,5,6,7].map(c => [3, c, 1] as LayoutCell),
      ...[4,5,6,7].map(c => [5, c, 1] as LayoutCell),
    ],
  },
  // 6. Восьмёрка
  {
    name: "Восьмёрка",
    cells: [
      ...[2,3,4,5,6,7,8,9].map(c => [1, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [7, c, 0] as LayoutCell),
      ...[1,2,9,10].flatMap(r => [3,4,5,6,7,8].map(c => [r, c, 0] as LayoutCell)),
      ...[4,5,6,7,8].map(c => [4, c, 0] as LayoutCell),
      ...[4,5,6,7,8].map(c => [4, c, 1] as LayoutCell),
    ],
  },
  // 7. Дракон
  {
    name: "Дракон",
    cells: [
      ...[0,11].flatMap(() => [2,3,4,5,6].map(r => [r, 0, 0] as LayoutCell)),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [4, c, 0] as LayoutCell),
      ...[2,3,4,5,6].map(r => [r, 11, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [2, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [6, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [4, c, 1] as LayoutCell),
      ...[4,5,6,7].map(c => [4, c, 2] as LayoutCell),
    ],
  },
  // 8. Лестница
  {
    name: "Лестница",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [c % 8, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [(c + 1) % 8, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [3, c, 1] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [4, c, 1] as LayoutCell),
    ],
  },
  // 9. Ромб
  {
    name: "Ромб",
    cells: [
      [4,5,0],[4,6,0],
      [3,4,0],[3,5,0],[3,6,0],[3,7,0],
      [2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],
      [1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],
      [0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],
      [5,4,0],[5,5,0],[5,6,0],[5,7,0],
      [6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],
      [7,2,0],[7,3,0],[7,4,0],[7,5,0],[7,6,0],[7,7,0],[7,8,0],[7,9,0],
      [8,3,0],[8,4,0],[8,5,0],[8,6,0],[8,7,0],[8,8,0],
      [2,4,1],[2,5,1],[2,6,1],[2,7,1],
      [1,4,1],[1,5,1],[1,6,1],[1,7,1],
    ],
  },
  // 10. Спираль
  {
    name: "Спираль",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [0, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 11, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [7, c, 0] as LayoutCell),
      ...[2,3,4,5,6].map(r => [r, 1, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [2, c, 0] as LayoutCell),
      ...[3,4,5].map(r => [r, 9, 0] as LayoutCell),
      ...[3,4,5,6,7].map(c => [5, c, 0] as LayoutCell),
      [3,3,0],[3,4,0],[3,5,0],[3,6,0],
      ...[3,4,5,6,7].map(c => [3, c, 1] as LayoutCell),
    ],
  },
  // 11. Стрела
  {
    name: "Стрела",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[0,1,2,3].map(c => [3, c, 0] as LayoutCell),
      ...[0,1,2,3].map(c => [5, c, 0] as LayoutCell),
      ...[0,1,2].map(c => [2, c, 0] as LayoutCell),
      ...[0,1,2].map(c => [6, c, 0] as LayoutCell),
      [0,1,7,0],[0,1,6,0],
      ...[5,6,7,8,9,10].map(c => [4, c, 1] as LayoutCell),
      ...[6,7,8,9].map(c => [4, c, 2] as LayoutCell),
    ],
  },
  // 12. Звезда
  {
    name: "Звезда",
    cells: [
      [4,5,0],[4,6,0],
      [3,4,0],[3,5,0],[3,6,0],[3,7,0],
      [2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],
      [5,4,0],[5,5,0],[5,6,0],[5,7,0],
      [6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],
      [1,5,0],[1,6,0],[7,5,0],[7,6,0],
      [0,5,0],[0,6,0],[8,5,0],[8,6,0],
      [4,2,0],[4,3,0],[4,8,0],[4,9,0],
      [4,0,0],[4,1,0],[4,10,0],[4,11,0],
      [3,5,1],[3,6,1],[4,5,1],[4,6,1],[5,5,1],[5,6,1],
    ],
  },
  // 13. Воронка
  {
    name: "Воронка",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [0, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [8, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 0, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 11, 0] as LayoutCell),
      ...[2,3,4,5,6].map(r => [r, 2, 0] as LayoutCell),
      ...[2,3,4,5,6].map(r => [r, 9, 0] as LayoutCell),
      ...[3,4,5].map(r => [r, 4, 0] as LayoutCell),
      ...[3,4,5].map(r => [r, 7, 0] as LayoutCell),
      [4,5,0],[4,6,0],
    ],
  },
  // 14. Мост
  {
    name: "Мост",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [3, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [5, c, 0] as LayoutCell),
      ...[0,2,4,6,8,10].map(c => [4, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [3, c, 1] as LayoutCell),
      ...[1,2,3,4,5,6,7,8,9,10].map(c => [5, c, 1] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [3, c, 2] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [5, c, 2] as LayoutCell),
    ],
  },
  // 15. Сердце
  {
    name: "Сердце",
    cells: [
      [1,2,0],[1,3,0],[1,7,0],[1,8,0],
      [0,2,0],[0,3,0],[0,4,0],[0,7,0],[0,8,0],[0,9,0],
      [2,1,0],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,0],
      [3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,0],[3,9,0],
      [4,3,0],[4,4,0],[4,5,0],[4,6,0],[4,7,0],[4,8,0],
      [5,4,0],[5,5,0],[5,6,0],[5,7,0],
      [6,5,0],[6,6,0],
      [7,5,0],[7,6,0],
      [3,4,1],[3,5,1],[3,6,1],[3,7,1],
      [4,4,1],[4,5,1],[4,6,1],[4,7,1],
    ],
  },
  // 16. Кольцо
  {
    name: "Кольцо",
    cells: [
      ...[3,4,5,6,7,8].map(c => [0, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [8, c, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 2, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 9, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [2, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [6, c, 0] as LayoutCell),
      ...[3,4,5].map(r => [r, 4, 0] as LayoutCell),
      ...[3,4,5].map(r => [r, 7, 0] as LayoutCell),
      [4,5,0],[4,6,0],
    ],
  },
  // 17. Квадрат
  {
    name: "Квадрат",
    cells: [
      ...([0,1,2,3,4,5,6,7].flatMap(r => [2,3,4,5,6,7,8,9].map(c => [r, c, 0] as LayoutCell))),
      ...([1,2,3,4,5,6].flatMap(r => [3,4,5,6,7,8].map(c => [r, c, 1] as LayoutCell))),
      ...([2,3,4,5].flatMap(r => [4,5,6,7].map(c => [r, c, 2] as LayoutCell))),
      ...([3].flatMap(r => [5,6].map(c => [r, c, 3] as LayoutCell))),
    ],
  },
  // 18. Нить
  {
    name: "Нить",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [0, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [2, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [6, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [8, c, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [2, c, 1] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [4, c, 1] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [6, c, 1] as LayoutCell),
    ],
  },
  // 19. Лабиринт
  {
    name: "Лабиринт",
    cells: [
      ...[0,2,4,6,8,10].map(c => [0, c, 0] as LayoutCell),
      ...[0,2,4,6,8,10].map(c => [8, c, 0] as LayoutCell),
      ...[0,2,4,6,8].map(r => [r, 0, 0] as LayoutCell),
      ...[0,2,4,6,8].map(r => [r, 10, 0] as LayoutCell),
      ...[1,2,3,4,5,6,7].map(r => [r, 2, 0] as LayoutCell),
      ...[2,3,4,5,6].map(c => [2, c, 0] as LayoutCell),
      ...[3,4,5,6].map(r => [r, 6, 0] as LayoutCell),
      ...[4,5,6,7,8].map(c => [6, c, 0] as LayoutCell),
      ...[4,5].map(r => [r, 4, 0] as LayoutCell),
      [4,5,0],[4,6,0],[4,7,0],[4,8,0],
      [3,4,1],[4,4,1],[5,4,1],
    ],
  },
  // 20. Вихрь
  {
    name: "Вихрь",
    cells: [
      ...[0,1,2,3,4,5,6,7,8,9,10,11].map(c => [4, c, 0] as LayoutCell),
      ...[0,1,2,3,4,5,6,7].map(r => [r, 5, 0] as LayoutCell),
      ...[1,2,3,4,5,6].map(r => [r, 3, 0] as LayoutCell),
      ...[1,2,3,4,5,6].map(r => [r, 8, 0] as LayoutCell),
      ...[2,3,4,5].map(r => [r, 1, 0] as LayoutCell),
      ...[2,3,4,5].map(r => [r, 10, 0] as LayoutCell),
      ...[2,3,4,5,6,7,8,9].map(c => [2, c, 0] as LayoutCell),
      ...[3,4,5,6,7,8].map(c => [6, c, 0] as LayoutCell),
      ...[4,5,6,7].map(c => [4, c, 1] as LayoutCell),
      ...[3,4,5].map(r => [r, 5, 1] as LayoutCell),
    ],
  },
];

// Tile symbols
export const TILE_SYMBOLS = [
  // Бамбук
  { symbol: '🎋', group: 'bamboo' },
  { symbol: '🎍', group: 'bamboo' },
  { symbol: '🌿', group: 'bamboo' },
  { symbol: '🍃', group: 'bamboo' },
  { symbol: '🌱', group: 'bamboo' },
  { symbol: '🌾', group: 'bamboo' },
  { symbol: '🎑', group: 'bamboo' },
  { symbol: '🍀', group: 'bamboo' },
  { symbol: '🌲', group: 'bamboo' },
  // Символы
  { symbol: '🀄', group: 'symbols' },
  { symbol: '☯️', group: 'symbols' },
  { symbol: '⭐', group: 'symbols' },
  { symbol: '🌟', group: 'symbols' },
  { symbol: '💫', group: 'symbols' },
  { symbol: '✨', group: 'symbols' },
  { symbol: '🔮', group: 'symbols' },
  { symbol: '🎯', group: 'symbols' },
  { symbol: '🔱', group: 'symbols' },
  // Стихии
  { symbol: '🔥', group: 'elements' },
  { symbol: '💧', group: 'elements' },
  { symbol: '🌊', group: 'elements' },
  { symbol: '⚡', group: 'elements' },
  { symbol: '🌪️', group: 'elements' },
  { symbol: '❄️', group: 'elements' },
  { symbol: '🌙', group: 'elements' },
  { symbol: '☀️', group: 'elements' },
  { symbol: '🌈', group: 'elements' },
  // Числа
  { symbol: '①', group: 'numbers' },
  { symbol: '②', group: 'numbers' },
  { symbol: '③', group: 'numbers' },
  { symbol: '④', group: 'numbers' },
  { symbol: '⑤', group: 'numbers' },
  { symbol: '⑥', group: 'numbers' },
  { symbol: '⑦', group: 'numbers' },
  { symbol: '⑧', group: 'numbers' },
  { symbol: '⑨', group: 'numbers' },
];

export function generateTiles(layoutIndex: number): TileType[] {
  const layout = LAYOUTS[layoutIndex % LAYOUTS.length];
  const cells = layout.cells;
  const totalTiles = Math.floor(cells.length / 2) * 2;
  const usedCells = cells.slice(0, totalTiles);

  const symbolCount = Math.ceil(totalTiles / 2);
  const symbols: string[] = [];
  for (let i = 0; i < symbolCount; i++) {
    const sym = TILE_SYMBOLS[i % TILE_SYMBOLS.length].symbol;
    symbols.push(sym, sym);
  }
  // Shuffle symbols
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  return usedCells.map(([row, col, layer], idx) => ({
    id: `${row}-${col}-${layer}-${idx}`,
    symbol: symbols[idx] || '❓',
    group: TILE_SYMBOLS.find(t => t.symbol === symbols[idx])?.group || 'other',
    row,
    col,
    layer,
    matched: false,
    selected: false,
  }));
}

export function isTileFree(tile: TileType, allTiles: TileType[]): boolean {
  const remaining = allTiles.filter(t => !t.matched);

  // Check if blocked on left or right
  const blockedLeft = remaining.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1
  );
  const blockedRight = remaining.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1
  );

  // Check if covered from above (same position or adjacent, higher layer)
  const coveredAbove = remaining.some(
    t => t.id !== tile.id &&
      t.layer === tile.layer + 1 &&
      Math.abs(t.row - tile.row) <= 1 &&
      Math.abs(t.col - tile.col) <= 1
  );

  if (coveredAbove) return false;
  if (blockedLeft && blockedRight) return false;
  return true;
}

export function findHint(tiles: TileType[]): [TileType, TileType] | null {
  const free = tiles.filter(t => !t.matched && isTileFree(t, tiles));
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (free[i].symbol === free[j].symbol) {
        return [free[i], free[j]];
      }
    }
  }
  return null;
}

export function hasNoMoves(tiles: TileType[]): boolean {
  return findHint(tiles) === null;
}

// Achievements
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: (stats: GameStats) => boolean;
};

export type GameStats = {
  levelsCompleted: number;
  totalScore: number;
  fastWins: number; // wins under 2 min
  perfectWins: number; // no hints used
  hintsUsed: number;
  streak: number;
  totalTime: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', name: 'Первая победа', description: 'Пройди первый уровень', icon: '🏆', color: 'gold', condition: s => s.levelsCompleted >= 1 },
  { id: 'speed_demon', name: 'Молния', description: 'Пройди уровень за 2 минуты', icon: '⚡', color: 'blue', condition: s => s.fastWins >= 1 },
  { id: 'perfectionist', name: 'Перфекционист', description: 'Пройди без подсказок', icon: '💎', color: 'purple', condition: s => s.perfectWins >= 1 },
  { id: 'streak_3', name: 'Серия x3', description: 'Выиграй 3 уровня подряд', icon: '🔥', color: 'pink', condition: s => s.streak >= 3 },
  { id: 'streak_5', name: 'Серия x5', description: 'Выиграй 5 уровней подряд', icon: '🌟', color: 'gold', condition: s => s.streak >= 5 },
  { id: 'level_5', name: 'Ветеран', description: 'Пройди 5 уровней', icon: '🎖️', color: 'green', condition: s => s.levelsCompleted >= 5 },
  { id: 'level_10', name: 'Мастер', description: 'Пройди 10 уровней', icon: '👑', color: 'gold', condition: s => s.levelsCompleted >= 10 },
  { id: 'level_20', name: 'Легенда', description: 'Пройди все 20 уровней', icon: '🐉', color: 'purple', condition: s => s.levelsCompleted >= 20 },
  { id: 'score_1000', name: 'Тысячник', description: 'Набери 1000 очков', icon: '💰', color: 'gold', condition: s => s.totalScore >= 1000 },
  { id: 'no_hints_5', name: 'Самостоятельный', description: 'Пройди 5 уровней без подсказок', icon: '🧠', color: 'blue', condition: s => s.perfectWins >= 5 },
  { id: 'speed_5', name: 'Скоростной игрок', description: '5 побед менее чем за 2 мин', icon: '🚀', color: 'blue', condition: s => s.fastWins >= 5 },
  { id: 'zen', name: 'Дзен', description: 'Сыграй 1 час суммарно', icon: '☯️', color: 'purple', condition: s => s.totalTime >= 3600 },
];

export function calculateScore(tilesLeft: number, timeSeconds: number, hintsUsed: number): number {
  const base = 1000;
  const timeBonus = Math.max(0, 300 - timeSeconds) * 2;
  const hintPenalty = hintsUsed * 50;
  return Math.max(0, base + timeBonus - hintPenalty);
}
