import './voice-test.css';

const SETTINGS_KEY = 'blindfold_chess_settings_v1';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="voice-test-shell">
    <section class="voice-test-card">
      <div class="voice-test-head">
        <div>
          <p class="voice-test-kicker">Blindfold Chess Trainer</p>
          <h1>Voice Input Test</h1>
        </div>
        <label class="voice-test-language">
          Language
          <select id="languageSelect">
            <option value="pl">Polish Notation</option>
            <option value="en">English Notation</option>
          </select>
        </label>
      </div>

      <div class="voice-test-actions">
        <button id="startBtn" type="button">Start Listening</button>
        <button id="stopBtn" type="button">Stop</button>
        <button id="clearBtn" type="button">Clear</button>
      </div>

      <p id="statusText" class="voice-test-status">Ready.</p>

      <section class="voice-test-panel voice-test-panel-primary" aria-live="polite">
        <span class="voice-test-label">Recognized move</span>
        <div id="heardMove" class="voice-test-move">-</div>
      </section>

      <section class="voice-test-grid">
        <article class="voice-test-panel">
          <span class="voice-test-label">Raw transcript</span>
          <div id="rawTranscript" class="voice-test-text">-</div>
        </article>
        <article class="voice-test-panel">
          <span class="voice-test-label">Normalized preview</span>
          <div id="normalizedTranscript" class="voice-test-text">-</div>
        </article>
      </section>

      <section class="voice-test-panel">
        <span class="voice-test-label">Recent results</span>
        <div id="history" class="voice-test-history">
          <div class="voice-test-history-empty">No voice input yet.</div>
        </div>
      </section>
    </section>
  </main>
`;

const elements = {
  languageSelect: document.getElementById('languageSelect'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  clearBtn: document.getElementById('clearBtn'),
  statusText: document.getElementById('statusText'),
  heardMove: document.getElementById('heardMove'),
  rawTranscript: document.getElementById('rawTranscript'),
  normalizedTranscript: document.getElementById('normalizedTranscript'),
  history: document.getElementById('history')
};

const voiceState = {
  recognition: null,
  listening: false,
  pendingRestartId: null,
  history: [],
  closedByUser: false
};

const params = new URLSearchParams(window.location.search);
const initialSettings = readSavedSettings();
const initialLanguage = resolveInitialLanguage(initialSettings);

elements.languageSelect.value = initialLanguage;

function readSavedSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null');
  } catch (_error) {
    // ignore invalid saved settings
    return null;
  }
}

function resolveInitialLanguage(savedSettings) {
  const lang = params.get('lang');
  if (lang === 'pl' || lang === 'en') {
    return lang;
  }
  if (savedSettings?.moveLanguage === 'pl' || savedSettings?.moveLanguage === 'en') {
    return savedSettings.moveLanguage;
  }
  return 'pl';
}

function useFigurineNotation() {
  const forced = params.get('figurines');
  if (forced === '1') {
    return true;
  }
  if (forced === '0') {
    return false;
  }
  return readSavedSettings()?.figurineNotation !== false;
}

function normalizeVoiceText(raw) {
  return String(raw ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMovePreview(raw, lang) {
  let text = normalizeVoiceText(raw);
  if (!text) {
    return '';
  }

  text = text
    .replace(/\bkrolowa\b/g, 'hetman')
    .replace(/\bkrol\b/g, 'krol')
    .replace(/\bwieza\b/g, 'wieza')
    .replace(/\bgoniec\b/g, 'goniec')
    .replace(/\bskoczek\b/g, 'skoczek')
    .replace(/\bkon\b/g, 'kon')
    .replace(/\bknight\b/g, 'knight')
    .replace(/\bbishop\b/g, 'bishop')
    .replace(/\brook\b/g, 'rook')
    .replace(/\bqueen\b/g, 'queen')
    .replace(/\bking\b/g, 'king')
    .replace(/\blong castle\b/g, 'o-o-o')
    .replace(/\bshort castle\b/g, 'o-o')
    .replace(/\bcastle long\b/g, 'o-o-o')
    .replace(/\bcastle short\b/g, 'o-o')
    .replace(/\brokada dluga\b/g, 'o-o-o')
    .replace(/\brokada krotka\b/g, 'o-o')
    .replace(/\brokada\b/g, 'o-o')
    .replace(/\b0-0-0\b/g, 'o-o-o')
    .replace(/\b0-0\b/g, 'o-o');

  const figureMap = lang === 'pl'
    ? [
        [/\bhetman\b/g, 'H'],
        [/\bkrol\b/g, 'K'],
        [/\bwieza\b/g, 'W'],
        [/\bgoniec\b/g, 'G'],
        [/\bskoczek\b/g, 'S'],
        [/\bkon\b/g, 'S']
      ]
    : [
        [/\bqueen\b/g, 'Q'],
        [/\bking\b/g, 'K'],
        [/\brook\b/g, 'R'],
        [/\bbishop\b/g, 'B'],
        [/\bknight\b/g, 'N']
      ];

  for (const [pattern, replacement] of figureMap) {
    text = text.replace(pattern, replacement);
  }

  const compact = text
    .replace(/\bna\b/g, '')
    .replace(/\bto\b/g, '')
    .replace(/\btakes\b/g, 'x')
    .replace(/\bbije\b/g, 'x')
    .replace(/\s*x\s*/g, 'x')
    .replace(/\s+/g, '')
    .replace(/^o-o-o$/i, 'O-O-O')
    .replace(/^o-o$/i, 'O-O');
  return compact;
}

function formatMovePreviewForDisplay(normalized, lang) {
  if (!normalized) {
    return '';
  }
  const pawnCaptureWithTarget = normalized.match(/^([a-h])([a-h][1-8](?:=[qrbnhwgs])?[+#]?)$/);
  if (pawnCaptureWithTarget) {
    return `${pawnCaptureWithTarget[1].toLowerCase()}x${pawnCaptureWithTarget[2].toLowerCase()}`;
  }
  if (/^[a-h]x?[a-h]$/.test(normalized)) {
    return normalized.toLowerCase();
  }
  if (/^[a-h](?:x?[a-h][1-8]|[a-h][1-8]|[1-8])(?:=[qrbnhwgs])?[+#]?$/.test(normalized)) {
    return normalized.toLowerCase();
  }
  if (!useFigurineNotation()) {
    return normalized;
  }

  const pieceMap = lang === 'pl'
    ? { K: '♔', H: '♕', W: '♖', G: '♗', S: '♘' }
    : { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘' };

  return normalized
    .replace(/^([KHWGSQRBN])/, (match, piece) => pieceMap[piece] ?? match)
    .replace(/=([KHWGSQRBN])/g, (match, piece) => `=${pieceMap[piece] ?? piece}`);
}

function setStatus(text) {
  elements.statusText.textContent = text;
}

function updateListeningUi() {
  elements.startBtn.disabled = voiceState.listening;
  elements.stopBtn.disabled = !voiceState.listening && !voiceState.recognition;
  document.body.classList.toggle('is-listening', voiceState.listening);
}

function renderHistory() {
  if (!voiceState.history.length) {
    elements.history.innerHTML = '<div class="voice-test-history-empty">No voice input yet.</div>';
    return;
  }
  elements.history.innerHTML = voiceState.history
    .map((entry) => `
      <div class="voice-test-history-row">
        <span class="voice-test-history-move">${entry.move}</span>
        <span class="voice-test-history-raw">${entry.raw}</span>
      </div>
    `)
    .join('');
}

function clearPendingRestart() {
  if (voiceState.pendingRestartId !== null) {
    window.clearTimeout(voiceState.pendingRestartId);
    voiceState.pendingRestartId = null;
  }
}

function clearOutput() {
  elements.heardMove.textContent = '-';
  elements.rawTranscript.textContent = '-';
  elements.normalizedTranscript.textContent = '-';
  voiceState.history = [];
  renderHistory();
  setStatus('Ready.');
}

function getRecognition() {
  if (voiceState.recognition) {
    return voiceState.recognition;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    voiceState.listening = true;
    updateListeningUi();
    setStatus('Listening...');
  };

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result?.[0]?.transcript?.trim() ?? '';
    if (!transcript) {
      return;
    }

    const normalized = normalizeMovePreview(transcript, elements.languageSelect.value);
    const displayMove = formatMovePreviewForDisplay(normalized, elements.languageSelect.value) || transcript;
    elements.heardMove.textContent = displayMove;
    elements.rawTranscript.textContent = transcript;
    elements.normalizedTranscript.textContent = displayMove || '(no move normalization)';

    voiceState.history.unshift({
      move: displayMove || transcript,
      raw: transcript
    });
    voiceState.history = voiceState.history.slice(0, 8);
    renderHistory();
    setStatus('Move captured.');
  };

  recognition.onerror = (event) => {
    const errorCode = String(event?.error ?? '');
    voiceState.listening = false;
    updateListeningUi();
    if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
      voiceState.closedByUser = true;
      setStatus('Microphone permission denied. Enable it in browser settings.');
      return;
    }
    if (errorCode === 'aborted' && voiceState.closedByUser) {
      setStatus('Stopped.');
      return;
    }
    setStatus('Voice recognition error. Restarting...');
  };

  recognition.onend = () => {
    voiceState.listening = false;
    updateListeningUi();
    if (voiceState.closedByUser) {
      voiceState.closedByUser = false;
      setStatus('Stopped.');
      return;
    }
    setStatus('Restarting listener...');
    clearPendingRestart();
    voiceState.pendingRestartId = window.setTimeout(() => {
      voiceState.pendingRestartId = null;
      startListening();
    }, 180);
  };

  voiceState.recognition = recognition;
  return recognition;
}

function startListening() {
  clearPendingRestart();
  const recognition = getRecognition();
  if (!recognition) {
    setStatus('Voice input is not supported in this browser.');
    updateListeningUi();
    return;
  }

  recognition.lang = elements.languageSelect.value === 'en' ? 'en-US' : 'pl-PL';
  voiceState.closedByUser = false;
  try {
    recognition.start();
  } catch (error) {
    if (String(error?.name ?? '') !== 'InvalidStateError') {
      setStatus('Voice listener failed to start.');
    }
  }
}

function stopListening() {
  clearPendingRestart();
  if (!voiceState.recognition) {
    voiceState.listening = false;
    updateListeningUi();
    setStatus('Stopped.');
    return;
  }
  voiceState.closedByUser = true;
  voiceState.recognition.stop();
}

elements.startBtn.addEventListener('click', () => {
  startListening();
});

elements.stopBtn.addEventListener('click', () => {
  stopListening();
});

elements.clearBtn.addEventListener('click', () => {
  clearOutput();
});

elements.languageSelect.addEventListener('change', () => {
  const current = new URL(window.location.href);
  current.searchParams.set('lang', elements.languageSelect.value);
  window.history.replaceState({}, '', current);
  setStatus(elements.languageSelect.value === 'en' ? 'Language set to English notation.' : 'Language set to Polish notation.');
  if (voiceState.listening) {
    stopListening();
    window.setTimeout(() => {
      startListening();
    }, 220);
  }
});

window.addEventListener('beforeunload', () => {
  clearPendingRestart();
  voiceState.closedByUser = true;
  if (voiceState.recognition) {
    voiceState.recognition.stop();
  }
});

updateListeningUi();
renderHistory();
