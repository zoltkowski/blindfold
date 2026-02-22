import { Chess } from 'chess.js';
import { Chessground } from '@lichess-org/chessground';
import '@lichess-org/chessground/assets/chessground.base.css';
import '@lichess-org/chessground/assets/chessground.brown.css';
import '@lichess-org/chessground/assets/chessground.cburnett.css';
import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="layout">
    <section class="left-col">
        <div class="board-shell">
          <div id="board" class="board"></div>
        </div>
      <div class="board-actions">
        <div class="board-actions-left">
          <button id="rotateBoardBtn" class="icon-rotate-btn" type="button" aria-label="Rotate board" title="Rotate board">↻</button>
          <button id="openConfigBtn" class="icon-config-btn" type="button" aria-label="Open configuration">⚙</button>
        </div>
        <div class="board-actions-main">
          <button id="newGameBtn" type="button">New Game</button>
          <button id="loadPuzzleBtn" type="button">Lichess Puzzle</button>
          <button id="blindPuzzlesBtn" type="button">Blind Puzzles</button>
        </div>
        <button id="revealBtn" class="icon-eye-btn" type="button" aria-label="Reveal position" title="Reveal position">👁</button>
      </div>
    </section>

    <section class="right-col">
      <h1>Blindfold Chess Trainer</h1>

      <div class="grid-controls">
        <label id="displayModeRow">
          Board View Mode
          <select id="displayMode">
            <option value="normal-pieces">Normal Pieces</option>
            <option value="same-pieces">Same Color Pieces</option>
            <option value="different-disks">Different Color Disks</option>
            <option value="same-disks">Same Color Disks</option>
            <option value="no-pieces">No Pieces, Move Marks</option>
            <option value="no-pieces-no-marks">No Pieces, No Move Marks</option>
            <option value="no-board">No Board</option>
            <option value="white-only">Show White, Hide Black</option>
            <option value="black-only">Show Black, Hide White</option>
            <option value="white-pieces-black-disks">White Pieces, Black Disks</option>
            <option value="black-pieces-white-disks">Black Pieces, White Disks</option>
          </select>
        </label>
      </div>

      <div id="configModal" class="config-modal" hidden>
        <div class="config-card">
          <div class="config-head">
            <strong>Configuration</strong>
            <button id="closeConfigBtn" type="button">Close</button>
          </div>
          <div class="grid-controls">
            <label>
              Move Input Language
              <select id="moveLanguage">
                <option value="pl">Polish Notation</option>
                <option value="en">English Notation</option>
              </select>
            </label>

            <label>
              <span class="engine-meta"><span>Stockfish Elo</span>: <span id="optionStrengthValue">1700</span></span>
              <input id="optionEngineStrength" type="range" min="400" max="2850" step="50" value="1700" />
            </label>

            <label class="checkbox-row">
              <input id="speakComputer" type="checkbox" />
              Hear Computer Moves
            </label>
            <label class="checkbox-row">
              <input id="voiceSticky" type="checkbox" checked />
              Sticky Voice Button
            </label>
            <label class="checkbox-row">
              <input id="speakCheck" type="checkbox" />
              Speak Checks
            </label>
            <label class="checkbox-row">
              <input id="figurineNotation" type="checkbox" checked />
              Use Figurine Notation
            </label>
            <label class="checkbox-row">
              <input id="showBlindDests" type="checkbox" checked />
              Show legal target dots after source click
            </label>
            <label class="checkbox-row">
              <input id="puzzleAutoOpponent" type="checkbox" checked />
              Auto-play opponent moves
            </label>
            <label class="checkbox-row">
              <input id="darkMode" type="checkbox" />
              Dark Mode
            </label>
            <label class="checkbox-row">
              <input id="showOnScreenKeyboard" type="checkbox" />
              Show On-Screen Keyboard
            </label>
            <label>
              Puzzle Difficulty
              <select id="puzzleDifficulty">
                <option value="easiest" selected>easiest</option>
                <option value="easier">easier</option>
                <option value="normal">normal</option>
                <option value="harder">harder</option>
                <option value="hardest">hardest</option>
              </select>
            </label>
            <label>
              Blind Puzzle Questions
              <input id="blindQuestionCount" type="number" min="1" max="200" step="1" value="25" />
            </label>
            <label>
              Puzzle Backtrack (plies)
              <input id="puzzleBacktrack" type="number" min="0" max="20" step="1" value="2" />
            </label>
          </div>
        </div>
      </div>

      <div class="puzzle-panel" id="puzzlePanel" hidden>
        <div class="puzzle-head-row"><span><strong>Puzzle:</strong> <span id="puzzleMeta">-</span></span><button id="showSolutionBtn" type="button" disabled>Show Solution</button></div>
        <div><strong>Moves:</strong> <span id="puzzleContext">-</span></div>
      </div>

      <div class="puzzle-panel blind-panel" id="blindPanel" hidden>
        <div class="blind-buttons">
          <button id="blindSquareColorsBtn" type="button">Square Colors</button>
          <button id="blindBishopBtn" type="button">♗ Movements</button>
          <button id="blindKnightBtn" type="button">♘ Movements</button>
          <button id="blindCheckBtn" type="button">Check</button>
          <button id="blindKRookBtn" type="button">♔+♖ Matting</button>
          <button id="blindKQueenBtn" type="button">♔+♕ Matting</button>
          <button id="blindPositionBtn" type="button">Position</button>
          <button id="blindGameBtn" type="button">Game</button>
        </div>
        <div><strong>Position:</strong> <span id="blindPrompt">-</span></div>
        <div><strong>Progress:</strong> <span id="blindProgress">-</span></div>
        <div><strong>Correct:</strong> <span id="blindCorrect">0</span></div>
        <div><strong>Time:</strong> <span id="blindTimer">00:00</span></div>
      </div>

      <div id="moveInputs" class="move-inputs">
        <form id="moveForm">
          <div class="move-form-row">
            <input id="moveInput" type="text" autocomplete="off" placeholder="Wpisz ruch (np. Sf3 albo e2e4)" />
            <button type="submit">Play Move</button>
            <button id="clearMoveInputBtn" type="button">Clear</button>
          </div>
          <div id="moveAssist" class="move-assist">
            <div class="assist-row assist-pieces">
              <button type="button" class="assist-btn assist-piece-btn" data-assist-piece="k">♔</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-piece="q">♕</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-piece="r">♖</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-piece="b">♗</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-piece="n">♘</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-token="O-O">O-O</button>
              <button type="button" class="assist-btn assist-piece-btn" data-assist-token="O-O-O">O-O-O</button>
            </div>
            <div class="assist-row assist-files">
              <button type="button" class="assist-btn" data-assist-token="a">a</button>
              <button type="button" class="assist-btn" data-assist-token="b">b</button>
              <button type="button" class="assist-btn" data-assist-token="c">c</button>
              <button type="button" class="assist-btn" data-assist-token="d">d</button>
              <button type="button" class="assist-btn" data-assist-token="e">e</button>
              <button type="button" class="assist-btn" data-assist-token="f">f</button>
              <button type="button" class="assist-btn" data-assist-token="g">g</button>
              <button type="button" class="assist-btn" data-assist-token="h">h</button>
            </div>
            <div class="assist-row assist-ranks">
              <button type="button" class="assist-btn" data-assist-token="1">1</button>
              <button type="button" class="assist-btn" data-assist-token="2">2</button>
              <button type="button" class="assist-btn" data-assist-token="3">3</button>
              <button type="button" class="assist-btn" data-assist-token="4">4</button>
              <button type="button" class="assist-btn" data-assist-token="5">5</button>
              <button type="button" class="assist-btn" data-assist-token="6">6</button>
              <button type="button" class="assist-btn" data-assist-token="7">7</button>
              <button type="button" class="assist-btn" data-assist-token="8">8</button>
            </div>
          </div>
        </form>
        <div class="voice-controls">
          <button id="voiceOnceBtn" type="button">Listen Once</button>
          <button id="voiceStickyBtn" type="button">Voice: Off</button>
        </div>
        <div id="voiceStatus" class="muted"></div>
      </div>

      <div id="statusRow" class="status-row">
        <strong>Status:</strong>
        <span id="statusText">White to move</span>
      </div>
      <div id="lastMoveRow" class="last-move-row">
        <strong>Last move:</strong>
        <span id="lastMoveText" class="last-move-text">-</span>
      </div>

      <div id="movesPanel" class="moves-panel">
        <button id="toggleMovesBtn" type="button">Show Moves</button>
        <div id="reviewNav" class="review-nav">
          <button id="reviewPrevBtn" type="button">Prev</button>
          <button id="reviewNextBtn" type="button">Next</button>
        </div>
        <div id="movesWrap" class="moves-wrap">
          <table id="movesTable" class="moves-table">
            <thead>
              <tr>
                <th>#</th>
                <th>White</th>
                <th>Black</th>
              </tr>
            </thead>
            <tbody id="movesBody"></tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
`;

const elements = {
  board: document.getElementById('board'),
  boardShell: document.querySelector('.board-shell'),
  rotateBoardBtn: document.getElementById('rotateBoardBtn'),
  openConfigBtn: document.getElementById('openConfigBtn'),
  closeConfigBtn: document.getElementById('closeConfigBtn'),
  configModal: document.getElementById('configModal'),
  displayModeRow: document.getElementById('displayModeRow'),
  displayMode: document.getElementById('displayMode'),
  moveLanguage: document.getElementById('moveLanguage'),
  optionEngineStrength: document.getElementById('optionEngineStrength'),
  optionStrengthValue: document.getElementById('optionStrengthValue'),
  speakComputer: document.getElementById('speakComputer'),
  voiceSticky: document.getElementById('voiceSticky'),
  speakCheck: document.getElementById('speakCheck'),
  figurineNotation: document.getElementById('figurineNotation'),
  showBlindDests: document.getElementById('showBlindDests'),
  darkMode: document.getElementById('darkMode'),
  showOnScreenKeyboard: document.getElementById('showOnScreenKeyboard'),
  puzzlePanel: document.getElementById('puzzlePanel'),
  puzzleBacktrack: document.getElementById('puzzleBacktrack'),
  blindQuestionCount: document.getElementById('blindQuestionCount'),
  puzzleAutoOpponent: document.getElementById('puzzleAutoOpponent'),
  puzzleDifficulty: document.getElementById('puzzleDifficulty'),
  loadPuzzleBtn: document.getElementById('loadPuzzleBtn'),
  blindPuzzlesBtn: document.getElementById('blindPuzzlesBtn'),
  showSolutionBtn: document.getElementById('showSolutionBtn'),
  puzzleMeta: document.getElementById('puzzleMeta'),
  puzzleContext: document.getElementById('puzzleContext'),
  blindPanel: document.getElementById('blindPanel'),
  blindGameBtn: document.getElementById('blindGameBtn'),
  blindPositionBtn: document.getElementById('blindPositionBtn'),
  blindSquareColorsBtn: document.getElementById('blindSquareColorsBtn'),
  blindBishopBtn: document.getElementById('blindBishopBtn'),
  blindKnightBtn: document.getElementById('blindKnightBtn'),
  blindCheckBtn: document.getElementById('blindCheckBtn'),
  blindKRookBtn: document.getElementById('blindKRookBtn'),
  blindKQueenBtn: document.getElementById('blindKQueenBtn'),
  blindPrompt: document.getElementById('blindPrompt'),
  blindProgress: document.getElementById('blindProgress'),
  blindCorrect: document.getElementById('blindCorrect'),
  blindTimer: document.getElementById('blindTimer'),
  moveInputs: document.getElementById('moveInputs'),
  moveForm: document.getElementById('moveForm'),
  moveInput: document.getElementById('moveInput'),
  clearMoveInputBtn: document.getElementById('clearMoveInputBtn'),
  moveAssist: document.getElementById('moveAssist'),
  voiceOnceBtn: document.getElementById('voiceOnceBtn'),
  voiceStickyBtn: document.getElementById('voiceStickyBtn'),
  voiceStatus: document.getElementById('voiceStatus'),
  statusRow: document.getElementById('statusRow'),
  statusText: document.getElementById('statusText'),
  lastMoveRow: document.getElementById('lastMoveRow'),
  lastMoveText: document.getElementById('lastMoveText'),
  toggleMovesBtn: document.getElementById('toggleMovesBtn'),
  reviewNav: document.getElementById('reviewNav'),
  reviewPrevBtn: document.getElementById('reviewPrevBtn'),
  reviewNextBtn: document.getElementById('reviewNextBtn'),
  movesPanel: document.getElementById('movesPanel'),
  movesWrap: document.getElementById('movesWrap'),
  movesBody: document.getElementById('movesBody'),
  revealBtn: document.getElementById('revealBtn'),
  newGameBtn: document.getElementById('newGameBtn')
};

const assistPieceButtons = Array.from(document.querySelectorAll('[data-assist-piece]'));

const SETTINGS_KEY = 'blindfold_chess_settings_v1';
const POSITION_SOLVED_KEY = 'blind_position_solved_v1';
const GAME_SOLVED_KEY = 'blind_game_solved_v1';

const POSITION_EXERCISE_LINES = `
białe: Ka7 P:a6  czarne: Kc6 – posunięcie czarnych
białe: Ka1 P:f5,g5,h5  czarne: Ka3 P:f7,g7,h7 – posunięcie białych
białe: Kc6 P:b5  czarne: Kc8– posunięcie białych
białe: Kh1 Ga1  czarne: Kg6 Gf8 P:g7,h7,h6 – posunięcie białych
białe: Kb1 p:f5,g5,h5 czarne: Kb3 p:f7,g7,h7 ruch białych
białe: Kh2 Hb3 czarne:Kb1 p:c2
białe: Kb6,P:b5  czarne:Kb8 Białe zaczynają.
białe: Kc4,P:e5, g5  czarne:Ke6,P:b4,c5 Białe zaczynają.
białe: Kb6, Gh5, Gf1 czarne: Kb8, Wd7 Białe zaczynają.
białe: Kb6 P: c6 czarne: Ka1, Wd5 Białe zaczynają.
białe: Ke3,P:g2, d4, a4, b4  czarne:Kd5,P:a7, b7, e4, g5 Białe zaczynają.
białe: Kf1, We8, P:e7  czarne: Kc7, Wa2 Białe zaczynają.
białe: Ka5, Gg1 P:a6 czarne: Kc7 Białe zaczynają.
białe: Kb1,P:e4  czarne:Kc5,P:d6 Białe zaczynają.
białe: Kg2,P:f3  czarne:Kd1,P:e5,g5 Białe zaczynają.
białe: Kh5, Gb1 P:h6 czarne: Kf7 Białe zaczynają.
białe: Ke2, Wh8 P: h7  czarne: Kd7, Wh1 Białe zaczynają.
białe: Kf5, P: d5  czarne: Kb6, P: d6 Białe zaczynają.
białe: Kd1, P: b4  czarne: Kf8 Białe zaczynają.
białe: Kf1, P: g2  czarne: Kc8, P: h5 Białe zaczynają.
białe: Kg2, P: f3  czarne: Kd1, P: e5, g5 Białe zaczynają.
białe:Ke5, Gg4, P: h3  czarne: Kh4, P: g5, h5 Białe zaczynają.
białe: Kf1, P: a2, d4  czarne: Kf3, P: e6, f7 Białe zaczynają.
białe: Kg4, P: a6, a5  czarne: Kc6, P: g5, h4 Białe zaczynają.
białe: Kh1, P: a5, b5, c5 czarne: Kh3, P: a7, b7, c7 Białe zaczynają.
białe: Kf7, P: a6 czarne: Kb2, P: a7 Białe zaczynają.
białe: Kb2, Hd6, Gc5 czarne: Ke8 Białe zaczynają.
białe: Kg2, Gc5, Hg5  czarne: Ke8 Białe zaczynają.
białe: Kc6, Wh7, Hh4 czarne: Ke8 Białe zaczynają.
białe: Ke8  czarne: Kd2, Hg5, Sd5 Czarne zaczynają.
białe: Kh8, P: c6  czarne: Ka6, P: h5 Białe zaczynają.
białe: Kd1, Wh8, P: b3  czarne: Kf2, Wb2, P: f4 Białe zaczynają.
białe: Kh3, Wg2, Se5 czarne: Kb8,Wc8, P: b7, c7 Białe zaczynają.
białe: Kb1, Wc1, P: b2, c2  czarne: Kb5, Wd4, Sf1 Czarne zaczynają.
białe: Kc5, Hc6 czarne: Kb8, Wh5 Białe zaczynają.
białe: Kc1, Sd2, Wd1 czarne: Kg8, Gd6, Gf5 Czarne zaczynają.
białe: Kg1, Wh1, Sh2 czarne: Kg8, Gh3, Gd6 Czarne zaczynają.
białe: Kf1, Gb4, Ga6 czarne: Kb8, Wa8, Ga7 Białe zaczynają.
białe: Kh1, Gh6, Gc2 czarne: Kg8, Wh8, Sh7 Białe zaczynają.
białe: Kh5, P: h4, g4 czarne: Kg7, P: h6, f7, f6 Czarne zaczynają.
białe: Ka5, P: h4, h5  czarne: Kb3, P: g7 Białe zaczynają.
białe: Kg3, Wg5, P: h4 czarne: Kf6, We4, P: h5, g6 Czarne zaczynają.
białe: Kh3, P: c2  czarne: Kh6, P: b4 Białe zaczynają.
białe: Kd2, Sb1 P: a6  czarne: Kf5, P: e4, h3 Białe zaczynają.
białe: Kh5, Sg5, P: g6, h7  czarne: Kh8, Wf8 Białe zaczynają.
białe: Kd8, Sd6, Sc5  czarne: Kb8, Sc8, Sa7 Białe zaczynają.
białe: Kc2, P: b2 czarne: Kf6, P: a4 Białe zaczynają.
białe: Kc1, P: b3  czarne: Ke8 Białe zaczynają.
białe: Ke1, Wf4, Wh1 czarne: Kg3 Białe zaczynają i dają mata w dwóch ruchach.
białe: Ke1, Wd2, Wa1 czarne: Kg1 Białe zaczynają i dają mata w jednym ruchu.
białe: Kf1, Wa8, P: a7 czarne: Kf7, Wa2 Białe zaczynają.
białe: Kg1, Hd2, Wd1 czarne: Kh8, Sf7, P: g7, h7 Białe zaczynają.
białe: Kg1, Hd2, Wd1  czarne: Kh8, Wb8, P: g7, h7 Białe zaczynają.
białe: Kg1, Wa1, P: f2, g2, h2 czarne: Kg8, Hd7, Wd8 Czarne zaczynają.
białe: Kg1, Wd1, Wd2  czarne: Kg8, Wa8, P: f7, g7, h7, f6 Białe zaczynają.
białe: Kb1, Wc1, P: b2, c2 czarne: Kg8, Wh4, Se4 Czarne zaczynają.
białe: Kg3, Wa5, Sd5 czarne: Kg8, Wf8, P: f7, g7 Białe zaczynają.
białe: Kg3, Wf2, Se5  czarne: Kb8, Wc8, P: b7, c7 Białe zaczynają.
białe: Kc3, Gc4, Wa2  czarne: Kd1, We8 Białe zaczynają.
białe: Kc6, Gf4, P: c7  czarne: Ka7, Sa8, P: a6 Białe zaczynają.
białe: Kg2, Wf1, Gd4, P: h2, g2  czarne: Kh8, Wg7, Sc6, P: h7 Białe zaczynają.
białe: Kf5, Wh3, P: g2  czarne: Kh5, Wh4, P: h6 Białe zaczynają.
białe: Kb2, Hh8 czarne: Kd3, He4 P: e2 Białe zaczynają.
białe: Ka1, Wh6, P: e6  czarne: Ka3,Wb4 Białe zaczynają.
białe: Kg2, Sf6, Wc8, P: g5  czarne: Kg7, P: f7, g6, h7 Białe zaczynają.
białe: Kg2, Wh1, Gf6, P: f2  czarne: Kg8, Wf8, P: f7, g6 Białe zaczynają.
białe: Kb1, Se1 czarne: Ka3, Sb3, Hd6, P: a4 Białe zaczynają.
białe: Kf5, Hg6, Hh8, P: e4, f3 czarne: Ke7, Gf7, P: f6, e5, d3 Czarne zaczynają.
białe: Kh8, Hh6 czarne: Kb3, P: f2 Białe zaczynają.
białe: Kd4, Ha2 czarne: Kd1, P: c2 Białe zaczynają.
białe: Kc6, Wh7 P: d6  czarne: Kd8, Wg8 Białe zaczynają.
białe: Kd8, Wf4 P: d7  czarne: Kg6, Wc2 Białe zaczynają.
białe: Kd8, We2 P: d7  czarne: Kf7, Wc1 Białe zaczynają.
białe: Kg2, Wa8 P: a7  czarne: Kf7, Wa1 Białe zaczynają.
białe: Kf6, P: g6  czarne: Kh7 Czarne zaczynają.
białe: Kb6, P: c5  czarne: Kc8  Białe zaczynają.
białe: Kf6, P: g5 czarne: Kh7  Białe zaczynają.
białe: Kg3, P: g6, h7  czarne: Kh8  Białe zaczynają.
białe: Kf4, P: e3 czarne: Ke7 Czarne zaczynają.
białe: Kg8, P: a2  czarne: Kg6, P: a3  Białe zaczynają.
białe: Ke5, P: c5, d6 czarne: Kd7, P: c6 Białe zaczynają.
białe: Kh4, P: b6 czarne: Kb1, P: b7 Białe zaczynają.
białe: Ke4, P: g5 czarne: Kf7, P: g6 Białe zaczynają.
białe: Kb6, P: d5 czarne: Kf5, P: d6 Białe zaczynają.
białe: Ke6, Se4, P: e7 czarne: Ke8, Hd1 Białe zaczynają.
białe: Ke1, Sd2, Sc5 czarne: Ka5, Sb4, Sb5 Białe zaczynają.
białe: Kb6, Gh3 czarne: Ka8, Gb8 Białe zaczynają.
białe: Kb1, Sa1 czarne: Ka3, Sb3, P: a4 Białe zaczynają.
białe: Kg1, We1, Ge2, P: f2, g2, h2, g6  czarne: Kg8, He6, P: c4, g7 Białe zaczynają.
białe: Kh2, Wf2, P: h3  czarne: Ke3, Wa1, P: h4, g5 Czarne zaczynają.
białe: Kc2, Sf5 czarne: Ka1, P: a2  Białe zaczynają.
białe: Kd3, Gb3, P: e6  czarne: Kb7, Gh1 Białe zaczynają.
białe: Ka1, Sd6, P: a4  czarne: Ka3, Sh3 Białe zaczynają.
białe: Kh4, P: g6, h6  czarne: Ka7, Se6, P: g7 Białe zaczynają.
białe: Kh1, P: d7  czarne: Kb7, He6, Ga7 Białe zaczynają.
białe: Kb3, Wa1, Sa4 czarne: Ka8, Wb8, Wc8 P: a7, b7 Białe zaczynają.
białe: Kc6, Hb7 czarne: Kd8, Wh2 Białe zaczynają.
`.split('\n').map((l) => l.trim()).filter(Boolean);

const GAME_EXERCISE_LINES = `
1.d4 d5 2.Gg5 h6 3.Gh4 c6 4.e3 e5 5.d:e5
1.d4 d5 2.c4 e5 3.d:e5 d4 4.e3
1.d4 d5 2.c4 e6 3.Sc3 Sf6 4.Gg5 Sbd7 5.c:d5 e:d5 6.S:d5
1.d4 d5 2.c4 d:c4 3.e3 b5 4.a4 c6 5.a:b5 c:b5
1.e4 e5 2.Sf3 Sf6 3.Sxe5 Sxe4 4.He2 Sf6
1.e4 e5 2.f4 Gc5 3.fxe5
1.e4 e5 2.Sf3 Sf6 3.S:e5 S:e4 4.He2 Sf6
1.e4 e5 2.f4 Gc5 3.f:e5
1.d4 Sf6 2.c4 e6 3.Sc3 Gb4 4.Sf3 h6 5.Se5 a6
1.e4 d5 2.e:d5 Sf6 3.d4 S:d5 4.Sf3 Gg4 5.Gc4 Sb6
1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Hb6 5.Gd3 cxd4 6.cxd4 Hxd4
1.e4 e5 2.Hh5 Sc6 3.Gc4 g6 4.Hf3 Sf6 5.Hb3
1.e4 c5 2.Sf3 e6 3.d4 cxd4 4.Sxd4 Sf6 5.e5
1.e4 c5 2.Sf3 d6 3. c3 Sf6 4.Ge2 Sxe4
1.e4 c6 2.d4 d5 3.Sc3 dxe4 4.Sxe4 Sd7 5.He2 Sgf6
1.e4 e5 2.Sf3 Sf6 3.Sxe5 Sxe4 4.He2 Sf6
1.d4 Sf6 2.Gf4 c5 3.Sf3 cxd4 4.Sxd4
1.e4 e5 2.Sf3 Sf6 3.Sxe5 Sxe4 4.He2 Sf6
1.d4 Sf6 2.Gf4 c5 3.Sf3 cxd4 4.Sxd4
`.split('\n').map((l) => l.trim()).filter(Boolean);

const state = {
  game: new Chess(),
  userColor: 'white',
  boardOrientation: 'white',
  displayMode: 'normal-pieces',
  moveLanguage: 'pl',
  stockfishElo: 1700,
  speakCheck: false,
  sessionMode: 'game',
  puzzle: null,
  puzzleAutoPlaying: false,
  puzzleAutoOpponent: true,
  puzzleDifficulty: 'easiest',
  blindQuestionCount: 25,
  blindPuzzles: {
    mode: null,
    running: false,
    total: 25,
    asked: 0,
    correct: 0,
    startAt: 0,
    elapsedMs: 0,
    timerId: null,
    currentSquare: '',
    currentAnswer: '',
    expectedSquares: new Set(),
    givenSquares: new Set(),
    positionIndex: null,
    gameIndex: null,
    gamePrefixMoves: []
  },
  positionExercises: [],
  positionSolved: new Set(),
  gameExercises: [],
  gameSolved: new Set(),
  prePuzzleDisplayMode: null,
  puzzleViewIndex: 0,
  reviewPly: null,
  revealPosition: false,
  movesVisible: false,
  showBlindDests: true,
  darkMode: false,
  showOnScreenKeyboard: false,
  blindClickFrom: null,
  voiceSticky: true,
  voiceMode: false,
  voiceOneShot: false,
  voiceListening: false,
  speaking: false,
  engineThinking: false,
  hideBelowSliderOnStart: true,
  gameStarted: false
};

function readSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function readSolvedPositions() {
  try {
    const raw = localStorage.getItem(POSITION_SOLVED_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((v) => Number.isInteger(v)));
  } catch (_error) {
    return new Set();
  }
}

function writeSolvedPositions() {
  try {
    localStorage.setItem(POSITION_SOLVED_KEY, JSON.stringify([...state.positionSolved.values()].sort((a, b) => a - b)));
  } catch (_error) {
    // ignore storage errors
  }
}

function readSolvedGames() {
  try {
    const raw = localStorage.getItem(GAME_SOLVED_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((v) => Number.isInteger(v)));
  } catch (_error) {
    return new Set();
  }
}

function writeSolvedGames() {
  try {
    localStorage.setItem(GAME_SOLVED_KEY, JSON.stringify([...state.gameSolved.values()].sort((a, b) => a - b)));
  } catch (_error) {
    // ignore storage errors
  }
}

function normalizePolishText(text) {
  return String(text ?? '')
    .replace(/[ąćęłńóśżź]/gi, (c) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ż: 'z', ź: 'z', Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ż: 'Z', Ź: 'Z' }[c] ?? c));
}

function parseColorPieces(segment, color) {
  const out = [];
  const pieceToFen = { K: 'k', H: 'q', W: 'r', G: 'b', S: 'n' };
  const majorRe = /(?<!:)\b([KHWGSkhwgs])\s*([a-h][1-8])\b/g;
  let m;
  while ((m = majorRe.exec(segment)) !== null) {
    const p = m[1].toUpperCase();
    const sq = m[2].toLowerCase();
    const fen = pieceToFen[p];
    if (!fen) {
      continue;
    }
    out.push({ square: sq, piece: color === 'white' ? fen.toUpperCase() : fen });
  }

  const pawnRe = /[Pp]\s*:\s*([^.;]+)/g;
  while ((m = pawnRe.exec(segment)) !== null) {
    const pawns = m[1].match(/[a-h][1-8]/gi) ?? [];
    for (const sq of pawns) {
      out.push({ square: sq.toLowerCase(), piece: color === 'white' ? 'P' : 'p' });
    }
  }
  return out;
}

function boardMapToFen(boardMap, turn) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(''));
  for (const [sq, piece] of boardMap.entries()) {
    const x = sq.charCodeAt(0) - 97;
    const y = Number(sq[1]) - 1;
    board[7 - y][x] = piece;
  }
  const fenBoard = board.map((row) => {
    let out = '';
    let empty = 0;
    for (const cell of row) {
      if (!cell) {
        empty += 1;
        continue;
      }
      if (empty) {
        out += String(empty);
        empty = 0;
      }
      out += cell;
    }
    if (empty) {
      out += String(empty);
    }
    return out;
  }).join('/');
  return `${fenBoard} ${turn} - - 0 1`;
}

function parsePositionExerciseLine(line, index) {
  const norm = normalizePolishText(line).toLowerCase();
  const wi = norm.indexOf('biale:');
  const bi = norm.indexOf('czarne:');
  if (wi < 0 || bi < 0 || bi <= wi) {
    return null;
  }

  const whiteRaw = line.slice(wi + 'biale:'.length, bi).trim();
  let blackRaw = line.slice(bi + 'czarne:'.length).trim();
  blackRaw = blackRaw.replace(/(Bia[łl]e|Czarne)\s+zaczynaj[aą].*$/i, '').replace(/(posuni[eę]cie|ruch)\s+(bia[łl]ych|czarnych).*$/i, '').trim();

  const turn = /(posuni[eę]cie|ruch)\s+czarnych|czarne\s+zaczynaj[aą]/i.test(norm) ? 'b' : 'w';
  const whitePieces = parseColorPieces(whiteRaw, 'white');
  const blackPieces = parseColorPieces(blackRaw, 'black');
  const all = [...whitePieces, ...blackPieces];
  if (!all.length) {
    return null;
  }

  const boardMap = new Map();
  for (const entry of all) {
    if (boardMap.has(entry.square)) {
      const existing = boardMap.get(entry.square);
      const existingPawn = existing === 'P' || existing === 'p';
      const newPawn = entry.piece === 'P' || entry.piece === 'p';
      if (existingPawn && !newPawn) {
        boardMap.set(entry.square, entry.piece);
        continue;
      }
      if (!existingPawn && newPawn) {
        continue;
      }
      return null;
    }
    boardMap.set(entry.square, entry.piece);
  }
  const whiteKings = [...boardMap.values()].filter((p) => p === 'K').length;
  const blackKings = [...boardMap.values()].filter((p) => p === 'k').length;
  if (whiteKings !== 1 || blackKings !== 1) {
    return null;
  }

  const fen = boardMapToFen(boardMap, turn);
  const game = new Chess();
  try {
    game.load(fen);
  } catch (_error) {
    return null;
  }

  const figurines = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙', k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  const whiteLabel = whitePieces.map((p) => `${figurines[p.piece]}${p.square}`).join(' ');
  const blackLabel = blackPieces.map((p) => `${figurines[p.piece]}${p.square}`).join(' ');

  return {
    id: index,
    task: line,
    fen,
    turn,
    whiteLabel,
    blackLabel
  };
}

function buildPositionExercises() {
  return POSITION_EXERCISE_LINES
    .map((line, i) => parsePositionExerciseLine(line, i))
    .filter(Boolean);
}

function parseExpectedTurnFromTask(line) {
  const norm = normalizePolishText(line).toLowerCase();
  if (/(posuniecie|ruch)\s+czarnych|czarne\s+zaczynaj/.test(norm)) {
    return 'b';
  }
  if (/(posuniecie|ruch)\s+bialych|biale\s+zaczynaj/.test(norm)) {
    return 'w';
  }
  return null;
}

function splitMovesPartFromTask(line) {
  const m = normalizePolishText(line).match(/\b(posuniecie|ruch|zaczynaj)/i);
  if (!m || m.index === undefined) {
    return line;
  }
  return line.slice(0, m.index).trim();
}

function sanitizeGameSanToken(token) {
  let t = token.trim();
  if (!t) {
    return '';
  }
  t = t.replace(/[,\u2013\u2014]/g, '');
  t = t.replace(/:/g, 'x');
  t = t.replace(/^[.]+|[.]+$/g, '');
  if (!t || /^\d+$/.test(t)) {
    return '';
  }
  if (/^(1-0|0-1|1\/2-1\/2|\*)$/i.test(t)) {
    return '';
  }
  t = t.replace(/^0-0-0$/i, 'O-O-O').replace(/^0-0$/i, 'O-O');
  return polishToEnglishSan(t);
}

function parseGameExerciseLine(line, index) {
  const expectedTurn = parseExpectedTurnFromTask(line);
  const movesPart = splitMovesPartFromTask(line);
  const cleaned = movesPart.replace(/\d+\./g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return null;
  }

  const game = new Chess();
  const tokens = cleaned.split(' ').map(sanitizeGameSanToken).filter(Boolean);
  const moveSans = [];
  const moveVerbose = [];
  for (const san of tokens) {
    try {
      const mv = game.move(san);
      if (!mv) {
        return null;
      }
      moveSans.push(mv.san);
      moveVerbose.push({ from: mv.from, to: mv.to, promotion: mv.promotion, san: mv.san });
    } catch (_error) {
      return null;
    }
  }

  let fen = game.fen();
  if (expectedTurn && game.turn() !== expectedTurn) {
    const parts = fen.split(' ');
    if (parts.length >= 2) {
      parts[1] = expectedTurn;
      fen = parts.join(' ');
    }
  }

  return {
    id: index,
    task: line,
    fen,
    turn: expectedTurn ?? fen.split(' ')[1] ?? game.turn(),
    moveSans,
    moveVerbose
  };
}

function buildGameExercises() {
  return GAME_EXERCISE_LINES
    .map((line, i) => parseGameExerciseLine(line, i))
    .filter(Boolean)
    .map((ex, order) => ({ ...ex, _order: order }))
    .sort((a, b) => {
      const pa = a.moveSans?.length ?? 0;
      const pb = b.moveSans?.length ?? 0;
      return pa - pb || a._order - b._order;
    })
    .map(({ _order, ...ex }) => ex);
}

function writeSettings() {
  const payload = {
    moveLanguage: state.moveLanguage,
    stockfishElo: state.stockfishElo,
    speakComputer: elements.speakComputer.checked,
    voiceSticky: state.voiceSticky,
    speakCheck: state.speakCheck,
    figurineNotation: elements.figurineNotation.checked,
    showBlindDests: state.showBlindDests,
    darkMode: state.darkMode,
    showOnScreenKeyboard: state.showOnScreenKeyboard,
    puzzleAutoOpponent: state.puzzleAutoOpponent,
    puzzleDifficulty: state.puzzleDifficulty,
    blindQuestionCount: state.blindQuestionCount
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
  } catch (_error) {
    // ignore storage errors
  }
}

function loadSettingsIntoState() {
  const saved = readSettings();
  if (!saved) {
    return;
  }

  if (saved.moveLanguage === 'pl' || saved.moveLanguage === 'en') {
    state.moveLanguage = saved.moveLanguage;
  }
  const savedElo = Number(saved.stockfishElo ?? saved.defaultStockfishElo);
  if (Number.isFinite(savedElo)) {
    state.stockfishElo = Math.max(400, Math.min(2850, savedElo));
  }
  if (typeof saved.speakCheck === 'boolean') {
    state.speakCheck = saved.speakCheck;
  }
  if (typeof saved.voiceSticky === 'boolean') {
    state.voiceSticky = saved.voiceSticky;
  }
  if (typeof saved.puzzleAutoOpponent === 'boolean') {
    state.puzzleAutoOpponent = saved.puzzleAutoOpponent;
  }
  if (['easiest', 'easier', 'normal', 'harder', 'hardest'].includes(saved.puzzleDifficulty)) {
    state.puzzleDifficulty = saved.puzzleDifficulty;
  }
  if (Number.isFinite(Number(saved.blindQuestionCount))) {
    state.blindQuestionCount = Math.max(1, Math.min(200, Math.floor(Number(saved.blindQuestionCount))));
  }
  if (typeof saved.showBlindDests === 'boolean') {
    state.showBlindDests = saved.showBlindDests;
  }
  if (typeof saved.darkMode === 'boolean') {
    state.darkMode = saved.darkMode;
  }
  if (typeof saved.showOnScreenKeyboard === 'boolean') {
    state.showOnScreenKeyboard = saved.showOnScreenKeyboard;
  }
}

function applySettingsToUi() {
  elements.displayMode.value = state.displayMode;
  elements.moveLanguage.value = state.moveLanguage;
  elements.optionEngineStrength.value = String(state.stockfishElo);
  elements.optionStrengthValue.textContent = String(state.stockfishElo);
  elements.speakCheck.checked = state.speakCheck;
  elements.voiceSticky.checked = state.voiceSticky;
  elements.showBlindDests.checked = state.showBlindDests;
  elements.darkMode.checked = state.darkMode;
  elements.showOnScreenKeyboard.checked = state.showOnScreenKeyboard;
  elements.puzzleAutoOpponent.checked = state.puzzleAutoOpponent;
  elements.puzzleDifficulty.value = state.puzzleDifficulty;
  elements.blindQuestionCount.value = String(state.blindQuestionCount);

  const saved = readSettings();
  if (saved) {
    elements.speakComputer.checked = !!saved.speakComputer;
    elements.figurineNotation.checked = saved.figurineNotation !== false;
  }
  applyTheme();
  syncMoveInputMode();
  updateMoveAssistVisibility();
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', state.darkMode);
}

function syncViewModeClasses() {
  const isDefaultGameView = state.sessionMode === 'game';
  document.body.classList.toggle('game-default-view', isDefaultGameView);
}

const stockfishState = {
  worker: null,
  ready: false,
  pending: null,
  uciReadySeen: false,
  readySeen: false
};

const voiceState = {
  recognition: null,
  startLock: false
};

function stopStockfishWorker() {
  if (!stockfishState.worker) {
    return;
  }
  try {
    stockfishState.worker.postMessage('quit');
  } catch (_error) {
    // ignore
  }
  stockfishState.worker.terminate();
  stockfishState.worker = null;
  stockfishState.ready = false;
  stockfishState.pending = null;
  stockfishState.uciReadySeen = false;
  stockfishState.readySeen = false;
}

const ground = Chessground(elements.board, {
  orientation: 'white',
  coordinates: false,
  movable: {
    free: false,
    color: 'white',
    showDests: false,
    events: {
      after: onBoardMove
    }
  },
  draggable: {
    enabled: true,
    showGhost: true
  },
  selectable: {
    enabled: true
  }
});

function fileRankToSquare(fileIdx, rankIdx) {
  const file = String.fromCharCode(97 + fileIdx);
  const rank = (8 - rankIdx).toString();
  return `${file}${rank}`;
}

function fenToPieces(fen) {
  const board = fen.split(' ')[0];
  const rows = board.split('/');
  const pieces = new Map();

  for (let rankIdx = 0; rankIdx < 8; rankIdx += 1) {
    let fileIdx = 0;
    for (const symbol of rows[rankIdx]) {
      if (/\d/.test(symbol)) {
        fileIdx += Number(symbol);
        continue;
      }
      const color = symbol === symbol.toUpperCase() ? 'white' : 'black';
      const pieceMap = {
        p: 'pawn',
        n: 'knight',
        b: 'bishop',
        r: 'rook',
        q: 'queen',
        k: 'king'
      };
      const role = pieceMap[symbol.toLowerCase()];
      pieces.set(fileRankToSquare(fileIdx, rankIdx), { color, role });
      fileIdx += 1;
    }
  }

  return pieces;
}

function transformPiecesForDisplay(realPieces) {
  if (state.revealPosition) {
    return realPieces;
  }

  const transformed = new Map();
  if (state.displayMode === 'no-pieces' || state.displayMode === 'no-pieces-no-marks') {
    return transformed;
  }

  for (const [square, piece] of realPieces.entries()) {
    if (state.displayMode === 'normal-pieces') {
      transformed.set(square, piece);
    } else if (state.displayMode === 'same-pieces') {
      transformed.set(square, { color: 'white', role: piece.role });
    } else if (state.displayMode === 'different-disks') {
      transformed.set(square, piece);
    } else if (state.displayMode === 'same-disks') {
      transformed.set(square, piece);
    } else if (state.displayMode === 'white-only') {
      if (piece.color === 'white') {
        transformed.set(square, piece);
      }
    } else if (state.displayMode === 'black-only') {
      if (piece.color === 'black') {
        transformed.set(square, piece);
      }
    } else if (state.displayMode === 'white-pieces-black-disks') {
      transformed.set(square, piece);
    } else if (state.displayMode === 'black-pieces-white-disks') {
      transformed.set(square, piece);
    } else {
      transformed.set(square, piece);
    }
  }

  return transformed;
}

function updateBoard() {
  elements.board.dataset.mode = state.displayMode;
  elements.board.dataset.reveal = String(state.revealPosition);
  const boardHidden = (state.sessionMode === 'blind-puzzles' && !state.revealPosition)
    || (state.displayMode === 'no-board' && !state.revealPosition);
  const suppressVisualMarks = shouldSuppressVisualMarks();
  elements.boardShell.classList.toggle('is-hidden', boardHidden);
  elements.boardShell.classList.toggle('is-blind-hidden', state.sessionMode === 'blind-puzzles' && boardHidden);
  syncRevealButtonUi();

  const boardGame = getBoardGame();
  const reviewLocked = isReviewLocked();
  const realPieces = fenToPieces(boardGame.fen());
  const transformed = transformPiecesForDisplay(realPieces);
  const pieces = transformed instanceof Map
    ? transformed
    : new Map(Object.entries(transformed ?? {}));

  const turnColor = boardGame.turn() === 'w' ? 'white' : 'black';
  const boardOrientation = state.boardOrientation;
  const movableColor = state.sessionMode === 'puzzle'
    ? undefined
    : (reviewLocked
      ? undefined
      : (boardGame.turn() === (state.userColor === 'white' ? 'w' : 'b') ? state.userColor : undefined));
  const boardInputEnabled = state.sessionMode !== 'game' || state.gameStarted;

  ground.set({
    orientation: boardOrientation,
    turnColor,
    highlight: {
      lastMove: !suppressVisualMarks,
      check: !suppressVisualMarks,
      custom: suppressVisualMarks ? new Map() : blindSourceHighlightMap()
    },
    movable: {
      free: false,
      color: boardInputEnabled ? movableColor : undefined,
      showDests: !suppressVisualMarks && shouldShowAnyMoveDots(),
      dests: (state.sessionMode === 'puzzle' || reviewLocked) ? new Map() : toDests(boardGame),
      events: {
        after: onBoardMove
      }
    },
    draggable: {
      enabled: state.sessionMode !== 'puzzle' && boardInputEnabled,
      showGhost: true
    },
    selectable: {
      enabled: state.sessionMode !== 'puzzle' && !reviewLocked && boardInputEnabled
    },
    check: suppressVisualMarks ? false : boardGame.inCheck(),
    lastMove: suppressVisualMarks ? undefined : lastMoveSquares(boardGame),
    pieces
  });
  syncBlindClickDots();
}

function shouldSuppressVisualMarks() {
  if (state.revealPosition) {
    return false;
  }
  return state.displayMode === 'no-board'
    || state.displayMode === 'no-pieces-no-marks'
    || state.sessionMode === 'blind-puzzles';
}

function syncRevealButtonUi() {
  elements.revealBtn.classList.toggle('is-on', state.revealPosition);
  if (state.displayMode === 'no-board') {
    elements.revealBtn.title = state.revealPosition ? 'Hide board' : 'Show board';
    return;
  }
  elements.revealBtn.title = state.revealPosition ? 'Hide revealed position' : 'Reveal position';
}

function isBlindClickInputActive() {
  if (state.sessionMode !== 'game') {
    return false;
  }
  if (isReviewLocked()) {
    return false;
  }
  if (!isUserTurn()) {
    return false;
  }
  if (state.revealPosition) {
    return false;
  }
  if (state.displayMode === 'no-pieces' || state.displayMode === 'no-pieces-no-marks') {
    return true;
  }
  if (state.displayMode === 'white-only' && state.userColor === 'black') {
    return true;
  }
  if (state.displayMode === 'black-only' && state.userColor === 'white') {
    return true;
  }
  return false;
}

function shouldShowAnyMoveDots() {
  return !shouldSuppressVisualMarks() && state.showBlindDests && isBlindClickInputActive();
}

function blindSourceHighlightMap() {
  if (shouldSuppressVisualMarks() || !isBlindClickInputActive() || !state.blindClickFrom) {
    return new Map();
  }
  return new Map([[state.blindClickFrom, 'blind-click-source']]);
}

function clearBlindClickSelection() {
  state.blindClickFrom = null;
  const suppressVisualMarks = shouldSuppressVisualMarks();
  ground.set({
    highlight: {
      lastMove: !suppressVisualMarks,
      check: !suppressVisualMarks,
      custom: new Map()
    }
  });
  ground.selectSquare(null);
  ground.setAutoShapes([]);
}

function syncBlindClickDots() {
  const suppressVisualMarks = shouldSuppressVisualMarks();
  ground.set({
    highlight: {
      lastMove: !suppressVisualMarks,
      check: !suppressVisualMarks,
      custom: suppressVisualMarks ? new Map() : blindSourceHighlightMap()
    }
  });
  if (suppressVisualMarks || !isBlindClickInputActive()) {
    state.blindClickFrom = null;
    ground.selectSquare(null);
    ground.setAutoShapes([]);
    return;
  }
  if (!state.blindClickFrom || !state.showBlindDests) {
    ground.selectSquare(state.blindClickFrom, true);
    ground.setAutoShapes([]);
    return;
  }
  const legalMoves = state.game.moves({ verbose: true }).filter((mv) => mv.from === state.blindClickFrom);
  if (!legalMoves.length) {
    state.blindClickFrom = null;
    ground.selectSquare(null);
    ground.setAutoShapes([]);
    return;
  }
  ground.selectSquare(state.blindClickFrom, true);
  const dots = legalMoves.map((mv) => ({ orig: mv.to, brush: 'paleGrey' }));
  ground.setAutoShapes(dots);
}

function setBlindClickFrom(square) {
  state.blindClickFrom = square;
  window.setTimeout(() => {
    if (state.blindClickFrom !== square) {
      return;
    }
    ground.selectSquare(square, true);
    syncBlindClickDots();
  }, 0);
}

function onBlindBoardClick(event) {
  if (!(event instanceof MouseEvent)) {
    return;
  }
  if (!isBlindClickInputActive()) {
    clearBlindClickSelection();
    return;
  }

  const square = ground.getKeyAtDomPos([event.clientX, event.clientY]);
  if (!square) {
    return;
  }

  const legalMoves = state.game.moves({ verbose: true });
  const sideToMove = state.game.turn();
  const clickedPiece = state.game.get(square);
  const clickedOwnPiece = clickedPiece && clickedPiece.color === sideToMove;

  if (!state.blindClickFrom) {
    const fromMoves = legalMoves.filter((mv) => mv.from === square);
    if (clickedOwnPiece && fromMoves.length) {
      setBlindClickFrom(square);
    } else {
      clearBlindClickSelection();
    }
    return;
  }

  const from = state.blindClickFrom;
  if (square === from) {
    clearBlindClickSelection();
    return;
  }

  const selectedMove = legalMoves.find((mv) => mv.from === from && mv.to === square);
  clearBlindClickSelection();

  if (selectedMove) {
    onBoardMove(from, square);
    return;
  }

  const reselectMoves = legalMoves.filter((mv) => mv.from === square);
  if (clickedOwnPiece && reselectMoves.length) {
    setBlindClickFrom(square);
  }
}

function getBoardGame() {
  if (state.sessionMode === 'puzzle') {
    return state.game;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    const viewed = state.reviewPly ?? total;
    return gameDrillBoardFromAbsPly(viewed);
  }

  const total = state.game.history({ verbose: true }).length;
  const viewed = state.reviewPly ?? total;
  if (viewed >= total) {
    return state.game;
  }

  const nextGame = new Chess();
  const hist = state.game.history({ verbose: true });
  for (let i = 0; i < viewed; i += 1) {
    const mv = hist[i];
    nextGame.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
  }
  return nextGame;
}

function isReviewLocked() {
  if (state.sessionMode === 'puzzle') {
    return false;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    return state.reviewPly !== null && state.reviewPly < total;
  }
  const total = state.game.history({ verbose: true }).length;
  return state.reviewPly !== null && state.reviewPly < total;
}

function toDests(game = state.game) {
  const dests = new Map();
  const legalMoves = game.moves({ verbose: true });
  for (const mv of legalMoves) {
    if (!dests.has(mv.from)) {
      dests.set(mv.from, []);
    }
    dests.get(mv.from).push(mv.to);
  }
  return dests;
}

function lastMoveSquares(game = state.game) {
  const hist = game.history({ verbose: true });
  if (!hist.length) {
    return undefined;
  }
  const last = hist[hist.length - 1];
  return [last.from, last.to];
}

function englishToPolishSan(san) {
  return san.replace(/^([KQRBN])/, (m, p1) => ({ K: 'K', Q: 'H', R: 'W', B: 'G', N: 'S' }[p1] ?? p1))
    .replace(/=([QRBN])/g, (_m, p1) => `=${({ Q: 'H', R: 'W', B: 'G', N: 'S' }[p1] ?? p1)}`);
}

function polishToEnglishSan(san) {
  return san.replace(/^([KHWGS])/, (m, p1) => ({ K: 'K', H: 'Q', W: 'R', G: 'B', S: 'N' }[p1] ?? p1))
    .replace(/=([HWGS])/g, (_m, p1) => `=${({ H: 'Q', W: 'R', G: 'B', S: 'N' }[p1] ?? p1)}`);
}

function normalizePolishFigureWords(input) {
  const words = [
    ['skoczek', 'S'],
    ['goniec', 'G'],
    ['wieza', 'W'],
    ['wieża', 'W'],
    ['hetman', 'H'],
    ['krolowa', 'H'],
    ['królowa', 'H'],
    ['krol', 'K'],
    ['król', 'K'],
    ['pion', ''],
    ['pionek', '']
  ];

  let out = input.trim();
  for (const [word, letter] of words) {
    out = out.replace(new RegExp(`^${word}\\s*`, 'i'), letter);
    out = out.replace(new RegExp(`=\\s*${word}\\b`, 'ig'), `=${letter}`);
  }
  return out;
}

function sanToPolishSpeech(san) {
  if (san === 'O-O') return 'roszada';
  if (san === 'O-O-O') return 'długa roszada';

  const names = { K: 'król', Q: 'hetman', R: 'wieża', B: 'goniec', N: 'skoczek' };
  const clean = san.replace(/[+#]/g, '');
  const promoMatch = clean.match(/=([KQRBN])/);
  const promotion = promoMatch ? names[promoMatch[1]] : null;
  const base = clean.replace(/=([KQRBN])/, '');
  const targetMatch = base.match(/([a-h][1-8])$/);
  const target = targetMatch ? targetMatch[1] : '';
  const capture = base.includes('x');
  const first = base[0];
  const pieceName = /^[KQRBN]$/.test(first) ? names[first] : 'pion';
  const pawnCaptureFile = !/^[KQRBN]/.test(base) && capture
    ? ((base.match(/^([a-h])x/) ?? [])[1] ?? '')
    : '';

  let spoken;
  if (capture && pawnCaptureFile) {
    spoken = `${pawnCaptureFile} bije ${target}`;
  } else {
    spoken = capture ? `${pieceName} bije ${target}` : `${pieceName} ${target}`;
  }
  if (promotion) {
    spoken += ` promocja ${promotion}`;
  }
  if (san.includes('#')) {
    spoken += ' mat';
  } else if (san.includes('+') && state.speakCheck) {
    spoken += ' szach';
  }
  return spoken.trim();
}

function sanToEnglishSpeech(san) {
  if (san === 'O-O') return 'castle kingside';
  if (san === 'O-O-O') return 'castle queenside';

  const base = san.replace(/[+#]/g, '');
  let spoken = base;
  if (san.includes('#')) {
    spoken += ' mate';
  } else if (san.includes('+') && state.speakCheck) {
    spoken += ' check';
  }
  return spoken.trim();
}

function sanToFigurine(san) {
  const map = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘' };
  return san
    .replace(/^([KQRBN])/, (_m, p1) => map[p1] ?? p1)
    .replace(/=([KQRBN])/g, (_m, p1) => `=${map[p1] ?? p1}`);
}

function formatSanForDisplay(san) {
  if (elements.figurineNotation.checked) {
    return sanToFigurine(san);
  }
  if (state.moveLanguage === 'pl') {
    return englishToPolishSan(san);
  }
  return san;
}

function formatSanLineFromList(sans, startPly = 0) {
  if (!sans.length) {
    return '-';
  }
  const chunks = [];
  for (let i = 0; i < sans.length; i += 1) {
    const ply = startPly + i;
    const moveNo = Math.floor(ply / 2) + 1;
    const rendered = formatSanForDisplay(sans[i]);
    if (ply % 2 === 0) {
      chunks.push(`${moveNo}. ${rendered}`);
    } else {
      const lastIdx = chunks.length - 1;
      if (lastIdx >= 0) {
        chunks[lastIdx] = `${chunks[lastIdx]} ${rendered}`;
      } else {
        chunks.push(`${moveNo}... ${rendered}`);
      }
    }
  }
  return chunks.join(' | ');
}

function updatePuzzlePanel() {
  if (!state.puzzle) {
    elements.puzzlePanel.hidden = true;
    elements.puzzleMeta.textContent = '-';
    elements.puzzleContext.textContent = '-';
    elements.showSolutionBtn.disabled = true;
    return;
  }

  elements.puzzlePanel.hidden = false;
  const p = state.puzzle;
  const solvedSolutionCount = Math.max(0, p.solutionIndex - p.contextMoves.length);
  elements.puzzleMeta.innerHTML = '';
  const puzzleLink = document.createElement('a');
  puzzleLink.href = `https://lichess.org/training/${p.id}`;
  puzzleLink.target = '_blank';
  puzzleLink.rel = 'noopener noreferrer';
  puzzleLink.textContent = p.id;
  elements.puzzleMeta.appendChild(puzzleLink);
  elements.puzzleMeta.append(` | rating ${p.rating}`);
  const contextLine = formatSanLineFromList(p.contextSans, p.contextStartPly);
  const shownSolutionSans = p.revealSolutionText
    ? p.solutionSans
    : p.solutionSans.slice(0, solvedSolutionCount);
  const solutionLine = shownSolutionSans.length
    ? formatSanLineFromList(shownSolutionSans, p.startPly)
    : '-';
  if (contextLine && contextLine !== '-' && solutionLine && solutionLine !== '-') {
    elements.puzzleContext.textContent = `${contextLine} | ${solutionLine}`;
  } else if (contextLine && contextLine !== '-') {
    elements.puzzleContext.textContent = contextLine;
  } else {
    elements.puzzleContext.textContent = solutionLine;
  }
  elements.showSolutionBtn.disabled = p.solved || state.puzzleAutoPlaying;
}

function setGameFromVerboseMoves(verboseMoves, plyCount) {
  const nextGame = new Chess();
  const safePly = Math.max(0, Math.min(verboseMoves.length, plyCount));
  for (let i = 0; i < safePly; i += 1) {
    const mv = verboseMoves[i];
    try {
      const applied = nextGame.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
      if (!applied) {
        return null;
      }
    } catch (_error) {
      return null;
    }
  }
  return nextGame;
}

function buildSolutionMovesFromPly(verboseMoves, startPly, solutionUcis) {
  const game = setGameFromVerboseMoves(verboseMoves, startPly);
  if (!game) {
    return null;
  }
  const moves = [];

  for (const rawUci of solutionUcis) {
    const parsedUci = parseUci(rawUci);
    if (!parsedUci) {
      return null;
    }
    let applied;
    try {
      applied = game.move({
        from: parsedUci.from,
        to: parsedUci.to,
        promotion: parsedUci.promotion
      });
    } catch (_error) {
      return null;
    }
    if (!applied) {
      return null;
    }
    moves.push({
      from: applied.from,
      to: applied.to,
      color: applied.color,
      promotion: applied.promotion,
      san: applied.san,
      uci: uciFromMove(applied)
    });
  }
  return moves;
}

function findPuzzleStartAndSolution(verboseMoves, initialPlyRaw, solutionUcis) {
  const clamped = Math.max(0, Math.min(verboseMoves.length, initialPlyRaw));
  const maxDistance = verboseMoves.length + 2;

  for (let dist = 0; dist <= maxDistance; dist += 1) {
    // When two nearby candidates fit, prefer the later one.
    // Lichess puzzle start is typically after the last game move before the tactic.
    const candidates = dist === 0 ? [clamped] : [clamped + dist, clamped - dist];
    for (const ply of candidates) {
      if (ply < 0 || ply > verboseMoves.length) {
        continue;
      }
      const built = buildSolutionMovesFromPly(verboseMoves, ply, solutionUcis);
      if (built) {
        return { startPly: ply, solutionMoves: built };
      }
    }
  }

  return null;
}

function setGameFromPuzzleLine(baseFen, lineMoves, count) {
  const nextGame = new Chess(baseFen);
  const safeCount = Math.max(0, Math.min(lineMoves.length, count));
  for (let i = 0; i < safeCount; i += 1) {
    const mv = lineMoves[i];
    let applied;
    try {
      applied = nextGame.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
    } catch (_error) {
      return null;
    }
    if (!applied) {
      return null;
    }
  }
  return nextGame;
}

function syncPuzzleGameToView() {
  if (state.sessionMode !== 'puzzle' || !state.puzzle) {
    return true;
  }
  const absView = Math.max(0, state.puzzleViewIndex);
  if (absView <= state.puzzle.contextStartPly) {
    const preGame = setGameFromVerboseMoves(state.puzzle.verboseMoves, absView);
    if (!preGame) {
      return false;
    }
    state.game = preGame;
    return true;
  }

  const rel = absView - state.puzzle.contextStartPly;
  const nextGame = setGameFromPuzzleLine(state.puzzle.baseFen, state.puzzle.lineMoves, rel);
  if (!nextGame) {
    return false;
  }
  state.game = nextGame;
  return true;
}

function syncPuzzleToProgress() {
  if (state.sessionMode !== 'puzzle' || !state.puzzle) {
    return true;
  }
  state.puzzleViewIndex = puzzleProgressAbsPly();
  return syncPuzzleGameToView();
}

function puzzleProgressAbsPly() {
  if (!state.puzzle) {
    return 0;
  }
  return state.puzzle.contextStartPly + state.puzzle.solutionIndex;
}

function inputMatchesTargetMove(text, targetMove) {
  if (!targetMove) {
    return false;
  }
  const parsed = normalizeMoveInput(text);
  if (parsed.type === 'uci') {
    return parsed.value === targetMove.uci;
  }
  if (parsed.type !== 'san') {
    return false;
  }

  const normalizeLoose = (san) => san.replace(/[x+#]/g, '');
  const engSan = targetMove.san;
  const polSan = englishToPolishSan(targetMove.san);
  return [engSan, polSan].some((san) => normalizeLoose(san) === normalizeLoose(parsed.value));
}

function trySkipContextToSolution(playedUci) {
  if (state.sessionMode !== 'puzzle' || !state.puzzle) {
    return false;
  }
  const contextCount = state.puzzle.contextMoves.length;
  if (state.puzzle.solutionIndex >= contextCount) {
    return false;
  }
  const firstSolutionUci = state.puzzle.solutionMoves[0]?.uci;
  if (!firstSolutionUci || playedUci !== firstSolutionUci) {
    return false;
  }

  state.puzzle.solutionIndex = contextCount;
  state.puzzleViewIndex = puzzleProgressAbsPly();
  return syncPuzzleToProgress();
}

function trySkipContextToSolutionByInput(text) {
  if (state.sessionMode !== 'puzzle' || !state.puzzle) {
    return false;
  }
  const contextCount = state.puzzle.contextMoves.length;
  if (state.puzzle.solutionIndex >= contextCount) {
    return false;
  }
  const firstSolutionMove = state.puzzle.solutionMoves[0];
  if (!inputMatchesTargetMove(text, firstSolutionMove)) {
    return false;
  }
  state.puzzle.solutionIndex = contextCount;
  state.puzzleViewIndex = puzzleProgressAbsPly();
  return syncPuzzleToProgress();
}

async function loadLichessPuzzle() {
  resetBlindPuzzleSession();
  state.puzzleAutoPlaying = false;
  elements.loadPuzzleBtn.disabled = true;
  elements.statusText.textContent = 'Loading puzzle from Lichess...';

  try {
    const query = new URLSearchParams();
    query.set('difficulty', state.puzzleDifficulty);
    const response = await fetch(`https://lichess.org/api/puzzle/next?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    const pgn = payload?.game?.pgn;
    const puzzle = payload?.puzzle;
    if (!pgn || !puzzle?.solution?.length || typeof puzzle.initialPly !== 'number') {
      throw new Error('Invalid puzzle payload');
    }

    const parsed = new Chess();
    parsed.loadPgn(pgn);
    const verbose = parsed.history({ verbose: true });
    const sans = parsed.history({ verbose: false });

    const resolved = findPuzzleStartAndSolution(verbose, puzzle.initialPly, puzzle.solution);
    if (!resolved) {
      throw new Error('Could not align puzzle solution with game PGN');
    }
    const startPly = resolved.startPly;
    const backtrackRaw = Number(elements.puzzleBacktrack.value);
    const backtrack = Number.isFinite(backtrackRaw) ? Math.max(0, Math.min(20, Math.floor(backtrackRaw))) : 0;
    elements.puzzleBacktrack.value = String(backtrack);
    const contextStartPly = Math.max(0, startPly - backtrack);
    const contextSans = sans.slice(contextStartPly, startPly);
    const contextVerbose = verbose.slice(contextStartPly, startPly);
    const contextMoves = contextVerbose.map((mv) => ({
      from: mv.from,
      to: mv.to,
      color: mv.color,
      promotion: mv.promotion,
      san: mv.san,
      uci: uciFromMove(mv)
    }));
    const solutionMoves = resolved.solutionMoves;
    const lineMoves = [...contextMoves, ...solutionMoves];
    const baseGame = setGameFromVerboseMoves(verbose, contextStartPly);
    if (!baseGame) {
      throw new Error('Could not build puzzle base position');
    }

    const puzzleStartGame = setGameFromVerboseMoves(verbose, startPly);
    if (!puzzleStartGame) {
      throw new Error('Could not build puzzle start position');
    }

    state.puzzle = {
      id: puzzle.id,
      rating: puzzle.rating,
      lineMoves,
      contextMoves,
      solutionMoves,
      prefixSans: sans.slice(0, contextStartPly),
      playerColor: puzzleStartGame.turn(),
      solutionIndex: 0,
      solved: false,
      revealSolutionText: false,
      contextStartPly,
      contextSans,
      solutionSans: solutionMoves.map((mv) => mv.san),
      startPly,
      baseFen: baseGame.fen(),
      verboseMoves: verbose
    };
    state.sessionMode = 'puzzle';
    if (state.prePuzzleDisplayMode === null) {
      state.prePuzzleDisplayMode = state.displayMode;
    }
    state.displayMode = 'normal-pieces';
    elements.displayMode.value = state.displayMode;
    state.boardOrientation = state.puzzle.playerColor === 'b' ? 'black' : 'white';
    state.puzzleViewIndex = contextStartPly;
    state.reviewPly = null;

    state.game = setGameFromVerboseMoves(verbose, contextStartPly) ?? new Chess(baseGame.fen());
    updateAll();
    elements.statusText.textContent = 'Puzzle loaded.';
    speakPuzzleContextIfEnabled(contextSans);
  } catch (error) {
    state.sessionMode = 'game';
    state.puzzle = null;
    state.puzzleViewIndex = 0;
    state.reviewPly = null;
    updatePuzzlePanel();
    const msg = String(error?.message ?? '');
    elements.statusText.textContent = msg
      ? `Failed to load puzzle from Lichess: ${msg}`
      : 'Failed to load puzzle from Lichess.';
  } finally {
    elements.loadPuzzleBtn.disabled = false;
  }
}

function playPuzzleUciMove(uci) {
  if (!syncPuzzleToProgress()) {
    return false;
  }

  const expected = state.puzzle?.lineMoves[state.puzzle.solutionIndex];
  if (!expected || expected.uci !== uci) {
    return false;
  }
  const applied = state.game.move({ from: expected.from, to: expected.to, promotion: expected.promotion });
  if (!applied) {
    return false;
  }
  state.puzzle.solutionIndex += 1;
  state.puzzleViewIndex = puzzleProgressAbsPly();
  speakMoveIfEnabled(applied.san);
  return true;
}

function currentPuzzleExpectedUci() {
  if (state.sessionMode !== 'puzzle' || !state.puzzle || state.puzzle.solved) {
    return null;
  }
  return state.puzzle.lineMoves[state.puzzle.solutionIndex]?.uci ?? null;
}

function markPuzzleSolvedIfFinished() {
  if (!state.puzzle) {
    return;
  }
  if (state.puzzle.solved) {
    return;
  }
  if (state.puzzle.solutionIndex >= state.puzzle.lineMoves.length) {
    state.puzzle.solved = true;
    state.puzzle.revealSolutionText = true;
    elements.statusText.textContent = 'Puzzle solved.';
    speakPuzzleSolvedIfEnabled();
  }
}

function playPuzzleReplyFromSolution() {
  if (!state.puzzle || state.puzzle.solved) {
    return;
  }

  const replyUci = currentPuzzleExpectedUci();
  if (!replyUci) {
    markPuzzleSolvedIfFinished();
    updateAll();
    return;
  }

  if (!playPuzzleUciMove(replyUci)) {
    elements.statusText.textContent = 'Puzzle data mismatch for this position.';
    return;
  }
  markPuzzleSolvedIfFinished();
  updateAll();
}

function stopBlindPuzzleTimer() {
  if (state.blindPuzzles.timerId) {
    window.clearInterval(state.blindPuzzles.timerId);
    state.blindPuzzles.timerId = null;
  }
}

function resetBlindPuzzleSession() {
  const wasBlindMode = state.sessionMode === 'blind-puzzles';
  stopBlindPuzzleTimer();
  state.blindPuzzles.mode = null;
  state.blindPuzzles.running = false;
  state.blindPuzzles.total = state.blindQuestionCount;
  state.blindPuzzles.asked = 0;
  state.blindPuzzles.correct = 0;
  state.blindPuzzles.startAt = 0;
  state.blindPuzzles.elapsedMs = 0;
  state.blindPuzzles.currentSquare = '';
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.positionIndex = null;
  state.blindPuzzles.gameIndex = null;
  state.blindPuzzles.gamePrefixMoves = [];
  if (wasBlindMode) {
    setVoiceMode(false);
  }
}

function formatBlindTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function updateBlindPanel() {
  const active = state.sessionMode === 'blind-puzzles';
  elements.blindPanel.hidden = !active;
  if (!active) {
    return;
  }
  const bp = state.blindPuzzles;
  if (bp.mode === 'kr-matting' || bp.mode === 'kq-matting') {
    elements.blindPrompt.textContent = bp.mode === 'kr-matting' ? 'K+R vs K' : 'K+Q vs K';
    elements.blindProgress.textContent = '-';
    elements.blindCorrect.textContent = '-';
    elements.blindTimer.textContent = '-';
    return;
  }
  if (bp.mode === 'position') {
    const idx = bp.positionIndex;
    const ex = Number.isInteger(idx) ? state.positionExercises[idx] : null;
    const solvedCount = state.positionSolved.size;
    elements.blindPrompt.textContent = ex ? `Białe: ${ex.whiteLabel} | Czarne: ${ex.blackLabel}` : '-';
    elements.blindProgress.textContent = ex ? `${idx + 1}/${state.positionExercises.length}` : '-';
    elements.blindCorrect.textContent = `${solvedCount}/${state.positionExercises.length}`;
    elements.blindTimer.textContent = '-';
    return;
  }
  if (bp.mode === 'game-drill') {
    const idx = bp.gameIndex;
    const ex = Number.isInteger(idx) ? state.gameExercises[idx] : null;
    const solvedCount = state.gameSolved.size;
    elements.blindPrompt.textContent = ex ? ex.task : '-';
    elements.blindProgress.textContent = ex ? `${idx + 1}/${state.gameExercises.length}` : '-';
    elements.blindCorrect.textContent = `${solvedCount}/${state.gameExercises.length}`;
    elements.blindTimer.textContent = '-';
    return;
  }
  elements.blindPrompt.textContent = bp.currentSquare || '-';
  elements.blindProgress.textContent = `${bp.asked}/${bp.total}`;
  const extra = (bp.mode === 'bishop-movements' || bp.mode === 'knight-movements' || bp.mode === 'check')
    ? ` (${bp.givenSquares.size}/${bp.expectedSquares.size})`
    : '';
  elements.blindCorrect.textContent = `${bp.correct}${extra}`;
  elements.blindTimer.textContent = formatBlindTime(bp.elapsedMs);
}

function squareColorAnswer(square) {
  const file = square.charCodeAt(0) - 96;
  const rank = Number(square[1]);
  return ((file + rank) % 2 === 0) ? 'czarne' : 'biale';
}

function randomSquare() {
  const file = String.fromCharCode(97 + Math.floor(Math.random() * 8));
  const rank = 1 + Math.floor(Math.random() * 8);
  return `${file}${rank}`;
}

function randomInnerSquare() {
  const file = String.fromCharCode(98 + Math.floor(Math.random() * 6)); // b..g
  const rank = 2 + Math.floor(Math.random() * 6); // 2..7
  return `${file}${rank}`;
}

function squareToCoords(square) {
  return {
    x: square.charCodeAt(0) - 97,
    y: Number(square[1]) - 1
  };
}

function coordsToSquare(x, y) {
  return `${String.fromCharCode(97 + x)}${y + 1}`;
}

function bishopEdgeSquares(square) {
  const { x, y } = squareToCoords(square);
  const dirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const out = [];
  for (const [dx, dy] of dirs) {
    let cx = x;
    let cy = y;
    while (true) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || nx > 7 || ny < 0 || ny > 7) {
        out.push(coordsToSquare(cx, cy));
        break;
      }
      cx = nx;
      cy = ny;
    }
  }
  return Array.from(new Set(out)).sort();
}

function knightSquares(square) {
  const { x, y } = squareToCoords(square);
  const deltas = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  const out = [];
  for (const [dx, dy] of deltas) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx > 7 || ny < 0 || ny > 7) {
      continue;
    }
    out.push(coordsToSquare(nx, ny));
  }
  return out.sort();
}

function slidingMovesFrom(square, dirs, blockedSquare = null) {
  const { x, y } = squareToCoords(square);
  const out = [];
  for (const [dx, dy] of dirs) {
    let cx = x + dx;
    let cy = y + dy;
    while (cx >= 0 && cx <= 7 && cy >= 0 && cy <= 7) {
      const sq = coordsToSquare(cx, cy);
      if (blockedSquare && sq === blockedSquare) {
        break;
      }
      out.push(sq);
      cx += dx;
      cy += dy;
    }
  }
  return out;
}

function pieceMovesOnEmptyBoard(from, pieceRole, kingSquare) {
  if (pieceRole === 'N') {
    return knightSquares(from).filter((sq) => sq !== kingSquare);
  }
  if (pieceRole === 'B') {
    return slidingMovesFrom(from, [[1, 1], [1, -1], [-1, 1], [-1, -1]], kingSquare);
  }
  if (pieceRole === 'R') {
    return slidingMovesFrom(from, [[1, 0], [-1, 0], [0, 1], [0, -1]], kingSquare);
  }
  if (pieceRole === 'Q') {
    return slidingMovesFrom(from, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], kingSquare);
  }
  return [];
}

function attacksKing(from, pieceRole, kingSquare) {
  const f = squareToCoords(from);
  const k = squareToCoords(kingSquare);
  const dx = k.x - f.x;
  const dy = k.y - f.y;
  if (pieceRole === 'N') {
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    return (ax === 1 && ay === 2) || (ax === 2 && ay === 1);
  }
  if (pieceRole === 'B') {
    return Math.abs(dx) === Math.abs(dy);
  }
  if (pieceRole === 'R') {
    return dx === 0 || dy === 0;
  }
  if (pieceRole === 'Q') {
    return dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);
  }
  return false;
}

function pieceSymbol(role) {
  return ({ R: '♖', N: '♘', B: '♗', Q: '♕' }[role] ?? role);
}

function pieceNamePl(role) {
  return ({ R: 'wieża', N: 'skoczek', B: 'goniec', Q: 'hetman' }[role] ?? 'figura');
}

function isBlindMattingMode() {
  return state.sessionMode === 'blind-puzzles'
    && (state.blindPuzzles.mode === 'kr-matting' || state.blindPuzzles.mode === 'kq-matting');
}

function isBlindPlayableGameMode() {
  return state.sessionMode === 'blind-puzzles'
    && (state.blindPuzzles.mode === 'kr-matting'
      || state.blindPuzzles.mode === 'kq-matting'
      || state.blindPuzzles.mode === 'position'
      || state.blindPuzzles.mode === 'game-drill');
}

function kingsAdjacent(a, b) {
  const ac = squareToCoords(a);
  const bc = squareToCoords(b);
  return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y)) <= 1;
}

function randomKMajorMattingGame(majorPiece, maxTries = 500) {
  for (let i = 0; i < maxTries; i += 1) {
    const wk = randomSquare();
    let major = randomSquare();
    let bk = randomSquare();
    if (major === wk || bk === wk || bk === major) {
      continue;
    }
    if (kingsAdjacent(wk, bk)) {
      continue;
    }

    const board = Array.from({ length: 8 }, () => Array(8).fill(''));
    const wkC = squareToCoords(wk);
    const majorC = squareToCoords(major);
    const bkC = squareToCoords(bk);
    board[7 - wkC.y][wkC.x] = 'K';
    board[7 - majorC.y][majorC.x] = majorPiece;
    board[7 - bkC.y][bkC.x] = 'k';
    const fenBoard = board.map((row) => {
      let out = '';
      let empty = 0;
      for (const cell of row) {
        if (!cell) {
          empty += 1;
          continue;
        }
        if (empty) {
          out += String(empty);
          empty = 0;
        }
        out += cell;
      }
      if (empty) {
        out += String(empty);
      }
      return out;
    }).join('/');

    const whiteFen = `${fenBoard} w - - 0 1`;
    const blackFen = `${fenBoard} b - - 0 1`;
    const gameW = new Chess();
    const gameB = new Chess();
    try {
      gameW.load(whiteFen);
      gameB.load(blackFen);
    } catch (_error) {
      continue;
    }
    if (gameW.inCheck() || gameB.inCheck()) {
      continue;
    }
    if (gameW.isGameOver()) {
      continue;
    }
    return gameW;
  }
  return null;
}

function randomKRookMattingGame(maxTries = 500) {
  return randomKMajorMattingGame('R', maxTries);
}

function randomKQueenMattingGame(maxTries = 500) {
  return randomKMajorMattingGame('Q', maxTries);
}

function speakBlindPrompt(text) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pl-PL';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };
  speechSynthesis.speak(utterance);
}

function startBlindPuzzleTimer() {
  stopBlindPuzzleTimer();
  state.blindPuzzles.startAt = Date.now();
  state.blindPuzzles.elapsedMs = 0;
  state.blindPuzzles.timerId = window.setInterval(() => {
    if (!state.blindPuzzles.running || !state.blindPuzzles.startAt) {
      return;
    }
    state.blindPuzzles.elapsedMs = Date.now() - state.blindPuzzles.startAt;
    updateBlindPanel();
  }, 200);
}

function askNextSquareColorQuestion() {
  const sq = randomSquare();
  state.blindPuzzles.currentSquare = sq;
  state.blindPuzzles.currentAnswer = squareColorAnswer(sq);
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  elements.statusText.textContent = 'Say: białe or czarne';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function normalizeVoiceText(raw) {
  return String(raw ?? '').toLowerCase()
    .replace(/[ąćęłńóśżź]/g, (c) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ż: 'z', ź: 'z' }[c] ?? c))
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSquareColorVoice(raw) {
  const text = normalizeVoiceText(raw);
  if (text.includes('biale') || text.includes('white')) {
    return 'biale';
  }
  if (text.includes('czarne') || text.includes('black')) {
    return 'czarne';
  }
  return '';
}

function extractSquaresFromVoice(raw) {
  const text = normalizeVoiceText(raw);
  const matches = [...text.matchAll(/([a-h])\s*([1-8])/g)];
  return Array.from(new Set(matches.map((m) => `${m[1]}${m[2]}`)));
}

function hasStopToken(raw) {
  const text = normalizeVoiceText(raw);
  return /\b(stop|koniec|dosc|wystarczy)\b/.test(text);
}

function finishSquareColors(success) {
  state.blindPuzzles.running = false;
  state.blindPuzzles.elapsedMs = state.blindPuzzles.startAt ? (Date.now() - state.blindPuzzles.startAt) : state.blindPuzzles.elapsedMs;
  stopBlindPuzzleTimer();
  updateBlindPanel();
  if (success) {
    elements.statusText.textContent = `Game over. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.`;
  } else {
    elements.statusText.textContent = `Game over. Wrong answer. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.`;
  }
  setVoiceMode(false);
}

function finishBlindPuzzleGeneric(success, wrongReason = '') {
  state.blindPuzzles.running = false;
  state.blindPuzzles.elapsedMs = state.blindPuzzles.startAt ? (Date.now() - state.blindPuzzles.startAt) : state.blindPuzzles.elapsedMs;
  stopBlindPuzzleTimer();
  updateBlindPanel();
  if (success) {
    elements.statusText.textContent = `Game over. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.`;
  } else {
    const tail = wrongReason ? ` ${wrongReason}` : '';
    elements.statusText.textContent = `Game over. Wrong answer. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.${tail}`;
  }
  setVoiceMode(false);
}

function handleSquareColorsVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'square-colors' || !state.blindPuzzles.running) {
    return false;
  }
  const answer = normalizeSquareColorVoice(transcript);
  if (!answer) {
    elements.statusText.textContent = 'Answer with: białe or czarne.';
    return true;
  }

  state.blindPuzzles.asked += 1;
  if (answer !== state.blindPuzzles.currentAnswer) {
    finishSquareColors(false);
    return true;
  }

  state.blindPuzzles.correct += 1;
  if (state.blindPuzzles.asked >= state.blindPuzzles.total) {
    finishSquareColors(true);
    return true;
  }
  askNextSquareColorQuestion();
  return true;
}

function finishBlindQuestionOrAskNext(nextAsker) {
  state.blindPuzzles.asked += 1;
  state.blindPuzzles.correct += 1;
  if (state.blindPuzzles.asked >= state.blindPuzzles.total) {
    finishBlindPuzzleGeneric(true);
    return;
  }
  nextAsker();
}

function askNextBishopQuestion() {
  const sq = randomInnerSquare();
  state.blindPuzzles.currentSquare = sq;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set(bishopEdgeSquares(sq));
  state.blindPuzzles.givenSquares = new Set();
  elements.statusText.textContent = 'Say 4 edge squares reachable by bishop.';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function askNextKnightQuestion() {
  const sq = randomSquare();
  const targets = knightSquares(sq);
  state.blindPuzzles.currentSquare = sq;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set(targets);
  state.blindPuzzles.givenSquares = new Set();
  elements.statusText.textContent = targets.length < 8
    ? 'Say all knight squares, then say stop.'
    : 'Say all 8 knight squares.';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function askNextCheckQuestion() {
  const king = randomSquare();
  const roles = ['R', 'N', 'B', 'Q'];
  const role = roles[Math.floor(Math.random() * roles.length)];
  let from = randomSquare();
  let guard = 0;
  while ((from === king || attacksKing(from, role, king)) && guard < 200) {
    from = randomSquare();
    guard += 1;
  }

  const candidates = pieceMovesOnEmptyBoard(from, role, king).filter((to) =>
    !kingsAdjacent(to, king) && attacksKing(to, role, king)
  );

  state.blindPuzzles.currentSquare = `♚${king} ${pieceSymbol(role)}${from}`;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set(candidates);
  state.blindPuzzles.givenSquares = new Set();
  elements.statusText.textContent = 'Say all checking moves as squares, then stop.';
  updateBlindPanel();
  speakBlindPrompt(`król ${king}, ${pieceNamePl(role)} ${from}`);
}

function handleBishopVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'bishop-movements' || !state.blindPuzzles.running) {
    return false;
  }
  const heardSquares = extractSquaresFromVoice(transcript);
  if (!heardSquares.length) {
    elements.statusText.textContent = 'Say squares like a1, h8.';
    return true;
  }
  for (const sq of heardSquares) {
    if (!state.blindPuzzles.expectedSquares.has(sq)) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
    state.blindPuzzles.givenSquares.add(sq);
  }
  updateBlindPanel();
  if (state.blindPuzzles.givenSquares.size === state.blindPuzzles.expectedSquares.size) {
    finishBlindQuestionOrAskNext(askNextBishopQuestion);
  }
  return true;
}

function handleKnightVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'knight-movements' || !state.blindPuzzles.running) {
    return false;
  }
  const heardSquares = extractSquaresFromVoice(transcript);
  const stop = hasStopToken(transcript);

  for (const sq of heardSquares) {
    if (!state.blindPuzzles.expectedSquares.has(sq)) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
    state.blindPuzzles.givenSquares.add(sq);
  }
  updateBlindPanel();

  const expectedCount = state.blindPuzzles.expectedSquares.size;
  const gotAll = state.blindPuzzles.givenSquares.size === expectedCount;
  if (expectedCount === 8 && gotAll) {
    finishBlindQuestionOrAskNext(askNextKnightQuestion);
    return true;
  }

  if (expectedCount < 8 && stop) {
    if (gotAll) {
      finishBlindQuestionOrAskNext(askNextKnightQuestion);
    } else {
      finishBlindPuzzleGeneric(false);
    }
    return true;
  }

  if (!heardSquares.length && !stop) {
    elements.statusText.textContent = expectedCount < 8
      ? 'Say squares, then stop.'
      : 'Say all 8 squares.';
  }
  return true;
}

function handleCheckVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'check' || !state.blindPuzzles.running) {
    return false;
  }
  const heardSquares = extractSquaresFromVoice(transcript);
  const stop = hasStopToken(transcript);

  for (const sq of heardSquares) {
    if (!state.blindPuzzles.expectedSquares.has(sq)) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
    state.blindPuzzles.givenSquares.add(sq);
  }
  updateBlindPanel();

  if (!stop) {
    if (!heardSquares.length) {
      elements.statusText.textContent = 'Say squares and then stop.';
    }
    return true;
  }

  if (state.blindPuzzles.givenSquares.size !== state.blindPuzzles.expectedSquares.size) {
    finishBlindPuzzleGeneric(false);
    return true;
  }
  finishBlindQuestionOrAskNext(askNextCheckQuestion);
  return true;
}

function handleBlindPuzzleVoice(transcript) {
  if (handleSquareColorsVoice(transcript)) {
    return true;
  }
  if (handleBishopVoice(transcript)) {
    return true;
  }
  if (handleKnightVoice(transcript)) {
    return true;
  }
  if (handleCheckVoice(transcript)) {
    return true;
  }
  return false;
}

function startBlindPuzzlesMode() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.revealPosition = false;
  clearBlindClickSelection();
  updateAll();
  elements.statusText.textContent = 'Choose a blind puzzle.';
}

function nextUnsolvedPositionIndex() {
  for (let i = 0; i < state.positionExercises.length; i += 1) {
    if (!state.positionSolved.has(i)) {
      return i;
    }
  }
  return -1;
}

function nextUnsolvedGameIndex() {
  for (let i = 0; i < state.gameExercises.length; i += 1) {
    if (!state.gameSolved.has(i)) {
      return i;
    }
  }
  return -1;
}

function speakPositionTask(task) {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    speechSynthesis.cancel();
  }
  const spokenTask = String(task)
    .replace(/\bK([a-h][1-8])\b/gi, (_m, sq) => `król ${sq.toLowerCase()}`)
    .replace(/\bH([a-h][1-8])\b/gi, (_m, sq) => `hetman ${sq.toLowerCase()}`)
    .replace(/\bW([a-h][1-8])\b/gi, (_m, sq) => `wieża ${sq.toLowerCase()}`)
    .replace(/\bG([a-h][1-8])\b/gi, (_m, sq) => `goniec ${sq.toLowerCase()}`)
    .replace(/\bS([a-h][1-8])\b/gi, (_m, sq) => `skoczek ${sq.toLowerCase()}`)
    .replace(/\bP\s*:\s*([a-h][1-8](?:\s*,\s*[a-h][1-8])*)/gi, (_m, list) => {
      const parts = list.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
      return parts.map((sq) => `pion ${sq}`).join(', ');
    });
  const utterance = new SpeechSynthesisUtterance(spokenTask);
  utterance.lang = 'pl-PL';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };
  speechSynthesis.speak(utterance);
}

function startPositionExercise() {
  if (!state.positionExercises.length) {
    elements.statusText.textContent = 'No valid position exercises loaded.';
    return;
  }
  const idx = nextUnsolvedPositionIndex();
  if (idx < 0) {
    elements.statusText.textContent = 'All position exercises solved.';
    return;
  }
  const ex = state.positionExercises[idx];
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.blindPuzzles.mode = 'position';
  state.blindPuzzles.positionIndex = idx;
  state.userColor = ex.turn === 'w' ? 'white' : 'black';
  state.revealPosition = false;
  state.reviewPly = null;
  state.game = new Chess();
  state.game.load(ex.fen);
  updateAll();
  elements.statusText.textContent = ex.task;
  speakPositionTask(ex.task);
  setVoiceMode(false);
}

function speakGameTask(exercise) {
  if (!exercise) {
    return;
  }
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    speechSynthesis.cancel();
  }
  const movesSpoken = (exercise.moveSans ?? [])
    .map((san, idx) => {
      const prefix = idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : '';
      return `${prefix}${sanToPolishSpeech(san)}`;
    })
    .join('. ');
  const side = exercise.turn === 'w' ? 'biale zaczynaja' : 'czarne zaczynaja';
  const utterance = new SpeechSynthesisUtterance(`${movesSpoken}. ${side}.`);
  utterance.lang = 'pl-PL';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };
  speechSynthesis.speak(utterance);
}

function startGameExercise() {
  if (!state.gameExercises.length) {
    elements.statusText.textContent = 'No valid game exercises loaded.';
    return;
  }
  const idx = nextUnsolvedGameIndex();
  if (idx < 0) {
    elements.statusText.textContent = 'All game exercises solved.';
    return;
  }
  const ex = state.gameExercises[idx];
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.blindPuzzles.mode = 'game-drill';
  state.blindPuzzles.gameIndex = idx;
  state.blindPuzzles.gamePrefixMoves = ex.moveVerbose ?? [];
  state.userColor = ex.turn === 'w' ? 'white' : 'black';
  state.revealPosition = false;
  state.reviewPly = null;
  state.game = new Chess();
  state.game.load(ex.fen);
  updateAll();
  speakGameTask(ex);
  setVoiceMode(false);
}

function maybeMarkPositionSolved() {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'position') {
    return;
  }
  const idx = state.blindPuzzles.positionIndex;
  if (!Number.isInteger(idx) || state.positionSolved.has(idx)) {
    return;
  }
  if (!state.game.isGameOver()) {
    return;
  }
  state.positionSolved.add(idx);
  writeSolvedPositions();
  elements.statusText.textContent = `Exercise solved and saved (${state.positionSolved.size}/${state.positionExercises.length}).`;
}

function maybeMarkGameSolved() {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'game-drill') {
    return;
  }
  const idx = state.blindPuzzles.gameIndex;
  if (!Number.isInteger(idx) || state.gameSolved.has(idx)) {
    return;
  }
  if (!state.game.isGameOver()) {
    return;
  }
  state.gameSolved.add(idx);
  writeSolvedGames();
  elements.statusText.textContent = `Game exercise solved and saved (${state.gameSolved.size}/${state.gameExercises.length}).`;
}

function maybeMarkBlindExerciseSolved() {
  maybeMarkPositionSolved();
  maybeMarkGameSolved();
}

function gameDrillPrefixMoves() {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'game-drill') {
    return [];
  }
  return state.blindPuzzles.gamePrefixMoves ?? [];
}

function gameDrillTotalPlies() {
  return gameDrillPrefixMoves().length + state.game.history({ verbose: true }).length;
}

function gameDrillBoardFromAbsPly(absPly) {
  const prefix = gameDrillPrefixMoves();
  const played = state.game.history({ verbose: true });
  const total = prefix.length + played.length;
  const viewed = Math.max(0, Math.min(total, absPly));
  if (viewed >= total) {
    return state.game;
  }
  const replay = new Chess();
  const combined = [...prefix, ...played];
  for (let i = 0; i < viewed; i += 1) {
    const mv = combined[i];
    replay.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
  }
  return replay;
}

function startSquareColors() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'square-colors';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = state.blindQuestionCount;
  updateAll();
  startBlindPuzzleTimer();
  askNextSquareColorQuestion();
  setVoiceMode(false);
}

function startBishopMovements() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'bishop-movements';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = state.blindQuestionCount;
  updateAll();
  startBlindPuzzleTimer();
  askNextBishopQuestion();
  setVoiceMode(false);
}

function startKnightMovements() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'knight-movements';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = state.blindQuestionCount;
  updateAll();
  startBlindPuzzleTimer();
  askNextKnightQuestion();
  setVoiceMode(false);
}

function startCheckPuzzle() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'check';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = state.blindQuestionCount;
  updateAll();
  startBlindPuzzleTimer();
  askNextCheckQuestion();
  setVoiceMode(false);
}

function startKRookMatting() {
  const game = randomKRookMattingGame();
  if (!game) {
    elements.statusText.textContent = 'Could not generate K+R position. Try again.';
    return;
  }
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.blindPuzzles.mode = 'kr-matting';
  state.userColor = 'white';
  state.revealPosition = false;
  state.reviewPly = null;
  state.game = game;
  updateAll();
  elements.statusText.textContent = 'K+R vs K started. Mate black.';
  setVoiceMode(false);
}

function startKQueenMatting() {
  const game = randomKQueenMattingGame();
  if (!game) {
    elements.statusText.textContent = 'Could not generate K+Q position. Try again.';
    return;
  }
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.blindPuzzles.mode = 'kq-matting';
  state.userColor = 'white';
  state.revealPosition = false;
  state.reviewPly = null;
  state.game = game;
  updateAll();
  elements.statusText.textContent = 'K+Q vs K started. Mate black.';
  setVoiceMode(false);
}

function nextPuzzleMoveText() {
  if (state.sessionMode !== 'puzzle' || !state.puzzle || state.puzzle.solved) {
    return null;
  }
  const mv = state.puzzle.lineMoves[state.puzzle.solutionIndex];
  if (!mv) {
    return null;
  }
  return formatSanForDisplay(mv.san);
}

function autoPlayPuzzleOpponentMovesIfEnabled() {
  if (state.sessionMode !== 'puzzle' || !state.puzzle || state.puzzle.solved || !state.puzzleAutoOpponent) {
    return;
  }

  while (!state.puzzle.solved) {
    const expected = state.puzzle.lineMoves[state.puzzle.solutionIndex];
    if (!expected) {
      break;
    }
    if (expected.color === state.puzzle.playerColor) {
      break;
    }
    if (!playPuzzleUciMove(expected.uci)) {
      elements.statusText.textContent = 'Puzzle data mismatch for this position.';
      break;
    }
    markPuzzleSolvedIfFinished();
  }
}

async function showPuzzleSolution() {
  if (!state.puzzle || state.puzzle.solved || state.puzzleAutoPlaying) {
    return;
  }

  state.puzzle.revealSolutionText = true;
  state.puzzle.solutionIndex = state.puzzle.lineMoves.length;
  state.puzzle.solved = true;
  updateAll();
  elements.statusText.textContent = 'Solution revealed. Use Next or click moves to view on board.';
}

function puzzleStepBack() {
  if (!state.puzzle || state.puzzleAutoPlaying || state.puzzleViewIndex <= 0) {
    return;
  }
  state.puzzleViewIndex -= 1;
  if (!syncPuzzleGameToView()) {
    elements.statusText.textContent = 'Cannot navigate puzzle move list.';
    return;
  }
  updateAll();
}

function puzzleStepForward() {
  const progressAbsPly = puzzleProgressAbsPly();
  if (!state.puzzle || state.puzzleAutoPlaying || state.puzzleViewIndex >= progressAbsPly) {
    return;
  }
  state.puzzleViewIndex += 1;
  if (!syncPuzzleGameToView()) {
    elements.statusText.textContent = 'Cannot navigate puzzle move list.';
    return;
  }
  updateAll();
}

function reviewStepBack() {
  if (state.sessionMode === 'puzzle') {
    puzzleStepBack();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    const viewed = state.reviewPly ?? total;
    if (viewed <= 0) {
      return;
    }
    state.reviewPly = viewed - 1;
    updateAll();
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  const viewed = state.reviewPly ?? total;
  if (viewed <= 0) {
    return;
  }
  state.reviewPly = viewed - 1;
  updateAll();
}

function reviewStepForward() {
  if (state.sessionMode === 'puzzle') {
    puzzleStepForward();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    const viewed = state.reviewPly ?? total;
    if (viewed >= total) {
      return;
    }
    const next = viewed + 1;
    state.reviewPly = next >= total ? null : next;
    updateAll();
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  const viewed = state.reviewPly ?? total;
  if (viewed >= total) {
    return;
  }
  const next = viewed + 1;
  state.reviewPly = next >= total ? null : next;
  updateAll();
}

function jumpToMovePly(absPly) {
  if (!Number.isInteger(absPly) || absPly < 0) {
    return;
  }

  if (state.sessionMode === 'puzzle') {
    if (!state.puzzle || state.puzzleAutoPlaying) {
      return;
    }
    const progressAbsPly = puzzleProgressAbsPly();
    const bounded = Math.max(0, Math.min(progressAbsPly, absPly + 1));
    state.puzzleViewIndex = bounded;
    if (!syncPuzzleGameToView()) {
      elements.statusText.textContent = 'Cannot navigate puzzle move list.';
      return;
    }
    updateAll();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    if (total === 0) {
      return;
    }
    const next = Math.max(1, Math.min(total, absPly + 1));
    state.reviewPly = next >= total ? null : next;
    updateAll();
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  if (total === 0) {
    return;
  }
  const next = Math.max(1, Math.min(total, absPly + 1));
  state.reviewPly = next >= total ? null : next;
  updateAll();
}

function updateReviewControls() {
  if (state.sessionMode === 'puzzle') {
    const progressAbsPly = puzzleProgressAbsPly();
    const canPrev = !!state.puzzle && !state.puzzleAutoPlaying && state.puzzleViewIndex > 0;
    const canNext = !!state.puzzle && !state.puzzleAutoPlaying && state.puzzleViewIndex < progressAbsPly;
    elements.reviewPrevBtn.disabled = !canPrev;
    elements.reviewNextBtn.disabled = !canNext;
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const total = gameDrillTotalPlies();
    const viewed = state.reviewPly ?? total;
    elements.reviewPrevBtn.disabled = viewed <= 0;
    elements.reviewNextBtn.disabled = viewed >= total;
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  const viewed = state.reviewPly ?? total;
  elements.reviewPrevBtn.disabled = viewed <= 0;
  elements.reviewNextBtn.disabled = viewed >= total;
}

function uciFromMove(mv) {
  return `${mv.from}${mv.to}${mv.promotion ? mv.promotion : ''}`;
}

function normalizeMoveInput(inputRaw) {
  let move = inputRaw.trim();
  const spoken = move
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (['roszada', 'krotka roszada', 'roszada krotka'].includes(spoken)) {
    move = 'O-O';
  } else if (['dluga roszada', 'roszada dluga'].includes(spoken)) {
    move = 'O-O-O';
  }
  const compactCastle = move.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (compactCastle === 'ooo' || compactCastle === '000') {
    move = 'O-O-O';
  } else if (compactCastle === 'oo' || compactCastle === '00') {
    move = 'O-O';
  } else {
    move = move.replace(/^0-0-0$/i, 'O-O-O').replace(/^0-0$/i, 'O-O');
  }

  const uci = move.toLowerCase().replace(/\s+/g, '');
  if (/^[a-h][1-8][a-h][1-8][qrbnshwg]?$/.test(uci)) {
    const promoMap = { s: 'n', h: 'q', w: 'r', g: 'b' };
    const promo = uci[4] ? (promoMap[uci[4]] ?? uci[4]) : '';
    return { type: 'uci', value: `${uci.slice(0, 4)}${promo}` };
  }

  if (state.moveLanguage === 'pl') {
    move = normalizePolishFigureWords(move);
    move = move
      .replace(/^([khwgs])/i, (_m, p1) => p1.toUpperCase())
      .replace(/=([hwgs])/i, (_m, p1) => `=${p1.toUpperCase()}`);
    move = polishToEnglishSan(move);
  }

  // Voice transcription may uppercase SAN (e.g. "NF3", "NBD2", "EXD5").
  // Normalize to canonical SAN casing.
  move = move.toLowerCase();
  move = move.replace(/^([kqrbn])/, (_m, p1) => p1.toUpperCase());
  move = move.replace(/=([qrbn])/g, (_m, p1) => `=${p1.toUpperCase()}`);

  return { type: 'san', value: move };
}

function findMatchingMove(text) {
  const parsed = normalizeMoveInput(text);
  const legal = state.game.moves({ verbose: true });
  const normalizeLoose = (san) => san.replace(/[x+#]/g, '');

  for (const mv of legal) {
    const engSan = mv.san;
    const polSan = englishToPolishSan(mv.san);
    const uci = uciFromMove(mv);

    if (parsed.type === 'uci' && parsed.value === uci) {
      return mv;
    }

    if (parsed.type === 'san' && [engSan, polSan].includes(parsed.value)) {
      return mv;
    }

    if (parsed.type === 'san' && [engSan, polSan].some((san) => normalizeLoose(san) === normalizeLoose(parsed.value))) {
      return mv;
    }
  }

  if (parsed.type === 'san') {
    const stripped = parsed.value.replace(/[+#]/g, '');
    const target = (stripped.match(/([a-h][1-8])$/) ?? [])[1];
    const first = stripped[0];
    const wantedPiece = ({ K: 'k', Q: 'q', R: 'r', B: 'b', N: 'n' }[first] ?? 'p');
    const capture = stripped.includes('x');
    const promotion = (stripped.match(/=([QRBN])$/) ?? [])[1]?.toLowerCase();

    if (target) {
      const candidates = legal.filter((mv) =>
        mv.to === target &&
        mv.piece === wantedPiece &&
        (!promotion || mv.promotion === promotion) &&
        (!capture || mv.flags.includes('c') || mv.flags.includes('e'))
      );
      if (candidates.length === 1) {
        return candidates[0];
      }
    }
  }

  return null;
}

function findLooseExpectedPuzzleMove(text) {
  if (state.sessionMode !== 'puzzle' || !state.puzzle || state.puzzle.solved) {
    return null;
  }

  const parsed = normalizeMoveInput(text);
  if (parsed.type !== 'san') {
    return null;
  }

  const expectedUci = currentPuzzleExpectedUci();
  if (!expectedUci) {
    return null;
  }
  const expectedMove = findLegalMoveByUci(expectedUci);
  if (!expectedMove) {
    return null;
  }

  const normalizeLoose = (san) => san.replace(/[+#x]/g, '');
  const inputLoose = normalizeLoose(parsed.value);
  const expectedLoose = normalizeLoose(expectedMove.san);
  return inputLoose === expectedLoose ? expectedMove : null;
}

function applyPlayerMove(text) {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    return false;
  }

  if (state.sessionMode === 'puzzle' && state.puzzleAutoPlaying) {
    elements.statusText.textContent = 'Solution playback in progress...';
    return false;
  }

  if (isReviewLocked()) {
    elements.statusText.textContent = 'Review mode active. Press Next to return to the latest position.';
    return false;
  }

  if (!isUserTurn()) {
    return false;
  }

  const previousPuzzleView = state.sessionMode === 'puzzle' ? state.puzzleViewIndex : null;
  const restorePuzzleView = () => {
    if (state.sessionMode === 'puzzle' && previousPuzzleView !== null) {
      state.puzzleViewIndex = previousPuzzleView;
      syncPuzzleGameToView();
    }
  };

  if (state.sessionMode === 'puzzle' && state.puzzle && !syncPuzzleToProgress()) {
    elements.statusText.textContent = 'Puzzle state mismatch. Load a new puzzle.';
    return false;
  }

  if (state.sessionMode === 'puzzle' && state.puzzle && trySkipContextToSolutionByInput(text)) {
    updateAll();
  }

  let match = findMatchingMove(text);
  if (!match) {
    match = findLooseExpectedPuzzleMove(text);
  }
  if (!match) {
    if (state.sessionMode === 'puzzle' && state.puzzle && !state.puzzle.solved) {
      elements.statusText.textContent = 'Wrong move.';
    }
    restorePuzzleView();
    return false;
  }

  if (state.sessionMode === 'puzzle' && state.puzzle && !state.puzzle.solved) {
    let playedUci = uciFromMove(match);
    let expectedUci = currentPuzzleExpectedUci();
    if ((!expectedUci || playedUci !== expectedUci) && trySkipContextToSolution(playedUci)) {
      match = findMatchingMove(text);
      if (!match) {
        elements.statusText.textContent = 'Could not match move after context jump.';
        restorePuzzleView();
        return false;
      }
      playedUci = uciFromMove(match);
      expectedUci = currentPuzzleExpectedUci();
    }
    if (!expectedUci || playedUci !== expectedUci) {
      elements.statusText.textContent = 'Wrong move.';
      restorePuzzleView();
      return false;
    }
    state.puzzle.solutionIndex += 1;
  }

  state.game.move({ from: match.from, to: match.to, promotion: match.promotion });
  if (state.sessionMode === 'puzzle') {
    markPuzzleSolvedIfFinished();
    autoPlayPuzzleOpponentMovesIfEnabled();
    restorePuzzleView();
    updateAll();
    if (!state.puzzle?.solved) {
      elements.statusText.textContent = 'Correct.';
    }
  } else {
    afterAnyMove();
    window.setTimeout(playEngineMoveIfNeeded, 250);
  }
  return true;
}

function onBoardMove(from, to) {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    updateBoard();
    return;
  }

  if (state.sessionMode === 'puzzle') {
    elements.statusText.textContent = 'Board is inactive in puzzle mode. Use text or voice input.';
    updateBoard();
    return;
  }

  if (isReviewLocked()) {
    elements.statusText.textContent = 'Review mode active. Press Next to return to the latest position.';
    updateBoard();
    return;
  }

  if (!isUserTurn()) {
    updateBoard();
    return;
  }

  const legal = state.game.moves({ verbose: true });
  const match = legal.find((mv) => mv.from === from && mv.to === to);
  if (!match) {
    updateBoard();
    return;
  }

  state.game.move({ from, to, promotion: match.promotion ?? 'q' });
  afterAnyMove();
  window.setTimeout(playEngineMoveIfNeeded, 250);
}

function isUserTurn() {
  if (state.sessionMode === 'puzzle') {
    return true;
  }
  return state.game.turn() === (state.userColor === 'white' ? 'w' : 'b');
}

function engineColor() {
  return state.userColor === 'white' ? 'b' : 'w';
}

function stockfishMoveTimeFromElo(elo = state.stockfishElo) {
  if (elo <= 800) return 70;
  if (elo <= 1200) return 90;
  if (elo <= 1600) return 130;
  if (elo <= 2000) return 180;
  if (elo <= 2400) return 260;
  return 380;
}

function syncEngineControlUi() {
  elements.optionEngineStrength.min = '400';
  elements.optionEngineStrength.max = '2850';
  elements.optionEngineStrength.step = '50';
  elements.optionEngineStrength.value = String(state.stockfishElo);
  elements.optionStrengthValue.textContent = String(state.stockfishElo);
}

function ensureStockfishWorker() {
  if (stockfishState.worker) {
    return;
  }

  const worker = new Worker('/engines/stockfish-18-lite-single.js');
  stockfishState.worker = worker;
  stockfishState.ready = false;
  stockfishState.uciReadySeen = false;
  stockfishState.readySeen = false;

  worker.onmessage = (event) => {
    const line = String(event.data ?? '').trim();
    if (!line) {
      return;
    }

    if (line === 'uciok') {
      stockfishState.uciReadySeen = true;
      worker.postMessage('isready');
      return;
    }

    if (line === 'readyok') {
      stockfishState.readySeen = true;
      stockfishState.ready = true;
      return;
    }

    const pending = stockfishState.pending;
    if (!pending) {
      return;
    }

    if (pending.mode === 'bestmove' && line.startsWith('bestmove ')) {
      const uci = line.split(/\s+/)[1];
      stockfishState.pending = null;
      pending.resolve({ uci });
      return;
    }

    if (pending.mode === 'multipv') {
      if (line.startsWith('info ')) {
        const multipvMatch = line.match(/\bmultipv\s+(\d+)/);
        const pvMatch = line.match(/\bpv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (multipvMatch && pvMatch) {
          const idx = Number(multipvMatch[1]);
          pending.entries.set(idx, pvMatch[1]);
        }
      }

      if (line.startsWith('bestmove ')) {
        const uci = line.split(/\s+/)[1];
        stockfishState.pending = null;
        pending.resolve({
          uci,
          multipvMoves: [...pending.entries.entries()]
            .sort((a, b) => a[0] - b[0])
            .map((entry) => entry[1])
        });
      }
    }
  };

  worker.onerror = () => {
    stockfishState.ready = false;
    if (stockfishState.pending) {
      stockfishState.pending.reject(new Error('Stockfish worker error'));
      stockfishState.pending = null;
    }
  };

  worker.postMessage('uci');
}

function waitForStockfishReady(timeoutMs = 5000) {
  ensureStockfishWorker();
  if (stockfishState.ready) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (stockfishState.ready) {
        resolve();
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        reject(new Error('Stockfish did not become ready in time'));
        return;
      }
      window.setTimeout(tick, 30);
    };
    tick();
  });
}

function parseUci(uci) {
  if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(uci ?? '')) {
    return null;
  }
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci[4]
  };
}

function findLegalMoveByUci(uci) {
  const parsed = parseUci(uci);
  if (!parsed) {
    return null;
  }
  const legal = state.game.moves({ verbose: true });
  return legal.find((mv) =>
    mv.from === parsed.from &&
    mv.to === parsed.to &&
    (mv.promotion ?? '') === (parsed.promotion ?? '')
  ) ?? null;
}

async function requestStockfishBestMove({ fen, moveTime, uciElo }) {
  await waitForStockfishReady();

  if (stockfishState.pending) {
    stockfishState.worker.postMessage('stop');
    stockfishState.pending.reject(new Error('Engine request replaced by newer one'));
    stockfishState.pending = null;
  }

  return new Promise((resolve, reject) => {
    const pending = {
      mode: 'bestmove',
      resolve,
      reject,
      entries: new Map()
    };
    stockfishState.pending = pending;

    const timeout = window.setTimeout(() => {
      if (stockfishState.pending === pending) {
        stockfishState.pending = null;
        reject(new Error('Stockfish search timed out'));
      }
    }, Math.max(2000, moveTime * 10));

    const finish = pending.resolve;
    const fail = pending.reject;

    pending.resolve = (value) => {
      window.clearTimeout(timeout);
      finish(value);
    };

    pending.reject = (error) => {
      window.clearTimeout(timeout);
      fail(error);
    };

    stockfishState.worker.postMessage('ucinewgame');
    stockfishState.worker.postMessage('setoption name Skill Level value 20');
    stockfishState.worker.postMessage('setoption name MultiPV value 1');
    stockfishState.worker.postMessage('setoption name UCI_LimitStrength value true');
    stockfishState.worker.postMessage(`setoption name UCI_Elo value ${Math.max(400, Math.min(2850, uciElo))}`);
    stockfishState.worker.postMessage(`position fen ${fen}`);
    stockfishState.worker.postMessage(`go movetime ${moveTime}`);
  });
}

async function pickStockfishMove({ eloOverride, moveTimeOverride } = {}) {
  const fen = state.game.fen();
  const uciElo = eloOverride ?? state.stockfishElo;
  const moveTime = moveTimeOverride ?? stockfishMoveTimeFromElo(uciElo);

  const result = await requestStockfishBestMove({
    fen,
    moveTime,
    uciElo
  });

  return findLegalMoveByUci(result.uci);
}

async function pickEngineMove() {
  if (isBlindPlayableGameMode()) {
    return pickStockfishMove({ eloOverride: 2850, moveTimeOverride: 300 });
  }
  return pickStockfishMove();
}

function speakMoveIfEnabled(moveSan) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }

  if (state.speaking) {
    speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(
    state.moveLanguage === 'pl' ? sanToPolishSpeech(moveSan) : sanToEnglishSpeech(moveSan)
  );
  utterance.lang = state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };

  speechSynthesis.speak(utterance);
}

function speakPuzzleSolvedIfEnabled() {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    speechSynthesis.cancel();
  }
  const utterance = new SpeechSynthesisUtterance('brawo');
  utterance.lang = 'pl-PL';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };
  speechSynthesis.speak(utterance);
}

function speakPuzzleContextIfEnabled(contextSans) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (!Array.isArray(contextSans) || !contextSans.length) {
    return;
  }
  if (state.speaking) {
    speechSynthesis.cancel();
  }
  const spokenMoves = contextSans
    .map((san) => state.moveLanguage === 'pl' ? sanToPolishSpeech(san) : sanToEnglishSpeech(san))
    .filter(Boolean);
  if (!spokenMoves.length) {
    return;
  }
  const utterance = new SpeechSynthesisUtterance(spokenMoves.join('. '));
  utterance.lang = state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US';
  utterance.onstart = () => {
    state.speaking = true;
    refreshVoiceListeningState();
  };
  utterance.onend = () => {
    state.speaking = false;
    refreshVoiceListeningState();
  };
  speechSynthesis.speak(utterance);
}

async function playEngineMoveIfNeeded() {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    return;
  }
  if (state.sessionMode !== 'game' && !isBlindPlayableGameMode()) {
    return;
  }
  if (state.game.isGameOver()) {
    updateAll();
    return;
  }

  if (state.game.turn() !== engineColor()) {
    return;
  }

  if (state.engineThinking) {
    return;
  }

  state.engineThinking = true;
  refreshVoiceListeningState();
  try {
    const mv = await pickEngineMove();
    if (!mv) {
      return;
    }

    if (state.game.isGameOver() || state.game.turn() !== engineColor()) {
      return;
    }

    state.game.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
    speakMoveIfEnabled(mv.san);
    afterAnyMove();
  } catch (_error) {
    elements.statusText.textContent = 'Stockfish error. Try New Game.';
  } finally {
    state.engineThinking = false;
    refreshVoiceListeningState();
  }
}

function updateMovesList() {
  let hist = state.game.history({ verbose: false });
  let startPly = 0;
  let viewedPly = hist.length;
  if (state.sessionMode === 'puzzle' && state.puzzle) {
    const solvedSolutionCount = Math.max(0, state.puzzle.solutionIndex - state.puzzle.contextMoves.length);
    const solvedSolutionSans = state.puzzle.solutionSans.slice(0, solvedSolutionCount);
    hist = [...state.puzzle.prefixSans, ...state.puzzle.contextSans, ...solvedSolutionSans];
    startPly = 0;
    viewedPly = state.puzzleViewIndex;
  } else if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const prefixSans = gameDrillPrefixMoves().map((mv) => mv.san);
    const playedSans = state.game.history({ verbose: false });
    hist = [...prefixSans, ...playedSans];
    viewedPly = state.reviewPly ?? hist.length;
  } else if (state.sessionMode !== 'puzzle') {
    viewedPly = state.reviewPly ?? hist.length;
  }

  elements.movesBody.innerHTML = '';
  const activeAbsPly = viewedPly > 0 ? (startPly + viewedPly - 1) : null;

  const rows = [];
  for (let i = 0; i < hist.length; i += 1) {
    const ply = startPly + i;
    const moveNo = Math.floor(ply / 2) + 1;
    const san = formatSanForDisplay(hist[i]);
    if (ply % 2 === 0) {
      rows.push({
        moveNo,
        white: san,
        black: '',
        whitePly: ply,
        blackPly: null
      });
    } else if (rows.length > 0 && rows[rows.length - 1].moveNo === moveNo && rows[rows.length - 1].black === '') {
      rows[rows.length - 1].black = san;
      rows[rows.length - 1].blackPly = ply;
    } else {
      rows.push({
        moveNo,
        white: '',
        black: san,
        whitePly: null,
        blackPly: ply
      });
    }
  }

  for (const row of rows) {
    const tr = document.createElement('tr');
    const tdNo = document.createElement('td');
    const tdWhite = document.createElement('td');
    const tdBlack = document.createElement('td');
    tdNo.textContent = String(row.moveNo);
    tdWhite.textContent = row.white;
    tdBlack.textContent = row.black;
    const whiteClickable = row.white && row.whitePly !== null;
    const blackClickable = row.black && row.blackPly !== null;
    if (whiteClickable) {
      tdWhite.dataset.ply = String(row.whitePly);
      tdWhite.classList.add('clickable-move');
    }
    if (blackClickable) {
      tdBlack.dataset.ply = String(row.blackPly);
      tdBlack.classList.add('clickable-move');
    }
    if (activeAbsPly !== null) {
      if (row.whitePly === activeAbsPly) {
        tdWhite.classList.add('active-move');
      }
      if (row.blackPly === activeAbsPly) {
        tdBlack.classList.add('active-move');
      }
    }
    tr.append(tdNo, tdWhite, tdBlack);
    elements.movesBody.appendChild(tr);
  }
}

function updateLastMove() {
  let hist = state.game.history({ verbose: false });
  if (state.sessionMode === 'puzzle' && state.puzzle) {
    const solvedSolutionCount = Math.max(0, state.puzzle.solutionIndex - state.puzzle.contextMoves.length);
    const solvedSolutionSans = state.puzzle.solutionSans.slice(0, solvedSolutionCount);
    hist = [...state.puzzle.prefixSans, ...state.puzzle.contextSans, ...solvedSolutionSans];
  } else if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const prefixSans = gameDrillPrefixMoves().map((mv) => mv.san);
    hist = [...prefixSans, ...state.game.history({ verbose: false })];
  }

  const last = hist.length ? hist[hist.length - 1] : null;
  if (!last) {
    elements.lastMoveText.textContent = '-';
    return;
  }
  elements.lastMoveText.textContent = formatSanForDisplay(last);
}

function updateStatus() {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && !isBlindPlayableGameMode()) {
    return;
  }
  const boardGame = getBoardGame();
  const turn = boardGame.turn() === 'w' ? 'White' : 'Black';
  if (state.sessionMode === 'blind-puzzles' && (state.blindPuzzles.mode === 'position' || state.blindPuzzles.mode === 'game-drill')) {
    elements.statusText.textContent = `${turn} to move`;
    return;
  }
  const check = boardGame.inCheck() ? ' (Check)' : '';

  if (state.sessionMode === 'puzzle' && state.puzzle) {
    if (state.puzzle.solved) {
      elements.statusText.textContent = 'Puzzle solved.';
      return;
    }
    if (state.puzzleAutoPlaying) {
      elements.statusText.textContent = 'Showing full puzzle solution...';
      return;
    }
    elements.statusText.textContent = `${turn} to move${check} (Puzzle)`;
    return;
  }

  if (boardGame.isCheckmate()) {
    const winner = boardGame.turn() === 'w' ? 'Black' : 'White';
    elements.statusText.textContent = `Checkmate. ${winner} wins.`;
    return;
  }

  if (boardGame.isDraw()) {
    elements.statusText.textContent = 'Draw.';
    return;
  }
  elements.statusText.textContent = `${turn} to move${check}`;
}

function updateVoiceUi() {
  const stickyOn = state.voiceMode && !state.voiceOneShot;
  const oneShotOn = state.voiceMode && state.voiceOneShot;
  elements.voiceStickyBtn.textContent = stickyOn ? 'Voice: On' : 'Voice: Off';
  elements.voiceStickyBtn.classList.toggle('is-on', stickyOn);
  elements.voiceOnceBtn.classList.toggle('is-on', oneShotOn);
  elements.voiceOnceBtn.textContent = oneShotOn ? 'Listen Once: On' : 'Listen Once';
  const hideMoveForm = state.voiceMode || (state.sessionMode === 'blind-puzzles' && !isBlindPlayableGameMode());
  elements.moveInputs.classList.toggle('voice-active', hideMoveForm);
  if (!state.voiceMode) {
    elements.voiceStatus.textContent = '';
  } else if (isWaitingForComputerMove()) {
    elements.voiceStatus.textContent = 'Waiting for computer move...';
  } else if (!state.voiceListening && !elements.voiceStatus.textContent) {
    elements.voiceStatus.textContent = 'Starting voice recognition...';
  }
  updateMoveAssistVisibility();
}

function updateMoveAssistVisibility() {
  const inputFocused = document.activeElement === elements.moveInput;
  const visible = state.showOnScreenKeyboard && inputFocused && !elements.moveInputs.hidden;
  elements.moveAssist.hidden = !visible;
  elements.moveAssist.classList.toggle('is-popup-open', visible);
}

function applyRuntimeLayoutOverrides() {
  const portrait = window.matchMedia('(orientation: portrait)').matches;
  if (portrait) {
    elements.reviewNav.style.setProperty('margin-top', '2rem', 'important');
    elements.reviewPrevBtn.style.setProperty('min-height', '1.5rem', 'important');
    elements.reviewNextBtn.style.setProperty('min-height', '1.5rem', 'important');
    elements.reviewPrevBtn.style.setProperty('padding-top', '0.5rem', 'important');
    elements.reviewNextBtn.style.setProperty('padding-top', '0.5rem', 'important');
    elements.reviewPrevBtn.style.setProperty('padding-bottom', '0.4rem', 'important');
    elements.reviewNextBtn.style.setProperty('padding-bottom', '0.4rem', 'important');
    return;
  }
  elements.reviewNav.style.removeProperty('margin-top');
  elements.reviewPrevBtn.style.removeProperty('min-height');
  elements.reviewNextBtn.style.removeProperty('min-height');
  elements.reviewPrevBtn.style.removeProperty('padding-top');
  elements.reviewNextBtn.style.removeProperty('padding-top');
  elements.reviewPrevBtn.style.removeProperty('padding-bottom');
  elements.reviewNextBtn.style.removeProperty('padding-bottom');
}

function isMobileTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function syncMoveInputMode() {
  const usePopupOnly = state.showOnScreenKeyboard && isMobileTouchDevice();
  elements.moveInput.readOnly = usePopupOnly;
  if (usePopupOnly) {
    elements.moveInput.setAttribute('inputmode', 'none');
  } else {
    elements.moveInput.setAttribute('inputmode', 'text');
  }
}

function updateMainControlsVisibility() {
  const inPuzzle = state.sessionMode === 'puzzle';
  const inBlind = state.sessionMode === 'blind-puzzles';
  const hideMain = inPuzzle || inBlind;
  const beforeGameStart = state.sessionMode === 'game' && !state.gameStarted;
  const inBlindGame = inBlind && isBlindPlayableGameMode();
  const hideBelowSlider = state.hideBelowSliderOnStart && state.sessionMode === 'game';
  const allowMoveInput = !state.game.isGameOver()
    && !state.engineThinking
    && !isReviewLocked()
    && (state.sessionMode === 'puzzle'
      || state.sessionMode === 'game'
      || inBlindGame)
    && (state.sessionMode !== 'game' || state.gameStarted)
    && (state.sessionMode === 'puzzle' || isUserTurn());
  elements.displayModeRow.hidden = hideMain;
  elements.displayModeRow.style.display = hideMain ? 'none' : '';
  const hideMoveInputs = beforeGameStart
    || hideBelowSlider
    || (state.sessionMode === 'puzzle' && !allowMoveInput);
  elements.moveInputs.hidden = hideMoveInputs;
  elements.movesPanel.hidden = (inBlind && !inBlindGame) || hideBelowSlider;
  elements.lastMoveRow.hidden = (inBlind && !inBlindGame) || hideBelowSlider;
  elements.statusRow.hidden = hideBelowSlider;
}

function revealBelowSliderControls() {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    return;
  }
  if (!state.hideBelowSliderOnStart) {
    return;
  }
  state.hideBelowSliderOnStart = false;
  updateMainControlsVisibility();
}

function blurAnyFocusedInput() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) {
    return;
  }
  const tag = active.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || active.isContentEditable) {
    active.blur();
  }
}

function updateMoveInputPlaceholder() {
  elements.moveInput.placeholder = state.moveLanguage === 'pl'
    ? 'Wpisz ruch (np. Sf3 albo e2e4)'
    : 'Enter move (e.g. Nf3 or e2e4)';
}

function pieceTokenForInput(role) {
  if (state.moveLanguage === 'pl') {
    return ({ k: 'K', q: 'H', r: 'W', b: 'G', n: 'S' })[role] ?? '';
  }
  return ({ k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N' })[role] ?? '';
}

function syncMoveAssistPieces() {
  for (const btn of assistPieceButtons) {
    const token = pieceTokenForInput(btn.dataset.assistPiece ?? '');
    btn.dataset.assistToken = token;
    btn.title = token ? `Insert ${token}` : '';
    btn.setAttribute('aria-label', token ? `Insert ${token}` : 'Insert');
  }
}

function appendMoveInputToken(token) {
  if (!token) {
    return;
  }
  elements.moveInput.value = `${elements.moveInput.value}${token}`;
  elements.moveInput.focus();
}

function openConfigModal() {
  elements.configModal.hidden = false;
}

function closeConfigModal() {
  elements.configModal.hidden = true;
}

function ensureVoiceRecognition() {
  if (voiceState.recognition) {
    return voiceState.recognition;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.maxAlternatives = 3;
  recognition.interimResults = false;

  recognition.onstart = () => {
    state.voiceListening = true;
    elements.voiceStatus.textContent = 'Listening...';
    updateVoiceUi();
  };

  recognition.onresult = (event) => {
    if (!canListenToVoiceNow()) {
      return;
    }
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    elements.voiceStatus.textContent = `Heard: ${transcript}`;
    if (handleBlindPuzzleVoice(transcript)) {
      return;
    }
    if (state.sessionMode === 'blind-puzzles' && !isBlindPlayableGameMode()) {
      elements.statusText.textContent = 'Select a blind puzzle mode first.';
      return;
    }
    elements.moveInput.value = transcript;
    const ok = applyPlayerMove(transcript);
    if (!ok) {
      elements.statusText.textContent = `Could not parse voice move: ${transcript}`;
      return;
    }
    if (state.voiceOneShot) {
      state.voiceOneShot = false;
      setVoiceMode(false);
    }
  };

  recognition.onerror = () => {
    state.voiceListening = false;
    if (state.voiceMode) {
      elements.voiceStatus.textContent = 'Voice recognition error. Retrying...';
    } else {
      elements.voiceStatus.textContent = 'Voice recognition stopped.';
    }
  };

  recognition.onend = () => {
    state.voiceListening = false;
    updateVoiceUi();
    if (state.voiceMode) {
      window.setTimeout(startVoiceListening, 180);
    }
  };

  voiceState.recognition = recognition;
  return recognition;
}

function startVoiceListening() {
  if (!state.voiceMode || voiceState.startLock || !canListenToVoiceNow()) {
    updateVoiceUi();
    return;
  }
  const recognition = ensureVoiceRecognition();
  if (!recognition) {
    state.voiceMode = false;
    elements.voiceStatus.textContent = 'Voice input is not supported in this browser.';
    updateVoiceUi();
    return;
  }

  recognition.lang = state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US';
  voiceState.startLock = true;
  try {
    recognition.start();
  } catch (_error) {
    // `start` can throw if called while already active.
  } finally {
    window.setTimeout(() => {
      voiceState.startLock = false;
    }, 220);
  }
}

function stopVoiceListening() {
  const recognition = voiceState.recognition;
  if (!recognition) {
    state.voiceListening = false;
    return;
  }
  try {
    recognition.stop();
  } catch (_error) {
    // ignore
  }
  state.voiceListening = false;
}

function setVoiceMode(enabled) {
  state.voiceMode = enabled;
  if (!enabled) {
    state.voiceOneShot = false;
  }
  if (enabled) {
    refreshVoiceListeningState();
  } else {
    stopVoiceListening();
  }
  updateVoiceUi();
}

function isWaitingForComputerMove() {
  if (state.sessionMode !== 'game' && !isBlindPlayableGameMode()) {
    return false;
  }
  if (state.game.isGameOver()) {
    return false;
  }
  return state.engineThinking || !isUserTurn();
}

function canListenToVoiceNow() {
  return state.voiceMode && !isWaitingForComputerMove() && !state.speaking;
}

function refreshVoiceListeningState() {
  if (!state.voiceMode) {
    stopVoiceListening();
    return;
  }
  if (canListenToVoiceNow()) {
    if (!state.voiceListening) {
      startVoiceListening();
    }
    return;
  }
  if (state.voiceListening) {
    stopVoiceListening();
  }
  updateVoiceUi();
}

function afterAnyMove() {
  clearBlindClickSelection();
  maybeMarkBlindExerciseSolved();
  if (state.sessionMode !== 'puzzle') {
    state.reviewPly = null;
  }
  updateAll();
}

function updateAll() {
  syncViewModeClasses();
  updateBoard();
  updateMovesList();
  updateLastMove();
  updatePuzzlePanel();
  updateBlindPanel();
  updateMainControlsVisibility();
  updateReviewControls();
  applyRuntimeLayoutOverrides();
  updateStatus();
  refreshVoiceListeningState();
}

function resetGame() {
  resetBlindPuzzleSession();
  clearBlindClickSelection();
  if (state.prePuzzleDisplayMode !== null) {
    state.displayMode = state.prePuzzleDisplayMode;
    state.prePuzzleDisplayMode = null;
  }
  state.sessionMode = 'game';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.puzzleViewIndex = 0;
  state.reviewPly = null;
  state.userColor = state.boardOrientation;
  state.game = new Chess();
  state.gameStarted = true;
  state.hideBelowSliderOnStart = false;
  updateAll();
  if (state.userColor === 'black') {
    window.setTimeout(playEngineMoveIfNeeded, 250);
  }
}

elements.moveForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    elements.moveInput.value = '';
    return;
  }
  const ok = applyPlayerMove(elements.moveInput.value);
  if (!ok && state.sessionMode !== 'puzzle') {
    elements.statusText.textContent = 'Invalid move for current position.';
  }
  elements.moveInput.value = '';
  elements.moveInput.focus();
});

elements.clearMoveInputBtn.addEventListener('click', () => {
  elements.moveInput.value = '';
  elements.moveInput.focus();
});

elements.moveAssist.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const button = target.closest('button');
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const token = button.dataset.assistToken ?? '';
  if (token === 'O-O' || token === 'O-O-O') {
    elements.moveInput.value = token;
    elements.moveInput.focus();
    return;
  }
  appendMoveInputToken(token);
});

elements.moveAssist.addEventListener('pointerdown', (event) => {
  event.preventDefault();
});

elements.moveInput.addEventListener('focus', () => {
  updateMoveAssistVisibility();
});

elements.moveInput.addEventListener('blur', () => {
  window.setTimeout(updateMoveAssistVisibility, 0);
});

elements.displayMode.addEventListener('change', () => {
  state.displayMode = elements.displayMode.value;
  clearBlindClickSelection();
  updateBoard();
});

elements.moveLanguage.addEventListener('change', () => {
  state.moveLanguage = elements.moveLanguage.value;
  updateMoveInputPlaceholder();
  syncMoveAssistPieces();
  writeSettings();
  updateMovesList();
  updateLastMove();
  updatePuzzlePanel();
  if (state.voiceMode) {
    stopVoiceListening();
    window.setTimeout(startVoiceListening, 120);
  }
});

elements.figurineNotation.addEventListener('change', () => {
  writeSettings();
  updateMovesList();
  updateLastMove();
  updatePuzzlePanel();
});

elements.showBlindDests.addEventListener('change', () => {
  state.showBlindDests = elements.showBlindDests.checked;
  syncBlindClickDots();
  writeSettings();
});

elements.darkMode.addEventListener('change', () => {
  state.darkMode = elements.darkMode.checked;
  applyTheme();
  writeSettings();
});

elements.showOnScreenKeyboard.addEventListener('change', () => {
  state.showOnScreenKeyboard = elements.showOnScreenKeyboard.checked;
  syncMoveInputMode();
  updateMoveAssistVisibility();
  writeSettings();
});

elements.speakCheck.addEventListener('change', () => {
  state.speakCheck = elements.speakCheck.checked;
  writeSettings();
});

elements.voiceSticky.addEventListener('change', () => {
  state.voiceSticky = elements.voiceSticky.checked;
  writeSettings();
});

elements.puzzleAutoOpponent.addEventListener('change', () => {
  state.puzzleAutoOpponent = elements.puzzleAutoOpponent.checked;
  writeSettings();
});

elements.puzzleDifficulty.addEventListener('change', () => {
  state.puzzleDifficulty = elements.puzzleDifficulty.value;
  writeSettings();
});

elements.blindQuestionCount.addEventListener('change', () => {
  const value = Number(elements.blindQuestionCount.value);
  const bounded = Number.isFinite(value) ? Math.max(1, Math.min(200, Math.floor(value))) : 25;
  state.blindQuestionCount = bounded;
  elements.blindQuestionCount.value = String(bounded);
  writeSettings();
});

elements.optionEngineStrength.addEventListener('input', () => {
  const value = Number(elements.optionEngineStrength.value);
  const bounded = Number.isFinite(value) ? Math.max(400, Math.min(2850, Math.round(value / 50) * 50)) : 1700;
  state.stockfishElo = bounded;
  syncEngineControlUi();
  writeSettings();
});

elements.speakComputer.addEventListener('change', () => {
  if (!elements.speakComputer.checked && typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
    state.speaking = false;
    refreshVoiceListeningState();
  }
  writeSettings();
});

elements.puzzleBacktrack.addEventListener('change', () => {
  const value = Number(elements.puzzleBacktrack.value);
  elements.puzzleBacktrack.value = Number.isFinite(value)
    ? String(Math.max(0, Math.min(20, Math.floor(value))))
    : '2';
});

function syncMovesVisibilityUi() {
  elements.movesWrap.style.display = state.movesVisible ? 'block' : 'none';
  elements.toggleMovesBtn.textContent = state.movesVisible ? 'Hide Moves' : 'Show Moves';
}

elements.toggleMovesBtn.addEventListener('click', () => {
  state.movesVisible = !state.movesVisible;
  syncMovesVisibilityUi();
});

elements.revealBtn.addEventListener('click', () => {
  state.revealPosition = !state.revealPosition;
  clearBlindClickSelection();
  updateBoard();
});

elements.rotateBoardBtn.addEventListener('click', () => {
  state.boardOrientation = state.boardOrientation === 'white' ? 'black' : 'white';
  clearBlindClickSelection();
  updateBoard();
});

elements.newGameBtn.addEventListener('click', resetGame);
elements.loadPuzzleBtn.addEventListener('click', () => {
  revealBelowSliderControls();
  loadLichessPuzzle();
});
elements.blindPuzzlesBtn.addEventListener('click', () => {
  revealBelowSliderControls();
  startBlindPuzzlesMode();
});
elements.blindGameBtn.addEventListener('click', () => {
  startGameExercise();
});
elements.blindPositionBtn.addEventListener('click', () => {
  startPositionExercise();
});
elements.blindSquareColorsBtn.addEventListener('click', () => {
  startSquareColors();
});
elements.blindBishopBtn.addEventListener('click', () => {
  startBishopMovements();
});
elements.blindKnightBtn.addEventListener('click', () => {
  startKnightMovements();
});
elements.blindCheckBtn.addEventListener('click', () => {
  startCheckPuzzle();
});
elements.blindKRookBtn.addEventListener('click', () => {
  startKRookMatting();
});
elements.blindKQueenBtn.addEventListener('click', () => {
  startKQueenMatting();
});
elements.showSolutionBtn.addEventListener('click', showPuzzleSolution);
elements.reviewPrevBtn.addEventListener('click', reviewStepBack);
elements.reviewNextBtn.addEventListener('click', reviewStepForward);
elements.movesBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const cell = target.closest('[data-ply]');
  if (!(cell instanceof HTMLElement)) {
    return;
  }
  const raw = cell.dataset.ply;
  const ply = Number(raw);
  if (!Number.isInteger(ply)) {
    return;
  }
  jumpToMovePly(ply);
});

elements.board.addEventListener('click', onBlindBoardClick);

elements.openConfigBtn.addEventListener('click', openConfigModal);
elements.closeConfigBtn.addEventListener('click', closeConfigModal);
elements.configModal.addEventListener('click', (event) => {
  if (event.target === elements.configModal) {
    closeConfigModal();
  }
});

window.addEventListener('beforeunload', () => {
  state.voiceMode = false;
  stopVoiceListening();
  stopStockfishWorker();
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const isRefreshShortcut = key === 'f5'
    || (key === 'r' && (event.ctrlKey || event.metaKey));
  if (isRefreshShortcut) {
    event.preventDefault();
    return;
  }
  if (event.key === 'Escape' && !elements.configModal.hidden) {
    closeConfigModal();
  }
});

window.addEventListener('resize', () => {
  applyRuntimeLayoutOverrides();
});

window.addEventListener('pointerdown', () => {
  revealBelowSliderControls();
}, { once: true });

window.addEventListener('pointerdown', (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }
  if (target === elements.moveInput || elements.moveAssist.contains(target)) {
    return;
  }
  elements.moveInput.blur();
  updateMoveAssistVisibility();
});

elements.voiceOnceBtn.addEventListener('click', () => {
  state.voiceOneShot = true;
  setVoiceMode(true);
});

elements.voiceStickyBtn.addEventListener('click', () => {
  const stickyOn = state.voiceMode && !state.voiceOneShot;
  if (stickyOn) {
    setVoiceMode(false);
    return;
  }
  state.voiceOneShot = false;
  setVoiceMode(true);
});

ensureStockfishWorker();
state.positionExercises = buildPositionExercises();
state.positionSolved = readSolvedPositions();
state.gameExercises = buildGameExercises();
state.gameSolved = readSolvedGames();
loadSettingsIntoState();
syncEngineControlUi();
applySettingsToUi();
updateMoveInputPlaceholder();
syncMoveAssistPieces();
updateVoiceUi();
syncMovesVisibilityUi();
syncMoveInputMode();
updateAll();
window.setTimeout(blurAnyFocusedInput, 0);
