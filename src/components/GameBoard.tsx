import { useState, useEffect, useCallback, useRef } from 'react';
import { TileType, generateTiles, isTileFree, findHint, hasNoMoves, calculateScore } from '@/lib/mahjong';
import { LAYOUTS } from '@/lib/mahjong';
import Icon from '@/components/ui/icon';

interface GameBoardProps {
  layoutIndex: number;
  onWin: (score: number, timeSeconds: number, hintsUsed: number) => void;
  onBack: () => void;
}

export default function GameBoard({ layoutIndex, onWin, onBack }: GameBoardProps) {
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [selected, setSelected] = useState<TileType | null>(null);
  const [time, setTime] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintTiles, setHintTiles] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [noMoves, setNoMoves] = useState(false);
  const [won, setWon] = useState(false);
  const [particles, setParticles] = useState<{id:number;x:number;y:number;color:string}[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const layout = LAYOUTS[layoutIndex % LAYOUTS.length];

  const initGame = useCallback(() => {
    const newTiles = generateTiles(layoutIndex);
    setTiles(newTiles);
    setSelected(null);
    setTime(0);
    setHintsUsed(0);
    setHintTiles([]);
    setMatchedCount(0);
    setNoMoves(false);
    setWon(false);
    setParticles([]);
  }, [layoutIndex]);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [layoutIndex]);

  useEffect(() => {
    if (won && timerRef.current) clearInterval(timerRef.current);
  }, [won]);

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const spawnParticles = (x: number, y: number) => {
    const colors = ['#9b59ff','#4dc9ff','#ffd060','#39e88a','#ff6bb5'];
    const newParticles = Array.from({length: 8}, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 60 - 30,
      y: y + Math.random() * 60 - 30,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(p => [...p, ...newParticles]);
    setTimeout(() => setParticles(p => p.filter(pt => !newParticles.find(n => n.id === pt.id))), 1200);
  };

  const handleTileClick = (tile: TileType, e: React.MouseEvent) => {
    if (tile.matched || won) return;
    if (!isTileFree(tile, tiles)) return;

    setHintTiles([]);

    if (!selected) {
      setSelected(tile);
      setTiles(prev => prev.map(t => ({ ...t, selected: t.id === tile.id })));
      return;
    }

    if (selected.id === tile.id) {
      setSelected(null);
      setTiles(prev => prev.map(t => ({ ...t, selected: false })));
      return;
    }

    if (selected.symbol === tile.symbol) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      spawnParticles(rect.left + rect.width/2, rect.top + rect.height/2);

      setTiles(prev => prev.map(t =>
        t.id === selected.id || t.id === tile.id
          ? { ...t, matched: true, selected: false }
          : { ...t, selected: false }
      ));
      setSelected(null);
      const newMatchedCount = matchedCount + 2;
      setMatchedCount(newMatchedCount);

      setTimeout(() => {
        setTiles(prev => {
          const remaining = prev.filter(t => !t.matched);
          if (remaining.length === 0) {
            setWon(true);
            const score = calculateScore(0, time, hintsUsed);
            setTimeout(() => onWin(score, time, hintsUsed), 800);
          } else if (hasNoMoves(prev)) {
            setNoMoves(true);
          }
          return prev;
        });
      }, 400);
    } else {
      setSelected(tile);
      setTiles(prev => prev.map(t => ({ ...t, selected: t.id === tile.id })));
    }
  };

  const handleHint = () => {
    const hint = findHint(tiles.filter(t => !t.matched));
    if (hint) {
      setHintsUsed(h => h + 1);
      setHintTiles([hint[0].id, hint[1].id]);
      setTimeout(() => setHintTiles([]), 2400);
    }
  };

  const remaining = tiles.filter(t => !t.matched).length;
  const total = tiles.length;
  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0;

  // Group tiles by layer for rendering
  const tilesByLayer = tiles.reduce((acc, tile) => {
    if (!acc[tile.layer]) acc[tile.layer] = [];
    acc[tile.layer].push(tile);
    return acc;
  }, {} as Record<number, TileType[]>);

  const CELL_W = 52;
  const CELL_H = 60;
  const maxRow = Math.max(...tiles.map(t => t.row)) + 1;
  const maxCol = Math.max(...tiles.map(t => t.col)) + 1;
  const boardW = maxCol * CELL_W + 40;
  const boardH = maxRow * CELL_H + 40;

  return (
    <div className="min-h-screen flex flex-col" style={{paddingTop: '80px'}}>
      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'fixed', left: p.x, top: p.y, width: 8, height: 8,
          borderRadius: '50%', background: p.color, pointerEvents: 'none',
          animation: 'particle-float 1.2s ease forwards', zIndex: 999
        }}/>
      ))}

      {/* Header */}
      <div className="glass-dark border-b border-white/5 px-4 py-3" style={{position:'fixed',top:0,left:0,right:0,zIndex:100}}>
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="btn-secondary" style={{padding:'8px 16px',fontSize:'11px'}}>
            ← Назад
          </button>
          <div className="flex-1">
            <h2 className="font-orbitron text-sm font-bold text-white">{layout.name}</h2>
            <div className="progress-bar mt-1" style={{width:'180px'}}>
              <div className="progress-fill" style={{width:`${progress}%`}}/>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <div className="font-orbitron text-lg font-bold neon-blue">{formatTime(time)}</div>
              <div className="text-xs text-white/40">Время</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-lg font-bold neon-gold">{remaining}</div>
              <div className="text-xs text-white/40">Плиток</div>
            </div>
            <button onClick={handleHint} className="btn-secondary" style={{padding:'8px 14px',fontSize:'11px'}}>
              💡 Подсказка {hintsUsed > 0 && <span className="opacity-60">({hintsUsed})</span>}
            </button>
            <button onClick={initGame} className="btn-secondary" style={{padding:'8px 14px',fontSize:'11px'}}>
              ↺ Перемешать
            </button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div style={{position:'relative', width: boardW, height: boardH, margin: '0 auto'}}>
          {Object.entries(tilesByLayer)
            .sort(([a], [b]) => Number(a) - Number(b))
            .flatMap(([, layerTiles]) =>
              layerTiles.map(tile => {
                if (tile.matched) return null;
                const isFree = isTileFree(tile, tiles);
                const isSelected = tile.selected;
                const isHint = hintTiles.includes(tile.id);

                const x = tile.col * CELL_W + tile.layer * 3 + 16;
                const y = tile.row * CELL_H - tile.layer * 3 + 16;

                return (
                  <div
                    key={tile.id}
                    onClick={(e) => handleTileClick(tile, e)}
                    className={`tile ${!isFree ? 'tile-blocked' : ''} ${isSelected ? 'tile-selected' : ''} ${isHint ? 'hint-flash' : ''}`}
                    style={{
                      position: 'absolute',
                      left: x, top: y,
                      width: CELL_W - 4,
                      height: CELL_H - 4,
                      zIndex: tile.layer * 10 + (isSelected ? 100 : 0),
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(155,89,255,0.5) 0%, rgba(77,201,255,0.3) 100%)'
                        : isFree
                          ? 'linear-gradient(135deg, rgba(40,40,80,0.95) 0%, rgba(25,25,60,0.98) 100%)'
                          : 'linear-gradient(135deg, rgba(20,20,40,0.8) 0%, rgba(15,15,35,0.9) 100%)',
                      border: isSelected
                        ? '1.5px solid rgba(155,89,255,0.9)'
                        : isHint
                          ? '1.5px solid rgba(255,208,96,0.9)'
                          : isFree
                            ? '1px solid rgba(155,89,255,0.35)'
                            : '1px solid rgba(100,100,150,0.2)',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(155,89,255,0.4), inset 0 0 15px rgba(155,89,255,0.1), 2px 2px 0 rgba(0,0,0,0.5)'
                        : isFree
                          ? '0 3px 10px rgba(0,0,0,0.4), 2px 2px 0 rgba(0,0,0,0.4), inset 0 0 8px rgba(155,89,255,0.05)'
                          : '1px 1px 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    {tile.symbol}
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* No moves overlay */}
      {noMoves && !won && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)'}}>
          <div className="glass-dark rounded-2xl p-8 text-center animate-scale-in glow-border" style={{maxWidth:360}}>
            <div style={{fontSize:64}} className="mb-4">😔</div>
            <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Ходов нет!</h2>
            <p className="text-white/60 mb-6 font-golos">Нет доступных пар. Попробуй перемешать плитки.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={initGame} className="btn-primary">Перемешать</button>
              <button onClick={onBack} className="btn-secondary">К уровням</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
