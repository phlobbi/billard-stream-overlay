import { useEffect, useState } from 'react';

const STATE_URL = 'http://localhost:3001/state';

async function postState(update) {
  await fetch(STATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
}

function PlayerControl({ id, player, onUpdate }) {
  const label = id === 'p1' ? 'Player 1' : 'Player 2';

  function changeName(e) {
    onUpdate(id, { name: e.target.value });
  }

  function changeScore(delta) {
    const next = Math.max(0, player.score + delta);
    onUpdate(id, { score: next });
  }

  function resetScore() {
    onUpdate(id, { score: 0 });
  }

  function selectBallType(type) {
    onUpdate(id, { ballType: player.ballType === type ? null : type });
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-800 rounded-2xl p-6 flex-1">
      <h2 className="text-lg font-bold text-gray-300 uppercase tracking-widest">
        {label}
      </h2>

      {/* Name */}
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-400">Name</span>
        <input
          type="text"
          value={player.name}
          onChange={changeName}
          className="bg-gray-700 text-white rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      {/* Score */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-400">Score</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeScore(-1)}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white text-2xl font-bold transition-all"
          >
            −
          </button>
          <span className="text-5xl font-black tabular-nums text-white w-16 text-center">
            {player.score}
          </span>
          <button
            onClick={() => changeScore(1)}
            className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-500 active:scale-95 text-white text-2xl font-bold transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Ball type */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-gray-400">Ball type</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => selectBallType('half')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              player.ballType === 'half'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Half
          </button>
          <button
            onClick={() => selectBallType('full')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              player.ballType === 'full'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Full
          </button>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetScore}
        className="mt-2 bg-gray-600 hover:bg-gray-500 active:scale-95 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all"
      >
        Reset score
      </button>
    </div>
  );
}

export default function Control() {
  const [state, setState] = useState({
    p1: { name: 'Player 1', score: 0, ballType: null },
    p2: { name: 'Player 2', score: 0, ballType: null },
    centerText: 'VS',
  });

  useEffect(() => {
    fetch(STATE_URL)
      .then((r) => r.json())
      .then(setState)
      .catch(() => {});
  }, []);

  async function handleUpdate(playerId, fields) {
    const otherId = playerId === 'p1' ? 'p2' : 'p1';
    const opposite = { half: 'full', full: 'half' };

    if ('ballType' in fields && fields.ballType !== null) {
      const otherBallType = opposite[fields.ballType];
      setState((prev) => ({
        ...prev,
        [playerId]: { ...prev[playerId], ...fields },
        [otherId]: { ...prev[otherId], ballType: otherBallType },
      }));
      await postState({ [playerId]: fields, [otherId]: { ballType: otherBallType } });
    } else {
      setState((prev) => ({
        ...prev,
        [playerId]: { ...prev[playerId], ...fields },
      }));
      await postState({ [playerId]: fields });
    }
  }

  async function handleCenterText(e) {
    const centerText = e.target.value;
    setState((prev) => ({ ...prev, centerText }));
    await postState({ centerText });
  }

  async function handleResetBallTypes() {
    setState((prev) => ({
      ...prev,
      p1: { ...prev.p1, ballType: null },
      p2: { ...prev.p2, ballType: null },
    }));
    await postState({ p1: { ballType: null }, p2: { ballType: null } });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-black mb-8 tracking-tight">
        🎱 Scoreboard Control
      </h1>
      <div className="flex gap-6 w-full max-w-2xl">
        <PlayerControl id="p1" player={state.p1} onUpdate={handleUpdate} />
        <PlayerControl id="p2" player={state.p2} onUpdate={handleUpdate} />
      </div>
      <div className="mt-4 w-full max-w-2xl bg-gray-800 rounded-2xl p-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Center text (shown between players)</span>
          <input
            type="text"
            value={state.centerText}
            onChange={handleCenterText}
            className="bg-gray-700 text-white rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs"
          />
        </label>
        <button
          onClick={handleResetBallTypes}
          className="bg-gray-600 hover:bg-gray-500 active:scale-95 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all self-start"
        >
          Reset ball types
        </button>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Overlay URL for OBS:{' '}
        <span className="font-mono text-indigo-400">http://localhost:3000/</span>
      </p>
    </div>
  );
}
