import { useEffect, useState } from 'react';

const STATE_URL = 'http://localhost:3001/state';
const WS_URL = 'ws://localhost:3001';

const defaultState = {
  p1: { name: 'Player 1', score: 0 },
  p2: { name: 'Player 2', score: 0 },
  centerText: 'VS',
};

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
        <span
          className="text-2xl font-bold mt-1 uppercase tracking-widest"
          style={{ textShadow: '1px 1px 6px rgba(0,0,0,0.9)' }}
        >
          {player.name}
        </span>
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
