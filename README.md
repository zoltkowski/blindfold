# Blindfold Chess Web App

Blindfold training web app built with Lichess `chessground`.

## Features

- Lichess board component (`chessground`)
- Display modes:
  - Normal pieces
  - Same color pieces (both sides shown as white pieces)
  - Different color disks
  - Same color disks
  - No pieces
  - Show white only / show black only
  - White pieces + black disks / black pieces + white disks
- Move entry:
  - Drag and drop / click-click on board
  - Keyboard input (SAN or UCI)
  - Voice input (Web Speech API)
- English and Polish notation input support
- Optional speech for computer moves
- Optional figurine notation in move list and last move
- Show/hide move list button
- Reveal position toggle button
- Engine: Stockfish only
- Stockfish Elo slider (extended lower range)
- Lichess puzzle loader with configurable context (`-n` plies), immediate solving via text/voice, and board navigation (`Back`/`Forward`)
- Puzzle mode `Show Solution` button that auto-plays the full official Lichess solution line and fills move list

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in terminal.
