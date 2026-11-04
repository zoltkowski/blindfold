# Blindfold Chess Web App

Blindfold training web app built with Lichess `chessground`.

## https://blindfold-chess.pages.dev/

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
- New Game uses [Maia 3 5M](https://github.com/CSSLab/maia3) with a configurable rating from 600 to 2600. The browser downloads and caches the [ONNX model](https://huggingface.co/cemoss17/maia3-onnx/tree/2a8295492e802fdea829cc9d30d8ad42fc3c7f72) on first use and runs it locally.
- Exercises use [Stockfish 19](https://github.com/official-stockfish/Stockfish/releases/tag/sf_19) via [Stockfish.js 19.0.1](https://github.com/nmrugg/stockfish.js/releases/tag/v19.0.1) Lite single-threaded WebAssembly (GPL-3.0).
- Lichess puzzle loader with configurable context (`-n` plies), immediate solving via text/voice, and board navigation (`Back`/`Forward`)
- Puzzle mode `Show Solution` button that auto-plays the full official Lichess solution line and fills move list

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in terminal.
