# Billiard Stream Overlay

A real-time scoreboard overlay for billiard/pool streams for an internal event. Designed to be used as a browser source in OBS (or any similar streaming software), it displays a live scoreboard at the bottom of the screen that updates instantly as scores change.

## How It Works

The project consists of three parts:

- **Overlay** (`/`) — A transparent, full-width scoreboard pinned to the bottom of the screen. It shows each player's name and score along with a configurable center label (e.g. "VS"). Add this URL as a browser source in OBS.
- **Control panel** (`/control`) — A dark web UI for managing the match in real time. You can edit player names, increment/decrement scores, reset scores, and change the center text.
- **State server** (`state-server.js`) — A lightweight Express + WebSocket server running on port 3001. It holds the current match state in memory and pushes updates to all connected overlay clients instantly via WebSocket.

## Folder Structure

```
billard-stream-overlay
├── public/
│   └── robots.txt
├── src/
│   ├── App.jsx          # Router: / → Overlay, /control → Control
│   ├── Overlay.jsx      # OBS browser source overlay
│   ├── Control.jsx      # Scoreboard control panel
│   ├── index.jsx
│   └── index.css
├── state-server.js      # Express + WebSocket state server (port 3001)
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

Install dependencies:

```
npm install
```

Start the entire stack with:

```
npm run start
```

This runs the Vite dev server on **http://localhost:3000** and the state server on **http://localhost:3001** concurrently.
Make sure that these ports are not already in use.

| URL                          | Purpose                              |
| ---------------------------- | ------------------------------------ |
| http://localhost:3000/       | Overlay — add as OBS browser source  |
| http://localhost:3000/control | Control panel — manage the match    |

## Usage with OBS

1. Run `npm run start`.
2. In OBS, add a **Browser Source** and set the URL to `http://localhost:3000/`.
3. Set the browser source dimensions to match your canvas (e.g. 1920×1080) and enable **transparent background**.
4. Open `http://localhost:3000/control` in a browser window to control the scoreboard live.

## License

This project is licensed under the terms of the [MIT license](LICENSE).
