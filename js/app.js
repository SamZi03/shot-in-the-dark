// Shot in the Dark — Home screen logic

const STORAGE_KEY = 'sitd_players';
const MAX_PLAYERS = 5;

let players = [];
let selectedCategory = null;

// --- Persistence ---

function loadPlayers() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored) && stored.length > 0) {
      players = stored.slice(0, MAX_PLAYERS);
      return;
    }
  } catch (_) {}
  players = ['Player 1', 'Player 2'];
}

function savePlayers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

// --- Rendering ---

function renderPlayers() {
  const list = document.getElementById('player-list');
  list.innerHTML = '';
  players.forEach((name, i) => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <input class="player-name-input" type="text" maxlength="20" value="${escHtml(name)}" data-index="${i}" aria-label="Player ${i + 1} name">
      <button class="remove-player-btn" data-index="${i}" aria-label="Remove player">✕</button>
    `;
    list.appendChild(card);
  });

  document.getElementById('add-player-btn').disabled = players.length >= MAX_PLAYERS;
  updateStartBtn();
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Player list events (delegated) ---

document.getElementById('player-list').addEventListener('input', (e) => {
  if (!e.target.classList.contains('player-name-input')) return;
  const i = parseInt(e.target.dataset.index, 10);
  players[i] = e.target.value;
  savePlayers();
  updateStartBtn();
});

document.getElementById('player-list').addEventListener('click', (e) => {
  if (!e.target.classList.contains('remove-player-btn')) return;
  const i = parseInt(e.target.dataset.index, 10);
  players.splice(i, 1);
  savePlayers();
  renderPlayers();
});

document.getElementById('add-player-btn').addEventListener('click', () => {
  if (players.length >= MAX_PLAYERS) return;
  players.push(`Player ${players.length + 1}`);
  savePlayers();
  renderPlayers();
  // Focus the new input
  const inputs = document.querySelectorAll('.player-name-input');
  if (inputs.length) inputs[inputs.length - 1].focus();
});

// --- Category selection ---

document.getElementById('category-grid').addEventListener('click', (e) => {
  const card = e.target.closest('.category-card');
  if (!card) return;
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  selectedCategory = card.dataset.category;
  updateStartBtn();
});

// --- Start button ---

function updateStartBtn() {
  const validPlayers = players.filter(n => n.trim().length > 0);
  const canStart = validPlayers.length >= 2 && selectedCategory !== null;
  document.getElementById('start-btn').disabled = !canStart;
}

document.getElementById('start-btn').addEventListener('click', () => {
  const validPlayers = players.filter(n => n.trim().length > 0);
  if (validPlayers.length < 2 || !selectedCategory) return;
  sessionStorage.setItem('sitd_game', JSON.stringify({
    players: validPlayers,
    category: selectedCategory
  }));
  window.location.href = 'game.html';
});

// --- Init ---

loadPlayers();
renderPlayers();
