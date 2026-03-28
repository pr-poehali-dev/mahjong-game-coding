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

function row(r: number, cols: number[], layer: number): LayoutCell[] {
  return cols.map(c => [r, c, layer]);
}
function col(rows: number[], c: number, layer: number): LayoutCell[] {
  return rows.map(r => [r, c, layer]);
}
function rect(rows: number[], cols: number[], layer: number): LayoutCell[] {
  const cells: LayoutCell[] = [];
  for (const r of rows) for (const c of cols) cells.push([r, c, layer]);
  return cells;
}

export const LAYOUTS: { name: string; cells: LayoutCell[] }[] = [
  // 1. Черепаха (классика)
  {
    name: "Черепаха",
    cells: [
      ...row(4, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(3, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(5, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(2, [2,3,4,5,6,7,8,9], 0),
      ...row(6, [2,3,4,5,6,7,8,9], 0),
      ...row(1, [3,4,5,6,7,8], 0),
      ...row(7, [3,4,5,6,7,8], 0),
      ...row(4, [2,3,4,5,6,7,8,9], 1),
      ...row(3, [3,4,5,6,7,8], 1),
      ...row(5, [3,4,5,6,7,8], 1),
      ...row(4, [4,5,6,7], 2),
      [4, 5, 3],
    ],
  },
  // 2. Пирамида
  {
    name: "Пирамида",
    cells: [
      ...row(7, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(6, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(5, [2,3,4,5,6,7,8,9], 0),
      ...row(4, [3,4,5,6,7,8], 0),
      ...row(3, [4,5,6,7], 0),
      ...row(2, [5,6], 0),
      ...row(7, [2,3,4,5,6,7,8,9], 1),
      ...row(6, [3,4,5,6,7,8], 1),
      ...row(5, [4,5,6,7], 1),
      ...row(4, [5,6], 1),
    ],
  },
  // 3. Крест
  {
    name: "Крест",
    cells: [
      ...row(0, [3,4,5,6,7,8], 0),
      ...row(1, [3,4,5,6,7,8], 0),
      ...row(4, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(7, [3,4,5,6,7,8], 0),
      ...row(8, [3,4,5,6,7,8], 0),
      ...row(4, [3,4,5,6,7,8], 1),
    ],
  },
  // 4. Башни
  {
    name: "Башни",
    cells: [
      ...rect([0,1,2,3,4,5,6,7], [0,1,2,3], 0),
      ...rect([0,1,2,3,4,5,6,7], [8,9,10,11], 0),
      ...rect([2,3,4,5], [0,1,2,3], 1),
      ...rect([2,3,4,5], [8,9,10,11], 1),
      ...rect([3,4], [0,1,2,3], 2),
      ...rect([3,4], [8,9,10,11], 2),
    ],
  },
  // 5. Бабочка
  {
    name: "Бабочка",
    cells: [
      ...row(4, [0,1,2,3,8,9,10,11], 0),
      ...row(3, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(5, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(2, [2,3,4,5,6,7,8,9], 0),
      ...row(6, [2,3,4,5,6,7,8,9], 0),
      ...row(4, [3,4,5,6,7,8], 1),
      ...row(3, [4,5,6,7], 1),
      ...row(5, [4,5,6,7], 1),
    ],
  },
  // 6. Восьмёрка
  {
    name: "Восьмёрка",
    cells: [
      ...row(1, [2,3,4,5,6,7,8,9], 0),
      ...row(7, [2,3,4,5,6,7,8,9], 0),
      ...row(4, [4,5,6,7,8], 0),
      ...col([1,2,3,4,5,6,7], 2, 0),
      ...col([1,2,3,4,5,6,7], 9, 0),
      ...row(2, [3,4,5,6,7,8], 0),
      ...row(6, [3,4,5,6,7,8], 0),
      ...row(4, [4,5,6,7,8], 1),
    ],
  },
  // 7. Дракон
  {
    name: "Дракон",
    cells: [
      ...col([2,3,4,5,6], 0, 0),
      ...row(4, [1,2,3,4,5,6,7,8,9,10], 0),
      ...col([2,3,4,5,6], 11, 0),
      ...row(2, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(6, [1,2,3,4,5,6,7,8,9,10], 0),
      ...row(4, [3,4,5,6,7,8], 1),
      ...row(4, [4,5,6,7], 2),
    ],
  },
  // 8. Лестница
  {
    name: "Лестница",
    cells: [
      ...row(0, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(1, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(2, [2,3,4,5,6,7,8,9], 0),
      ...row(3, [4,5,6,7], 0),
      ...row(4, [6,7,8,9], 0),
      ...row(5, [2,3,4,5,6,7,8,9], 0),
      ...row(6, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(7, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(3, [4,5,6,7], 1),
      ...row(4, [6,7], 1),
    ],
  },
  // 9. Ромб
  {
    name: "Ромб",
    cells: [
      [0,5,0],[0,6,0],
      [1,4,0],[1,5,0],[1,6,0],[1,7,0],
      [2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],
      [3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,0],[3,9,0],
      [4,3,0],[4,4,0],[4,5,0],[4,6,0],[4,7,0],[4,8,0],
      [5,4,0],[5,5,0],[5,6,0],[5,7,0],
      [6,5,0],[6,6,0],
      [7,4,0],[7,5,0],[7,6,0],[7,7,0],
      [8,3,0],[8,4,0],[8,5,0],[8,6,0],[8,7,0],[8,8,0],
      [3,4,1],[3,5,1],[3,6,1],[3,7,1],
      [4,4,1],[4,5,1],[4,6,1],[4,7,1],
    ],
  },
  // 10. Спираль
  {
    name: "Спираль",
    cells: [
      ...row(0, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...col([1,2,3,4,5,6,7], 11, 0),
      ...row(7, [1,2,3,4,5,6,7,8,9,10], 0),
      ...col([2,3,4,5,6], 1, 0),
      ...row(2, [2,3,4,5,6,7,8,9], 0),
      ...col([3,4,5], 9, 0),
      ...row(5, [3,4,5,6,7,8], 0),
      ...row(3, [3,4,5,6,7], 0),
      ...row(4, [3,4,5,6,7], 1),
    ],
  },
  // 11. Стрела
  {
    name: "Стрела",
    cells: [
      ...row(4, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(3, [0,1,2,3], 0),
      ...row(5, [0,1,2,3], 0),
      ...row(2, [0,1,2], 0),
      ...row(6, [0,1,2], 0),
      [1, 0, 0],[2, 0, 0],
      ...row(4, [5,6,7,8,9,10], 1),
      ...row(4, [6,7,8,9], 2),
    ],
  },
  // 12. Звезда
  {
    name: "Звезда",
    cells: [
      [0,5,0],[0,6,0],
      [1,5,0],[1,6,0],
      [2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],
      [3,4,0],[3,5,0],[3,6,0],[3,7,0],
      [4,2,0],[4,3,0],[4,4,0],[4,5,0],[4,6,0],[4,7,0],[4,8,0],[4,9,0],
      [5,4,0],[5,5,0],[5,6,0],[5,7,0],
      [6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],
      [7,5,0],[7,6,0],
      [8,5,0],[8,6,0],
      [4,0,0],[4,1,0],[4,10,0],[4,11,0],
      [3,5,1],[3,6,1],[4,5,1],[4,6,1],[5,5,1],[5,6,1],
    ],
  },
  // 13. Воронка
  {
    name: "Воронка",
    cells: [
      ...row(0, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(8, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...col([1,2,3,4,5,6,7], 0, 0),
      ...col([1,2,3,4,5,6,7], 11, 0),
      ...col([2,3,4,5,6], 2, 0),
      ...col([2,3,4,5,6], 9, 0),
      ...col([3,4,5], 4, 0),
      ...col([3,4,5], 7, 0),
      [4,5,0],[4,6,0],
    ],
  },
  // 14. Мост
  {
    name: "Мост",
    cells: [
      ...row(3, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(5, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(4, [0,2,4,6,8,10], 0),
      ...row(3, [1,2,3,4,5,6,7,8,9,10], 1),
      ...row(5, [1,2,3,4,5,6,7,8,9,10], 1),
      ...row(3, [3,4,5,6,7,8], 2),
      ...row(5, [3,4,5,6,7,8], 2),
    ],
  },
  // 15. Сердце
  {
    name: "Сердце",
    cells: [
      [0,2,0],[0,3,0],[0,7,0],[0,8,0],
      [1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,7,0],[1,8,0],[1,9,0],[1,10,0],
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
      ...row(0, [3,4,5,6,7,8], 0),
      ...row(8, [3,4,5,6,7,8], 0),
      ...col([1,2,3,4,5,6,7], 2, 0),
      ...col([1,2,3,4,5,6,7], 9, 0),
      ...row(2, [3,4,5,6,7,8], 0),
      ...row(6, [3,4,5,6,7,8], 0),
      ...col([3,4,5], 4, 0),
      ...col([3,4,5], 7, 0),
      [4,5,0],[4,6,0],
      ...row(1, [3,4,5,6,7,8], 0),
      ...row(7, [3,4,5,6,7,8], 0),
    ],
  },
  // 17. Квадрат
  {
    name: "Квадрат",
    cells: [
      ...rect([0,1,2,3,4,5,6,7], [2,3,4,5,6,7,8,9], 0),
      ...rect([1,2,3,4,5,6], [3,4,5,6,7,8], 1),
      ...rect([2,3,4,5], [4,5,6,7], 2),
      [3,5,3],[3,6,3],
    ],
  },
  // 18. Нить
  {
    name: "Нить",
    cells: [
      ...row(0, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(2, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(4, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(6, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(8, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...row(2, [2,3,4,5,6,7,8,9], 1),
      ...row(4, [2,3,4,5,6,7,8,9], 1),
      ...row(6, [2,3,4,5,6,7,8,9], 1),
    ],
  },
  // 19. Лабиринт
  {
    name: "Лабиринт",
    cells: [
      ...row(0, [0,2,4,6,8,10], 0),
      ...row(8, [0,2,4,6,8,10], 0),
      ...col([0,1,2,3,4,5,6,7,8], 0, 0),
      ...col([0,1,2,3,4,5,6,7,8], 10, 0),
      ...col([1,2,3,4,5,6,7], 2, 0),
      ...row(2, [2,3,4,5,6,7,8], 0),
      ...col([3,4,5,6], 6, 0),
      ...row(6, [4,5,6,7,8], 0),
      ...col([3,4,5], 4, 0),
      [4,5,0],[4,6,0],[4,7,0],[4,8,0],
      [3,4,1],[4,4,1],[5,4,1],
    ],
  },
  // 20. Вихрь
  {
    name: "Вихрь",
    cells: [
      ...row(4, [0,1,2,3,4,5,6,7,8,9,10,11], 0),
      ...col([0,1,2,3,4,5,6,7], 5, 0),
      ...col([1,2,3,4,5,6], 3, 0),
      ...col([1,2,3,4,5,6], 8, 0),
      ...col([2,3,4,5], 1, 0),
      ...col([2,3,4,5], 10, 0),
      ...row(2, [2,3,4,5,6,7,8,9], 0),
      ...row(6, [3,4,5,6,7,8], 0),
      ...row(4, [4,5,6,7], 1),
      ...col([3,4,5], 5, 1),
    ],
  },
];

// Настоящие тайлы маджонга (Unicode Mahjong Tiles блок U+1F000)
export const TILE_SYMBOLS = [
  // Ветра (Winds)
  { symbol: '🀀', group: 'winds', label: 'Восток' },
  { symbol: '🀁', group: 'winds', label: 'Юг' },
  { symbol: '🀂', group: 'winds', label: 'Запад' },
  { symbol: '🀃', group: 'winds', label: 'Север' },
  // Драконы (Dragons)
  { symbol: '🀄', group: 'dragons', label: 'Красный' },
  { symbol: '🀅', group: 'dragons', label: 'Зелёный' },
  { symbol: '🀆', group: 'dragons', label: 'Белый' },
  // Бамбук 1-9
  { symbol: '🀐', group: 'bamboo', label: 'Бамбук 1' },
  { symbol: '🀑', group: 'bamboo', label: 'Бамбук 2' },
  { symbol: '🀒', group: 'bamboo', label: 'Бамбук 3' },
  { symbol: '🀓', group: 'bamboo', label: 'Бамбук 4' },
  { symbol: '🀔', group: 'bamboo', label: 'Бамбук 5' },
  { symbol: '🀕', group: 'bamboo', label: 'Бамбук 6' },
  { symbol: '🀖', group: 'bamboo', label: 'Бамбук 7' },
  { symbol: '🀗', group: 'bamboo', label: 'Бамбук 8' },
  { symbol: '🀘', group: 'bamboo', label: 'Бамбук 9' },
  // Кружки 1-9
  { symbol: '🀙', group: 'circles', label: 'Круг 1' },
  { symbol: '🀚', group: 'circles', label: 'Круг 2' },
  { symbol: '🀛', group: 'circles', label: 'Круг 3' },
  { symbol: '🀜', group: 'circles', label: 'Круг 4' },
  { symbol: '🀝', group: 'circles', label: 'Круг 5' },
  { symbol: '🀞', group: 'circles', label: 'Круг 6' },
  { symbol: '🀟', group: 'circles', label: 'Круг 7' },
  { symbol: '🀠', group: 'circles', label: 'Круг 8' },
  { symbol: '🀡', group: 'circles', label: 'Круг 9' },
  // Знаки 1-9 (Wan/Characters)
  { symbol: '🀇', group: 'chars', label: 'Знак 1' },
  { symbol: '🀈', group: 'chars', label: 'Знак 2' },
  { symbol: '🀉', group: 'chars', label: 'Знак 3' },
  { symbol: '🀊', group: 'chars', label: 'Знак 4' },
  { symbol: '🀋', group: 'chars', label: 'Знак 5' },
  { symbol: '🀌', group: 'chars', label: 'Знак 6' },
  { symbol: '🀍', group: 'chars', label: 'Знак 7' },
  { symbol: '🀎', group: 'chars', label: 'Знак 8' },
  { symbol: '🀏', group: 'chars', label: 'Знак 9' },
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
  const blockedLeft = remaining.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1
  );
  const blockedRight = remaining.some(
    t => t.id !== tile.id && t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1
  );
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
      if (free[i].symbol === free[j].symbol) return [free[i], free[j]];
    }
  }
  return null;
}

export function hasNoMoves(tiles: TileType[]): boolean {
  return findHint(tiles) === null;
}

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
  fastWins: number;
  perfectWins: number;
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
  { id: 'speed_5', name: 'Скоростной', description: '5 побед менее чем за 2 мин', icon: '🚀', color: 'blue', condition: s => s.fastWins >= 5 },
  { id: 'zen', name: 'Дзен', description: 'Сыграй 1 час суммарно', icon: '☯️', color: 'purple', condition: s => s.totalTime >= 3600 },
];

export function calculateScore(tilesLeft: number, timeSeconds: number, hintsUsed: number): number {
  const base = 1000;
  const timeBonus = Math.max(0, 300 - timeSeconds) * 2;
  const hintPenalty = hintsUsed * 50;
  return Math.max(0, base + timeBonus - hintPenalty + tilesLeft);
}