// Shot in the Dark — Game screen logic

let gameData = null;
let questions = [];
let scores = {};
let currentIndex = 0;

// --- Bootstrap ---

(async function init() {
  try {
    gameData = JSON.parse(sessionStorage.getItem('sitd_game'));
  } catch (_) {}

  if (!gameData || !Array.isArray(gameData.players) || gameData.players.length < 2) {
    window.location.href = 'index.html';
    return;
  }

  // Category badge
  document.getElementById('category-badge').textContent = gameData.category;

  // Initialise scores
  gameData.players.forEach(name => { scores[name] = 0; });

  // Render score cards
  renderScoreCards();

  // Fetch and shuffle questions
  try {
    const res = await fetch(`data/${gameData.category}.json`);
    if (!res.ok) throw new Error('fetch failed');
    const raw = await res.json();
    questions = fisherYates(raw);
  } catch (err) {
    document.getElementById('question-text').textContent = 'Could not load questions. Check the data file exists.';
    console.error(err);
    return;
  }

  showQuestion(0);
})();

// --- Fisher-Yates shuffle ---

function fisherYates(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Question display ---

function showQuestion(index) {
  const q = questions[index];
  document.getElementById('question-counter').textContent = `Question ${index + 1} of ${questions.length}`;
  document.getElementById('question-text').textContent = q.q;

  const answerEl = document.getElementById('answer-display');
  answerEl.textContent = '';
  answerEl.classList.add('hidden');

  document.getElementById('reveal-btn').classList.remove('hidden');
  document.getElementById('next-btn').classList.add('hidden');
}

// --- Reveal answer ---

document.getElementById('reveal-btn').addEventListener('click', () => {
  const q = questions[currentIndex];
  const answerEl = document.getElementById('answer-display');
  answerEl.textContent = q.unit ? `${q.a} ${q.unit}` : String(q.a);
  answerEl.classList.remove('hidden');
  document.getElementById('reveal-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.remove('hidden');
});

// --- Next question ---

document.getElementById('next-btn').addEventListener('click', () => {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showEndScreen();
  } else {
    showQuestion(currentIndex);
  }
});

// --- Score cards ---

function renderScoreCards() {
  const container = document.getElementById('player-scores');
  container.innerHTML = '';
  gameData.players.forEach(name => {
    const card = document.createElement('div');
    card.className = 'score-card';
    card.dataset.player = name;
    card.innerHTML = `
      <span class="player-label">${escHtml(name)}</span>
      <button class="score-minus" data-player="${escHtml(name)}" aria-label="Minus one">−</button>
      <span class="score-value">${scores[name]}</span>
      <button class="score-plus" data-player="${escHtml(name)}" aria-label="Plus one">+</button>
    `;
    container.appendChild(card);
  });
}

function updateScoreCard(name) {
  const card = document.querySelector(`.score-card[data-player="${CSS.escape(name)}"]`);
  if (card) card.querySelector('.score-value').textContent = scores[name];
}

document.getElementById('player-scores').addEventListener('click', (e) => {
  const btn = e.target.closest('.score-minus, .score-plus');
  if (!btn) return;
  const name = btn.dataset.player;
  if (btn.classList.contains('score-plus')) {
    scores[name]++;
  } else {
    scores[name] = Math.max(0, scores[name] - 1);
  }
  updateScoreCard(name);
});

// --- End screen ---

function showEndScreen() {
  // Hide game elements
  document.getElementById('game-screen').classList.add('hidden');

  // Build ranked results
  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const topScore = ranked[0][1];

  let rows = ranked.map(([name, score], i) => {
    const isWinner = score === topScore;
    return `<div class="result-card${isWinner ? ' winner' : ''}">
      <span class="result-rank">${i + 1}</span>
      <span class="result-name">${escHtml(name)}</span>
      <span class="result-score">${score} pt${score !== 1 ? 's' : ''}</span>
    </div>`;
  }).join('');

  const endDiv = document.getElementById('end-screen');
  endDiv.classList.remove('hidden');
  endDiv.innerHTML = `
    <h2>Final Scores</h2>
    <div class="results-list">${rows}</div>
    <div class="end-actions">
      <button id="play-again-btn">Play Again</button>
      <button id="home-btn">Home</button>
    </div>
  `;

  document.getElementById('play-again-btn').addEventListener('click', playAgain);
  document.getElementById('home-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

function playAgain() {
  // Reset scores
  gameData.players.forEach(name => { scores[name] = 0; });
  currentIndex = 0;

  // Reshuffle
  questions = fisherYates(questions);

  // Show game screen, hide end screen
  document.getElementById('end-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  renderScoreCards();
  showQuestion(0);
}

// --- End game button ---

document.getElementById('end-btn').addEventListener('click', () => {
  if (confirm('End game? Scores will be lost.')) {
    window.location.href = 'index.html';
  }
});

// --- Utility ---

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
