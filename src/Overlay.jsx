import { useEffect, useState } from 'react';

const STATE_URL = 'http://localhost:3001/state';
const WS_URL = 'ws://localhost:3001';

const defaultState = {
  p1: { name: 'Player 1', score: 0, ballType: null },
  p2: { name: 'Player 2', score: 0, ballType: null },
  centerText: 'VS',
};

function BallIcon({ type }) {
  if (!type) return null;

  const isFull = type === 'full';
  return (
    <span
      data-testid="ball-icon"
      title={isFull ? 'Full' : 'Half'}
      className="inline-block w-6 h-6 rounded-full border-2 border-white shrink-0"
      style={{
        background: isFull
          ? '#ff0909'
          : 'linear-gradient(to bottom, #ff0909 30%, white 30%, white 70%, #ff0909 70%)',
        boxShadow: '1px 1px 4px rgba(0,0,0,0.8)',
      }}
    />
  );
}

function PlayerPanel({ player, align }) {
  const isLeft = align === 'left';

  return (
    <div className={`flex-1 flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-end gap-4 px-6 py-4`}>
      {/* Score block */}
      <div className={`flex flex-col ${isLeft ? 'items-start' : 'items-end'} leading-none`}>
        <span
          className="text-7xl font-black tabular-nums"
          style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}
        >
          {player.score}
        </span>
        <div className={`flex items-center gap-2 mt-1 ${isLeft ? '' : 'flex-row-reverse'}`}>
          <span
            className="text-2xl font-bold uppercase tracking-widest"
            style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.9)' }}
          >
            {player.name}
          </span>
          <BallIcon type={player.ballType} />
        </div>
      </div>
    </div>
  );
}

export default function Overlay() {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    fetch(STATE_URL)
      .then((r) => r.json())
      .then(setState)
      .catch(() => {});

    const ws = new WebSocket(WS_URL);
    ws.onmessage = (e) => {
      try {
        setState(JSON.parse(e.data));
      } catch {}
    };
    return () => ws.close();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full flex text-white pointer-events-none">
      <PlayerPanel player={state.p1} align="left" />

      {/* Center divider */}
      <div className="flex items-end pb-4 px-2">
        <span
          className="text-4xl font-black opacity-60"
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9)' }}
        >
          {state.centerText}
        </span>
      </div>

      <PlayerPanel player={state.p2} align="right" />
    </div>
  );
}
