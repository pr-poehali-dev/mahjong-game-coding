import { useState } from 'react';
import Icon from '@/components/ui/icon';
import GameBoard from '@/components/GameBoard';
import { LAYOUTS, ACHIEVEMENTS, type Achievement, type GameStats } from '@/lib/mahjong';

type Page = 'home' | 'game' | 'levels' | 'settings' | 'achievements';

const DEFAULT_STATS: GameStats = {
  levelsCompleted: 0,
  totalScore: 0,
  fastWins: 0,
  perfectWins: 0,
  hintsUsed: 0,
  streak: 0,
  totalTime: 0,
};

function loadStats(): GameStats {
  try {
    const s = localStorage.getItem('mahjong_stats');
    return s ? { ...DEFAULT_STATS, ...JSON.parse(s) } : DEFAULT_STATS;
  } catch { return DEFAULT_STATS; }
}

function saveStats(s: GameStats) {
  localStorage.setItem('mahjong_stats', JSON.stringify(s));
}

function loadCompleted(): number[] {
  try {
    const c = localStorage.getItem('mahjong_completed');
    return c ? JSON.parse(c) : [];
  } catch { return []; }
}

function loadScores(): Record<number, number> {
  try {
    const s = localStorage.getItem('mahjong_scores');
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}

const DIFFICULTY = ['Лёгкий','Лёгкий','Лёгкий','Средний','Средний','Средний','Средний','Средний','Средний','Сложный','Сложный','Сложный','Сложный','Сложный','Сложный','Эксперт','Эксперт','Эксперт','Эксперт','Эксперт'];
const DIFF_COLOR: Record<string, string> = { 'Лёгкий':'green','Средний':'blue','Сложный':'purple','Эксперт':'pink' };

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [completedLevels, setCompletedLevels] = useState<number[]>(loadCompleted);
  const [scores, setScores] = useState<Record<number, number>>(loadScores);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showWin, setShowWin] = useState(false);
  const [winData, setWinData] = useState({ score: 0, time: 0, hints: 0 });
  const [sound, setSound] = useState(() => localStorage.getItem('mahjong_sound') !== 'off');

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.condition(stats));

  const handleWin = (score: number, timeSeconds: number, hintsUsed: number) => {
    const newCompleted = completedLevels.includes(currentLevel)
      ? completedLevels
      : [...completedLevels, currentLevel];
    const newScores = { ...scores };
    if (!newScores[currentLevel] || score > newScores[currentLevel]) {
      newScores[currentLevel] = score;
    }

    const newStats: GameStats = {
      levelsCompleted: newCompleted.length,
      totalScore: stats.totalScore + score,
      fastWins: timeSeconds < 120 ? stats.fastWins + 1 : stats.fastWins,
      perfectWins: hintsUsed === 0 ? stats.perfectWins + 1 : stats.perfectWins,
      hintsUsed: stats.hintsUsed + hintsUsed,
      streak: stats.streak + 1,
      totalTime: stats.totalTime + timeSeconds,
    };

    const prevEarned = ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);
    const newlyEarned = ACHIEVEMENTS.filter(a => a.condition(newStats) && !prevEarned.includes(a.id));

    setCompletedLevels(newCompleted);
    setScores(newScores);
    setStats(newStats);
    saveStats(newStats);
    localStorage.setItem('mahjong_completed', JSON.stringify(newCompleted));
    localStorage.setItem('mahjong_scores', JSON.stringify(newScores));

    setWinData({ score, time: timeSeconds, hints: hintsUsed });
    setShowWin(true);
    if (newlyEarned.length > 0) setNewAchievements(newlyEarned);
  };

  if (page === 'game') {
    return (
      <div>
        {showWin && (
          <WinScreen
            score={winData.score}
            time={winData.time}
            hints={winData.hints}
            newAchievements={newAchievements}
            levelName={LAYOUTS[currentLevel % LAYOUTS.length].name}
            onNext={() => {
              setShowWin(false);
              setNewAchievements([]);
              if (currentLevel < LAYOUTS.length - 1) {
                setCurrentLevel(l => l + 1);
              } else {
                setPage('levels');
              }
            }}
            onLevels={() => { setShowWin(false); setNewAchievements([]); setPage('levels'); }}
            onReplay={() => { setShowWin(false); setNewAchievements([]); }}
          />
        )}
        {!showWin && (
          <GameBoard
            layoutIndex={currentLevel}
            onWin={handleWin}
            onBack={() => setPage('levels')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav page={page} setPage={setPage} />
      {page === 'home' && (
        <HomePage
          stats={stats}
          setPage={setPage}
          setCurrentLevel={setCurrentLevel}
          completedLevels={completedLevels}
        />
      )}
      {page === 'levels' && (
        <LevelsPage
          completedLevels={completedLevels}
          scores={scores}
          setPage={setPage}
          setCurrentLevel={setCurrentLevel}
        />
      )}
      {page === 'achievements' && (
        <AchievementsPage stats={stats} earnedAchievements={earnedAchievements} />
      )}
      {page === 'settings' && (
        <SettingsPage
          sound={sound}
          setSound={setSound}
          stats={stats}
          onResetStats={() => {
            setStats(DEFAULT_STATS);
            saveStats(DEFAULT_STATS);
            setCompletedLevels([]);
            setScores({});
            localStorage.removeItem('mahjong_completed');
            localStorage.removeItem('mahjong_scores');
          }}
        />
      )}
    </div>
  );
}

function Nav({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const links: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'levels', label: 'Уровни', icon: 'LayoutGrid' },
    { id: 'achievements', label: 'Достижения', icon: 'Trophy' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  return (
    <nav className="glass-dark border-b border-white/5" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 24 }}>🀄</span>
          <span className="font-orbitron font-bold text-base gradient-text">МаджонгПортал</span>
        </div>
        <div className="flex gap-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              className={`nav-link ${page === link.id ? 'active' : ''}`}
            >
              <span className="hidden sm:inline">{link.label}</span>
              <span className="sm:hidden">
                <Icon name={link.icon as Parameters<typeof Icon>[0]['name']} size={18} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    purple: 'var(--neon-purple)',
    gold: 'var(--neon-gold)',
    blue: 'var(--neon-blue)',
    pink: 'var(--neon-pink)',
    green: 'var(--neon-green)',
  };
  return (
    <div className="glass-dark rounded-2xl p-5 text-center glow-border animate-fade-in">
      <div style={{ fontSize: 32 }} className="mb-2">{icon}</div>
      <div className="font-orbitron font-bold text-2xl mb-1" style={{ color: colorMap[color] || 'white' }}>
        {value}
      </div>
      <div className="text-white/50 text-sm font-golos">{label}</div>
    </div>
  );
}

function HomePage({ stats, setPage, setCurrentLevel, completedLevels }: {
  stats: GameStats;
  setPage: (p: Page) => void;
  setCurrentLevel: (n: number) => void;
  completedLevels: number[];
}) {
  const nextLevel = completedLevels.length < LAYOUTS.length ? completedLevels.length : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-fade-in">
        <div style={{ fontSize: 80, marginBottom: 16 }}>🀄</div>
        <h1 className="font-orbitron font-black mb-4" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', lineHeight: 1.1 }}>
          <span className="gradient-text">МАДЖОНГ</span>
          <br />
          <span style={{ color: 'white', fontSize: '0.55em', letterSpacing: '0.35em', opacity: 0.6 }}>
            ПОРТАЛ
          </span>
        </h1>
        <p className="font-golos text-white/60 text-lg max-w-md mx-auto mb-8">
          20 уникальных раскладок · система достижений · рейтинг скорости
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            className="btn-primary"
            onClick={() => { setCurrentLevel(nextLevel); setPage('game'); }}
          >
            {completedLevels.length === 0 ? '▶ Начать игру' : `▶ Уровень ${nextLevel + 1}`}
          </button>
          <button className="btn-secondary" onClick={() => setPage('levels')}>
            📋 Все уровни
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon="🎯" value={stats.levelsCompleted} label="Уровней пройдено" color="purple" />
        <StatCard icon="💰" value={stats.totalScore.toLocaleString()} label="Общий счёт" color="gold" />
        <StatCard icon="⚡" value={stats.fastWins} label="Быстрые победы" color="blue" />
        <StatCard icon="🔥" value={stats.streak} label="Серия" color="pink" />
      </div>

      <div>
        <h2 className="font-orbitron font-bold text-white mb-4 text-sm" style={{ letterSpacing: '0.12em' }}>
          РАСКЛАДКИ
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {LAYOUTS.slice(0, 10).map((layout, i) => {
            const done = completedLevels.includes(i);
            return (
              <button
                key={i}
                onClick={() => { setCurrentLevel(i); setPage('game'); }}
                className="glass-dark rounded-xl p-4 text-left transition-all duration-200 glow-border hover:scale-105"
                style={{ border: done ? '1px solid rgba(57,232,138,0.3)' : undefined }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-orbitron font-bold text-white text-sm">{i + 1}</span>
                  {done && <span style={{ color: 'var(--neon-green)', fontSize: 14 }}>✓</span>}
                </div>
                <div className="font-golos text-white/70 text-xs truncate">{layout.name}</div>
                <div className={`badge badge-${DIFF_COLOR[DIFFICULTY[i]]} mt-2`} style={{ fontSize: 9, padding: '2px 8px' }}>
                  {DIFFICULTY[i]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LevelsPage({ completedLevels, scores, setPage, setCurrentLevel }: {
  completedLevels: number[];
  scores: Record<number, number>;
  setPage: (p: Page) => void;
  setCurrentLevel: (n: number) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-orbitron font-black text-3xl text-white mb-1">УРОВНИ</h1>
          <p className="text-white/50 font-golos">{completedLevels.length} из {LAYOUTS.length} пройдено</p>
        </div>
        <div className="glass-dark rounded-xl px-5 py-3 glow-border-gold">
          <div className="font-orbitron font-bold text-xl" style={{ color: 'var(--neon-gold)' }}>
            {completedLevels.length}/{LAYOUTS.length}
          </div>
          <div className="text-white/50 text-xs text-center">Прогресс</div>
        </div>
      </div>

      <div className="progress-bar mb-8" style={{ height: 8 }}>
        <div className="progress-fill" style={{ width: `${(completedLevels.length / LAYOUTS.length) * 100}%`, height: '100%' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {LAYOUTS.map((layout, i) => {
          const done = completedLevels.includes(i);
          const score = scores[i];
          const diff = DIFFICULTY[i];
          const locked = i > completedLevels.length && !done;

          return (
            <div
              key={i}
              onClick={() => { if (!locked) { setCurrentLevel(i); setPage('game'); } }}
              className={`glass-dark rounded-2xl p-5 transition-all duration-200 ${!locked ? 'cursor-pointer hover:scale-105 glow-border' : 'opacity-40 cursor-not-allowed'}`}
              style={{
                border: done ? '1px solid rgba(57,232,138,0.4)' : undefined,
                boxShadow: done ? '0 0 20px rgba(57,232,138,0.08)' : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-orbitron font-bold text-white text-lg">{i + 1}</div>
                  <div className="font-golos text-white/70 text-sm mt-0.5">{layout.name}</div>
                </div>
                <div style={{ fontSize: 20 }}>
                  {locked ? '🔒' : done ? '✅' : '▶'}
                </div>
              </div>

              <div className={`badge badge-${DIFF_COLOR[diff]} mb-3`}>{diff}</div>

              {score ? (
                <div className="mt-2">
                  <div className="text-white/40 text-xs font-golos mb-1">Лучший счёт</div>
                  <div className="font-orbitron font-bold text-sm" style={{ color: 'var(--neon-gold)' }}>
                    {score.toLocaleString()}
                  </div>
                </div>
              ) : (
                !locked && <div className="text-white/30 text-xs font-golos mt-2">Не пройден</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AchievementsPage({ stats, earnedAchievements }: { stats: GameStats; earnedAchievements: Achievement[] }) {
  const earned = new Set(earnedAchievements.map(a => a.id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-orbitron font-black text-3xl text-white mb-1">ДОСТИЖЕНИЯ</h1>
        <p className="text-white/50 font-golos">{earnedAchievements.length} из {ACHIEVEMENTS.length} получено</p>
      </div>

      <div className="progress-bar mb-10" style={{ height: 8 }}>
        <div className="progress-fill" style={{ width: `${(earnedAchievements.length / ACHIEVEMENTS.length) * 100}%`, height: '100%' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map(a => {
          const isEarned = earned.has(a.id);
          const borderColor =
            a.color === 'gold' ? 'rgba(255,208,96,0.4)' :
            a.color === 'blue' ? 'rgba(77,201,255,0.3)' :
            a.color === 'green' ? 'rgba(57,232,138,0.3)' :
            a.color === 'pink' ? 'rgba(255,107,181,0.3)' :
            'rgba(155,89,255,0.3)';

          return (
            <div
              key={a.id}
              className="glass-dark rounded-2xl p-5 transition-all"
              style={isEarned ? { border: `1px solid ${borderColor}` } : { opacity: 0.45 }}
            >
              <div className="flex items-start gap-3">
                <div style={{ fontSize: 36, filter: isEarned ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <div className="font-orbitron font-bold text-white text-sm mb-1">{a.name}</div>
                  <div className="font-golos text-white/50 text-xs">{a.description}</div>
                  {isEarned && (
                    <div className={`badge badge-${a.color} mt-2`} style={{ fontSize: 10 }}>
                      Получено!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage({ sound, setSound, stats, onResetStats }: {
  sound: boolean;
  setSound: (s: boolean) => void;
  stats: GameStats;
  onResetStats: () => void;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-orbitron font-black text-3xl text-white mb-8">НАСТРОЙКИ</h1>

      <div className="space-y-4">
        <div className="glass-dark rounded-2xl p-6 glow-border">
          <h2 className="font-orbitron font-bold text-white mb-4 text-xs tracking-widest">ЗВУК</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-golos text-white font-medium">Звуковые эффекты</div>
              <div className="text-white/40 text-sm">Звук при совпадении тайлов</div>
            </div>
            <button
              onClick={() => { setSound(!sound); localStorage.setItem('mahjong_sound', sound ? 'off' : 'on'); }}
              style={{
                position: 'relative',
                width: 52, height: 28,
                background: sound ? 'linear-gradient(135deg, var(--neon-purple), var(--neon-blue))' : 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                cursor: 'pointer',
                transition: 'background 0.3s',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, width: 22, height: 22,
                background: 'white', borderRadius: '50%',
                transition: 'left 0.3s ease',
                left: sound ? 26 : 3,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6 glow-border">
          <h2 className="font-orbitron font-bold text-white mb-4 text-xs tracking-widest">СТАТИСТИКА</h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['Уровней пройдено', stats.levelsCompleted],
              ['Общий счёт', stats.totalScore.toLocaleString()],
              ['Быстрые победы', stats.fastWins],
              ['Победы без подсказок', stats.perfectWins],
              ['Использовано подсказок', stats.hintsUsed],
              ['Лучшая серия', stats.streak],
            ] as [string, string | number][]).map(([label, val]) => (
              <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-white/40 text-xs font-golos mb-1">{label}</div>
                <div className="font-orbitron font-bold text-white text-lg">{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6" style={{ border: '1px solid rgba(255,80,80,0.2)' }}>
          <h2 className="font-orbitron font-bold text-white mb-4 text-xs tracking-widest">ОПАСНАЯ ЗОНА</h2>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{ background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.3)', fontFamily: 'Orbitron', fontSize: 11, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
            >
              🗑 Сбросить прогресс
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-golos text-white/60 text-sm">Точно сбросить всё?</span>
              <button
                onClick={() => { onResetStats(); setConfirmReset(false); }}
                style={{ background: 'rgba(255,80,80,0.2)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.4)', fontFamily: 'Orbitron', fontSize: 11, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}
              >
                Да, сбросить
              </button>
              <button onClick={() => setConfirmReset(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 11 }}>
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WinScreen({ score, time, hints, newAchievements, levelName, onNext, onLevels, onReplay }: {
  score: number;
  time: number;
  hints: number;
  newAchievements: Achievement[];
  levelName: string;
  onNext: () => void;
  onLevels: () => void;
  onReplay: () => void;
}) {
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="confetti" style={{
          position: 'fixed',
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width: 8, height: 8,
          background: ['#9b59ff', '#4dc9ff', '#ffd060', '#39e88a', '#ff6bb5'][i % 5],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animationDuration: `${1.5 + Math.random() * 2}s`,
          animationDelay: `${Math.random() * 0.5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }} />
      ))}

      <div className="glass-dark rounded-3xl p-8 text-center animate-scale-in victory-pulse" style={{ maxWidth: 420, width: '90%' }}>
        <div style={{ fontSize: 80, marginBottom: 8 }}>🏆</div>
        <h2 className="font-orbitron font-black text-3xl gradient-text-gold mb-1">ПОБЕДА!</h2>
        <p className="text-white/50 font-golos mb-6">{levelName}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-orbitron font-bold text-xl" style={{ color: 'var(--neon-gold)' }}>{score.toLocaleString()}</div>
            <div className="text-white/40 text-xs mt-1">Счёт</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-orbitron font-bold text-xl" style={{ color: 'var(--neon-blue)' }}>{formatTime(time)}</div>
            <div className="text-white/40 text-xs mt-1">Время</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="font-orbitron font-bold text-xl" style={{ color: hints === 0 ? 'var(--neon-green)' : 'var(--neon-purple)' }}>{hints}</div>
            <div className="text-white/40 text-xs mt-1">Подсказок</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {time < 120 && <div className="badge badge-blue">⚡ Молниеносная победа!</div>}
          {hints === 0 && <div className="badge badge-purple">💎 Без подсказок!</div>}
        </div>

        {newAchievements.length > 0 && (
          <div className="mb-5">
            <div className="text-white/50 text-xs font-golos mb-2">Новые достижения:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {newAchievements.map(a => (
                <div key={a.id} className={`badge badge-${a.color}`}>
                  {a.icon} {a.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-center flex-wrap">
          <button onClick={onReplay} className="btn-secondary" style={{ padding: '10px 18px', fontSize: 11 }}>↺ Повтор</button>
          <button onClick={onNext} className="btn-primary">Следующий →</button>
          <button onClick={onLevels} className="btn-secondary" style={{ padding: '10px 18px', fontSize: 11 }}>📋 Уровни</button>
        </div>
      </div>
    </div>
  );
}