import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;

let state = {
  p1: { name: 'Player 1', score: 0, ballType: null },
  p2: { name: 'Player 2', score: 0, ballType: null },
  centerText: 'VS',
};

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.options('/{*path}', (_req, res) => res.sendStatus(204));
app.use(express.json());

app.get('/state', (_req, res) => {
  res.json(state);
});

app.post('/state', (req, res) => {
  const { p1, p2, centerText } = req.body;
  if (p1) state.p1 = { ...state.p1, ...p1 };
  if (p2) state.p2 = { ...state.p2, ...p2 };
  if (centerText !== undefined) state.centerText = centerText;
  broadcast(state);
  res.json(state);
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(state));
});

server.listen(PORT, () => {
  console.log(`State server running on http://localhost:${PORT}`);
});
