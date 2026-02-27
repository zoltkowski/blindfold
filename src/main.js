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
          <button id="followGameBtn" type="button">Follow Game</button>
          <button id="loadPuzzleBtn" type="button">Lichess Puzzle</button>
          <button id="blindPuzzlesBtn" type="button">Other Puzzles</button>
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
            <option value="no-pieces">No Pieces</option>
            <option value="no-board">No Board</option>
            <option value="white-only">Show White, Hide Black</option>
            <option value="black-only">Show Black, Hide White</option>
            <option value="white-pieces-black-disks">White Pieces, Black Disks</option>
            <option value="black-pieces-white-disks">Black Pieces, White Disks</option>
          </select>
        </label>
        <label id="boardRevealRow">
          <span class="engine-meta"><span id="boardRevealValue">Board reveal: after 1 move</span></span>
          <input id="boardReveal" type="range" min="1" max="33" step="1" value="1" />
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
              <input id="speakCheck" type="checkbox" />
              Speak Checks
            </label>
            <label class="checkbox-row">
              <input id="voiceOnOtherPuzzles" type="checkbox" />
              Voice on for puzzles with timer
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
              <input id="showCoordinates" type="checkbox" />
              Show Square Coordinates
            </label>
            <label class="checkbox-row">
              <input id="showLastMove" type="checkbox" checked />
              Show Last Move
            </label>
            <label class="checkbox-row">
              <input id="showMoveMarks" type="checkbox" checked />
              Show Move Marks
            </label>
            <label class="checkbox-row">
              <input id="puzzleAutoOpponent" type="checkbox" checked />
              Auto-play opponent moves in lichess puzzles
            </label>
            <label class="checkbox-row">
              <input id="puzzleFixedOrientation" type="checkbox" />
              Fixed board orientation for lichess puzzles
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
              TTS Voice
              <select id="ttsVoice">
                <option value="">System default</option>
              </select>
            </label>
            <label>
              <span class="engine-meta"><span>TTS Speed</span>: <span id="ttsRateValue">1.0x</span></span>
              <input id="ttsRate" type="range" min="0.1" max="1.5" step="0.1" value="1.0" />
            </label>
            <label>
              <span class="engine-meta"><span>TTS Move Pause</span>: <span id="ttsMovePauseValue">250 ms</span></span>
              <input id="ttsMovePause" type="range" min="0" max="5000" step="250" value="250" />
            </label>
            <button id="ttsSampleBtn" type="button">Play TTS Sample</button>
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
              <span class="engine-meta"><span>Blind Puzzle Questions</span>: <span id="blindQuestionCountValue">25</span></span>
              <input id="blindQuestionCount" type="range" min="1" max="30" step="1" value="25" />
            </label>
            <label>
              <span class="engine-meta"><span>Puzzle Backtrack (plies)</span>: <span id="puzzleBacktrackValue">2</span></span>
              <input id="puzzleBacktrack" type="range" min="1" max="32" step="1" value="2" />
            </label>
            <label>
              <span class="engine-meta"><span>Recall Pieces</span>: <span id="positionRecallPiecesValue">8</span></span>
              <input id="positionRecallPieces" type="range" min="2" max="32" step="1" value="8" />
            </label>
            <label>
              <span class="engine-meta"><span>Recall Show (s)</span>: <span id="positionRecallShowSecValue">5</span></span>
              <input id="positionRecallShowSec" type="range" min="1" max="20" step="1" value="5" />
            </label>
            <label>
              <span class="engine-meta"><span>Recall Hide (s)</span>: <span id="positionRecallHideSecValue">3</span></span>
              <input id="positionRecallHideSec" type="range" min="1" max="20" step="1" value="3" />
            </label>
            <label id="mattingTypesRow" class="toggle-option-row">
              <span>Matting Types</span>
              <div class="toggle-option-buttons" role="group" aria-label="Matting types">
                <button id="mattingTypeKQBtn" type="button" data-matting-type="kq" aria-pressed="true" title="King + Queen">♔+♕</button>
                <button id="mattingTypeKRBtn" type="button" data-matting-type="kr" aria-pressed="false" title="King + Rook">♔+♖</button>
                <button id="mattingTypeKBBBtn" type="button" data-matting-type="kbb" aria-pressed="false" title="King + Two Bishops">♔+♗+♗</button>
                <button id="mattingTypeKBNBtn" type="button" data-matting-type="kbn" aria-pressed="false" title="King + Bishop + Knight">♔+♗+♘</button>
              </div>
            </label>
            <label id="movementModesRow" class="toggle-option-row">
              <span>Movement Modes</span>
              <div class="toggle-option-buttons" role="group" aria-label="Movement modes">
                <button id="movementModeEdgeBtn" type="button" data-movement-mode="edge" aria-pressed="true">Edge Squares</button>
                <button id="movementModeRouteBtn" type="button" data-movement-mode="route" aria-pressed="false">Route</button>
              </div>
            </label>
            <label id="movementPiecesRow" class="toggle-option-row">
              <span>Movement Pieces</span>
              <div class="toggle-option-buttons" role="group" aria-label="Movement pieces">
                <button id="movementPieceBishopBtn" type="button" data-movement-piece="bishop" aria-pressed="true">Bishop</button>
                <button id="movementPieceKnightBtn" type="button" data-movement-piece="knight" aria-pressed="true">Knight</button>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="puzzle-panel" id="puzzlePanel" hidden>
        <div><span id="puzzleContext">-</span></div>
      </div>

      <div class="puzzle-panel follow-panel" id="followPanel" hidden>
        <div class="follow-controls">
          <label id="followGamePickerRow" class="follow-field">
            Game
            <select id="followGameSelect"></select>
          </label>
          <div id="followGamePickerActions" class="follow-actions">
            <button id="followLoadBtn" type="button">Load</button>
            <button id="followRandomBtn" type="button">Random</button>
            <button id="followUploadBtn" type="button">Upload PGN</button>
            <input id="followUploadInput" type="file" accept=".pgn,text/plain" hidden />
          </div>
          <div class="follow-actions">
            <button id="followModeQuizBtn" type="button" data-follow-mode="quiz">Quiz</button>
            <select id="followQuizAutoColor" title="Computer plays this color in quiz">
              <option value="none">Quiz: both colors</option>
              <option value="white">Quiz: white auto</option>
              <option value="black">Quiz: black auto</option>
            </select>
            <button id="followRestartBtn" type="button">Restart</button>
          </div>
          <label id="followQuizStartRow" class="follow-field" hidden>
            <span class="engine-meta"><span>Quiz From Move</span>: <span id="followQuizStartValue">1</span></span>
            <input id="followQuizStart" type="range" min="1" max="25" step="1" value="1" />
          </label>
        </div>
        <div id="followGameTitle" class="follow-title">-</div>
        <div id="followGameMeta" class="follow-meta">-</div>
        <div id="followGameMoves" class="follow-moves">-</div>
        <button id="followNextBtn" type="button">Next</button>
      </div>

      <div class="puzzle-panel blind-panel" id="blindPanel" hidden>
        <div class="blind-buttons">
          <button id="blindSquareColorsBtn" type="button">Square Colors</button>
          <button id="blindSameDiagonalBtn" type="button">Same Diagonal</button>
          <button id="blindMovementsBtn" type="button">Movements</button>
          <button id="blindCheckBtn" type="button">Check</button>
          <button id="blindMatingBtn" type="button">Mating</button>
          <button id="blindPositionRecallBtn" type="button">Position Recall</button>
          <button id="blindPositionBtn" type="button">Position</button>
          <button id="blindGameBtn" type="button">Game</button>
        </div>
        <div id="blindMain" class="blind-main">
          <div class="blind-stats">
            <div><strong>Progress:</strong> <span id="blindProgress">-</span></div>
            <div><strong id="blindCorrectLabel">Correct:</strong> <span id="blindCorrect">0</span></div>
            <div><strong>Time:</strong> <span id="blindTimer">00:00</span></div>
          </div>
          <div id="blindPrompt" class="blind-prompt">-</div>
        </div>
        <div id="blindInputFeedback" class="blind-input-feedback" hidden>
          <div><strong>Entered:</strong> <span id="blindEntered">-</span></div>
          <div><strong>Missing:</strong> <span id="blindMissing">-</span></div>
        </div>
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
          <button id="voiceStickyBtn" type="button">Voice: Off</button>
          <button id="voiceOnceBtn" type="button">Listen Once</button>
        </div>
        <div id="voiceStatus" class="muted"></div>
      </div>

      <div id="statusRow" class="status-row">
        <span id="statusText">White to move</span>
      </div>
      <div id="squareColorControls" class="square-color-controls" hidden>
        <button id="squareColorWhiteBtn" type="button">White</button>
        <button id="squareColorBlackBtn" type="button">Black</button>
        <button id="sameDiagonalYesBtn" type="button" hidden>Yes</button>
        <button id="sameDiagonalNoBtn" type="button" hidden>No</button>
        <button id="blindStopBtn" type="button" hidden>Stop</button>
      </div>
      <div id="lastMoveRow" class="last-move-row">
        <button id="gameDrillPauseBtn" type="button" hidden>Pause</button>
        <span id="lastMoveText" class="last-move-text"></span>
      </div>

      <div id="movesPanel" class="moves-panel">
        <button id="toggleMovesBtn" type="button" aria-label="Show moves" title="Show moves">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
          </svg>
        </button>
        <a id="openPuzzleLinkBtn" href="#" target="_blank" rel="noopener noreferrer" hidden aria-label="Open puzzle on Lichess" title="Open puzzle on Lichess">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M10.457 6.161a.237.237 0 0 0-.296.165c-.8 2.785 2.819 5.579 5.214 7.428.653.504 1.216.939 1.591 1.292 1.745 1.642 2.564 2.851 2.733 3.178a.24.24 0 0 0 .275.122c.047-.013 4.726-1.3 3.934-4.574a.257.257 0 0 0-.023-.06L18.204 3.407 18.93.295a.24.24 0 0 0-.262-.293c-1.7.201-3.115.435-4.5 1.425-4.844-.323-8.718.9-11.213 3.539C.334 7.737-.246 11.515.085 14.128c.763 5.655 5.191 8.631 9.081 9.532.993.229 1.974.34 2.923.34 3.344 0 6.297-1.381 7.946-3.85a.24.24 0 0 0-.372-.3c-3.411 3.527-9.002 4.134-13.296 1.444-4.485-2.81-6.202-8.41-3.91-12.749C4.741 4.221 8.801 2.362 13.888 3.31c.056.01.115 0 .165-.029l.335-.197c.926-.546 1.961-1.157 2.873-1.279l-.694 1.993a.243.243 0 0 0 .02.202l6.082 10.192c-.193 2.028-1.706 2.506-2.226 2.611-.287-.645-.814-1.364-2.306-2.803-.422-.407-1.21-.941-2.124-1.56-2.364-1.601-5.937-4.02-5.391-5.984a.239.239 0 0 0-.165-.295z"></path>
          </svg>
        </a>
        <button id="showSolutionBtn" type="button" hidden disabled aria-label="Show solution" title="Show solution">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <div id="reviewNav" class="review-nav">
          <button id="reviewPrevBtn" type="button" aria-label="Previous move" title="Previous move">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M15 6 L9 12 L15 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button id="reviewNextBtn" type="button" aria-label="Next move" title="Next move">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M9 6 L15 12 L9 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
        <div id="movesWrap" class="moves-wrap">
          <div id="movesBody" class="moves-inline"></div>
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
  boardRevealRow: document.getElementById('boardRevealRow'),
  boardReveal: document.getElementById('boardReveal'),
  boardRevealValue: document.getElementById('boardRevealValue'),
  moveLanguage: document.getElementById('moveLanguage'),
  optionEngineStrength: document.getElementById('optionEngineStrength'),
  optionStrengthValue: document.getElementById('optionStrengthValue'),
  speakComputer: document.getElementById('speakComputer'),
  speakCheck: document.getElementById('speakCheck'),
  voiceOnOtherPuzzles: document.getElementById('voiceOnOtherPuzzles'),
  figurineNotation: document.getElementById('figurineNotation'),
  showBlindDests: document.getElementById('showBlindDests'),
  showCoordinates: document.getElementById('showCoordinates'),
  showLastMove: document.getElementById('showLastMove'),
  showMoveMarks: document.getElementById('showMoveMarks'),
  darkMode: document.getElementById('darkMode'),
  showOnScreenKeyboard: document.getElementById('showOnScreenKeyboard'),
  ttsVoice: document.getElementById('ttsVoice'),
  ttsRate: document.getElementById('ttsRate'),
  ttsRateValue: document.getElementById('ttsRateValue'),
  ttsMovePause: document.getElementById('ttsMovePause'),
  ttsMovePauseValue: document.getElementById('ttsMovePauseValue'),
  ttsSampleBtn: document.getElementById('ttsSampleBtn'),
  puzzlePanel: document.getElementById('puzzlePanel'),
  puzzleBacktrack: document.getElementById('puzzleBacktrack'),
  puzzleBacktrackValue: document.getElementById('puzzleBacktrackValue'),
  positionRecallPieces: document.getElementById('positionRecallPieces'),
  positionRecallPiecesValue: document.getElementById('positionRecallPiecesValue'),
  positionRecallShowSec: document.getElementById('positionRecallShowSec'),
  positionRecallShowSecValue: document.getElementById('positionRecallShowSecValue'),
  positionRecallHideSec: document.getElementById('positionRecallHideSec'),
  positionRecallHideSecValue: document.getElementById('positionRecallHideSecValue'),
  mattingTypeKQBtn: document.getElementById('mattingTypeKQBtn'),
  mattingTypeKRBtn: document.getElementById('mattingTypeKRBtn'),
  mattingTypeKBBBtn: document.getElementById('mattingTypeKBBBtn'),
  mattingTypeKBNBtn: document.getElementById('mattingTypeKBNBtn'),
  movementModeEdgeBtn: document.getElementById('movementModeEdgeBtn'),
  movementModeRouteBtn: document.getElementById('movementModeRouteBtn'),
  movementPieceBishopBtn: document.getElementById('movementPieceBishopBtn'),
  movementPieceKnightBtn: document.getElementById('movementPieceKnightBtn'),
  blindQuestionCount: document.getElementById('blindQuestionCount'),
  blindQuestionCountValue: document.getElementById('blindQuestionCountValue'),
  puzzleAutoOpponent: document.getElementById('puzzleAutoOpponent'),
  puzzleFixedOrientation: document.getElementById('puzzleFixedOrientation'),
  puzzleDifficulty: document.getElementById('puzzleDifficulty'),
  followGameBtn: document.getElementById('followGameBtn'),
  followPanel: document.getElementById('followPanel'),
  followGamePickerRow: document.getElementById('followGamePickerRow'),
  followGamePickerActions: document.getElementById('followGamePickerActions'),
  followGameSelect: document.getElementById('followGameSelect'),
  followLoadBtn: document.getElementById('followLoadBtn'),
  followRandomBtn: document.getElementById('followRandomBtn'),
  followUploadBtn: document.getElementById('followUploadBtn'),
  followUploadInput: document.getElementById('followUploadInput'),
  followModeQuizBtn: document.getElementById('followModeQuizBtn'),
  followQuizAutoColor: document.getElementById('followQuizAutoColor'),
  followQuizStartRow: document.getElementById('followQuizStartRow'),
  followQuizStart: document.getElementById('followQuizStart'),
  followQuizStartValue: document.getElementById('followQuizStartValue'),
  followRestartBtn: document.getElementById('followRestartBtn'),
  followGameTitle: document.getElementById('followGameTitle'),
  followGameMeta: document.getElementById('followGameMeta'),
  followGameMoves: document.getElementById('followGameMoves'),
  followNextBtn: document.getElementById('followNextBtn'),
  loadPuzzleBtn: document.getElementById('loadPuzzleBtn'),
  blindPuzzlesBtn: document.getElementById('blindPuzzlesBtn'),
  openPuzzleLinkBtn: document.getElementById('openPuzzleLinkBtn'),
  showSolutionBtn: document.getElementById('showSolutionBtn'),
  puzzleContext: document.getElementById('puzzleContext'),
  blindPanel: document.getElementById('blindPanel'),
  blindGameBtn: document.getElementById('blindGameBtn'),
  blindPositionBtn: document.getElementById('blindPositionBtn'),
  blindSquareColorsBtn: document.getElementById('blindSquareColorsBtn'),
  blindSameDiagonalBtn: document.getElementById('blindSameDiagonalBtn'),
  blindMovementsBtn: document.getElementById('blindMovementsBtn'),
  blindCheckBtn: document.getElementById('blindCheckBtn'),
  blindMatingBtn: document.getElementById('blindMatingBtn'),
  blindPositionRecallBtn: document.getElementById('blindPositionRecallBtn'),
  blindPrompt: document.getElementById('blindPrompt'),
  blindMain: document.getElementById('blindMain'),
  blindInputFeedback: document.getElementById('blindInputFeedback'),
  blindEntered: document.getElementById('blindEntered'),
  blindMissing: document.getElementById('blindMissing'),
  blindProgress: document.getElementById('blindProgress'),
  blindCorrectLabel: document.getElementById('blindCorrectLabel'),
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
  squareColorControls: document.getElementById('squareColorControls'),
  squareColorWhiteBtn: document.getElementById('squareColorWhiteBtn'),
  squareColorBlackBtn: document.getElementById('squareColorBlackBtn'),
  sameDiagonalYesBtn: document.getElementById('sameDiagonalYesBtn'),
  sameDiagonalNoBtn: document.getElementById('sameDiagonalNoBtn'),
  blindStopBtn: document.getElementById('blindStopBtn'),
  lastMoveRow: document.getElementById('lastMoveRow'),
  gameDrillPauseBtn: document.getElementById('gameDrillPauseBtn'),
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
const mattingTypeButtons = Array.from(document.querySelectorAll('[data-matting-type]'));
const movementModeButtons = Array.from(document.querySelectorAll('[data-movement-mode]'));
const movementPieceButtons = Array.from(document.querySelectorAll('[data-movement-piece]'));
const followModeButtons = Array.from(document.querySelectorAll('[data-follow-mode]'));

const SETTINGS_KEY = 'blindfold_chess_settings_v1';
const POSITION_SOLVED_KEY = 'blind_position_solved_v1';
const GAME_SOLVED_KEY = 'blind_game_solved_v1';
const SQUARE_COLOR_STATS_KEY = 'blind_square_color_stats_v1';
const SQUARE_COLOR_RECORDS_KEY = 'blind_square_color_records_v1';
const STORAGE_DB_NAME = 'blindfold_chess_persist_v1';
const STORAGE_DB_VERSION = 1;
const STORAGE_STORE_NAME = 'app_kv';
const PERSISTED_KEYS = [SETTINGS_KEY, POSITION_SOLVED_KEY, GAME_SOLVED_KEY, SQUARE_COLOR_STATS_KEY, SQUARE_COLOR_RECORDS_KEY];
const BOARD_REVEAL_MIN = 1;
const BOARD_REVEAL_NEVER = 33;
const MATTING_TYPE_KEYS = ['kq', 'kr', 'kbb', 'kbn'];
const MOVEMENT_MODE_KEYS = ['edge', 'route'];
const MOVEMENT_PIECE_KEYS = ['bishop', 'knight'];
const BLIND_MATTING_MODES = new Set(['kq-matting', 'kr-matting', 'kbb-matting', 'kbn-matting']);

const persistentStorage = {
  initPromise: null,
  db: null,
  cache: new Map(),
  ready: false
};

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

const FOLLOW_GAME_PGN_RECORDS = [
  {
    title: 'Morphy vs Duke Karl / Count Isouard (Opera Game)',
    source: 'https://www.pgnmentor.com/players/Morphy.zip',
    pgn: `[Event "Paris it"]
[Site "Paris"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Duke Karl Count Isouard"]
[Result "1-0"]

1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8+ 1-0`
  },
  {
    title: 'Morphy vs Anderssen (Paris 1858)',
    source: 'https://www.pgnmentor.com/players/Morphy.zip',
    pgn: `[Event "Paris m1"]
[Site "Paris"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Anderssen, Adolf"]
[Result "1-0"]

1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 Bg7 5.O-O d6 6.c3 Nc6 7.Qb3 Qe7 8.d4 a6 9.Nxg5 Qxg5 10.Bxf7+ Kd8 11.Bxf4 Qe7 12.Bxg8 Bg4 13.Nd2 Kd7 14.Bd5 Nd8 15.Bxb7 Nxb7 16.Qxb7 a5 17.Bxd6 Bxd4+ 18.cxd4 Qxd6 19.Rf7+ 1-0`
  },
  {
    title: 'Morphy vs Bird (London 1858)',
    source: 'https://www.pgnmentor.com/players/Morphy.zip',
    pgn: `[Event "London m5"]
[Site "London"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Bird, Henry Edward"]
[Result "1-0"]

1.e4 e5 2.f4 exf4 3.Nf3 g5 4.h4 g4 5.Ne5 Nf6 6.Bc4 d5 7.exd5 Bd6 8.d4 Nh5 9.Nc3 Bf5 10.Ne2 Bxe5 11.dxe5 f3 12.gxf3 gxf3 13.Bg5 f6 14.exf6 Qd6 15.Qd4 fxe2 16.Bxe2 Qg3+ 17.Kd2 O-O 18.Rag1 1-0`
  },
  {
    title: 'Saint-Amant vs Morphy (Paris 1858)',
    source: 'https://www.pgnmentor.com/players/Morphy.zip',
    pgn: `[Event "Paris it"]
[Site "Paris"]
[Date "1858.??.??"]
[White "De Saint Amant, Pierre Charles Four"]
[Black "Morphy, Paul"]
[Result "0-1"]

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.O-O O-O 11.h3 Nf4 12.Kh2 Nxd4 13.Nxd4 Qxd4 14.Qc2 Qd6 15.Kh1 Qh6 16.Qc3 Bf5 17.Kh2 Rad8 18.Rad1 Bxh3 19.gxh3 Rd3 20.Qxd3 Nxd3 21.Bxd3 Qd6+ 22.f4 Qxd3 0-1`
  },
  {
    title: 'Anderssen vs Kieseritzky (Immortal Game)',
    source: 'https://www.pgnmentor.com/players/Anderssen.zip',
    pgn: `[Event "London 'Immortal game'"]
[Site "London"]
[Date "1851.??.??"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "1-0"]

1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Bxg1 19.e5 Qxa1+ 20.Ke2 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7+ 1-0`
  },
  {
    title: 'Anderssen vs Dufresne (Evergreen Game)',
    source: 'https://www.pgnmentor.com/players/Anderssen.zip',
    pgn: `[Event "Berlin 'Evergreen'"]
[Site "Berlin"]
[Date "1852.??.??"]
[White "Anderssen, Adolf"]
[Black "Dufresne, Jean"]
[Result "1-0"]

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8 23.Bd7+ Kf8 24.Bxe7+ 1-0`
  },
  {
    title: 'Rubinstein vs Rotlewi (Lodz 1907)',
    source: 'https://www.pgnmentor.com/players/Rubinstein.zip',
    pgn: `[Event "Lodz"]
[Site "Lodz"]
[Date "1907.??.??"]
[White "Rubinstein, Akiba"]
[Black "Rotlewi, Georg A"]
[Result "1-0"]

1.d4 d5 2.c4 e6 3.Nc3 dxc4 4.e3 Nf6 5.Bxc4 c5 6.Nf3 Nc6 7.O-O a6 8.Qe2 cxd4 9.Rd1 Be7 10.exd4 O-O 11.Bf4 b5 12.d5 exd5 13.Bxd5 Nxd5 14.Nxd5 Bd7 15.Bc7 1-0`
  },
  {
    title: 'Steinitz vs von Bardeleben (Hastings 1895)',
    source: 'https://www.pgnmentor.com/players/Steinitz.zip',
    pgn: `[Event "Hastings"]
[Site "Hastings"]
[Date "1895.??.??"]
[White "Steinitz, William"]
[Black "Von Bardeleben, Curt"]
[Result "1-0"]

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Nc3 d5 8.exd5 Nxd5 9.O-O Be6 10.Bg5 Be7 11.Bxd5 Bxd5 12.Nxd5 Qxd5 13.Bxe7 Nxe7 14.Re1 f6 15.Qe2 Qd7 16.Rac1 c6 17.d5 cxd5 18.Nd4 Kf7 19.Ne6 Rhc8 20.Qg4 g6 21.Ng5+ Ke8 22.Rxe7+ Kf8 23.Rf7+ Kg8 24.Rg7+ Kh8 25.Rxh7+ 1-0`
  },
  {
    title: 'Larsen vs Spassky (Belgrade 1970)',
    source: 'https://www.pgnmentor.com/players/Spassky.zip',
    pgn: `[Event "Belgrade URS-World"]
[Site "Belgrade"]
[Date "1970.??.??"]
[White "Larsen, Bent"]
[Black "Spassky, Boris V"]
[Result "0-1"]

1.b3 e5 2.Bb2 Nc6 3.c4 Nf6 4.Nf3 e4 5.Nd4 Bc5 6.Nxc6 dxc6 7.e3 Bf5 8.Qc2 Qe7 9.Be2 O-O-O 10.f4 Ng4 11.g3 h5 12.h3 h4 13.hxg4 hxg3 14.Rg1 Rh1 15.Rxh1 g2 16.Rf1 Qh4+ 17.Kd1 gxf1=Q+ 0-1`
  },
  {
    title: 'Kasparov vs Anand (Dortmund 1992)',
    source: 'https://www.pgnmentor.com/players/Kasparov.zip',
    pgn: `[Event "Dortmund"]
[Site "Dortmund"]
[Date "1992.??.??"]
[White "Kasparov, Gary"]
[Black "Anand, Viswanathan"]
[Result "1-0"]

1.Nf3 d5 2.c4 c6 3.d4 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2 Nbd7 10.Ne5 Re8 11.Rd1 Qc7 12.Nxd7 Qxd7 13.f3 Nd5 14.Na2 Bf8 15.e4 Bg6 16.Qe1 f5 17.exd5 1-0`
  }
];

const state = {
  game: new Chess(),
  userColor: 'white',
  boardOrientation: 'white',
  displayMode: 'normal-pieces',
  moveLanguage: 'pl',
  stockfishElo: 1700,
  speakCheck: false,
  voiceOnOtherPuzzles: false,
  sessionMode: 'game',
  followGame: {
    games: [],
    current: null,
    shownPlies: 0,
    chunkStartPly: 0,
    selectedId: '',
    mode: 'browse',
    quizActive: false,
    quizStartMove: 1,
    quizAutoColor: 'none',
    quizFeedback: '',
    quizEvalToken: 0,
    quizEvaluating: false
  },
  puzzle: null,
  puzzleAutoPlaying: false,
  puzzleAutoOpponent: true,
  puzzleFixedOrientation: false,
  puzzleDifficulty: 'easiest',
  mattingTypes: {
    kq: true,
    kr: false,
    kbb: false,
    kbn: false
  },
  movementModes: {
    edge: true,
    route: false
  },
  movementPieces: {
    bishop: true,
    knight: true
  },
  positionRecallPieces: 8,
  positionRecallShowSec: 5,
  positionRecallHideSec: 3,
  blindQuestionCount: 25,
  puzzleBacktrack: 2,
  puzzleLastAttempt: null,
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
    questionStartedAt: 0,
    responseTimesMs: [],
    expectedSquares: new Set(),
    givenSquares: new Set(),
    roundUsedSquares: new Set(),
    attemptedEntries: [],
    movementVariant: 'edge',
    movementPiece: 'B',
    routeTask: null,
    positionRecallStage: 'idle',
    positionRecallShowTimerId: null,
    positionRecallHideTimerId: null,
    positionRecallTargetPieces: [],
    positionRecallPlacedPieces: new Map(),
    positionRecallOrder: [],
    positionRecallIndex: 0,
    positionIndex: null,
    gameIndex: null,
    gamePrefixMoves: [],
    gameDrillReplayTimerId: null,
    gameDrillReplayPaused: false,
    staticPrompt: ''
  },
  positionExercises: [],
  positionSolved: new Set(),
  gameExercises: [],
  gameSolved: new Set(),
  squareColorStats: {},
  squareColorRecords: {
    bestTotalMsByCount: {},
    bestAvgMsGte20: null
  },
  prePuzzleDisplayMode: null,
  puzzleViewIndex: 0,
  puzzleRevealPrevView: null,
  reviewPly: null,
  revealPosition: false,
  movesVisible: false,
  showBlindDests: true,
  showCoordinates: false,
  showLastMove: true,
  showMoveMarks: true,
  boardRevealEvery: BOARD_REVEAL_MIN,
  darkMode: false,
  showOnScreenKeyboard: false,
  ttsVoiceUri: '',
  ttsRate: 1,
  ttsMovePauseMs: 250,
  ttsSequenceToken: 0,
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

function readLocalJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function writeLocalJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // ignore storage errors
  }
}

function openPersistentDb() {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let settled = false;
    try {
      const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
          db.createObjectStore(STORAGE_STORE_NAME);
        }
      };
      request.onsuccess = () => {
        settled = true;
        resolve(request.result);
      };
      request.onerror = () => {
        settled = true;
        resolve(null);
      };
      request.onblocked = () => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      };
    } catch (_error) {
      resolve(null);
    }
  });
}

function idbGet(db, key) {
  if (!db) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORAGE_STORE_NAME, 'readonly');
      const store = tx.objectStore(STORAGE_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => resolve(null);
    } catch (_error) {
      resolve(null);
    }
  });
}

function idbSet(db, key, value) {
  if (!db) {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORAGE_STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORAGE_STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
      tx.onabort = () => resolve(false);
    } catch (_error) {
      resolve(false);
    }
  });
}

async function hydratePersistentStorage() {
  if (persistentStorage.initPromise) {
    return persistentStorage.initPromise;
  }
  persistentStorage.initPromise = (async () => {
    const db = await openPersistentDb();
    persistentStorage.db = db;
    for (const key of PERSISTED_KEYS) {
      let value = db ? await idbGet(db, key) : null;
      if (value == null) {
        const local = readLocalJson(key);
        if (local != null) {
          value = local;
          if (db) {
            await idbSet(db, key, local);
          }
        }
      }
      persistentStorage.cache.set(key, value ?? null);
    }
    persistentStorage.ready = true;
  })();
  return persistentStorage.initPromise;
}

function readPersistentValue(key) {
  if (persistentStorage.cache.has(key)) {
    return persistentStorage.cache.get(key);
  }
  return readLocalJson(key);
}

async function writePersistentValue(key, value) {
  persistentStorage.cache.set(key, value);
  writeLocalJson(key, value);
  try {
    if (!persistentStorage.ready) {
      await hydratePersistentStorage();
    }
    if (persistentStorage.db) {
      await idbSet(persistentStorage.db, key, value);
    }
  } catch (_error) {
    // ignore storage errors
  }
}

function readSettings() {
  const parsed = readPersistentValue(SETTINGS_KEY);
  return parsed && typeof parsed === 'object' ? parsed : null;
}

function readSolvedPositions() {
  const parsed = readPersistentValue(POSITION_SOLVED_KEY);
  if (!Array.isArray(parsed)) {
    return new Set();
  }
  return new Set(parsed.filter((v) => Number.isInteger(v)));
}

function writeSolvedPositions() {
  const payload = [...state.positionSolved.values()].sort((a, b) => a - b);
  void writePersistentValue(POSITION_SOLVED_KEY, payload);
}

function readSolvedGames() {
  const parsed = readPersistentValue(GAME_SOLVED_KEY);
  if (!Array.isArray(parsed)) {
    return new Set();
  }
  return new Set(parsed.filter((v) => Number.isInteger(v)));
}

function writeSolvedGames() {
  const payload = [...state.gameSolved.values()].sort((a, b) => a - b);
  void writePersistentValue(GAME_SOLVED_KEY, payload);
}

function isBoardSquare(square) {
  return /^[a-h][1-8]$/.test(String(square ?? '').toLowerCase());
}

function sanitizeSquareColorStats(raw) {
  if (!raw || typeof raw !== 'object') {
    return {};
  }
  const out = {};
  for (const [squareRaw, value] of Object.entries(raw)) {
    const square = String(squareRaw ?? '').toLowerCase();
    if (!isBoardSquare(square)) {
      continue;
    }
    const askedRaw = Number(value?.asked);
    const correctRaw = Number(value?.correct);
    const asked = Number.isFinite(askedRaw) ? Math.max(0, Math.floor(askedRaw)) : 0;
    const correct = Number.isFinite(correctRaw) ? Math.max(0, Math.floor(correctRaw)) : 0;
    if (asked <= 0) {
      continue;
    }
    out[square] = { asked, correct: Math.min(asked, correct) };
  }
  return out;
}

function readSquareColorStats() {
  const parsed = readPersistentValue(SQUARE_COLOR_STATS_KEY);
  return sanitizeSquareColorStats(parsed);
}

function writeSquareColorStats() {
  const payload = sanitizeSquareColorStats(state.squareColorStats);
  void writePersistentValue(SQUARE_COLOR_STATS_KEY, payload);
}

function sanitizeSquareColorRecords(raw) {
  const out = {
    bestTotalMsByCount: {},
    bestAvgMsGte20: null
  };
  if (!raw || typeof raw !== 'object') {
    return out;
  }
  const byCount = raw.bestTotalMsByCount;
  if (byCount && typeof byCount === 'object') {
    for (const [countRaw, valueRaw] of Object.entries(byCount)) {
      const count = Number(countRaw);
      const value = Number(valueRaw);
      if (!Number.isInteger(count) || count < 1 || count > 64) {
        continue;
      }
      if (!Number.isFinite(value) || value <= 0) {
        continue;
      }
      out.bestTotalMsByCount[String(count)] = Math.max(1, Math.floor(value));
    }
  }
  const bestAvg = Number(raw.bestAvgMsGte20);
  if (Number.isFinite(bestAvg) && bestAvg > 0) {
    out.bestAvgMsGte20 = Math.max(1, Math.floor(bestAvg));
  }
  return out;
}

function readSquareColorRecords() {
  const parsed = readPersistentValue(SQUARE_COLOR_RECORDS_KEY);
  return sanitizeSquareColorRecords(parsed);
}

function writeSquareColorRecords() {
  const payload = sanitizeSquareColorRecords(state.squareColorRecords);
  void writePersistentValue(SQUARE_COLOR_RECORDS_KEY, payload);
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

function parsePgnHeaderValue(pgnText, key) {
  const match = String(pgnText ?? '').match(new RegExp(`\\[${key}\\s+\"([^\"]*)\"\\]`, 'i'));
  return match ? match[1].trim() : '';
}

function stripPgnCommentsAndVariations(text) {
  let out = String(text ?? '');
  out = out.replace(/\{[^}]*\}/g, ' ');
  while (/\([^()]*\)/.test(out)) {
    out = out.replace(/\([^()]*\)/g, ' ');
  }
  return out.replace(/\s+/g, ' ').trim();
}

function parseFollowGameRecord(record, index, { maxFullMoves = 25 } = {}) {
  const source = String(record?.source ?? '').trim();
  const pgnText = String(record?.pgn ?? '').trim();
  if (!pgnText) {
    return null;
  }
  const event = parsePgnHeaderValue(pgnText, 'Event');
  const site = parsePgnHeaderValue(pgnText, 'Site');
  const date = parsePgnHeaderValue(pgnText, 'Date');
  const white = parsePgnHeaderValue(pgnText, 'White');
  const black = parsePgnHeaderValue(pgnText, 'Black');
  const result = parsePgnHeaderValue(pgnText, 'Result');
  const fallbackTitle = [white || 'White', black || 'Black'].join(' vs ');
  const title = String(record?.title ?? '').trim() || fallbackTitle;

  const moveText = stripPgnCommentsAndVariations(
    pgnText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('['))
      .join(' ')
  );
  if (!moveText) {
    return null;
  }

  const game = new Chess();
  const moveSans = [];
  const moveVerbose = [];
  const tokens = moveText.split(/\s+/).filter(Boolean);
  for (const tokenRaw of tokens) {
    const withoutMoveNo = tokenRaw.replace(/^\d+\.(?:\.\.)?/, '');
    const san = sanitizeGameSanToken(withoutMoveNo);
    if (!san) {
      continue;
    }
    let mv;
    try {
      mv = game.move(san);
    } catch (_error) {
      return null;
    }
    if (!mv) {
      return null;
    }
    moveSans.push(mv.san);
    moveVerbose.push({ from: mv.from, to: mv.to, promotion: mv.promotion, san: mv.san });
  }
  if (!moveSans.length) {
    return null;
  }
  const fullMoves = Math.ceil(moveSans.length / 2);
  if (Number.isFinite(Number(maxFullMoves)) && fullMoves > Number(maxFullMoves)) {
    return null;
  }

  return {
    id: String(record?.id ?? index),
    title,
    source,
    event,
    site,
    date,
    white,
    black,
    result,
    moveSans,
    moveVerbose
  };
}

function buildFollowGames() {
  return FOLLOW_GAME_PGN_RECORDS
    .map((record, i) => parseFollowGameRecord(record, i))
    .filter(Boolean);
}

function normalizeMattingTypes(raw) {
  const base = {
    kq: true,
    kr: false,
    kbb: false,
    kbn: false
  };
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const next = { ...base };
  for (const key of MATTING_TYPE_KEYS) {
    if (typeof raw[key] === 'boolean') {
      next[key] = raw[key];
    }
  }
  if (!Object.values(next).some(Boolean)) {
    next.kq = true;
  }
  return next;
}

function normalizeMovementModes(raw) {
  const base = {
    edge: true,
    route: false
  };
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const next = { ...base };
  for (const key of MOVEMENT_MODE_KEYS) {
    if (typeof raw[key] === 'boolean') {
      next[key] = raw[key];
    }
  }
  if (!Object.values(next).some(Boolean)) {
    next.edge = true;
  }
  return next;
}

function normalizeMovementPieces(raw) {
  const base = {
    bishop: true,
    knight: true
  };
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  const next = { ...base };
  for (const key of MOVEMENT_PIECE_KEYS) {
    if (typeof raw[key] === 'boolean') {
      next[key] = raw[key];
    }
  }
  if (!Object.values(next).some(Boolean)) {
    next.bishop = true;
  }
  return next;
}

function enabledMattingTypeKeys() {
  return MATTING_TYPE_KEYS.filter((key) => !!state.mattingTypes[key]);
}

function syncMattingTypeButtons() {
  for (const button of mattingTypeButtons) {
    const key = button.dataset.mattingType ?? '';
    const active = !!state.mattingTypes[key];
    button.classList.toggle('is-on', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

function enabledMovementModeKeys() {
  return MOVEMENT_MODE_KEYS.filter((key) => !!state.movementModes[key]);
}

function pickMovementModeForQuestion() {
  const enabled = enabledMovementModeKeys();
  if (!enabled.length) {
    return 'edge';
  }
  return enabled[Math.floor(Math.random() * enabled.length)] ?? 'edge';
}

function syncMovementModeButtons() {
  for (const button of movementModeButtons) {
    const key = button.dataset.movementMode ?? '';
    const active = !!state.movementModes[key];
    button.classList.toggle('is-on', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

function enabledMovementPieceKeys() {
  return MOVEMENT_PIECE_KEYS.filter((key) => !!state.movementPieces[key]);
}

function pickMovementPieceForQuestion() {
  const enabled = enabledMovementPieceKeys();
  if (!enabled.length) {
    return 'bishop';
  }
  return enabled[Math.floor(Math.random() * enabled.length)] ?? 'bishop';
}

function syncMovementPieceButtons() {
  for (const button of movementPieceButtons) {
    const key = button.dataset.movementPiece ?? '';
    const active = !!state.movementPieces[key];
    button.classList.toggle('is-on', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

function writeSettings() {
  const payload = {
    moveLanguage: state.moveLanguage,
    stockfishElo: state.stockfishElo,
    speakComputer: elements.speakComputer.checked,
    voiceSticky: state.voiceSticky,
    speakCheck: state.speakCheck,
    voiceOnOtherPuzzles: state.voiceOnOtherPuzzles,
    figurineNotation: elements.figurineNotation.checked,
    showBlindDests: state.showBlindDests,
    showCoordinates: state.showCoordinates,
    showLastMove: state.showLastMove,
    showMoveMarks: state.showMoveMarks,
    boardRevealEvery: state.boardRevealEvery,
    darkMode: state.darkMode,
    showOnScreenKeyboard: state.showOnScreenKeyboard,
    ttsVoiceUri: state.ttsVoiceUri,
    ttsRate: state.ttsRate,
    ttsMovePauseMs: state.ttsMovePauseMs,
    puzzleAutoOpponent: state.puzzleAutoOpponent,
    puzzleFixedOrientation: state.puzzleFixedOrientation,
    puzzleDifficulty: state.puzzleDifficulty,
    mattingTypes: normalizeMattingTypes(state.mattingTypes),
    movementModes: normalizeMovementModes(state.movementModes),
    movementPieces: normalizeMovementPieces(state.movementPieces),
    positionRecallPieces: state.positionRecallPieces,
    positionRecallShowSec: state.positionRecallShowSec,
    positionRecallHideSec: state.positionRecallHideSec,
    blindQuestionCount: state.blindQuestionCount,
    puzzleBacktrack: state.puzzleBacktrack
  };
  void writePersistentValue(SETTINGS_KEY, payload);
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
  if (typeof saved.voiceOnOtherPuzzles === 'boolean') {
    state.voiceOnOtherPuzzles = saved.voiceOnOtherPuzzles;
  }
  if (typeof saved.voiceSticky === 'boolean') {
    state.voiceSticky = saved.voiceSticky;
  }
  if (typeof saved.puzzleAutoOpponent === 'boolean') {
    state.puzzleAutoOpponent = saved.puzzleAutoOpponent;
  }
  if (typeof saved.puzzleFixedOrientation === 'boolean') {
    state.puzzleFixedOrientation = saved.puzzleFixedOrientation;
  }
  if (['easiest', 'easier', 'normal', 'harder', 'hardest'].includes(saved.puzzleDifficulty)) {
    state.puzzleDifficulty = saved.puzzleDifficulty;
  }
  if (saved.mattingTypes && typeof saved.mattingTypes === 'object') {
    state.mattingTypes = normalizeMattingTypes(saved.mattingTypes);
  }
  if (saved.movementModes && typeof saved.movementModes === 'object') {
    state.movementModes = normalizeMovementModes(saved.movementModes);
  }
  if (saved.movementPieces && typeof saved.movementPieces === 'object') {
    state.movementPieces = normalizeMovementPieces(saved.movementPieces);
  }
  if (Number.isFinite(Number(saved.positionRecallPieces))) {
    state.positionRecallPieces = Math.max(2, Math.min(32, Math.floor(Number(saved.positionRecallPieces))));
  }
  if (Number.isFinite(Number(saved.positionRecallShowSec))) {
    state.positionRecallShowSec = Math.max(1, Math.min(20, Math.floor(Number(saved.positionRecallShowSec))));
  }
  if (Number.isFinite(Number(saved.positionRecallHideSec))) {
    state.positionRecallHideSec = Math.max(1, Math.min(20, Math.floor(Number(saved.positionRecallHideSec))));
  }
  if (Number.isFinite(Number(saved.blindQuestionCount))) {
    state.blindQuestionCount = Math.max(1, Math.min(30, Math.floor(Number(saved.blindQuestionCount))));
  }
  if (Number.isFinite(Number(saved.puzzleBacktrack))) {
    state.puzzleBacktrack = Math.max(1, Math.min(32, Math.floor(Number(saved.puzzleBacktrack))));
  }
  if (typeof saved.showBlindDests === 'boolean') {
    state.showBlindDests = saved.showBlindDests;
  }
  if (typeof saved.showCoordinates === 'boolean') {
    state.showCoordinates = saved.showCoordinates;
  }
  if (typeof saved.showLastMove === 'boolean') {
    state.showLastMove = saved.showLastMove;
  }
  if (typeof saved.showMoveMarks === 'boolean') {
    state.showMoveMarks = saved.showMoveMarks;
  }
  if (Number.isFinite(Number(saved.boardRevealEvery))) {
    state.boardRevealEvery = Math.max(BOARD_REVEAL_MIN, Math.min(BOARD_REVEAL_NEVER, Math.floor(Number(saved.boardRevealEvery))));
  }
  if (typeof saved.darkMode === 'boolean') {
    state.darkMode = saved.darkMode;
  }
  if (typeof saved.showOnScreenKeyboard === 'boolean') {
    state.showOnScreenKeyboard = saved.showOnScreenKeyboard;
  }
  if (typeof saved.ttsVoiceUri === 'string') {
    state.ttsVoiceUri = saved.ttsVoiceUri;
  }
  if (Number.isFinite(Number(saved.ttsRate))) {
    state.ttsRate = Math.max(0.1, Math.min(1.5, Number(saved.ttsRate)));
  }
  if (Number.isFinite(Number(saved.ttsMovePauseMs))) {
    state.ttsMovePauseMs = Math.max(0, Math.min(5000, Math.round(Number(saved.ttsMovePauseMs) / 250) * 250));
  }
}

function applySettingsToUi() {
  elements.displayMode.value = state.displayMode;
  elements.moveLanguage.value = state.moveLanguage;
  elements.optionEngineStrength.value = String(state.stockfishElo);
  elements.optionStrengthValue.textContent = String(state.stockfishElo);
  elements.speakCheck.checked = state.speakCheck;
  elements.voiceOnOtherPuzzles.checked = state.voiceOnOtherPuzzles;
  elements.showBlindDests.checked = state.showBlindDests;
  elements.showCoordinates.checked = state.showCoordinates;
  elements.showLastMove.checked = state.showLastMove;
  elements.showMoveMarks.checked = state.showMoveMarks;
  elements.boardReveal.value = String(state.boardRevealEvery);
  elements.boardRevealValue.textContent = formatBoardRevealLabel(state.boardRevealEvery);
  elements.darkMode.checked = state.darkMode;
  elements.showOnScreenKeyboard.checked = state.showOnScreenKeyboard;
  elements.ttsRate.value = String(state.ttsRate);
  elements.ttsRateValue.textContent = `${state.ttsRate.toFixed(1)}x`;
  elements.ttsMovePause.value = String(state.ttsMovePauseMs);
  elements.ttsMovePauseValue.textContent = `${state.ttsMovePauseMs} ms`;
  elements.ttsVoice.value = state.ttsVoiceUri;
  elements.puzzleAutoOpponent.checked = state.puzzleAutoOpponent;
  elements.puzzleFixedOrientation.checked = state.puzzleFixedOrientation;
  elements.puzzleDifficulty.value = state.puzzleDifficulty;
  elements.blindQuestionCount.value = String(state.blindQuestionCount);
  elements.blindQuestionCountValue.textContent = String(state.blindQuestionCount);
  elements.puzzleBacktrack.value = String(state.puzzleBacktrack);
  elements.puzzleBacktrackValue.textContent = String(state.puzzleBacktrack);
  elements.positionRecallPieces.value = String(state.positionRecallPieces);
  elements.positionRecallPiecesValue.textContent = String(state.positionRecallPieces);
  elements.positionRecallShowSec.value = String(state.positionRecallShowSec);
  elements.positionRecallShowSecValue.textContent = String(state.positionRecallShowSec);
  elements.positionRecallHideSec.value = String(state.positionRecallHideSec);
  elements.positionRecallHideSecValue.textContent = String(state.positionRecallHideSec);

  const saved = readSettings();
  if (saved) {
    elements.speakComputer.checked = !!saved.speakComputer;
    elements.figurineNotation.checked = saved.figurineNotation !== false;
  }
  state.mattingTypes = normalizeMattingTypes(state.mattingTypes);
  syncMattingTypeButtons();
  state.movementModes = normalizeMovementModes(state.movementModes);
  syncMovementModeButtons();
  state.movementPieces = normalizeMovementPieces(state.movementPieces);
  syncMovementPieceButtons();
  applyTheme();
  syncMoveInputMode();
  updateMoveAssistVisibility();
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', state.darkMode);
}

function syncViewModeClasses() {
  const isDefaultGameView = state.sessionMode === 'game';
  const isPuzzleView = state.sessionMode === 'puzzle';
  const isBlindView = state.sessionMode === 'blind-puzzles';
  const isBlindPositionView = state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'position';
  const isBlindStructuredView = state.sessionMode === 'blind-puzzles'
    && (state.blindPuzzles.mode === 'position'
      || state.blindPuzzles.mode === 'game-drill'
      || isBlindMattingModeValue(state.blindPuzzles.mode));
  document.body.classList.toggle('game-default-view', isDefaultGameView);
  document.body.classList.toggle('puzzle-mode', isPuzzleView);
  document.body.classList.toggle('blind-mode', isBlindView);
  document.body.classList.toggle('blind-position-mode', isBlindPositionView);
  document.body.classList.toggle('blind-structured-mode', isBlindStructuredView);
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
  startLock: false,
  restartTimerId: null,
  startWatchdogId: null,
  startAttemptId: 0,
  consecutiveFailures: 0,
  forceRecreateOnNextStart: false
};

function formatBoardRevealLabel(value) {
  const bounded = Math.max(BOARD_REVEAL_MIN, Math.min(BOARD_REVEAL_NEVER, Math.floor(Number(value) || BOARD_REVEAL_NEVER)));
  if (bounded >= BOARD_REVEAL_NEVER) {
    return 'Board reveal: never';
  }
  const suffix = bounded === 1 ? 'move' : 'moves';
  return `Board reveal: after ${bounded} ${suffix}`;
}

function getAvailableTtsVoices() {
  if (typeof speechSynthesis === 'undefined' || typeof speechSynthesis.getVoices !== 'function') {
    return [];
  }
  return speechSynthesis.getVoices() ?? [];
}

function findConfiguredTtsVoice() {
  if (!state.ttsVoiceUri) {
    return null;
  }
  return getAvailableTtsVoices().find((voice) => voice.voiceURI === state.ttsVoiceUri) ?? null;
}

function normalizeTtsText(text) {
  return String(text ?? '')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cancelTtsPlayback() {
  state.ttsSequenceToken += 1;
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  state.speaking = false;
  refreshVoiceListeningState();
}

function speakTtsSequence(texts, lang) {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }
  const queue = (Array.isArray(texts) ? texts : [])
    .map((item) => normalizeTtsText(item))
    .filter(Boolean);
  if (!queue.length) {
    return;
  }

  const token = ++state.ttsSequenceToken;
  const pauseMs = Math.max(0, Math.min(5000, Math.floor(Number(state.ttsMovePauseMs) || 0)));
  state.speaking = true;
  refreshVoiceListeningState();

  const finish = () => {
    if (token !== state.ttsSequenceToken) {
      return;
    }
    state.speaking = false;
    refreshVoiceListeningState();
  };

  const speakNext = () => {
    if (token !== state.ttsSequenceToken) {
      return;
    }
    const text = queue.shift();
    if (!text) {
      finish();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    applyTtsOptions(utterance, lang);
    utterance.onend = () => {
      if (token !== state.ttsSequenceToken) {
        return;
      }
      if (!queue.length) {
        finish();
        return;
      }
      window.setTimeout(speakNext, pauseMs);
    };
    utterance.onerror = () => {
      finish();
    };
    speechSynthesis.speak(utterance);
  };

  speakNext();
}

function applyTtsOptions(utterance, lang) {
  utterance.text = normalizeTtsText(utterance.text);
  utterance.lang = lang;
  utterance.rate = Math.max(0.1, Math.min(1.5, Number(state.ttsRate) || 1));
  const selectedVoice = findConfiguredTtsVoice();
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
}

function populateTtsVoices() {
  if (!(elements.ttsVoice instanceof HTMLSelectElement)) {
    return;
  }
  const select = elements.ttsVoice;
  const current = state.ttsVoiceUri;
  const languagePrefix = state.moveLanguage === 'pl' ? 'pl' : 'en';
  const voices = getAvailableTtsVoices()
    .filter((voice) => String(voice.lang ?? '').toLowerCase().startsWith(languagePrefix))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  select.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'System default';
  select.appendChild(defaultOpt);
  for (const voice of voices) {
    const opt = document.createElement('option');
    opt.value = voice.voiceURI;
    opt.textContent = `${voice.name} (${voice.lang})`;
    select.appendChild(opt);
  }
  const hasCurrent = !!voices.find((voice) => voice.voiceURI === current);
  if (!hasCurrent) {
    state.ttsVoiceUri = '';
  }
  select.value = hasCurrent ? current : '';
}

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
  coordinates: state.showCoordinates,
  coordinatesOnSquares: state.showCoordinates,
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

function countPlayerMovesPlayed() {
  const playerColor = state.userColor === 'white' ? 'w' : 'b';
  let count = 0;
  for (const mv of state.game.history({ verbose: true })) {
    if (mv.color === playerColor) {
      count += 1;
    }
  }
  return count;
}

function normalizedBoardRevealEvery() {
  return Math.max(BOARD_REVEAL_MIN, Math.min(BOARD_REVEAL_NEVER, Math.floor(Number(state.boardRevealEvery) || BOARD_REVEAL_NEVER)));
}

function isAutoBoardRevealNow() {
  if (state.sessionMode !== 'game' || !state.gameStarted || state.game.isGameOver()) {
    return false;
  }
  if (state.displayMode === 'normal-pieces') {
    return false;
  }
  const interval = normalizedBoardRevealEvery();
  if (interval >= BOARD_REVEAL_NEVER) {
    return false;
  }
  if (!isUserTurn()) {
    return false;
  }
  const nextPlayerMove = countPlayerMovesPlayed() + 1;
  return nextPlayerMove % interval === 0;
}

function isBoardRevealActive() {
  return state.revealPosition || isAutoBoardRevealNow();
}

function boardGameForDisplayedPieces(boardGame) {
  if (state.sessionMode === 'follow-game' && state.followGame.mode === 'browse') {
    if (state.revealPosition) {
      return boardGame;
    }
    const interval = normalizedBoardRevealEvery();
    if (interval <= 1 || interval >= BOARD_REVEAL_NEVER) {
      return boardGame;
    }
    const verbose = state.game.history({ verbose: true });
    if (!verbose.length) {
      return boardGame;
    }
    const shownPlies = Math.floor(verbose.length / interval) * interval;
    if (shownPlies === verbose.length) {
      return boardGame;
    }
    return setGameFromVerboseMoves(verbose, shownPlies) ?? boardGame;
  }

  if (state.sessionMode !== 'game' || !state.gameStarted || state.displayMode !== 'normal-pieces') {
    return boardGame;
  }
  if (state.game.isGameOver() || isReviewLocked() || state.revealPosition) {
    return boardGame;
  }
  const interval = normalizedBoardRevealEvery();
  if (interval <= 1 || interval >= BOARD_REVEAL_NEVER) {
    return boardGame;
  }
  const verbose = state.game.history({ verbose: true });
  if (!verbose.length) {
    return boardGame;
  }
  const shownPlies = Math.floor(verbose.length / interval) * interval;
  if (shownPlies === verbose.length) {
    return boardGame;
  }
  return setGameFromVerboseMoves(verbose, shownPlies) ?? boardGame;
}

function transformPiecesForDisplay(realPieces) {
  if (isBoardRevealActive() && state.sessionMode !== 'blind-puzzles') {
    return realPieces;
  }

  const transformed = new Map();
  if (state.displayMode === 'no-pieces') {
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
  const boardRevealActive = isBoardRevealActive();
  elements.board.dataset.reveal = String(boardRevealActive);
  const squareColorHeatmapActive = state.sessionMode === 'blind-puzzles'
    && state.blindPuzzles.mode === 'square-colors'
    && boardRevealActive;
  const boardHidden = (state.sessionMode === 'blind-puzzles' && !boardRevealActive)
    || (state.displayMode === 'no-board' && !boardRevealActive);
  const suppressVisualMarks = shouldSuppressVisualMarks();
  elements.boardShell.classList.toggle('is-hidden', boardHidden);
  elements.boardShell.classList.toggle('is-blind-hidden', state.sessionMode === 'blind-puzzles' && boardHidden);
  syncRevealButtonUi();

  const boardGame = getBoardGame();
  const boardGameForPieces = boardGameForDisplayedPieces(boardGame);
  const reviewLocked = isReviewLocked();
  const followMode = state.sessionMode === 'follow-game';
  const realPieces = fenToPieces(boardGameForPieces.fen());
  const transformed = transformPiecesForDisplay(realPieces);
  let pieces = transformed instanceof Map
    ? transformed
    : new Map(Object.entries(transformed ?? {}));
  if (isPositionRecallMode()) {
    if (state.blindPuzzles.positionRecallStage === 'show') {
      const shown = new Map();
      for (const piece of state.blindPuzzles.positionRecallTargetPieces) {
        shown.set(piece.square, { color: piece.color, role: piece.role });
      }
      pieces = shown;
    } else if (state.blindPuzzles.positionRecallStage === 'answer') {
      pieces = new Map(state.blindPuzzles.positionRecallPlacedPieces ?? []);
    } else {
      pieces = new Map();
    }
  }
  if (squareColorHeatmapActive) {
    pieces = new Map();
  }

  const turnColor = boardGame.turn() === 'w' ? 'white' : 'black';
  const boardOrientation = state.boardOrientation;
  const movableColor = (state.sessionMode === 'puzzle' || followMode)
    ? undefined
    : (reviewLocked
      ? undefined
      : (boardGame.turn() === (state.userColor === 'white' ? 'w' : 'b') ? state.userColor : undefined));
  const boardInputEnabled = (followMode || isPositionRecallMode())
    ? false
    : (state.sessionMode !== 'game' || state.gameStarted);
  const shouldShowCoordinates = state.showCoordinates || squareColorHeatmapActive;
  const needsCoordsRebuild = ground.state.coordinates !== shouldShowCoordinates
    || ground.state.coordinatesOnSquares !== shouldShowCoordinates;
  const customHighlights = squareColorHeatmapActive
    ? squareColorHeatmapHighlights()
    : (suppressVisualMarks ? new Map() : blindSourceHighlightMap());

  ground.set({
    orientation: boardOrientation,
    coordinates: shouldShowCoordinates,
    coordinatesOnSquares: shouldShowCoordinates,
    turnColor,
    highlight: {
      lastMove: !suppressVisualMarks,
      check: !suppressVisualMarks,
      custom: customHighlights
    },
    movable: {
      free: false,
      color: boardInputEnabled ? movableColor : undefined,
      showDests: !suppressVisualMarks && shouldShowAnyMoveDots(),
      dests: (state.sessionMode === 'puzzle' || followMode || reviewLocked) ? new Map() : toDests(boardGame),
      events: {
        after: onBoardMove
      }
    },
    draggable: {
      enabled: state.sessionMode !== 'puzzle' && !followMode && boardInputEnabled,
      showGhost: true
    },
    selectable: {
      enabled: state.sessionMode !== 'puzzle' && !followMode && !reviewLocked && boardInputEnabled
    },
    check: suppressVisualMarks ? false : boardGame.inCheck(),
    lastMove: suppressVisualMarks ? undefined : lastMoveSquares(boardGame),
    pieces
  });
  if (needsCoordsRebuild) {
    ground.redrawAll();
  }
  elements.board.classList.toggle('square-color-heatmap', squareColorHeatmapActive);
  syncBlindClickDots();
}

function shouldSuppressVisualMarks() {
  if (!state.showMoveMarks) {
    return true;
  }
  return state.displayMode === 'no-board'
    || state.sessionMode === 'blind-puzzles';
}

function syncRevealButtonUi() {
  elements.revealBtn.classList.toggle('is-on', state.revealPosition);
  if (state.sessionMode === 'puzzle' && state.puzzle) {
    elements.revealBtn.title = state.revealPosition ? 'Hide puzzle start position' : 'Show puzzle start position';
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'square-colors') {
    elements.revealBtn.title = state.revealPosition ? 'Hide square heat map' : 'Show square heat map';
    return;
  }
  if (state.displayMode === 'no-board') {
    elements.revealBtn.title = state.revealPosition ? 'Hide board' : 'Show board';
    return;
  }
  elements.revealBtn.title = state.revealPosition ? 'Hide revealed position' : 'Reveal position';
}

function squareColorHeatClass(square) {
  const stats = getSquareColorStatsEntry(square);
  if (stats.asked <= 0) {
    return 'square-color-heat square-color-heat-0';
  }
  const ratio = stats.correct / Math.max(1, stats.asked);
  if (ratio >= 0.85) {
    return 'square-color-heat square-color-heat-4';
  }
  if (ratio >= 0.65) {
    return 'square-color-heat square-color-heat-3';
  }
  if (ratio >= 0.45) {
    return 'square-color-heat square-color-heat-2';
  }
  return 'square-color-heat square-color-heat-1';
}

function squareColorHeatmapHighlights() {
  const custom = new Map();
  for (const square of ALL_BOARD_SQUARES) {
    custom.set(square, squareColorHeatClass(square));
  }
  return custom;
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
  if (isBoardRevealActive()) {
    return false;
  }
  if (state.displayMode === 'no-pieces') {
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
  const squareColorHeatmapActive = state.sessionMode === 'blind-puzzles'
    && state.blindPuzzles.mode === 'square-colors'
    && state.revealPosition;
  const customHighlights = squareColorHeatmapActive
    ? squareColorHeatmapHighlights()
    : (suppressVisualMarks ? new Map() : blindSourceHighlightMap());
  ground.set({
    highlight: {
      lastMove: !suppressVisualMarks,
      check: !suppressVisualMarks,
      custom: customHighlights
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
  if (isPositionRecallMode()
    && state.blindPuzzles.running
    && state.blindPuzzles.positionRecallStage === 'answer') {
    const squareRecall = ground.getKeyAtDomPos([event.clientX, event.clientY]);
    if (squareRecall) {
      handlePositionRecallBoardClick(squareRecall);
    }
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
  const pieceName = /^[KQRBN]$/.test(first) ? names[first] : '';
  const pawnCaptureFile = !/^[KQRBN]/.test(base) && capture
    ? ((base.match(/^([a-h])x/) ?? [])[1] ?? '')
    : '';

  let spoken;
  if (capture && pawnCaptureFile) {
    spoken = `${pawnCaptureFile} bije ${target}`;
  } else if (!pieceName) {
    spoken = capture ? `bije ${target}` : `${target}`;
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
  return spoken
    .replace(/\bpion(?:ek)?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
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

function stripPromotionEqualsForDisplay(san) {
  return san.replace(/=([KQRBNHWGS♔♕♖♗♘])/g, '$1');
}

function formatSanForDisplay(san) {
  if (elements.figurineNotation.checked) {
    return stripPromotionEqualsForDisplay(sanToFigurine(san));
  }
  if (state.moveLanguage === 'pl') {
    return stripPromotionEqualsForDisplay(englishToPolishSan(san));
  }
  return stripPromotionEqualsForDisplay(san);
}

function appendSanMovesToNode(node, sans, startPly = 0, { activeAbsPly = null, solutionStartPly = null } = {}) {
  if (!node || !Array.isArray(sans) || !sans.length) {
    return;
  }
  const frag = document.createDocumentFragment();
  for (let i = 0; i < sans.length; i += 1) {
    const ply = startPly + i;
    const moveNo = Math.floor(ply / 2) + 1;
    const rendered = formatSanForDisplay(sans[i]);

    if (ply % 2 === 0) {
      const no = document.createElement('span');
      no.className = 'move-no';
      no.textContent = `${moveNo}.`;
      frag.appendChild(no);
    } else {
      const prevPly = ply - 1;
      const blackStartsSequence = i === 0 || prevPly < startPly || (prevPly % 2 === 1);
      if (blackStartsSequence) {
        const no = document.createElement('span');
        no.className = 'move-no';
        no.textContent = `${moveNo}...`;
        frag.appendChild(no);
      }
    }

    const mv = document.createElement('span');
    mv.className = 'move-token';
    mv.textContent = rendered;
    if (solutionStartPly !== null && ply >= solutionStartPly) {
      mv.classList.add('puzzle-solution-move');
    }
    if (activeAbsPly !== null && ply === activeAbsPly) {
      mv.classList.add('active-move');
    }
    frag.appendChild(mv);
    frag.appendChild(document.createTextNode(' '));
  }
  node.appendChild(frag);
}

function updatePuzzlePanel() {
  if (!state.puzzle) {
    elements.puzzlePanel.hidden = state.sessionMode !== 'puzzle';
    elements.puzzleContext.textContent = '-';
    elements.openPuzzleLinkBtn.hidden = true;
    elements.openPuzzleLinkBtn.removeAttribute('href');
    elements.showSolutionBtn.hidden = true;
    elements.showSolutionBtn.disabled = true;
    return;
  }

  elements.puzzlePanel.hidden = false;
  elements.openPuzzleLinkBtn.hidden = false;
  elements.showSolutionBtn.hidden = false;
  const p = state.puzzle;
  const solvedSolutionCount = Math.max(0, p.solutionIndex - p.contextMoves.length);
  elements.openPuzzleLinkBtn.href = `https://lichess.org/training/${p.id}`;
  const shownSolutionSans = p.revealSolutionText
    ? p.solutionSans
    : p.solutionSans.slice(0, solvedSolutionCount);
  const activeAbsPly = state.puzzleViewIndex > 0 ? (state.puzzleViewIndex - 1) : null;
  const hasContext = p.contextSans.length > 0;
  const hasSolution = shownSolutionSans.length > 0;
  elements.puzzleContext.textContent = '';
  if (hasContext) {
    appendSanMovesToNode(elements.puzzleContext, p.contextSans, p.contextStartPly, {
      activeAbsPly,
      solutionStartPly: p.startPly
    });
  }
  if (hasSolution) {
    appendSanMovesToNode(elements.puzzleContext, shownSolutionSans, p.startPly, {
      activeAbsPly,
      solutionStartPly: p.startPly
    });
  }
  if (!hasContext && !hasSolution) {
    elements.puzzleContext.textContent = '-';
  }
  if (state.puzzleLastAttempt?.wrong && state.puzzleLastAttempt.text) {
    const wrong = document.createElement('span');
    wrong.className = 'puzzle-wrong-inline';
    wrong.textContent = ` ${state.puzzleLastAttempt.text}`;
    elements.puzzleContext.appendChild(wrong);
  }
  if (p.solved) {
    const solvedFace = document.createElement('span');
    solvedFace.className = 'puzzle-solved-face';
    solvedFace.textContent = ' :)';
    elements.puzzleContext.appendChild(solvedFace);
  }
  elements.showSolutionBtn.disabled = p.solved || state.puzzleAutoPlaying;
}

function followGameDateLabel(rawDate) {
  const value = String(rawDate ?? '').trim();
  if (!value) {
    return '';
  }
  const year = value.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : value;
}

function normalizeFollowMode(raw) {
  return raw === 'quiz' ? 'quiz' : 'browse';
}

function syncFollowModeButtons() {
  for (const button of followModeButtons) {
    const key = button.dataset.followMode ?? 'browse';
    const active = normalizeFollowMode(key) === state.followGame.mode;
    button.classList.toggle('is-on', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  }
}

function followExpectedMoveAtShownPly() {
  const current = state.followGame.current;
  if (!current) {
    return null;
  }
  return current.moveVerbose[state.followGame.shownPlies] ?? null;
}

function followAutoColorForTurn(turn) {
  if (state.followGame.quizAutoColor === 'white') {
    return turn === 'w';
  }
  if (state.followGame.quizAutoColor === 'black') {
    return turn === 'b';
  }
  return false;
}

function isFollowQuizPlayable() {
  return state.sessionMode === 'follow-game'
    && state.followGame.mode === 'quiz'
    && state.followGame.quizActive
    && !!state.followGame.current;
}

function isFollowQuizAutoTurn() {
  if (!isFollowQuizPlayable()) {
    return false;
  }
  const expected = followExpectedMoveAtShownPly();
  if (!expected) {
    return false;
  }
  const turn = state.followGame.shownPlies % 2 === 0 ? 'w' : 'b';
  return followAutoColorForTurn(turn);
}

function splitPgnGamesFromText(text) {
  const normalized = String(text ?? '').replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return [];
  }
  if (!normalized.includes('[Event')) {
    return [normalized];
  }
  return normalized
    .split(/\n(?=\[Event\s+")/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function parseUploadedFollowGames(pgnText, sourceLabel = 'User PGN') {
  const chunks = splitPgnGamesFromText(pgnText);
  const out = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const record = {
      id: `user-${Date.now()}-${i}`,
      source: sourceLabel,
      pgn: chunks[i]
    };
    const parsed = parseFollowGameRecord(record, record.id, { maxFullMoves: null });
    if (parsed) {
      out.push(parsed);
    }
  }
  return out;
}

function followTotalMoves(current = state.followGame.current) {
  const totalPlies = current?.moveSans?.length ?? 0;
  return Math.ceil(totalPlies / 2);
}

function followStartPlyFromSelectedMove() {
  const current = state.followGame.current;
  const totalPlies = current?.moveSans?.length ?? 0;
  const chosenMove = Math.max(1, Math.min(followTotalMoves(current), Math.floor(Number(state.followGame.quizStartMove) || 1)));
  return Math.max(0, Math.min(totalPlies, (chosenMove - 1) * 2));
}

function syncFollowQuizSliderBounds() {
  const totalMoves = Math.max(1, followTotalMoves());
  elements.followQuizStart.min = '1';
  elements.followQuizStart.max = String(totalMoves);
  const bounded = Math.max(1, Math.min(totalMoves, Math.floor(Number(state.followGame.quizStartMove) || 1)));
  state.followGame.quizStartMove = bounded;
  elements.followQuizStart.value = String(bounded);
  elements.followQuizStartValue.textContent = String(bounded);
}

function syncFollowGameSelectOptions() {
  const select = elements.followGameSelect;
  const previous = state.followGame.selectedId || select.value;
  select.innerHTML = '';
  for (const game of state.followGame.games) {
    const option = document.createElement('option');
    option.value = String(game.id);
    const year = followGameDateLabel(game.date);
    option.textContent = year ? `${game.title} (${year})` : game.title;
    select.appendChild(option);
  }
  const exists = state.followGame.games.some((game) => String(game.id) === String(previous));
  if (exists) {
    state.followGame.selectedId = String(previous);
  } else {
    state.followGame.selectedId = state.followGame.games.length ? String(state.followGame.games[0].id) : '';
  }
  select.value = state.followGame.selectedId;
}

function followGameById(id) {
  return state.followGame.games.find((game) => String(game.id) === String(id)) ?? null;
}

function applyFollowExpectedMove() {
  const expected = followExpectedMoveAtShownPly();
  if (!expected) {
    return false;
  }
  const applied = state.game.move({ from: expected.from, to: expected.to, promotion: expected.promotion });
  if (!applied) {
    return false;
  }
  state.followGame.shownPlies += 1;
  return true;
}

function followQuizAutoplayIfNeeded() {
  if (!isFollowQuizPlayable()) {
    return;
  }
  let moved = false;
  while (isFollowQuizAutoTurn()) {
    if (!applyFollowExpectedMove()) {
      elements.statusText.textContent = 'Cannot continue quiz from game line.';
      state.followGame.quizActive = false;
      break;
    }
    moved = true;
  }
  if (moved) {
    state.reviewPly = null;
  }
}

function followQuizFinishIfDone() {
  const total = followGameTotalPlies();
  if (state.followGame.shownPlies >= total) {
    state.followGame.quizActive = false;
    return true;
  }
  return false;
}

function followQuizFeedbackFromQuality(quality) {
  if (quality === 'good') {
    return 'Zle, ale to dobry ruch.';
  }
  return 'Zle, to nie jest dobry ruch.';
}

async function evaluateAndSetFollowQuizFeedback(fenBefore, guessedUci, token) {
  const quality = await classifyFollowQuizMoveWithStockfish(fenBefore, guessedUci);
  if (token !== state.followGame.quizEvalToken || state.sessionMode !== 'follow-game') {
    return;
  }
  state.followGame.quizEvaluating = false;
  state.followGame.quizFeedback = followQuizFeedbackFromQuality(quality);
  updateFollowPanel();
  updateStatus();
}

function applyFollowQuizUserMove(text) {
  if (!isFollowQuizPlayable()) {
    elements.statusText.textContent = 'Follow mode is read-only. Turn Quiz on to enter moves.';
    return false;
  }
  if (state.followGame.quizEvaluating) {
    elements.statusText.textContent = 'Evaluating previous move...';
    return false;
  }
  if (isFollowQuizAutoTurn()) {
    elements.statusText.textContent = 'This color is auto-played by computer in quiz.';
    return false;
  }
  const expected = followExpectedMoveAtShownPly();
  if (!expected) {
    followQuizFinishIfDone();
    updateAll();
    return false;
  }

  let guess = findMatchingMove(text);
  if (!guess) {
    state.followGame.quizFeedback = 'Invalid move format.';
    updateStatus();
    updateFollowPanel();
    return false;
  }

  const guessedUci = uciFromMove(guess);
  const expectedUci = uciFromMove(expected);
  const rootFen = state.game.fen();
  const isExact = guessedUci === expectedUci;

  const applied = applyFollowExpectedMove();
  if (!applied) {
    elements.statusText.textContent = 'Cannot continue quiz from game line.';
    state.followGame.quizActive = false;
    updateAll();
    return false;
  }

  if (isExact) {
    state.followGame.quizFeedback = `Poprawnie: ${formatSanForDisplay(expected.san)}.`;
  } else {
    state.followGame.quizEvaluating = true;
    state.followGame.quizFeedback = 'Sprawdzam ruch w Stockfish...';
    const token = ++state.followGame.quizEvalToken;
    void evaluateAndSetFollowQuizFeedback(rootFen, guessedUci, token);
  }

  followQuizAutoplayIfNeeded();
  const finished = followQuizFinishIfDone();
  if (finished) {
    state.followGame.quizFeedback = 'Quiz finished. You can restart from beginning.';
  }
  updateAll();
  return true;
}

function resetFollowForCurrentSelection({ autoAdvanceBrowse = true } = {}) {
  const selected = followGameById(state.followGame.selectedId);
  state.followGame.quizEvalToken += 1;
  if (!selected) {
    state.followGame.current = null;
    state.followGame.shownPlies = 0;
    state.followGame.quizActive = false;
    state.game = new Chess();
    updateAll();
    return;
  }
  state.followGame.current = selected;
  state.followGame.quizFeedback = '';
  state.followGame.quizEvaluating = false;
  if (state.followGame.mode === 'quiz') {
    state.followGame.quizActive = true;
    const startPly = followStartPlyFromSelectedMove();
    if (!setFollowGamePly(startPly)) {
      elements.statusText.textContent = 'Cannot load selected follow game.';
      return;
    }
    followQuizAutoplayIfNeeded();
    updateAll();
    return;
  }
  state.followGame.quizActive = false;
  if (!setFollowGamePly(0)) {
    elements.statusText.textContent = 'Cannot load selected follow game.';
    return;
  }
  updateAll();
  if (autoAdvanceBrowse) {
    advanceFollowGameChunk();
  }
}

function pickRandomFollowGameFromList() {
  const games = state.followGame.games;
  if (!Array.isArray(games) || !games.length) {
    return null;
  }
  if (games.length === 1) {
    return games[0];
  }
  const currentId = state.followGame.current?.id;
  const pool = games.filter((item) => item.id !== currentId);
  const source = pool.length ? pool : games;
  return source[Math.floor(Math.random() * source.length)] ?? null;
}

function setFollowMode(mode) {
  state.followGame.mode = normalizeFollowMode(mode);
  state.followGame.quizActive = false;
  state.followGame.quizFeedback = '';
  state.followGame.quizEvaluating = false;
  state.followGame.quizEvalToken += 1;
  resetFollowForCurrentSelection({ autoAdvanceBrowse: state.followGame.mode === 'browse' });
}

function loadSelectedFollowGame() {
  resetFollowForCurrentSelection({ autoAdvanceBrowse: state.followGame.mode === 'browse' });
}

function loadRandomFollowGame() {
  const picked = pickRandomFollowGameFromList();
  if (!picked) {
    elements.statusText.textContent = 'No follow games available.';
    return;
  }
  state.followGame.selectedId = String(picked.id);
  resetFollowForCurrentSelection({ autoAdvanceBrowse: state.followGame.mode === 'browse' });
}

function restartFollowCurrent() {
  resetFollowForCurrentSelection({ autoAdvanceBrowse: state.followGame.mode === 'browse' });
}

function updateFollowPanel() {
  const active = state.sessionMode === 'follow-game';
  elements.followPanel.hidden = !active;
  if (!active) {
    elements.followGamePickerRow.hidden = false;
    elements.followGamePickerActions.hidden = false;
    elements.followGameSelect.innerHTML = '';
    elements.followGameTitle.textContent = '-';
    elements.followGameMeta.textContent = '-';
    elements.followGameMoves.textContent = '-';
    elements.followQuizStartRow.hidden = true;
    elements.followNextBtn.hidden = false;
    elements.followRestartBtn.disabled = true;
    elements.followNextBtn.disabled = true;
    elements.followNextBtn.textContent = 'Next';
    return;
  }

  syncFollowModeButtons();
  syncFollowGameSelectOptions();
  syncFollowQuizSliderBounds();
  elements.followQuizAutoColor.value = state.followGame.quizAutoColor;
  elements.followQuizStartRow.hidden = state.followGame.mode !== 'quiz';
  elements.followGameSelect.disabled = !state.followGame.games.length;
  elements.followLoadBtn.disabled = !state.followGame.games.length;
  elements.followRandomBtn.disabled = !state.followGame.games.length;
  elements.followQuizAutoColor.disabled = state.followGame.mode !== 'quiz';
  elements.followQuizStart.disabled = state.followGame.mode !== 'quiz' || !state.followGame.current;

  const current = state.followGame.current;
  const hasLoadedGame = !!current;
  elements.followGamePickerRow.hidden = hasLoadedGame;
  elements.followGamePickerActions.hidden = hasLoadedGame;
  if (!current) {
    elements.followGameTitle.textContent = 'No follow game selected.';
    elements.followGameMeta.textContent = '-';
    elements.followGameMoves.textContent = '-';
    elements.followNextBtn.hidden = state.followGame.mode !== 'browse';
    elements.followRestartBtn.disabled = true;
    elements.followNextBtn.disabled = true;
    elements.followNextBtn.textContent = 'Next';
    return;
  }
  elements.followRestartBtn.disabled = false;

  const totalPlies = current.moveSans.length;
  const shownPlies = Math.max(0, Math.min(totalPlies, state.followGame.shownPlies));
  const shownMoves = Math.ceil(shownPlies / 2);
  const totalMoves = Math.ceil(totalPlies / 2);
  const metaParts = [];
  if (current.event) {
    metaParts.push(current.event);
  }
  const year = followGameDateLabel(current.date);
  if (year) {
    metaParts.push(year);
  }
  const modeLabel = state.followGame.mode === 'quiz' ? 'quiz' : 'browse';
  metaParts.push(`${shownMoves}/${totalMoves} moves`);
  metaParts.push(modeLabel);
  if (state.followGame.mode === 'quiz' && state.followGame.quizFeedback) {
    metaParts.push(state.followGame.quizFeedback);
  }
  elements.followGameTitle.textContent = current.title;
  elements.followGameMeta.textContent = metaParts.join(' - ');

  elements.followGameMoves.textContent = '';
  if (shownPlies <= 0) {
    elements.followGameMoves.textContent = '-';
  } else if (state.followGame.mode === 'browse') {
    const lastSan = current.moveSans[shownPlies - 1] ?? '';
    const rendered = formatSanForDisplay(lastSan);
    elements.followGameMoves.textContent = shownPlies % 2 === 0 ? `... ${rendered}` : rendered;
  } else {
    appendSanMovesToNode(
      elements.followGameMoves,
      current.moveSans.slice(0, shownPlies),
      0,
      { activeAbsPly: shownPlies - 1 }
    );
  }

  const finished = shownPlies >= totalPlies;
  const browsing = state.followGame.mode === 'browse';
  elements.followNextBtn.hidden = !browsing;
  elements.followNextBtn.disabled = !browsing || finished;
  if (finished) {
    elements.followNextBtn.textContent = 'Done';
    return;
  }
  const remainingPlies = totalPlies - shownPlies;
  const previewMoves = Math.ceil(Math.min(remainingPlies, followChunkPlies()) / 2);
  const suffix = previewMoves === 1 ? 'move' : 'moves';
  elements.followNextBtn.textContent = `Next (${previewMoves} ${suffix})`;
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

function normalizeSanLooseMatch(san) {
  return String(san ?? '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
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

  const engSan = targetMove.san;
  const polSan = englishToPolishSan(targetMove.san);
  const parsedLoose = normalizeSanLooseMatch(parsed.value);
  return [engSan, polSan].some((san) => normalizeSanLooseMatch(san) === parsedLoose);
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
  state.puzzleRevealPrevView = null;
  state.puzzleLastAttempt = null;
  elements.moveInput.value = '';
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
    const backtrack = state.puzzleBacktrack;
    elements.puzzleBacktrack.value = String(backtrack);
    elements.puzzleBacktrackValue.textContent = String(backtrack);
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
    state.boardOrientation = state.puzzleFixedOrientation
      ? 'white'
      : (state.puzzle.playerColor === 'b' ? 'black' : 'white');
    state.puzzleViewIndex = contextStartPly;
    state.reviewPly = null;

    state.game = setGameFromVerboseMoves(verbose, contextStartPly) ?? new Chess(baseGame.fen());
    updateAll();
    speakPuzzleContextIfEnabled(contextSans);
  } catch (error) {
    state.puzzleRevealPrevView = null;
    state.puzzleLastAttempt = null;
    if (state.prePuzzleDisplayMode === null) {
      state.prePuzzleDisplayMode = state.displayMode;
    }
    state.sessionMode = 'puzzle';
    if (!state.puzzle) {
      state.displayMode = 'normal-pieces';
      elements.displayMode.value = state.displayMode;
      state.puzzleViewIndex = 0;
      state.reviewPly = null;
      state.game = new Chess();
    }
    updateAll();
    const msg = String(error?.message ?? '');
    if (msg === 'HTTP 429') {
      elements.statusText.textContent = 'Lichess busy, wait 1 minute';
      return;
    }
    elements.statusText.textContent = 'Unable to get puzzle from Lichess.';
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

function clearPositionRecallTimers() {
  if (state.blindPuzzles.positionRecallShowTimerId) {
    window.clearTimeout(state.blindPuzzles.positionRecallShowTimerId);
    state.blindPuzzles.positionRecallShowTimerId = null;
  }
  if (state.blindPuzzles.positionRecallHideTimerId) {
    window.clearTimeout(state.blindPuzzles.positionRecallHideTimerId);
    state.blindPuzzles.positionRecallHideTimerId = null;
  }
}

function resetBlindPuzzleSession() {
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const wasBlindMode = state.sessionMode === 'blind-puzzles';
  clearPositionRecallTimers();
  clearGameDrillReplayTimer();
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
  state.blindPuzzles.questionStartedAt = 0;
  state.blindPuzzles.responseTimesMs = [];
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.roundUsedSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  state.blindPuzzles.movementVariant = 'edge';
  state.blindPuzzles.movementPiece = 'B';
  state.blindPuzzles.routeTask = null;
  state.blindPuzzles.positionRecallStage = 'idle';
  state.blindPuzzles.positionRecallTargetPieces = [];
  state.blindPuzzles.positionRecallPlacedPieces = new Map();
  state.blindPuzzles.positionRecallOrder = [];
  state.blindPuzzles.positionRecallIndex = 0;
  state.blindPuzzles.positionIndex = null;
  state.blindPuzzles.gameIndex = null;
  state.blindPuzzles.gamePrefixMoves = [];
  state.blindPuzzles.gameDrillReplayPaused = false;
  state.blindPuzzles.staticPrompt = '';
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

function averageMs(values) {
  if (!Array.isArray(values) || !values.length) {
    return 0;
  }
  const sum = values.reduce((acc, item) => acc + (Number.isFinite(Number(item)) ? Number(item) : 0), 0);
  return Math.round(sum / values.length);
}

function formatMsAsSeconds(ms, decimals = 2) {
  const value = Math.max(0, Number(ms) || 0) / 1000;
  return `${value.toFixed(decimals).replace(/\.?0+$/, '')} s`;
}

function recordBlindAttempt(square, correct) {
  state.blindPuzzles.attemptedEntries.push({ square, correct: !!correct });
  if (correct) {
    state.blindPuzzles.givenSquares.add(square);
  }
}

function renderBlindMovementFeedback(mode) {
  const movementMode = mode === 'movements' || mode === 'check';
  elements.blindInputFeedback.hidden = !movementMode;
  if (!movementMode) {
    return;
  }

  const entered = state.blindPuzzles.attemptedEntries;
  elements.blindEntered.innerHTML = '';
  if (!entered.length) {
    elements.blindEntered.textContent = '-';
  } else {
    for (let i = 0; i < entered.length; i += 1) {
      const token = document.createElement('span');
      token.className = `blind-token ${entered[i].correct ? 'is-good' : 'is-bad'}`;
      token.textContent = entered[i].square;
      elements.blindEntered.appendChild(token);
      if (i < entered.length - 1) {
        elements.blindEntered.appendChild(document.createTextNode(' '));
      }
    }
  }

  const missing = [...state.blindPuzzles.expectedSquares].filter((sq) => !state.blindPuzzles.givenSquares.has(sq));
  elements.blindMissing.innerHTML = '';
  if (state.blindPuzzles.running) {
    elements.blindMissing.textContent = '-';
    return;
  }
  if (!missing.length) {
    elements.blindMissing.textContent = '-';
  } else {
    for (let i = 0; i < missing.length; i += 1) {
      const token = document.createElement('span');
      token.className = 'blind-token is-missing';
      token.textContent = missing[i];
      elements.blindMissing.appendChild(token);
      if (i < missing.length - 1) {
        elements.blindMissing.appendChild(document.createTextNode(' '));
      }
    }
  }
}

function updateBlindPanel() {
  const active = state.sessionMode === 'blind-puzzles';
  elements.blindPanel.hidden = !active;
  if (!active) {
    elements.blindPanel.classList.remove('square-color-layout');
  elements.blindPanel.classList.remove('same-diagonal-layout');
  elements.blindPanel.classList.remove('movement-layout');
    elements.blindPanel.classList.remove('check-layout');
    elements.blindPanel.classList.remove('position-layout');
    elements.blindPanel.classList.remove('matting-layout');
    elements.blindPanel.classList.remove('game-drill-layout');
    elements.blindMain.hidden = true;
    elements.blindInputFeedback.hidden = true;
    return;
  }
  const bp = state.blindPuzzles;
  elements.blindCorrectLabel.textContent = 'Correct:';
  elements.blindMain.hidden = !bp.mode;
  if (!bp.mode) {
    elements.blindPanel.classList.remove('square-color-layout');
    elements.blindPanel.classList.remove('same-diagonal-layout');
    elements.blindPanel.classList.remove('movement-layout');
    elements.blindPanel.classList.remove('check-layout');
    elements.blindPanel.classList.remove('position-layout');
    elements.blindPanel.classList.remove('matting-layout');
    elements.blindPanel.classList.remove('game-drill-layout');
    elements.blindInputFeedback.hidden = true;
    return;
  }
  elements.blindPanel.classList.toggle('square-color-layout', bp.mode === 'square-colors');
  elements.blindPanel.classList.toggle('same-diagonal-layout', bp.mode === 'same-diagonal');
  elements.blindPanel.classList.toggle('movement-layout', bp.mode === 'movements');
  elements.blindPanel.classList.toggle('check-layout', bp.mode === 'check');
  elements.blindPanel.classList.toggle('position-layout', bp.mode === 'position');
  elements.blindPanel.classList.toggle('matting-layout', isBlindMattingModeValue(bp.mode));
  elements.blindPanel.classList.toggle('game-drill-layout', bp.mode === 'game-drill');
  if (isBlindMattingModeValue(bp.mode)) {
    const prompt = bp.staticPrompt || formatMattingPositionPrompt(state.game);
    elements.blindPrompt.textContent = prompt;
    elements.blindProgress.textContent = '-';
    elements.blindCorrect.textContent = '-';
    elements.blindTimer.textContent = '-';
    const stats = elements.blindMain.querySelector('.blind-stats');
    if (stats instanceof HTMLElement) {
      stats.hidden = true;
    }
    elements.blindInputFeedback.hidden = true;
    return;
  }
  const stats = elements.blindMain.querySelector('.blind-stats');
  if (stats instanceof HTMLElement) {
    stats.hidden = false;
  }
  if (bp.mode === 'position') {
    const idx = bp.positionIndex;
    const ex = Number.isInteger(idx) ? state.positionExercises[idx] : null;
    const solvedCount = state.positionSolved.size;
    elements.blindPrompt.textContent = ex ? `white: ${ex.whiteLabel}\nblack: ${ex.blackLabel}` : '-';
    elements.blindProgress.textContent = ex ? `${idx + 1}/${state.positionExercises.length}` : '-';
    elements.blindCorrect.textContent = `${solvedCount}/${state.positionExercises.length}`;
    elements.blindTimer.textContent = '-';
    elements.blindInputFeedback.hidden = true;
    return;
  }
  if (bp.mode === 'position-recall') {
    elements.blindPrompt.textContent = positionRecallPromptText();
    elements.blindProgress.textContent = `${bp.asked}/${bp.total}`;
    elements.blindCorrect.textContent = `${bp.correct}/${bp.total}`;
    elements.blindTimer.textContent = formatBlindTime(bp.elapsedMs);
    elements.blindInputFeedback.hidden = true;
    return;
  }
  if (bp.mode === 'game-drill') {
    const idx = bp.gameIndex;
    const ex = Number.isInteger(idx) ? state.gameExercises[idx] : null;
    const solvedCount = state.gameSolved.size;
    elements.blindPrompt.textContent = ex ? 'Replay shown moves from Last move, then continue.' : '-';
    elements.blindProgress.textContent = ex ? `${idx + 1}/${state.gameExercises.length}` : '-';
    elements.blindCorrect.textContent = `${solvedCount}/${state.gameExercises.length}`;
    elements.blindTimer.textContent = '-';
    elements.blindInputFeedback.hidden = true;
    return;
  }
  elements.blindPrompt.textContent = bp.currentSquare || '-';
  elements.blindProgress.textContent = `${bp.asked}/${bp.total}`;
  if (bp.mode === 'square-colors') {
    elements.blindCorrectLabel.textContent = 'Avg:';
    elements.blindCorrect.textContent = bp.responseTimesMs.length
      ? formatMsAsSeconds(averageMs(bp.responseTimesMs))
      : '-';
  } else {
    const extra = (bp.mode === 'movements' || bp.mode === 'check')
      ? ` (${bp.givenSquares.size}/${bp.expectedSquares.size})`
      : '';
    elements.blindCorrect.textContent = `${bp.correct}${extra}`;
  }
  elements.blindTimer.textContent = formatBlindTime(bp.elapsedMs);
  renderBlindMovementFeedback(bp.mode);
}

function squareColorAnswer(square) {
  const file = square.charCodeAt(0) - 96;
  const rank = Number(square[1]);
  return ((file + rank) % 2 === 0) ? 'czarne' : 'biale';
}

const ALL_BOARD_SQUARES = Array.from({ length: 8 }, (_f, fi) =>
  Array.from({ length: 8 }, (_r, ri) => `${String.fromCharCode(97 + fi)}${ri + 1}`)
).flat();

function randomSquare() {
  return ALL_BOARD_SQUARES[Math.floor(Math.random() * ALL_BOARD_SQUARES.length)];
}

function getSquareColorStatsEntry(square) {
  const key = String(square ?? '').toLowerCase();
  if (!isBoardSquare(key)) {
    return { asked: 0, correct: 0 };
  }
  const entry = state.squareColorStats[key];
  if (!entry || !Number.isFinite(entry.asked) || !Number.isFinite(entry.correct)) {
    return { asked: 0, correct: 0 };
  }
  const asked = Math.max(0, Math.floor(Number(entry.asked)));
  const correct = Math.max(0, Math.floor(Number(entry.correct)));
  return { asked, correct: Math.min(asked, correct) };
}

function compareSquareColorStats(a, b) {
  if (a.asked === 0 && b.asked === 0) {
    return 0;
  }
  if (a.asked === 0) {
    return -1;
  }
  if (b.asked === 0) {
    return 1;
  }
  const left = a.correct * b.asked;
  const right = b.correct * a.asked;
  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  if (a.asked > b.asked) {
    return -1;
  }
  if (a.asked < b.asked) {
    return 1;
  }
  return 0;
}

function pickNextSquareColorSquare() {
  const used = state.blindPuzzles.roundUsedSquares;
  const candidates = ALL_BOARD_SQUARES.filter((sq) => !used.has(sq));
  if (!candidates.length) {
    return randomSquare();
  }
  let bestStats = getSquareColorStatsEntry(candidates[0]);
  let bestSquares = [candidates[0]];
  for (let i = 1; i < candidates.length; i += 1) {
    const square = candidates[i];
    const stats = getSquareColorStatsEntry(square);
    const cmp = compareSquareColorStats(stats, bestStats);
    if (cmp < 0) {
      bestStats = stats;
      bestSquares = [square];
    } else if (cmp === 0) {
      bestSquares.push(square);
    }
  }
  return bestSquares[Math.floor(Math.random() * bestSquares.length)];
}

function recordSquareColorStat(square, correct) {
  const key = String(square ?? '').toLowerCase();
  if (!isBoardSquare(key)) {
    return;
  }
  const entry = getSquareColorStatsEntry(key);
  entry.asked += 1;
  if (correct) {
    entry.correct += 1;
  }
  state.squareColorStats[key] = entry;
  writeSquareColorStats();
}

function randomInnerSquare() {
  const file = String.fromCharCode(98 + Math.floor(Math.random() * 6)); // b..g
  const rank = 2 + Math.floor(Math.random() * 6); // 2..7
  return `${file}${rank}`;
}

function randomPositionRecallPieces(count) {
  const total = Math.max(2, Math.min(32, Math.floor(Number(count) || 8)));
  const pieces = [];
  const usedSquares = new Set();
  const kingUsed = { white: false, black: false };
  const roles = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
  while (pieces.length < total) {
    const square = randomSquare();
    if (usedSquares.has(square)) {
      continue;
    }
    const color = Math.random() < 0.5 ? 'white' : 'black';
    const nonKingRoles = ['pawn', 'knight', 'bishop', 'rook', 'queen'];
    const rolePool = kingUsed[color] ? nonKingRoles : roles;
    const role = rolePool[Math.floor(Math.random() * rolePool.length)] ?? 'pawn';
    if (role === 'king') {
      kingUsed[color] = true;
    }
    usedSquares.add(square);
    pieces.push({ square, color, role });
  }
  return pieces;
}

function isPositionRecallMode() {
  return state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'position-recall';
}

function positionRecallPromptText() {
  const bp = state.blindPuzzles;
  if (bp.positionRecallStage === 'show') {
    return 'Memorize this position.';
  }
  if (bp.positionRecallStage === 'hide') {
    return 'Position hidden. Wait...';
  }
  if (bp.positionRecallStage === 'answer') {
    const idx = bp.positionRecallIndex;
    const total = bp.positionRecallOrder.length;
    const nextPiece = bp.positionRecallOrder[idx];
    if (!nextPiece) {
      return 'Done.';
    }
    return `Place ${figurineForBoardPiece(nextPiece.color, nextPiece.role)} (${idx + 1}/${total})`;
  }
  return '-';
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

function bishopTargets(square) {
  return slidingMovesFrom(square, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
}

function squareColorParity(square) {
  const { x, y } = squareToCoords(square);
  return (x + y) % 2;
}

function canPieceStep(from, to, pieceRole) {
  if (!isBoardSquare(from) || !isBoardSquare(to) || from === to) {
    return false;
  }
  const a = squareToCoords(from);
  const b = squareToCoords(to);
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (pieceRole === 'N') {
    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
  if (pieceRole === 'B') {
    return dx === dy;
  }
  return false;
}

function pieceTargetsForRoute(square, pieceRole) {
  if (pieceRole === 'N') {
    return knightSquares(square);
  }
  if (pieceRole === 'B') {
    return bishopTargets(square);
  }
  return [];
}

function shortestRouteLength(pieceRole, from, to) {
  if (!isBoardSquare(from) || !isBoardSquare(to)) {
    return Infinity;
  }
  if (from === to) {
    return 0;
  }
  if (pieceRole === 'B' && squareColorParity(from) !== squareColorParity(to)) {
    return Infinity;
  }
  const visited = new Set([from]);
  const queue = [{ sq: from, dist: 0 }];
  while (queue.length) {
    const current = queue.shift();
    for (const next of pieceTargetsForRoute(current.sq, pieceRole)) {
      if (next === to) {
        return current.dist + 1;
      }
      if (visited.has(next)) {
        continue;
      }
      visited.add(next);
      queue.push({ sq: next, dist: current.dist + 1 });
    }
  }
  return Infinity;
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

function figurineForBoardPiece(color, role) {
  const figurines = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
  };
  return figurines[color]?.[role] ?? '';
}

function formatMattingPositionPrompt(game) {
  const pieces = fenToPieces(game.fen());
  const white = [];
  const black = [];
  const order = { king: 0, queen: 1, rook: 2, bishop: 3, knight: 4, pawn: 5 };

  for (const [square, piece] of pieces.entries()) {
    const token = `${figurineForBoardPiece(piece.color, piece.role)}${square}`;
    if (piece.color === 'white') {
      white.push({ token, role: piece.role, square });
    } else {
      black.push({ token, role: piece.role, square });
    }
  }

  const sorter = (a, b) => {
    const roleDiff = (order[a.role] ?? 99) - (order[b.role] ?? 99);
    if (roleDiff !== 0) {
      return roleDiff;
    }
    return a.square.localeCompare(b.square);
  };
  white.sort(sorter);
  black.sort(sorter);

  const whiteText = white.map((p) => p.token).join(' ') || '-';
  const blackText = black.map((p) => p.token).join(' ') || '-';
  return `White: ${whiteText}\nBlack: ${blackText}`;
}

function isBlindMattingModeValue(mode) {
  return BLIND_MATTING_MODES.has(String(mode ?? ''));
}

function isBlindMattingMode() {
  return state.sessionMode === 'blind-puzzles'
    && isBlindMattingModeValue(state.blindPuzzles.mode);
}

function isBlindPlayableGameMode() {
  return state.sessionMode === 'blind-puzzles'
    && (isBlindMattingModeValue(state.blindPuzzles.mode)
      || state.blindPuzzles.mode === 'position'
      || state.blindPuzzles.mode === 'game-drill');
}

function shouldShowBlindMoveControls() {
  return state.sessionMode === 'blind-puzzles'
    && (isBlindMattingModeValue(state.blindPuzzles.mode)
      || state.blindPuzzles.mode === 'position'
      || state.blindPuzzles.mode === 'game-drill'
      || state.blindPuzzles.mode === 'movements'
      || state.blindPuzzles.mode === 'check');
}

function shouldShowBlindVoiceControls() {
  return shouldShowBlindMoveControls()
    || (state.sessionMode === 'blind-puzzles'
      && (state.blindPuzzles.mode === 'square-colors' || state.blindPuzzles.mode === 'same-diagonal'));
}

function isBlindStructuredLastMoveMode() {
  return state.sessionMode === 'blind-puzzles'
    && (isBlindMattingModeValue(state.blindPuzzles.mode)
      || state.blindPuzzles.mode === 'position'
      || state.blindPuzzles.mode === 'game-drill');
}

function isBlindAnswerEntryMode() {
  return state.sessionMode === 'blind-puzzles'
    && (state.blindPuzzles.mode === 'square-colors'
      || state.blindPuzzles.mode === 'movements'
      || state.blindPuzzles.mode === 'check');
}

function kingsAdjacent(a, b) {
  const ac = squareToCoords(a);
  const bc = squareToCoords(b);
  return Math.max(Math.abs(ac.x - bc.x), Math.abs(ac.y - bc.y)) <= 1;
}

function randomKMajorMattingGame(majorPiece, maxTries = 500) {
  for (let i = 0; i < maxTries; i += 1) {
    const wk = randomSquare();
    const major = randomSquare();
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

function randomMattingGameWithWhitePieces(whitePieces, { requireOppositeBishopColors = false } = {}, maxTries = 500) {
  if (!Array.isArray(whitePieces) || !whitePieces.length) {
    return null;
  }
  for (let i = 0; i < maxTries; i += 1) {
    const wk = randomSquare();
    const bk = randomSquare();
    if (wk === bk || kingsAdjacent(wk, bk)) {
      continue;
    }
    const used = new Set([wk, bk]);
    const placed = [];
    let failed = false;
    for (const piece of whitePieces) {
      let square = randomSquare();
      let tries = 0;
      while (used.has(square) && tries < 24) {
        square = randomSquare();
        tries += 1;
      }
      if (used.has(square)) {
        failed = true;
        break;
      }
      used.add(square);
      placed.push({ piece, square });
    }
    if (failed) {
      continue;
    }
    if (requireOppositeBishopColors) {
      const bishops = placed.filter((entry) => entry.piece === 'B').map((entry) => entry.square);
      if (bishops.length >= 2 && squareColorAnswer(bishops[0]) === squareColorAnswer(bishops[1])) {
        continue;
      }
    }

    const board = Array.from({ length: 8 }, () => Array(8).fill(''));
    const wkC = squareToCoords(wk);
    const bkC = squareToCoords(bk);
    board[7 - wkC.y][wkC.x] = 'K';
    board[7 - bkC.y][bkC.x] = 'k';
    for (const entry of placed) {
      const c = squareToCoords(entry.square);
      board[7 - c.y][c.x] = entry.piece;
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

function randomKTwoBishopsMattingGame(maxTries = 500) {
  return randomMattingGameWithWhitePieces(['B', 'B'], { requireOppositeBishopColors: true }, maxTries);
}

function randomKBishopKnightMattingGame(maxTries = 500) {
  return randomMattingGameWithWhitePieces(['B', 'N'], {}, maxTries);
}

function speakBlindPrompt(text) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  applyTtsOptions(utterance, 'pl-PL');
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

function speakBlindGameOverMessage(success) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const utterance = new SpeechSynthesisUtterance(success ? 'brawo, koniec gry' : 'błąd, koniec gry');
  applyTtsOptions(utterance, 'pl-PL');
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
  const sq = pickNextSquareColorSquare();
  state.blindPuzzles.roundUsedSquares.add(sq);
  state.blindPuzzles.currentSquare = sq;
  state.blindPuzzles.currentAnswer = squareColorAnswer(sq);
  state.blindPuzzles.questionStartedAt = Date.now();
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  elements.statusText.textContent = 'Say: białe or czarne';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function areSquaresOnSameDiagonal(a, b) {
  const ac = squareToCoords(a);
  const bc = squareToCoords(b);
  return Math.abs(ac.x - bc.x) === Math.abs(ac.y - bc.y);
}

function pickSameDiagonalQuestion() {
  const from = randomSquare();
  const sameDiagSquares = ALL_BOARD_SQUARES.filter((sq) => sq !== from && areSquaresOnSameDiagonal(from, sq));
  const offDiagSquares = ALL_BOARD_SQUARES.filter((sq) => sq !== from && !areSquaresOnSameDiagonal(from, sq));
  const wantSame = Math.random() < 0.5 && sameDiagSquares.length > 0;
  const pool = wantSame ? sameDiagSquares : offDiagSquares;
  const to = pool[Math.floor(Math.random() * pool.length)] ?? from;
  return {
    from,
    to,
    answer: wantSame ? 'yes' : 'no'
  };
}

function askNextSameDiagonalQuestion() {
  const q = pickSameDiagonalQuestion();
  state.blindPuzzles.currentSquare = `${q.from} and ${q.to}`;
  state.blindPuzzles.currentAnswer = q.answer;
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  elements.statusText.textContent = 'Answer: yes or no.';
  updateBlindPanel();
  speakBlindPrompt(`${q.from} ${q.to}`);
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

function normalizeYesNoVoice(raw) {
  const text = normalizeVoiceText(raw);
  if (/\b(yes|tak)\b/.test(text)) {
    return 'yes';
  }
  if (/\b(no|nie)\b/.test(text)) {
    return 'no';
  }
  return '';
}

function extractSquaresFromVoice(raw) {
  const text = normalizeVoiceText(raw);
  const matches = [...text.matchAll(/([a-h])\s*([1-8])/g)];
  return Array.from(new Set(matches.map((m) => `${m[1]}${m[2]}`)));
}

function extractSquaresFromVoiceOrdered(raw) {
  const text = normalizeVoiceText(raw);
  const matches = [...text.matchAll(/([a-h])\s*([1-8])/g)];
  return matches.map((m) => `${m[1]}${m[2]}`);
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
    const total = state.blindPuzzles.total;
    const achievedTotalMs = Math.max(1, Math.floor(state.blindPuzzles.elapsedMs));
    const achievedAvgMs = Math.max(0, averageMs(state.blindPuzzles.responseTimesMs));
    const countKey = String(total);
    const prevBestTotal = Number(state.squareColorRecords.bestTotalMsByCount[countKey]);
    const validPrevBestTotal = Number.isFinite(prevBestTotal) && prevBestTotal > 0 ? prevBestTotal : null;
    const beatBestTotal = validPrevBestTotal === null || achievedTotalMs < validPrevBestTotal;
    const bestTotalAfter = beatBestTotal ? achievedTotalMs : validPrevBestTotal;
    state.squareColorRecords.bestTotalMsByCount[countKey] = bestTotalAfter;

    let bestAvgAfter = null;
    let beatBestAvg = false;
    if (total >= 20) {
      const prevBestAvg = Number(state.squareColorRecords.bestAvgMsGte20);
      const validPrevBestAvg = Number.isFinite(prevBestAvg) && prevBestAvg > 0 ? prevBestAvg : null;
      beatBestAvg = validPrevBestAvg === null || achievedAvgMs < validPrevBestAvg;
      bestAvgAfter = beatBestAvg ? achievedAvgMs : validPrevBestAvg;
      state.squareColorRecords.bestAvgMsGte20 = bestAvgAfter;
    }
    writeSquareColorRecords();

    const lines = [
      `Congratulations! Result: ${state.blindPuzzles.correct}/${total}.`,
      `Time: ${formatBlindTime(achievedTotalMs)} (Best: ${formatBlindTime(bestTotalAfter)}).`
    ];
    if (total >= 20 && bestAvgAfter !== null) {
      lines.push(`Avg: ${formatMsAsSeconds(achievedAvgMs)} (Best: ${formatMsAsSeconds(bestAvgAfter)}).`);
    }
    if (beatBestTotal || beatBestAvg) {
      lines.push('New personal record! Celebration time!');
    }
    elements.statusText.textContent = lines.join(' ');
  } else {
    elements.statusText.textContent = `Game over. Wrong answer. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.`;
  }
  speakBlindGameOverMessage(success);
  setVoiceMode(false);
}

function finishBlindPuzzleGeneric(success, wrongReason = '') {
  state.blindPuzzles.running = false;
  clearPositionRecallTimers();
  state.blindPuzzles.elapsedMs = state.blindPuzzles.startAt ? (Date.now() - state.blindPuzzles.startAt) : state.blindPuzzles.elapsedMs;
  stopBlindPuzzleTimer();
  updateBlindPanel();
  if (success) {
    elements.statusText.textContent = `Game over. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.`;
  } else {
    const tail = wrongReason ? ` ${wrongReason}` : '';
    elements.statusText.textContent = `Game over. Wrong answer. Result: ${state.blindPuzzles.correct}/${state.blindPuzzles.total}.${tail}`;
  }
  speakBlindGameOverMessage(success);
  setVoiceMode(false);
}

function applySquareColorAnswer(answer) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'square-colors' || !state.blindPuzzles.running) {
    return false;
  }
  if (!answer) {
    elements.statusText.textContent = 'Answer with: białe or czarne.';
    return true;
  }
  const oneShotActive = state.voiceOneShot;
  const currentSquare = state.blindPuzzles.currentSquare;
  const startedAt = Number(state.blindPuzzles.questionStartedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    state.blindPuzzles.responseTimesMs.push(Math.max(0, Date.now() - startedAt));
  }
  state.blindPuzzles.questionStartedAt = 0;

  state.blindPuzzles.asked += 1;
  if (answer !== state.blindPuzzles.currentAnswer) {
    recordSquareColorStat(currentSquare, false);
    finishSquareColors(false);
    return true;
  }

  recordSquareColorStat(currentSquare, true);
  state.blindPuzzles.correct += 1;
  if (state.blindPuzzles.asked >= state.blindPuzzles.total) {
    finishSquareColors(true);
    return true;
  }
  askNextSquareColorQuestion();
  if (oneShotActive && state.voiceMode) {
    setVoiceMode(false);
  }
  return true;
}

function applySameDiagonalAnswer(answer) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'same-diagonal' || !state.blindPuzzles.running) {
    return false;
  }
  const normalized = normalizeYesNoVoice(answer);
  if (!normalized) {
    elements.statusText.textContent = 'Answer with: yes or no.';
    return true;
  }
  const oneShotActive = state.voiceOneShot;
  state.blindPuzzles.asked += 1;
  if (normalized !== state.blindPuzzles.currentAnswer) {
    finishBlindPuzzleGeneric(false);
    return true;
  }
  state.blindPuzzles.correct += 1;
  if (state.blindPuzzles.asked >= state.blindPuzzles.total) {
    finishBlindPuzzleGeneric(true);
    return true;
  }
  askNextSameDiagonalQuestion();
  if (oneShotActive && state.voiceMode) {
    setVoiceMode(false);
  }
  return true;
}

function handleSquareColorsVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'square-colors' || !state.blindPuzzles.running) {
    return false;
  }
  const answer = normalizeSquareColorVoice(transcript);
  return applySquareColorAnswer(answer);
}

function handleSameDiagonalVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'same-diagonal' || !state.blindPuzzles.running) {
    return false;
  }
  const answer = normalizeYesNoVoice(transcript);
  return applySameDiagonalAnswer(answer);
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

function pickRandomSquareByParity(parity, excludeSquare = '') {
  const candidates = ALL_BOARD_SQUARES.filter((sq) => sq !== excludeSquare && squareColorParity(sq) === parity);
  if (!candidates.length) {
    return randomSquare();
  }
  return candidates[Math.floor(Math.random() * candidates.length)] ?? candidates[0];
}

function askNextBishopEdgeQuestion() {
  const sq = randomInnerSquare();
  state.blindPuzzles.movementPiece = 'B';
  state.blindPuzzles.currentSquare = `${pieceSymbol('B')}${sq}`;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set(bishopEdgeSquares(sq));
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  state.blindPuzzles.routeTask = null;
  elements.statusText.textContent = 'Say 4 edge squares reachable by bishop.';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function askNextBishopRouteQuestion() {
  const from = randomSquare();
  const to = pickRandomSquareByParity(squareColorParity(from), from);
  const shortest = shortestRouteLength('B', from, to);
  state.blindPuzzles.movementPiece = 'B';
  state.blindPuzzles.currentSquare = `${pieceSymbol('B')}${from} -> ${to}`;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  state.blindPuzzles.routeTask = {
    pieceRole: 'B',
    from,
    to,
    shortest
  };
  elements.statusText.textContent = 'Say shortest path as squares, e.g. c1 e3 g5.';
  updateBlindPanel();
  speakBlindPrompt(`${from} ${to}`);
}

function askNextBishopQuestion() {
  state.blindPuzzles.movementVariant = pickMovementModeForQuestion();
  if (state.blindPuzzles.movementVariant === 'route') {
    askNextBishopRouteQuestion();
    return;
  }
  askNextBishopEdgeQuestion();
}

function askNextKnightEdgeQuestion() {
  const sq = randomSquare();
  const targets = knightSquares(sq);
  state.blindPuzzles.movementPiece = 'N';
  state.blindPuzzles.currentSquare = `${pieceSymbol('N')}${sq}`;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set(targets);
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  state.blindPuzzles.routeTask = null;
  elements.statusText.textContent = targets.length < 8
    ? 'Say all knight squares, then say stop.'
    : 'Say all 8 knight squares.';
  updateBlindPanel();
  speakBlindPrompt(sq);
}

function askNextKnightRouteQuestion() {
  const from = randomSquare();
  const candidates = ALL_BOARD_SQUARES.filter((sq) => sq !== from);
  const to = candidates[Math.floor(Math.random() * candidates.length)] ?? from;
  const shortest = shortestRouteLength('N', from, to);
  state.blindPuzzles.movementPiece = 'N';
  state.blindPuzzles.currentSquare = `${pieceSymbol('N')}${from} -> ${to}`;
  state.blindPuzzles.currentAnswer = '';
  state.blindPuzzles.expectedSquares = new Set();
  state.blindPuzzles.givenSquares = new Set();
  state.blindPuzzles.attemptedEntries = [];
  state.blindPuzzles.routeTask = {
    pieceRole: 'N',
    from,
    to,
    shortest
  };
  elements.statusText.textContent = 'Say shortest path as squares, e.g. g1 e2 f4.';
  updateBlindPanel();
  speakBlindPrompt(`${from} ${to}`);
}

function askNextKnightQuestion() {
  state.blindPuzzles.movementVariant = pickMovementModeForQuestion();
  if (state.blindPuzzles.movementVariant === 'route') {
    askNextKnightRouteQuestion();
    return;
  }
  askNextKnightEdgeQuestion();
}

function askNextMovementQuestion() {
  const piece = pickMovementPieceForQuestion();
  if (piece === 'knight') {
    askNextKnightQuestion();
    return;
  }
  askNextBishopQuestion();
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
  state.blindPuzzles.attemptedEntries = [];
  elements.statusText.textContent = 'Say all checking moves as squares, then stop.';
  updateBlindPanel();
  speakBlindPrompt(`król ${king}, ${pieceNamePl(role)} ${from}`);
}

function handleMovementRouteVoice(transcript, nextAsker) {
  const task = state.blindPuzzles.routeTask;
  if (!task) {
    elements.statusText.textContent = 'No route task active.';
    return true;
  }
  const heardSquares = extractSquaresFromVoiceOrdered(transcript);
  if (!heardSquares.length) {
    elements.statusText.textContent = 'Say path squares like c1 e3 g5.';
    return true;
  }

  let path = heardSquares.slice();
  if (path[0] !== task.from) {
    path = [task.from, ...path];
  }
  if (path[path.length - 1] !== task.to) {
    elements.statusText.textContent = `Path must end on ${task.to}.`;
    state.blindPuzzles.attemptedEntries = path.map((sq) => ({ square: sq, correct: true }));
    updateBlindPanel();
    return true;
  }

  for (let i = 1; i < path.length; i += 1) {
    if (!canPieceStep(path[i - 1], path[i], task.pieceRole)) {
      state.blindPuzzles.attemptedEntries = path.map((sq, idx) => ({ square: sq, correct: idx < i }));
      finishBlindPuzzleGeneric(false, `Illegal step: ${path[i - 1]}-${path[i]}.`);
      return true;
    }
  }

  state.blindPuzzles.attemptedEntries = path.map((sq) => ({ square: sq, correct: true }));
  updateBlindPanel();
  const usedMoves = path.length - 1;
  if (usedMoves > task.shortest) {
    finishBlindPuzzleGeneric(false, `Correct path, but not shortest (${usedMoves} vs ${task.shortest}).`);
    return true;
  }
  finishBlindQuestionOrAskNext(nextAsker);
  return true;
}

function handleBishopVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'movements' || !state.blindPuzzles.running) {
    return false;
  }
  if (state.blindPuzzles.movementPiece !== 'B') {
    return false;
  }
  if (state.blindPuzzles.movementVariant === 'route') {
    return handleMovementRouteVoice(transcript, askNextMovementQuestion);
  }
  const heardSquares = extractSquaresFromVoice(transcript);
  if (!heardSquares.length) {
    elements.statusText.textContent = 'Say squares like a1, h8.';
    return true;
  }
  for (const sq of heardSquares) {
    const correct = state.blindPuzzles.expectedSquares.has(sq);
    recordBlindAttempt(sq, correct);
    if (!correct) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
  }
  updateBlindPanel();
  if (state.blindPuzzles.givenSquares.size === state.blindPuzzles.expectedSquares.size) {
    finishBlindQuestionOrAskNext(askNextMovementQuestion);
  }
  return true;
}

function handleKnightVoice(transcript) {
  if (state.sessionMode !== 'blind-puzzles' || state.blindPuzzles.mode !== 'movements' || !state.blindPuzzles.running) {
    return false;
  }
  if (state.blindPuzzles.movementPiece !== 'N') {
    return false;
  }
  if (state.blindPuzzles.movementVariant === 'route') {
    return handleMovementRouteVoice(transcript, askNextMovementQuestion);
  }
  const heardSquares = extractSquaresFromVoice(transcript);
  const stop = hasStopToken(transcript);

  for (const sq of heardSquares) {
    const correct = state.blindPuzzles.expectedSquares.has(sq);
    recordBlindAttempt(sq, correct);
    if (!correct) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
  }
  updateBlindPanel();

  const expectedCount = state.blindPuzzles.expectedSquares.size;
  const gotAll = state.blindPuzzles.givenSquares.size === expectedCount;
  if (expectedCount === 8 && gotAll && !stop) {
    finishBlindQuestionOrAskNext(askNextMovementQuestion);
    return true;
  }

  if (stop) {
    if (gotAll) {
      finishBlindQuestionOrAskNext(askNextMovementQuestion);
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
    const correct = state.blindPuzzles.expectedSquares.has(sq);
    recordBlindAttempt(sq, correct);
    if (!correct) {
      finishBlindPuzzleGeneric(false);
      return true;
    }
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

function submitBlindStop() {
  if (state.sessionMode !== 'blind-puzzles' || !state.blindPuzzles.running) {
    return false;
  }
  if (state.blindPuzzles.mode === 'movements'
    && state.blindPuzzles.movementPiece === 'N'
    && state.blindPuzzles.movementVariant !== 'route') {
    return handleKnightVoice('stop');
  }
  if (state.blindPuzzles.mode === 'check') {
    return handleCheckVoice('stop');
  }
  return false;
}

function handleBlindPuzzleVoice(transcript) {
  if (handleSquareColorsVoice(transcript)) {
    return true;
  }
  if (handleSameDiagonalVoice(transcript)) {
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
  elements.statusText.textContent = 'Choose a puzzle.';
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
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const spokenTask = String(task)
    .replace(/\b\d+\.(?:\.\.)?/g, ' ')
    .replace(/\bK([a-h][1-8])\b/gi, (_m, sq) => `król ${sq.toLowerCase()}`)
    .replace(/\bH([a-h][1-8])\b/gi, (_m, sq) => `hetman ${sq.toLowerCase()}`)
    .replace(/\bW([a-h][1-8])\b/gi, (_m, sq) => `wieża ${sq.toLowerCase()}`)
    .replace(/\bG([a-h][1-8])\b/gi, (_m, sq) => `goniec ${sq.toLowerCase()}`)
    .replace(/\bS([a-h][1-8])\b/gi, (_m, sq) => `skoczek ${sq.toLowerCase()}`)
    .replace(/\bP\s*:\s*([a-h][1-8](?:\s*,\s*[a-h][1-8])*)/gi, (_m, list) => {
      const parts = list.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean);
      return parts.join(', ');
    });
  const utterance = new SpeechSynthesisUtterance(spokenTask);
  applyTtsOptions(utterance, 'pl-PL');
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
  elements.statusText.textContent = state.game.turn() === 'w' ? 'white move' : 'black move';
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
    cancelTtsPlayback();
  }
  const movesSpoken = (exercise.moveSans ?? [])
    .map((san) => sanToPolishSpeech(san))
    .filter(Boolean);
  const side = exercise.turn === 'w' ? 'biale zaczynaja' : 'czarne zaczynaja';
  speakTtsSequence([...movesSpoken, side], 'pl-PL');
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
  state.reviewPly = 0;
  state.game = new Chess();
  state.game.load(ex.fen);
  startGameDrillReplay();
  updateAll();
  setVoiceMode(false);
}

function positionRecallEnterHideStage() {
  if (!isPositionRecallMode() || !state.blindPuzzles.running) {
    return;
  }
  clearPositionRecallTimers();
  state.blindPuzzles.positionRecallStage = 'hide';
  state.revealPosition = false;
  elements.statusText.textContent = `Position hidden for ${state.positionRecallHideSec}s...`;
  updateAll();
  state.blindPuzzles.positionRecallHideTimerId = window.setTimeout(() => {
    state.blindPuzzles.positionRecallHideTimerId = null;
    positionRecallEnterAnswerStage();
  }, state.positionRecallHideSec * 1000);
}

function positionRecallEnterAnswerStage() {
  if (!isPositionRecallMode() || !state.blindPuzzles.running) {
    return;
  }
  state.blindPuzzles.positionRecallStage = 'answer';
  state.blindPuzzles.positionRecallPlacedPieces = new Map();
  state.blindPuzzles.positionRecallIndex = 0;
  state.revealPosition = true;
  elements.statusText.textContent = 'Rebuild the position by clicking squares for shown pieces.';
  updateAll();
}

function handlePositionRecallBoardClick(square) {
  if (!isPositionRecallMode() || !state.blindPuzzles.running || state.blindPuzzles.positionRecallStage !== 'answer') {
    return;
  }
  const bp = state.blindPuzzles;
  const nextPiece = bp.positionRecallOrder[bp.positionRecallIndex];
  if (!nextPiece) {
    return;
  }
  if (bp.positionRecallPlacedPieces.has(square)) {
    elements.statusText.textContent = `Square ${square} is already used.`;
    return;
  }
  bp.asked += 1;
  bp.positionRecallPlacedPieces.set(square, { color: nextPiece.color, role: nextPiece.role });
  if (square !== nextPiece.square) {
    bp.attemptedEntries = [{ square, correct: false }];
    finishBlindPuzzleGeneric(false, `Wrong square for ${figurineForBoardPiece(nextPiece.color, nextPiece.role)}.`);
    return;
  }
  bp.correct += 1;
  bp.positionRecallIndex += 1;
  updateAll();
  if (bp.correct >= bp.total) {
    finishBlindPuzzleGeneric(true);
  }
}

function followChunkMoves() {
  return Math.max(1, Math.floor(Number(state.puzzleBacktrack) || 1));
}

function followChunkPlies() {
  if (state.sessionMode === 'follow-game' && state.followGame.mode === 'browse') {
    return 1;
  }
  return followChunkMoves() * 2;
}

function followGameTotalPlies() {
  return state.followGame.current?.moveVerbose?.length ?? 0;
}

function speakFollowGameChunk(startPly, endPly) {
  if (!elements.speakComputer.checked || typeof speechSynthesis === 'undefined') {
    return;
  }
  const current = state.followGame.current;
  if (!current) {
    return;
  }
  const sans = current.moveSans.slice(startPly, endPly);
  const spokenMoves = sans
    .map((san) => (state.moveLanguage === 'pl' ? sanToPolishSpeech(san) : sanToEnglishSpeech(san)))
    .filter(Boolean);
  if (!spokenMoves.length) {
    return;
  }
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const lang = state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US';
  speakTtsSequence(spokenMoves, lang);
}

function setFollowGamePly(plyCount) {
  const current = state.followGame.current;
  if (!current) {
    return false;
  }
  const total = current.moveVerbose.length;
  const bounded = Math.max(0, Math.min(total, Math.floor(Number(plyCount) || 0)));
  const nextGame = setGameFromVerboseMoves(current.moveVerbose, bounded);
  if (!nextGame) {
    return false;
  }
  state.followGame.shownPlies = bounded;
  state.game = nextGame;
  state.reviewPly = null;
  return true;
}

function advanceFollowGameChunk() {
  if (state.sessionMode !== 'follow-game'
    || state.followGame.mode !== 'browse'
    || !state.followGame.current) {
    return;
  }
  const from = state.followGame.shownPlies;
  const total = followGameTotalPlies();
  if (from >= total) {
    return;
  }
  const to = Math.min(total, from + followChunkPlies());
  if (!setFollowGamePly(to)) {
    elements.statusText.textContent = 'Cannot load follow game moves.';
    return;
  }
  state.followGame.chunkStartPly = from;
  updateAll();
  speakFollowGameChunk(from, to);
}

function resetFollowGameSelectionState() {
  state.followGame.quizEvalToken += 1;
  state.followGame.current = null;
  state.followGame.shownPlies = 0;
  state.followGame.chunkStartPly = 0;
  state.followGame.quizActive = false;
  state.followGame.quizFeedback = '';
  state.followGame.quizEvaluating = false;
  state.game = new Chess();
  state.reviewPly = null;
}

function startFollowGame() {
  if (!state.followGame.games.length) {
    elements.statusText.textContent = 'No follow games available.';
    return;
  }
  resetBlindPuzzleSession();
  clearBlindClickSelection();
  setVoiceMode(false);
  if (state.speaking) {
    cancelTtsPlayback();
  }
  if (state.prePuzzleDisplayMode !== null) {
    state.displayMode = state.prePuzzleDisplayMode;
    state.prePuzzleDisplayMode = null;
  }
  state.sessionMode = 'follow-game';
  state.puzzle = null;
  state.puzzleRevealPrevView = null;
  state.puzzleAutoPlaying = false;
  state.puzzleViewIndex = 0;
  state.puzzleLastAttempt = null;
  state.revealPosition = false;
  state.followGame.mode = normalizeFollowMode(state.followGame.mode);
  state.userColor = 'white';
  if (!state.followGame.selectedId && state.followGame.games.length) {
    state.followGame.selectedId = String(state.followGame.games[0].id);
  }
  resetFollowGameSelectionState();
  updateAll();
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

function clearGameDrillReplayTimer() {
  if (state.blindPuzzles.gameDrillReplayTimerId) {
    window.clearTimeout(state.blindPuzzles.gameDrillReplayTimerId);
    state.blindPuzzles.gameDrillReplayTimerId = null;
  }
}

function isGameDrillModeActive() {
  return state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill';
}

function gameDrillReplayDelayMs() {
  return Math.max(0, Math.min(5000, Math.floor(Number(state.ttsMovePauseMs) || 0)));
}

function pauseGameDrillReplayForManualReview() {
  if (!isGameDrillModeActive()) {
    return;
  }
  if (!state.blindPuzzles.gameDrillReplayTimerId && !state.blindPuzzles.gameDrillReplayPaused) {
    return;
  }
  clearGameDrillReplayTimer();
  state.blindPuzzles.gameDrillReplayPaused = true;
}

function scheduleGameDrillReplayTick() {
  if (!isGameDrillModeActive() || state.blindPuzzles.gameDrillReplayPaused) {
    return;
  }
  const prefixTotal = gameDrillPrefixMoves().length;
  if (prefixTotal <= 0) {
    return;
  }
  const viewed = state.reviewPly ?? prefixTotal;
  if (viewed >= prefixTotal) {
    return;
  }
  clearGameDrillReplayTimer();
  state.blindPuzzles.gameDrillReplayTimerId = window.setTimeout(() => {
    state.blindPuzzles.gameDrillReplayTimerId = null;
    if (!isGameDrillModeActive() || state.blindPuzzles.gameDrillReplayPaused) {
      return;
    }
    const nextTotal = gameDrillPrefixMoves().length;
    const nextViewed = state.reviewPly ?? nextTotal;
    if (nextViewed >= nextTotal) {
      state.reviewPly = null;
      state.blindPuzzles.gameDrillReplayPaused = false;
      updateAll();
      return;
    }
    const next = nextViewed + 1;
    state.reviewPly = next >= nextTotal ? null : next;
    if (next >= nextTotal) {
      state.blindPuzzles.gameDrillReplayPaused = false;
    } else {
      scheduleGameDrillReplayTick();
    }
    updateAll();
  }, gameDrillReplayDelayMs());
}

function startGameDrillReplay() {
  if (!isGameDrillModeActive()) {
    return;
  }
  clearGameDrillReplayTimer();
  state.blindPuzzles.gameDrillReplayPaused = false;
  const total = gameDrillPrefixMoves().length;
  if (total <= 0) {
    state.reviewPly = null;
    return;
  }
  state.reviewPly = 0;
  scheduleGameDrillReplayTick();
}

function toggleGameDrillReplayPause() {
  if (!isGameDrillModeActive()) {
    return;
  }
  const total = gameDrillPrefixMoves().length;
  if (total <= 0) {
    return;
  }
  const viewed = state.reviewPly ?? total;
  if (!state.blindPuzzles.gameDrillReplayPaused && viewed >= total) {
    return;
  }
  if (state.blindPuzzles.gameDrillReplayPaused) {
    state.blindPuzzles.gameDrillReplayPaused = false;
    scheduleGameDrillReplayTick();
  } else {
    clearGameDrillReplayTimer();
    state.blindPuzzles.gameDrillReplayPaused = true;
  }
  updateMainControlsVisibility();
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
  state.blindPuzzles.total = Math.min(64, state.blindQuestionCount);
  updateAll();
  startBlindPuzzleTimer();
  askNextSquareColorQuestion();
  setVoiceMode(state.voiceOnOtherPuzzles);
}

function startSameDiagonalPuzzle() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'same-diagonal';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = Math.min(64, state.blindQuestionCount);
  updateAll();
  startBlindPuzzleTimer();
  askNextSameDiagonalQuestion();
  setVoiceMode(state.voiceOnOtherPuzzles);
}

function startPositionRecallPuzzle() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'position-recall';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = Math.max(2, Math.min(32, state.positionRecallPieces));
  state.blindPuzzles.asked = 0;
  state.blindPuzzles.correct = 0;
  state.blindPuzzles.positionRecallTargetPieces = randomPositionRecallPieces(state.blindPuzzles.total);
  state.blindPuzzles.positionRecallOrder = state.blindPuzzles.positionRecallTargetPieces.slice();
  state.blindPuzzles.positionRecallPlacedPieces = new Map();
  state.blindPuzzles.positionRecallIndex = 0;
  state.blindPuzzles.positionRecallStage = 'show';
  state.revealPosition = true;
  updateAll();
  startBlindPuzzleTimer();
  elements.statusText.textContent = `Memorize position (${state.positionRecallShowSec}s).`;
  clearPositionRecallTimers();
  state.blindPuzzles.positionRecallShowTimerId = window.setTimeout(() => {
    state.blindPuzzles.positionRecallShowTimerId = null;
    positionRecallEnterHideStage();
  }, state.positionRecallShowSec * 1000);
  setVoiceMode(false);
}

function startMovementsPuzzle() {
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.game = new Chess();
  state.reviewPly = null;
  state.blindPuzzles.mode = 'movements';
  state.blindPuzzles.running = true;
  state.blindPuzzles.total = state.blindQuestionCount;
  updateAll();
  startBlindPuzzleTimer();
  askNextMovementQuestion();
  setVoiceMode(state.voiceOnOtherPuzzles);
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
  setVoiceMode(state.voiceOnOtherPuzzles);
}

function mattingTypeDefinition(typeKey) {
  const key = String(typeKey ?? '').toLowerCase();
  if (key === 'kr') {
    return {
      key: 'kr',
      mode: 'kr-matting',
      label: 'K+R',
      create: () => randomKRookMattingGame()
    };
  }
  if (key === 'kbb') {
    return {
      key: 'kbb',
      mode: 'kbb-matting',
      label: 'K+2B',
      create: () => randomKTwoBishopsMattingGame()
    };
  }
  if (key === 'kbn') {
    return {
      key: 'kbn',
      mode: 'kbn-matting',
      label: 'K+B+N',
      create: () => randomKBishopKnightMattingGame()
    };
  }
  return {
    key: 'kq',
    mode: 'kq-matting',
    label: 'K+Q',
    create: () => randomKQueenMattingGame()
  };
}

function startMattingByType(typeKey) {
  const definition = mattingTypeDefinition(typeKey);
  const game = definition.create();
  if (!game) {
    elements.statusText.textContent = `Could not generate ${definition.label} position. Try again.`;
    return;
  }
  resetBlindPuzzleSession();
  state.sessionMode = 'blind-puzzles';
  state.puzzle = null;
  state.puzzleAutoPlaying = false;
  state.blindPuzzles.mode = definition.mode;
  state.userColor = 'white';
  state.revealPosition = false;
  state.reviewPly = null;
  state.game = game;
  state.blindPuzzles.staticPrompt = formatMattingPositionPrompt(game);
  updateAll();
  setVoiceMode(false);
}

function startMattingPuzzle() {
  const enabled = enabledMattingTypeKeys();
  if (!enabled.length) {
    state.mattingTypes = normalizeMattingTypes({});
    syncMattingTypeButtons();
    writeSettings();
  }
  const pool = enabled.length ? enabled : ['kq'];
  const choice = pool[Math.floor(Math.random() * pool.length)] ?? 'kq';
  startMattingByType(choice);
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

function showPuzzleSolution() {
  if (!state.puzzle || state.puzzle.solved || state.puzzleAutoPlaying) {
    return;
  }

  state.puzzle.revealSolutionText = true;
  state.puzzleLastAttempt = null;
  state.puzzle.solutionIndex = state.puzzle.lineMoves.length;
  updateAll();
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
  if (state.sessionMode === 'follow-game') {
    return;
  }
  if (state.sessionMode === 'puzzle') {
    puzzleStepBack();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    pauseGameDrillReplayForManualReview();
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
  if (state.sessionMode === 'follow-game') {
    return;
  }
  if (state.sessionMode === 'puzzle') {
    puzzleStepForward();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    pauseGameDrillReplayForManualReview();
    const total = gameDrillTotalPlies();
    const viewed = state.reviewPly ?? total;
    if (viewed >= total) {
      return;
    }
    const next = viewed + 1;
    state.reviewPly = next >= total ? null : next;
    if (state.reviewPly === null) {
      state.blindPuzzles.gameDrillReplayPaused = false;
    }
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

function reviewJumpFirst() {
  if (state.sessionMode === 'follow-game') {
    return;
  }
  if (state.sessionMode === 'puzzle') {
    if (!state.puzzle || state.puzzleAutoPlaying) {
      return;
    }
    const progressAbsPly = puzzleProgressAbsPly();
    state.puzzleViewIndex = progressAbsPly > 0 ? 1 : 0;
    if (!syncPuzzleGameToView()) {
      elements.statusText.textContent = 'Cannot navigate puzzle move list.';
      return;
    }
    updateAll();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    pauseGameDrillReplayForManualReview();
    const total = gameDrillTotalPlies();
    if (total === 0) {
      return;
    }
    state.reviewPly = 1;
    updateAll();
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  if (total === 0) {
    return;
  }
  state.reviewPly = 1;
  updateAll();
}

function reviewJumpLast() {
  if (state.sessionMode === 'follow-game') {
    return;
  }
  if (state.sessionMode === 'puzzle') {
    if (!state.puzzle || state.puzzleAutoPlaying) {
      return;
    }
    state.puzzleViewIndex = puzzleProgressAbsPly();
    if (!syncPuzzleGameToView()) {
      elements.statusText.textContent = 'Cannot navigate puzzle move list.';
      return;
    }
    updateAll();
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    pauseGameDrillReplayForManualReview();
    const total = gameDrillTotalPlies();
    if (total === 0) {
      return;
    }
    state.reviewPly = null;
    state.blindPuzzles.gameDrillReplayPaused = false;
    updateAll();
    return;
  }

  const total = state.game.history({ verbose: true }).length;
  if (total === 0) {
    return;
  }
  state.reviewPly = null;
  updateAll();
}

function installLongPressAction(button, onClick, onLongPress) {
  const longPressMs = 450;
  let timer = null;
  let longPressFired = false;
  let pointerActive = false;

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || button.disabled) {
      return;
    }
    pointerActive = true;
    longPressFired = false;
    clearTimer();
    timer = setTimeout(() => {
      if (!pointerActive || button.disabled) {
        return;
      }
      longPressFired = true;
      onLongPress();
    }, longPressMs);
  });

  const endPress = () => {
    pointerActive = false;
    clearTimer();
  };

  button.addEventListener('pointerup', endPress);
  button.addEventListener('pointercancel', endPress);
  button.addEventListener('pointerleave', endPress);

  button.addEventListener('click', (event) => {
    if (longPressFired) {
      event.preventDefault();
      event.stopPropagation();
      longPressFired = false;
      return;
    }
    onClick();
  });
}

function jumpToMovePly(absPly) {
  if (!Number.isInteger(absPly) || absPly < 0) {
    return;
  }
  if (state.sessionMode === 'follow-game') {
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
    pauseGameDrillReplayForManualReview();
    const total = gameDrillTotalPlies();
    if (total === 0) {
      return;
    }
    const next = Math.max(1, Math.min(total, absPly + 1));
    state.reviewPly = next >= total ? null : next;
    if (state.reviewPly === null) {
      state.blindPuzzles.gameDrillReplayPaused = false;
    }
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
  if (state.sessionMode === 'follow-game') {
    elements.reviewPrevBtn.disabled = true;
    elements.reviewNextBtn.disabled = true;
    return;
  }
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

function looksLikePawnSanInput(moveRaw) {
  const raw = String(moveRaw ?? '').trim();
  const san = raw.replace(/[+#]/g, '');
  return /^[a-h][1-8](?:=?[qrbnhwgsQBRNHWGS])?$/.test(san)
    || /^[a-h]x[a-h][1-8](?:=?[qrbnhwgsQBRNHWGS])?$/.test(san)
    || /^[a-h][a-h][1-8](?:=?[qrbnhwgsQBRNHWGS])?$/.test(san);
}

function normalizePromotionSansWithoutEquals(moveRaw) {
  const raw = String(moveRaw ?? '').trim();
  const m = raw.match(/^([a-h](?:x)?[a-h][1-8]|[a-h][a-h][1-8]|[a-h][1-8])([qrbnhwgsQBRNHWGS])([+#]?)$/);
  if (!m) {
    return raw;
  }
  return `${m[1]}=${m[2]}${m[3]}`;
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
  move = normalizePromotionSansWithoutEquals(move);

  const uci = move.toLowerCase().replace(/\s+/g, '');
  if (/^[a-h][1-8][a-h][1-8][qrbnshwg]?$/.test(uci)) {
    const promoMap = { s: 'n', h: 'q', w: 'r', g: 'b' };
    const promo = uci[4] ? (promoMap[uci[4]] ?? uci[4]) : '';
    return { type: 'uci', value: `${uci.slice(0, 4)}${promo}` };
  }

  if (state.moveLanguage === 'pl') {
    move = normalizePolishFigureWords(move);
    if (!looksLikePawnSanInput(move)) {
      move = move
        .replace(/^([khwgs])/i, (_m, p1) => p1.toUpperCase());
      move = polishToEnglishSan(move);
    }
    move = move.replace(/=([hwgs])/gi, (_m, p1) => `=${({ h: 'q', w: 'r', g: 'b', s: 'n', H: 'q', W: 'r', G: 'b', S: 'n' }[p1] ?? p1)}`);
  }

  // Voice transcription may uppercase SAN (e.g. "NF3", "NBD2", "EXD5").
  // Normalize to canonical SAN casing.
  move = move.toLowerCase();
  if (!looksLikePawnSanInput(move)) {
    move = move.replace(/^([kqrbn])/, (_m, p1) => p1.toUpperCase());
  }
  move = move.replace(/=([qrbn])/g, (_m, p1) => `=${p1.toUpperCase()}`);
  if (/^(o-o-o|ooo|0-0-0|000)$/i.test(move)) {
    move = 'O-O-O';
  } else if (/^(o-o|oo|0-0|00)$/i.test(move)) {
    move = 'O-O';
  }

  return { type: 'san', value: move };
}

function findMatchingMove(text) {
  const parsed = normalizeMoveInput(text);
  const legal = state.game.moves({ verbose: true });
  if (parsed.type === 'uci') {
    const uciMatches = legal.filter((mv) => uciFromMove(mv) === parsed.value);
    return uciMatches.length === 1 ? uciMatches[0] : null;
  }

  if (parsed.type === 'san') {
    const exactMatches = legal.filter((mv) => {
      const engSan = mv.san;
      const polSan = englishToPolishSan(mv.san);
      return [engSan, polSan].includes(parsed.value);
    });
    if (exactMatches.length === 1) {
      return exactMatches[0];
    }
    if (exactMatches.length > 1) {
      return null;
    }

    const parsedLoose = normalizeSanLooseMatch(parsed.value);
    const looseMatches = legal.filter((mv) => {
      const engSan = mv.san;
      const polSan = englishToPolishSan(mv.san);
      return [engSan, polSan].some((san) => normalizeSanLooseMatch(san) === parsedLoose);
    });
    if (looseMatches.length === 1) {
      return looseMatches[0];
    }
    if (looseMatches.length > 1) {
      return null;
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

    // Allow short pawn capture notation like "dc" / "dxc" when unique.
    const shortPawnCap = stripped.toLowerCase().match(/^([a-h])x?([a-h])$/);
    if (shortPawnCap) {
      const fromFile = shortPawnCap[1];
      const toFile = shortPawnCap[2];
      const candidates = legal.filter((mv) =>
        mv.piece === 'p'
        && mv.from[0] === fromFile
        && mv.to[0] === toFile
        && (mv.flags.includes('c') || mv.flags.includes('e'))
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

  const inputLoose = normalizeSanLooseMatch(parsed.value);
  const expectedLoose = normalizeSanLooseMatch(expectedMove.san);
  return inputLoose === expectedLoose ? expectedMove : null;
}

function normalizeVoiceMoveForHandling(rawText) {
  const parsed = normalizeMoveInput(String(rawText ?? '').trim());
  if (parsed.type === 'san') {
    return {
      input: parsed.value,
      display: formatSanForDisplay(parsed.value)
    };
  }
  return {
    input: parsed.value,
    display: parsed.value
  };
}

function puzzleWrongMoveStatus(text) {
  const entered = formatPuzzleAttemptForDisplay(text);
  return entered ? `Wrong move (${entered}).` : 'Wrong move.';
}

function formatPuzzleAttemptForDisplay(text) {
  const entered = String(text ?? '').trim();
  if (!entered) {
    return '';
  }
  const parsed = normalizeMoveInput(entered);
  if (parsed.type === 'san') {
    return formatSanForDisplay(parsed.value);
  }
  return parsed.value;
}

function setPuzzleLastAttempt(text) {
  if (state.sessionMode !== 'puzzle' || !state.puzzle) {
    return;
  }
  const entered = formatPuzzleAttemptForDisplay(text);
  state.puzzleLastAttempt = entered ? { text: entered, wrong: true } : null;
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
  if (state.sessionMode === 'follow-game') {
    return applyFollowQuizUserMove(text);
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
      setPuzzleLastAttempt(text);
      elements.statusText.textContent = puzzleWrongMoveStatus(text);
      updatePuzzlePanel();
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
      setPuzzleLastAttempt(text);
      elements.statusText.textContent = puzzleWrongMoveStatus(text);
      updatePuzzlePanel();
      restorePuzzleView();
      return false;
    }
    state.puzzleLastAttempt = null;
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
  if (state.sessionMode === 'follow-game') {
    const ok = applyFollowQuizUserMove(`${from}${to}`);
    if (!ok) {
      updateBoard();
    }
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
  if (state.sessionMode === 'follow-game') {
    return isFollowQuizPlayable() && !isFollowQuizAutoTurn();
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

function parseStockfishScoreFromInfo(line) {
  const mateMatch = line.match(/\bscore\s+mate\s+(-?\d+)/);
  if (mateMatch) {
    return { type: 'mate', value: Number(mateMatch[1]) };
  }
  const cpMatch = line.match(/\bscore\s+cp\s+(-?\d+)/);
  if (cpMatch) {
    return { type: 'cp', value: Number(cpMatch[1]) };
  }
  return null;
}

function stockfishScoreToCp(score) {
  if (!score || typeof score !== 'object') {
    return -999999;
  }
  if (score.type === 'mate') {
    const raw = Number(score.value) || 0;
    const distance = Math.min(99, Math.max(0, Math.abs(raw)));
    const mapped = 100000 - (distance * 1000);
    return raw >= 0 ? mapped : -mapped;
  }
  return Number(score.value) || 0;
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
        const score = parseStockfishScoreFromInfo(line);
        if (multipvMatch && (pvMatch || score)) {
          const idx = Number(multipvMatch[1]);
          const prev = pending.entries.get(idx) ?? {};
          pending.entries.set(idx, {
            uci: pvMatch ? pvMatch[1] : prev.uci,
            score: score ?? prev.score
          });
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
            .filter((entry) => entry && entry.uci)
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
    cancelTtsPlayback();
  }

  const utterance = new SpeechSynthesisUtterance(
    state.moveLanguage === 'pl' ? sanToPolishSpeech(moveSan) : sanToEnglishSpeech(moveSan)
  );
  applyTtsOptions(utterance, state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US');
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
    cancelTtsPlayback();
  }
  const utterance = new SpeechSynthesisUtterance('brawo');
  applyTtsOptions(utterance, 'pl-PL');
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
    cancelTtsPlayback();
  }
  const spokenMoves = contextSans
    .map((san) => state.moveLanguage === 'pl' ? sanToPolishSpeech(san) : sanToEnglishSpeech(san))
    .filter(Boolean);
  if (!spokenMoves.length) {
    return;
  }
  speakTtsSequence(spokenMoves, state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US');
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
  if (!hist.length) {
    elements.movesBody.textContent = '-';
    return;
  }
  const activeAbsPly = viewedPly > 0 ? (startPly + viewedPly - 1) : null;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < hist.length; i += 1) {
    const ply = startPly + i;
    const moveNo = Math.floor(ply / 2) + 1;
    const san = formatSanForDisplay(hist[i]);

    if (ply % 2 === 0) {
      const no = document.createElement('span');
      no.className = 'move-no';
      no.textContent = `${moveNo}.`;
      frag.appendChild(no);
    } else {
      const prevPly = ply - 1;
      const blackStartsSequence = i === 0 || prevPly < startPly || (prevPly % 2 === 1);
      if (blackStartsSequence) {
        const no = document.createElement('span');
        no.className = 'move-no';
        no.textContent = `${moveNo}...`;
        frag.appendChild(no);
      }
    }

    const mv = document.createElement('span');
    mv.className = 'move-token';
    mv.textContent = san;
    mv.dataset.ply = String(ply);
    mv.classList.add('clickable-move');
    if (state.sessionMode === 'puzzle' && state.puzzle && ply >= state.puzzle.startPly) {
      mv.classList.add('puzzle-solution-move');
    }
    if (activeAbsPly !== null && ply === activeAbsPly) {
      mv.classList.add('active-move');
    }
    frag.appendChild(mv);
    frag.appendChild(document.createTextNode(' '));
  }
  elements.movesBody.appendChild(frag);
}

function updateLastMove() {
  let hist = state.game.history({ verbose: false });
  let viewedPly = hist.length;
  if (state.sessionMode === 'puzzle' && state.puzzle) {
    const solvedSolutionCount = Math.max(0, state.puzzle.solutionIndex - state.puzzle.contextMoves.length);
    const solvedSolutionSans = state.puzzle.solutionSans.slice(0, solvedSolutionCount);
    hist = [...state.puzzle.prefixSans, ...state.puzzle.contextSans, ...solvedSolutionSans];
    viewedPly = state.puzzleViewIndex;
  } else if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const prefixSans = gameDrillPrefixMoves().map((mv) => mv.san);
    hist = [...prefixSans, ...state.game.history({ verbose: false })];
    viewedPly = state.reviewPly ?? hist.length;
  } else if (state.sessionMode !== 'puzzle') {
    viewedPly = state.reviewPly ?? hist.length;
  }

  const boundedViewed = Math.max(0, Math.min(hist.length, viewedPly));
  const last = boundedViewed > 0 ? hist[boundedViewed - 1] : null;
  if (!last) {
    elements.lastMoveText.textContent = '';
    return;
  }
  const isBlackMove = boundedViewed % 2 === 0;
  const rendered = formatSanForDisplay(last);
  elements.lastMoveText.textContent = isBlackMove ? `... ${rendered}` : rendered;
}

function updateStatus() {
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && !isBlindPlayableGameMode()) {
    return;
  }
  if (state.sessionMode === 'follow-game') {
    const current = state.followGame.current;
    if (!current) {
      elements.statusText.textContent = 'No follow game selected.';
      return;
    }
    const shownPlies = Math.max(0, Math.min(current.moveSans.length, state.followGame.shownPlies));
    const totalMoves = Math.ceil(current.moveSans.length / 2);
    const shownMoves = Math.ceil(shownPlies / 2);
    if (state.followGame.mode === 'browse') {
      if (shownPlies >= current.moveSans.length) {
        elements.statusText.textContent = `Follow browse finished (${totalMoves} moves).`;
        return;
      }
      const turn = state.game.turn() === 'w' ? 'White' : 'Black';
      elements.statusText.textContent = `${turn} to move - ${shownMoves}/${totalMoves} moves shown`;
      return;
    }
    if (shownPlies >= current.moveSans.length) {
      elements.statusText.textContent = 'Quiz finished. Use Restart.';
      return;
    }
    const turn = state.game.turn() === 'w' ? 'White' : 'Black';
    const sideInfo = isFollowQuizAutoTurn() ? 'auto move' : 'your move';
    const feedback = state.followGame.quizFeedback ? ` - ${state.followGame.quizFeedback}` : '';
    elements.statusText.textContent = `Quiz ${shownMoves}/${totalMoves}: ${turn} ${sideInfo}${feedback}`;
    return;
  }
  const boardGame = getBoardGame();
  const turn = boardGame.turn() === 'w' ? 'White' : 'Black';
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'position') {
    elements.statusText.textContent = boardGame.turn() === 'w' ? 'white move' : 'black move';
    return;
  }
  if (state.sessionMode === 'blind-puzzles'
    && isBlindMattingMode()) {
    elements.statusText.textContent = boardGame.turn() === 'w' ? 'white move' : 'black move';
    return;
  }
  if (state.sessionMode === 'blind-puzzles' && state.blindPuzzles.mode === 'game-drill') {
    const prefixSans = gameDrillPrefixMoves().map((mv) => mv.san);
    const hist = [...prefixSans, ...state.game.history({ verbose: false })];
    const viewed = Math.max(0, Math.min(hist.length, state.reviewPly ?? hist.length));
    if (viewed <= 0) {
      elements.statusText.textContent = 'White move';
      return;
    }
    const last = hist[viewed - 1];
    const rendered = formatSanForDisplay(last);
    elements.statusText.textContent = viewed % 2 === 0 ? `... ${rendered}` : rendered;
    return;
  }

  if (state.sessionMode === 'puzzle' && state.puzzle) {
    if (state.puzzle.solved) {
      elements.statusText.textContent = 'Puzzle solved.';
      return;
    }
    if (state.puzzleAutoPlaying) {
      elements.statusText.textContent = 'Showing full puzzle solution...';
      return;
    }
    elements.statusText.textContent = `${turn} to move`;
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
  elements.statusText.textContent = `${turn} to move`;
}

function updateVoiceUi() {
  const stickyOn = state.voiceMode && !state.voiceOneShot;
  const oneShotOn = state.voiceMode && state.voiceOneShot;
  elements.voiceStickyBtn.textContent = stickyOn ? 'Voice: On' : 'Voice: Off';
  elements.voiceStickyBtn.classList.toggle('is-on', stickyOn);
  elements.voiceOnceBtn.classList.toggle('is-on', oneShotOn);
  elements.voiceOnceBtn.textContent = oneShotOn ? 'Listen Once: On' : 'Listen Once';
  const hideMoveForm = state.sessionMode === 'blind-puzzles' && !shouldShowBlindMoveControls();
  elements.moveInputs.classList.toggle('voice-active', hideMoveForm);
  if (!state.voiceMode) {
    elements.voiceStatus.textContent = '';
  } else if (document.hidden) {
    elements.voiceStatus.textContent = 'Voice paused while app is in background.';
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
    const blindStructured = state.sessionMode === 'blind-puzzles'
      && (state.blindPuzzles.mode === 'position'
        || state.blindPuzzles.mode === 'game-drill'
        || isBlindMattingModeValue(state.blindPuzzles.mode));
    const gameDefault = state.sessionMode === 'game';
    elements.reviewNav.style.setProperty('margin-top', (blindStructured || gameDefault) ? '2.9rem' : '0.8rem', 'important');
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
  const inFollow = state.sessionMode === 'follow-game';
  const blindStructuredLastMove = isBlindStructuredLastMoveMode();
  const hideMain = inPuzzle;
  const beforeGameStart = state.sessionMode === 'game' && !state.gameStarted;
  const inBlindGame = inBlind && isBlindPlayableGameMode();
  const inGameDrill = inBlind && state.blindPuzzles.mode === 'game-drill';
  const inBlindVoiceControls = inBlind && shouldShowBlindVoiceControls();
  const inFollowQuiz = inFollow && isFollowQuizPlayable();
  const hideBelowSlider = state.hideBelowSliderOnStart && state.sessionMode === 'game';
  const allowMoveInput = !state.game.isGameOver()
    && !state.engineThinking
    && !(inFollowQuiz && state.followGame.quizEvaluating)
    && !isReviewLocked()
    && (state.sessionMode === 'puzzle'
      || state.sessionMode === 'game'
      || inBlindGame
      || inFollowQuiz)
    && (state.sessionMode !== 'game' || state.gameStarted)
    && (state.sessionMode === 'puzzle' || isUserTurn());
  elements.displayModeRow.hidden = hideMain;
  elements.displayModeRow.style.display = hideMain ? 'none' : '';
  const showBoardRevealRow = !inPuzzle && !inBlind;
  elements.boardRevealRow.hidden = !showBoardRevealRow;
  elements.boardRevealRow.style.display = showBoardRevealRow ? '' : 'none';
  const hideMoveInputs = beforeGameStart
    || hideBelowSlider
    || (inBlind && !inBlindVoiceControls)
    || (inFollow && !inFollowQuiz);
  elements.moveInputs.hidden = hideMoveInputs;
  elements.movesPanel.hidden = (inBlind && !inBlindGame) || hideBelowSlider;
  const hasLastMoveText = !!(elements.lastMoveText.textContent ?? '').trim();
  const gameDrillTotal = inGameDrill ? gameDrillTotalPlies() : 0;
  const gameDrillViewed = inGameDrill ? (state.reviewPly ?? gameDrillTotal) : 0;
  const gameDrillPrefixTotal = inGameDrill ? gameDrillPrefixMoves().length : 0;
  const blindHasPlayedMoves = blindStructuredLastMove
    && (inGameDrill
      ? gameDrillViewed > 0
      : state.game.history({ verbose: false }).length > 0);
  const forceShowLastMoveInGame = state.sessionMode === 'game'
    && (
      state.displayMode === 'no-board'
      || state.displayMode === 'no-pieces'
      || state.displayMode === 'white-only'
      || state.displayMode === 'black-only'
    );
  const showLastMoveRowInGame = state.sessionMode === 'game'
    && (forceShowLastMoveInGame || state.showLastMove)
    && hasLastMoveText;
  const showLastMoveRowInBlind = blindHasPlayedMoves && hasLastMoveText;
  const showLastMoveRow = showLastMoveRowInGame || showLastMoveRowInBlind;
  const canShowLastMoveRow = state.sessionMode === 'game' || blindStructuredLastMove;
  elements.lastMoveRow.hidden = !canShowLastMoveRow || hideBelowSlider || !showLastMoveRow;
  const gameDrillPauseVisible = inGameDrill
    && gameDrillPrefixTotal > 0
    && (
      state.blindPuzzles.gameDrillReplayPaused
      || !!state.blindPuzzles.gameDrillReplayTimerId
      || gameDrillViewed < gameDrillPrefixTotal
    );
  elements.gameDrillPauseBtn.hidden = !gameDrillPauseVisible;
  elements.gameDrillPauseBtn.disabled = !gameDrillPauseVisible;
  elements.gameDrillPauseBtn.textContent = state.blindPuzzles.gameDrillReplayPaused ? 'Resume' : 'Pause';
  const centerStatusNoLastMove = state.sessionMode === 'game' && !hideBelowSlider && elements.lastMoveRow.hidden;
  document.body.classList.toggle('center-status-no-lastmove', centerStatusNoLastMove);
  const newGamePending = state.sessionMode === 'game' && !state.gameStarted && !hideBelowSlider;
  document.body.classList.toggle('new-game-pending', newGamePending);
  const hideStatusForLastMove = !elements.lastMoveRow.hidden
    && (
      (state.sessionMode === 'game' && state.gameStarted && hasLastMoveText)
      || blindStructuredLastMove
    );
  elements.statusRow.hidden = hideBelowSlider || hideStatusForLastMove;
  document.body.classList.toggle('status-replaced-by-lastmove', !hideBelowSlider && hideStatusForLastMove);
}

function updateSquareColorControlsVisibility() {
  const squareColors = state.sessionMode === 'blind-puzzles'
    && state.blindPuzzles.mode === 'square-colors';
  const sameDiagonal = state.sessionMode === 'blind-puzzles'
    && state.blindPuzzles.mode === 'same-diagonal';
  const stopOnly = state.sessionMode === 'blind-puzzles'
    && (state.blindPuzzles.mode === 'check'
      || (state.blindPuzzles.mode === 'movements'
        && state.blindPuzzles.movementPiece === 'N'
        && state.blindPuzzles.movementVariant !== 'route'));
  const visible = (squareColors || sameDiagonal || stopOnly) && !elements.statusRow.hidden;
  elements.squareColorControls.hidden = !visible;
  elements.squareColorWhiteBtn.hidden = !squareColors;
  elements.squareColorBlackBtn.hidden = !squareColors;
  elements.sameDiagonalYesBtn.hidden = !sameDiagonal;
  elements.sameDiagonalNoBtn.hidden = !sameDiagonal;
  elements.blindStopBtn.hidden = !stopOnly;
  const enabled = visible && state.blindPuzzles.running;
  elements.squareColorWhiteBtn.disabled = !enabled || !squareColors;
  elements.squareColorBlackBtn.disabled = !enabled || !squareColors;
  elements.sameDiagonalYesBtn.disabled = !enabled || !sameDiagonal;
  elements.sameDiagonalNoBtn.disabled = !enabled || !sameDiagonal;
  elements.blindStopBtn.disabled = !enabled || !stopOnly;
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

function playTtsSample() {
  if (typeof speechSynthesis === 'undefined') {
    elements.statusText.textContent = 'TTS is not supported in this browser.';
    return;
  }
  if (state.speaking) {
    cancelTtsPlayback();
  }
  const sampleSans = [
    'e4', 'd4', 'c4', 'Nf3', 'Nc3', 'Bb5', 'Bc4', 'Qh5', 'Qxa3', 'Ng5',
    'exf4', 'dxe5', 'Rxa7', 'Bxh7+', 'Qe2', 'O-O', 'O-O-O'
  ];
  const spokenMoves = [];
  let prevSan = '';
  for (let i = 0; i < 6; i += 1) {
    let san = sampleSans[Math.floor(Math.random() * sampleSans.length)];
    if (sampleSans.length > 1 && san === prevSan) {
      san = sampleSans[(sampleSans.indexOf(san) + 1) % sampleSans.length];
    }
    prevSan = san;
    const spoken = state.moveLanguage === 'pl' ? sanToPolishSpeech(san) : sanToEnglishSpeech(san);
    if (spoken) {
      spokenMoves.push(spoken);
    }
  }
  if (!spokenMoves.length) {
    return;
  }
  const lang = state.moveLanguage === 'pl' ? 'pl-PL' : 'en-US';
  speakTtsSequence(spokenMoves, lang);
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
  if (state.speaking) {
    cancelTtsPlayback();
  }
  elements.configModal.hidden = true;
}

function clearVoiceRestartTimer() {
  if (voiceState.restartTimerId === null) {
    return;
  }
  window.clearTimeout(voiceState.restartTimerId);
  voiceState.restartTimerId = null;
}

function clearVoiceStartWatchdog() {
  if (voiceState.startWatchdogId === null) {
    return;
  }
  window.clearTimeout(voiceState.startWatchdogId);
  voiceState.startWatchdogId = null;
}

function clearVoiceScheduledWork() {
  clearVoiceRestartTimer();
  clearVoiceStartWatchdog();
  voiceState.startAttemptId += 1;
}

function destroyVoiceRecognition({ abortActive = true } = {}) {
  clearVoiceScheduledWork();
  voiceState.startLock = false;
  const recognition = voiceState.recognition;
  if (recognition) {
    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    if (abortActive) {
      try {
        if (typeof recognition.abort === 'function') {
          recognition.abort();
        } else {
          recognition.stop();
        }
      } catch (_error) {
        // ignore teardown failures
      }
    }
  }
  voiceState.recognition = null;
  state.voiceListening = false;
}

function scheduleVoiceListeningRestart(delayMs = 180) {
  clearVoiceRestartTimer();
  if (!state.voiceMode) {
    return;
  }
  const waitMs = Math.max(60, Math.floor(Number(delayMs) || 0));
  voiceState.restartTimerId = window.setTimeout(() => {
    voiceState.restartTimerId = null;
    startVoiceListening();
  }, waitMs);
}

function ensureVoiceRecognition() {
  if (voiceState.forceRecreateOnNextStart) {
    destroyVoiceRecognition();
    voiceState.forceRecreateOnNextStart = false;
  }
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
    clearVoiceStartWatchdog();
    state.voiceListening = true;
    voiceState.consecutiveFailures = 0;
    elements.voiceStatus.textContent = 'Listening...';
    updateVoiceUi();
  };

  recognition.onresult = (event) => {
    if (!canListenToVoiceNow()) {
      return;
    }
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    if (handleBlindPuzzleVoice(transcript)) {
      elements.voiceStatus.textContent = `Heard: ${transcript}`;
      return;
    }
    const mappedVoiceMove = normalizeVoiceMoveForHandling(transcript);
    const heardText = mappedVoiceMove.display || transcript;
    elements.voiceStatus.textContent = `Heard: ${heardText}`;
    if (state.sessionMode === 'blind-puzzles' && !isBlindPlayableGameMode()) {
      elements.statusText.textContent = 'Select a blind puzzle mode first.';
      return;
    }
    const ok = applyPlayerMove(mappedVoiceMove.input || transcript);
    if (!ok) {
      elements.statusText.textContent = `Could not parse voice move: ${heardText}`;
      return;
    }
    if (state.voiceOneShot) {
      state.voiceOneShot = false;
      setVoiceMode(false);
    }
  };

  recognition.onerror = (event) => {
    clearVoiceStartWatchdog();
    state.voiceListening = false;
    const errorCode = String(event?.error ?? '');
    if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
      elements.statusText.textContent = 'Microphone permission denied. Enable it in browser settings.';
      setVoiceMode(false);
      return;
    }
    if (errorCode === 'aborted' && !canListenToVoiceNow()) {
      updateVoiceUi();
      return;
    }
    if (state.voiceMode) {
      voiceState.consecutiveFailures += 1;
      if (voiceState.consecutiveFailures >= 2) {
        voiceState.forceRecreateOnNextStart = true;
      }
      elements.voiceStatus.textContent = 'Voice recognition error. Retrying...';
    } else {
      elements.voiceStatus.textContent = 'Voice recognition stopped.';
    }
  };

  recognition.onend = () => {
    clearVoiceStartWatchdog();
    state.voiceListening = false;
    updateVoiceUi();
    if (!state.voiceMode) {
      return;
    }
    if (voiceState.forceRecreateOnNextStart || voiceState.consecutiveFailures >= 2) {
      destroyVoiceRecognition({ abortActive: false });
      voiceState.forceRecreateOnNextStart = false;
    }
    const delayMs = Math.min(1500, 180 + (voiceState.consecutiveFailures * 220));
    scheduleVoiceListeningRestart(delayMs);
  };

  voiceState.recognition = recognition;
  return recognition;
}

function startVoiceListening() {
  clearVoiceRestartTimer();
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
  const attemptId = ++voiceState.startAttemptId;
  clearVoiceStartWatchdog();
  voiceState.startWatchdogId = window.setTimeout(() => {
    voiceState.startWatchdogId = null;
    if (!state.voiceMode || state.voiceListening || attemptId !== voiceState.startAttemptId) {
      return;
    }
    voiceState.consecutiveFailures += 1;
    voiceState.forceRecreateOnNextStart = true;
    elements.voiceStatus.textContent = 'Voice did not start. Retrying...';
    updateVoiceUi();
    destroyVoiceRecognition();
    const retryMs = Math.min(1600, 260 + (voiceState.consecutiveFailures * 240));
    scheduleVoiceListeningRestart(retryMs);
  }, 2200);

  voiceState.startLock = true;
  try {
    recognition.start();
  } catch (error) {
    clearVoiceStartWatchdog();
    const errorName = String(error?.name ?? '');
    const alreadyActive = errorName === 'InvalidStateError' && state.voiceListening;
    if (!alreadyActive) {
      voiceState.consecutiveFailures += 1;
      voiceState.forceRecreateOnNextStart = true;
      elements.voiceStatus.textContent = 'Voice failed to start. Retrying...';
      updateVoiceUi();
      destroyVoiceRecognition();
      const retryMs = Math.min(1600, 240 + (voiceState.consecutiveFailures * 220));
      scheduleVoiceListeningRestart(retryMs);
    }
  } finally {
    window.setTimeout(() => {
      voiceState.startLock = false;
    }, 220);
  }
}

function stopVoiceListening({ hardReset = false } = {}) {
  clearVoiceScheduledWork();
  if (hardReset) {
    destroyVoiceRecognition();
    voiceState.consecutiveFailures = 0;
    voiceState.forceRecreateOnNextStart = false;
    return;
  }
  const recognition = voiceState.recognition;
  if (!recognition) {
    state.voiceListening = false;
    return;
  }
  try {
    recognition.stop();
  } catch (_error) {
    // ignore stop failures
  }
  state.voiceListening = false;
}

function setVoiceMode(enabled) {
  const wasEnabled = state.voiceMode;
  state.voiceMode = enabled;
  if (!enabled) {
    state.voiceOneShot = false;
  }
  if (enabled) {
    if (!wasEnabled) {
      voiceState.forceRecreateOnNextStart = true;
      voiceState.consecutiveFailures = 0;
    }
    refreshVoiceListeningState();
  } else {
    stopVoiceListening({ hardReset: true });
  }
  updateVoiceUi();
}

function isWaitingForComputerMove() {
  if (state.sessionMode === 'follow-game') {
    return isFollowQuizAutoTurn() || state.followGame.quizEvaluating;
  }
  if (state.sessionMode !== 'game' && !isBlindPlayableGameMode()) {
    return false;
  }
  if (state.game.isGameOver()) {
    return false;
  }
  return state.engineThinking || !isUserTurn();
}

function canListenToVoiceNow() {
  return state.voiceMode && !isWaitingForComputerMove() && !state.speaking && !document.hidden;
}

function refreshVoiceListeningState() {
  if (!state.voiceMode) {
    stopVoiceListening({ hardReset: true });
    updateVoiceUi();
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
  updateFollowPanel();
  updateBlindPanel();
  updateMainControlsVisibility();
  updateSquareColorControlsVisibility();
  syncMovesVisibilityUi();
  updateReviewControls();
  applyRuntimeLayoutOverrides();
  updateStatus();
  refreshVoiceListeningState();
}

function resetGame() {
  resetBlindPuzzleSession();
  clearBlindClickSelection();
  elements.moveInput.value = '';
  if (state.prePuzzleDisplayMode !== null) {
    state.displayMode = state.prePuzzleDisplayMode;
    state.prePuzzleDisplayMode = null;
  }
  state.sessionMode = 'game';
  state.puzzle = null;
  state.puzzleRevealPrevView = null;
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
  const inputText = elements.moveInput.value.trim();
  if (state.sessionMode === 'game' && !state.gameStarted) {
    elements.statusText.textContent = 'Press New Game to start.';
    elements.moveInput.value = '';
    return;
  }
  if (isBlindAnswerEntryMode()) {
    const handled = handleBlindPuzzleVoice(inputText);
    if (!handled) {
      elements.statusText.textContent = state.blindPuzzles.running
        ? ((state.blindPuzzles.mode === 'movements')
          && state.blindPuzzles.movementVariant === 'route'
          ? 'Enter route squares like c1 e3 g5.'
          : 'Enter squares like a1 h8 (and stop where needed).')
        : 'This puzzle is finished. Start a new one.';
    }
    elements.moveInput.value = '';
    elements.moveInput.focus();
    return;
  }
  const ok = applyPlayerMove(inputText);
  if (!ok && state.sessionMode !== 'puzzle' && state.sessionMode !== 'follow-game') {
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
  updateMainControlsVisibility();
});

elements.boardReveal.addEventListener('input', () => {
  const value = Number(elements.boardReveal.value);
  const bounded = Number.isFinite(value)
    ? Math.max(BOARD_REVEAL_MIN, Math.min(BOARD_REVEAL_NEVER, Math.floor(value)))
    : BOARD_REVEAL_MIN;
  state.boardRevealEvery = bounded;
  elements.boardReveal.value = String(bounded);
  elements.boardRevealValue.textContent = formatBoardRevealLabel(bounded);
  writeSettings();
  if (state.sessionMode === 'game') {
    updateBoard();
  }
});

elements.moveLanguage.addEventListener('change', () => {
  state.moveLanguage = elements.moveLanguage.value;
  updateMoveInputPlaceholder();
  syncMoveAssistPieces();
  populateTtsVoices();
  writeSettings();
  updateMovesList();
  updateLastMove();
  updatePuzzlePanel();
  if (state.voiceMode) {
    stopVoiceListening({ hardReset: true });
    scheduleVoiceListeningRestart(180);
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

elements.showCoordinates.addEventListener('change', () => {
  state.showCoordinates = elements.showCoordinates.checked;
  updateBoard();
  writeSettings();
});

elements.showLastMove.addEventListener('change', () => {
  state.showLastMove = elements.showLastMove.checked;
  updateMainControlsVisibility();
  writeSettings();
});

elements.showMoveMarks.addEventListener('change', () => {
  state.showMoveMarks = elements.showMoveMarks.checked;
  clearBlindClickSelection();
  updateBoard();
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

elements.ttsVoice.addEventListener('change', () => {
  state.ttsVoiceUri = elements.ttsVoice.value;
  writeSettings();
});

elements.ttsRate.addEventListener('input', () => {
  const value = Number(elements.ttsRate.value);
  const bounded = Number.isFinite(value) ? Math.max(0.1, Math.min(1.5, value)) : 1;
  state.ttsRate = bounded;
  elements.ttsRate.value = String(bounded);
  elements.ttsRateValue.textContent = `${bounded.toFixed(1)}x`;
  writeSettings();
});

elements.ttsMovePause.addEventListener('input', () => {
  const value = Number(elements.ttsMovePause.value);
  const bounded = Number.isFinite(value)
    ? Math.max(0, Math.min(5000, Math.round(value / 250) * 250))
    : 250;
  state.ttsMovePauseMs = bounded;
  elements.ttsMovePause.value = String(bounded);
  elements.ttsMovePauseValue.textContent = `${bounded} ms`;
  writeSettings();
});

elements.ttsSampleBtn.addEventListener('click', () => {
  playTtsSample();
});

elements.speakCheck.addEventListener('change', () => {
  state.speakCheck = elements.speakCheck.checked;
  writeSettings();
});

elements.voiceOnOtherPuzzles.addEventListener('change', () => {
  state.voiceOnOtherPuzzles = elements.voiceOnOtherPuzzles.checked;
  writeSettings();
});

elements.puzzleAutoOpponent.addEventListener('change', () => {
  state.puzzleAutoOpponent = elements.puzzleAutoOpponent.checked;
  writeSettings();
});

elements.puzzleFixedOrientation.addEventListener('change', () => {
  state.puzzleFixedOrientation = elements.puzzleFixedOrientation.checked;
  if (state.puzzleFixedOrientation && state.sessionMode === 'puzzle') {
    state.boardOrientation = 'white';
    clearBlindClickSelection();
    updateBoard();
  }
  writeSettings();
});

elements.puzzleDifficulty.addEventListener('change', () => {
  state.puzzleDifficulty = elements.puzzleDifficulty.value;
  writeSettings();
});

elements.blindQuestionCount.addEventListener('input', () => {
  const value = Number(elements.blindQuestionCount.value);
  const bounded = Number.isFinite(value) ? Math.max(1, Math.min(30, Math.floor(value))) : 25;
  state.blindQuestionCount = bounded;
  elements.blindQuestionCount.value = String(bounded);
  elements.blindQuestionCountValue.textContent = String(bounded);
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
    cancelTtsPlayback();
  }
  writeSettings();
});

elements.puzzleBacktrack.addEventListener('input', () => {
  const value = Number(elements.puzzleBacktrack.value);
  const bounded = Number.isFinite(value)
    ? Math.max(1, Math.min(32, Math.floor(value)))
    : 2;
  state.puzzleBacktrack = bounded;
  elements.puzzleBacktrack.value = String(bounded);
  elements.puzzleBacktrackValue.textContent = String(bounded);
  writeSettings();
});

elements.positionRecallPieces.addEventListener('input', () => {
  const value = Number(elements.positionRecallPieces.value);
  const bounded = Number.isFinite(value) ? Math.max(2, Math.min(32, Math.floor(value))) : 8;
  state.positionRecallPieces = bounded;
  elements.positionRecallPieces.value = String(bounded);
  elements.positionRecallPiecesValue.textContent = String(bounded);
  writeSettings();
});

elements.positionRecallShowSec.addEventListener('input', () => {
  const value = Number(elements.positionRecallShowSec.value);
  const bounded = Number.isFinite(value) ? Math.max(1, Math.min(20, Math.floor(value))) : 5;
  state.positionRecallShowSec = bounded;
  elements.positionRecallShowSec.value = String(bounded);
  elements.positionRecallShowSecValue.textContent = String(bounded);
  writeSettings();
});

elements.positionRecallHideSec.addEventListener('input', () => {
  const value = Number(elements.positionRecallHideSec.value);
  const bounded = Number.isFinite(value) ? Math.max(1, Math.min(20, Math.floor(value))) : 3;
  state.positionRecallHideSec = bounded;
  elements.positionRecallHideSec.value = String(bounded);
  elements.positionRecallHideSecValue.textContent = String(bounded);
  writeSettings();
});

for (const button of mattingTypeButtons) {
  button.addEventListener('click', () => {
    const key = button.dataset.mattingType ?? '';
    if (!MATTING_TYPE_KEYS.includes(key)) {
      return;
    }
    const next = { ...normalizeMattingTypes(state.mattingTypes) };
    const currentlyOn = !!next[key];
    const enabledCount = MATTING_TYPE_KEYS.reduce((acc, typeKey) => acc + (next[typeKey] ? 1 : 0), 0);
    if (currentlyOn && enabledCount <= 1) {
      return;
    }
    next[key] = !currentlyOn;
    state.mattingTypes = normalizeMattingTypes(next);
    syncMattingTypeButtons();
    writeSettings();
  });
}

async function requestStockfishMultiPv({ fen, moveTime, multipv = 5 }) {
  await waitForStockfishReady();

  if (stockfishState.pending) {
    stockfishState.worker.postMessage('stop');
    stockfishState.pending.reject(new Error('Engine request replaced by newer one'));
    stockfishState.pending = null;
  }

  return new Promise((resolve, reject) => {
    const pending = {
      mode: 'multipv',
      resolve,
      reject,
      entries: new Map()
    };
    stockfishState.pending = pending;

    const timeout = window.setTimeout(() => {
      if (stockfishState.pending === pending) {
        stockfishState.pending = null;
        reject(new Error('Stockfish multipv timed out'));
      }
    }, Math.max(2500, moveTime * 12));

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

    const pvCount = Math.max(1, Math.min(8, Math.floor(Number(multipv) || 1)));
    stockfishState.worker.postMessage('ucinewgame');
    stockfishState.worker.postMessage('setoption name Skill Level value 20');
    stockfishState.worker.postMessage(`setoption name MultiPV value ${pvCount}`);
    stockfishState.worker.postMessage('setoption name UCI_LimitStrength value false');
    stockfishState.worker.postMessage(`position fen ${fen}`);
    stockfishState.worker.postMessage(`go movetime ${moveTime}`);
  });
}

async function classifyFollowQuizMoveWithStockfish(fen, guessedUci) {
  try {
    const analysis = await requestStockfishMultiPv({ fen, moveTime: 350, multipv: 6 });
    const list = Array.isArray(analysis?.multipvMoves) ? analysis.multipvMoves : [];
    const best = list[0];
    const guessed = list.find((entry) => entry?.uci === guessedUci);
    if (!best || !guessed) {
      return 'bad';
    }
    const diff = stockfishScoreToCp(best.score) - stockfishScoreToCp(guessed.score);
    return diff <= 120 ? 'good' : 'bad';
  } catch (_error) {
    return 'bad';
  }
}

for (const button of movementModeButtons) {
  button.addEventListener('click', () => {
    const key = button.dataset.movementMode ?? '';
    if (!MOVEMENT_MODE_KEYS.includes(key)) {
      return;
    }
    const next = { ...normalizeMovementModes(state.movementModes) };
    const currentlyOn = !!next[key];
    const enabledCount = MOVEMENT_MODE_KEYS.reduce((acc, modeKey) => acc + (next[modeKey] ? 1 : 0), 0);
    if (currentlyOn && enabledCount <= 1) {
      return;
    }
    next[key] = !currentlyOn;
    state.movementModes = normalizeMovementModes(next);
    syncMovementModeButtons();
    writeSettings();
  });
}

for (const button of movementPieceButtons) {
  button.addEventListener('click', () => {
    const key = button.dataset.movementPiece ?? '';
    if (!MOVEMENT_PIECE_KEYS.includes(key)) {
      return;
    }
    const next = { ...normalizeMovementPieces(state.movementPieces) };
    const currentlyOn = !!next[key];
    const enabledCount = MOVEMENT_PIECE_KEYS.reduce((acc, pieceKey) => acc + (next[pieceKey] ? 1 : 0), 0);
    if (currentlyOn && enabledCount <= 1) {
      return;
    }
    next[key] = !currentlyOn;
    state.movementPieces = normalizeMovementPieces(next);
    syncMovementPieceButtons();
    writeSettings();
  });
}

function syncMovesVisibilityUi() {
  elements.movesWrap.style.display = state.movesVisible ? 'block' : 'none';
  elements.toggleMovesBtn.hidden = false;
  const label = state.movesVisible ? 'Hide moves' : 'Show moves';
  elements.toggleMovesBtn.setAttribute('aria-label', label);
  elements.toggleMovesBtn.title = label;
  elements.toggleMovesBtn.classList.toggle('is-on', state.movesVisible);
}

elements.toggleMovesBtn.addEventListener('click', () => {
  state.movesVisible = !state.movesVisible;
  syncMovesVisibilityUi();
});

elements.revealBtn.addEventListener('click', () => {
  if (state.sessionMode === 'puzzle' && state.puzzle) {
    if (!state.revealPosition) {
      state.puzzleRevealPrevView = state.puzzleViewIndex;
      state.revealPosition = true;
      state.puzzleViewIndex = state.puzzle.startPly;
      if (!syncPuzzleGameToView()) {
        elements.statusText.textContent = 'Cannot show puzzle start position.';
        state.revealPosition = false;
        state.puzzleViewIndex = state.puzzleRevealPrevView ?? puzzleProgressAbsPly();
        state.puzzleRevealPrevView = null;
      }
      updateAll();
      return;
    }
    state.revealPosition = false;
    state.puzzleViewIndex = Number.isInteger(state.puzzleRevealPrevView)
      ? state.puzzleRevealPrevView
      : puzzleProgressAbsPly();
    state.puzzleRevealPrevView = null;
    if (!syncPuzzleGameToView()) {
      elements.statusText.textContent = 'Cannot restore puzzle view.';
    }
    updateAll();
    return;
  }
  state.revealPosition = !state.revealPosition;
  clearBlindClickSelection();
  updateBoard();
});

elements.rotateBoardBtn.addEventListener('click', () => {
  if (state.sessionMode === 'puzzle' && state.puzzleFixedOrientation) {
    state.boardOrientation = 'white';
    clearBlindClickSelection();
    updateBoard();
    return;
  }
  state.boardOrientation = state.boardOrientation === 'white' ? 'black' : 'white';
  clearBlindClickSelection();
  updateBoard();
});

elements.newGameBtn.addEventListener('click', resetGame);
elements.followGameBtn.addEventListener('click', () => {
  startFollowGame();
});
elements.followGameSelect.addEventListener('change', () => {
  state.followGame.selectedId = elements.followGameSelect.value;
});
elements.followLoadBtn.addEventListener('click', () => {
  loadSelectedFollowGame();
});
elements.followRandomBtn.addEventListener('click', () => {
  loadRandomFollowGame();
});
elements.followUploadBtn.addEventListener('click', () => {
  elements.followUploadInput.click();
});
elements.followUploadInput.addEventListener('change', async () => {
  const input = elements.followUploadInput;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  try {
    const text = await file.text();
    const parsed = parseUploadedFollowGames(text, file.name || 'Uploaded PGN');
    if (!parsed.length) {
      elements.statusText.textContent = 'Could not parse uploaded PGN file.';
      return;
    }
    state.followGame.games = [...state.followGame.games, ...parsed];
    state.followGame.selectedId = String(parsed[0].id);
    loadSelectedFollowGame();
    elements.statusText.textContent = `Added ${parsed.length} uploaded game(s).`;
  } catch (_error) {
    elements.statusText.textContent = 'Failed to read uploaded PGN file.';
  } finally {
    input.value = '';
    updateFollowPanel();
  }
});
for (const button of followModeButtons) {
  button.addEventListener('click', () => {
    const mode = normalizeFollowMode(button.dataset.followMode ?? 'browse');
    if (mode === 'quiz') {
      setFollowMode(state.followGame.mode === 'quiz' ? 'browse' : 'quiz');
      return;
    }
    setFollowMode(mode);
  });
}
elements.followQuizAutoColor.addEventListener('change', () => {
  state.followGame.quizAutoColor = ['none', 'white', 'black'].includes(elements.followQuizAutoColor.value)
    ? elements.followQuizAutoColor.value
    : 'none';
  if (isFollowQuizPlayable()) {
    followQuizAutoplayIfNeeded();
    updateAll();
  } else {
    updateFollowPanel();
  }
});
elements.followQuizStart.addEventListener('input', () => {
  const value = Number(elements.followQuizStart.value);
  const totalMoves = Math.max(1, followTotalMoves());
  const bounded = Number.isFinite(value) ? Math.max(1, Math.min(totalMoves, Math.floor(value))) : 1;
  state.followGame.quizStartMove = bounded;
  elements.followQuizStart.value = String(bounded);
  elements.followQuizStartValue.textContent = String(bounded);
  if (state.followGame.mode === 'quiz') {
    state.followGame.quizActive = false;
    state.followGame.quizFeedback = '';
    resetFollowForCurrentSelection({ autoAdvanceBrowse: false });
  }
});
elements.followRestartBtn.addEventListener('click', () => {
  restartFollowCurrent();
});
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
elements.blindSameDiagonalBtn.addEventListener('click', () => {
  startSameDiagonalPuzzle();
});
elements.blindMovementsBtn.addEventListener('click', () => {
  startMovementsPuzzle();
});
elements.blindCheckBtn.addEventListener('click', () => {
  startCheckPuzzle();
});
elements.blindMatingBtn.addEventListener('click', () => {
  startMattingPuzzle();
});
elements.blindPositionRecallBtn.addEventListener('click', () => {
  startPositionRecallPuzzle();
});
elements.squareColorWhiteBtn.addEventListener('click', () => {
  applySquareColorAnswer('biale');
});
elements.squareColorBlackBtn.addEventListener('click', () => {
  applySquareColorAnswer('czarne');
});
elements.sameDiagonalYesBtn.addEventListener('click', () => {
  applySameDiagonalAnswer('yes');
});
elements.sameDiagonalNoBtn.addEventListener('click', () => {
  applySameDiagonalAnswer('no');
});
elements.blindStopBtn.addEventListener('click', () => {
  submitBlindStop();
});
elements.gameDrillPauseBtn.addEventListener('click', () => {
  toggleGameDrillReplayPause();
});
elements.followNextBtn.addEventListener('click', () => {
  advanceFollowGameChunk();
});
elements.showSolutionBtn.addEventListener('click', showPuzzleSolution);
installLongPressAction(elements.reviewPrevBtn, reviewStepBack, reviewJumpFirst);
installLongPressAction(elements.reviewNextBtn, reviewStepForward, reviewJumpLast);
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
  stopVoiceListening({ hardReset: true });
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

window.addEventListener('visibilitychange', () => {
  if (!state.voiceMode) {
    return;
  }
  if (document.hidden) {
    stopVoiceListening({ hardReset: true });
    updateVoiceUi();
    return;
  }
  voiceState.forceRecreateOnNextStart = true;
  scheduleVoiceListeningRestart(180);
  updateVoiceUi();
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

if (typeof speechSynthesis !== 'undefined') {
  if (typeof speechSynthesis.addEventListener === 'function') {
    speechSynthesis.addEventListener('voiceschanged', populateTtsVoices);
  } else {
    speechSynthesis.onvoiceschanged = populateTtsVoices;
  }
}

elements.voiceOnceBtn.addEventListener('click', () => {
  const oneShotOn = state.voiceMode && state.voiceOneShot;
  if (oneShotOn) {
    setVoiceMode(false);
    return;
  }
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

async function bootstrapApp() {
  await hydratePersistentStorage();
  ensureStockfishWorker();
  state.positionExercises = buildPositionExercises();
  state.positionSolved = readSolvedPositions();
  state.gameExercises = buildGameExercises();
  state.followGame.games = buildFollowGames();
  state.followGame.selectedId = state.followGame.games.length ? String(state.followGame.games[0].id) : '';
  state.gameSolved = readSolvedGames();
  state.squareColorStats = readSquareColorStats();
  state.squareColorRecords = readSquareColorRecords();
  loadSettingsIntoState();
  populateTtsVoices();
  syncEngineControlUi();
  applySettingsToUi();
  updateMoveInputPlaceholder();
  syncMoveAssistPieces();
  updateVoiceUi();
  syncMovesVisibilityUi();
  syncMoveInputMode();
  updateAll();
  window.setTimeout(blurAnyFocusedInput, 0);
}

void bootstrapApp();
