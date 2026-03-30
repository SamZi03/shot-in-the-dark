# Shot in the Dark — Product Requirements Document

## Overview
A local multiplayer estimation game for 2–5 players. The host reads a numerical or date-based question aloud, players write their guesses privately, then the host reveals the answer and manually awards points to whoever was closest. Played on one shared screen (host's device).

---

## Screens

### 1. Home Screen (`index.html`)
- Game title and brief description
- **Players section:** up to 5 player name slots, editable, persisted in localStorage. Add/remove players.
- **Category section:** grid of category cards, tap to select one. Only one active at a time.
- **Start Game** button — disabled unless at least 2 players and a category are selected

### 2. Game Screen (`game.html`)
- Category badge at top
- Question counter (e.g. "Question 7")
- Large question text
- **Reveal Answer** button → shows the answer + unit
- Player score cards: name, current score, minus (−) and plus (+) buttons
- **Next Question** button (appears only after answer is revealed)
- **End Game** button (returns to home, keeps player names)

### 3. End Screen (bottom of `game.html` or modal)
- Final scores, ranked
- Winner highlighted
- **Play Again** (same players, same category, reshuffled questions)
- **Home** button

---

## Categories

| ID | Name | Description |
|----|------|-------------|
| `history` | History | UK and world historical dates and numbers |
| `science` | Science & Nature | Scientific facts, measurements, quantities |
| `sport` | Sport | UK-focused: football, cricket, rugby, tennis, F1 |
| `music` | Music & Entertainment | Chart positions, years, sales figures |
| `food` | Food & Drink | Quantities, years, UK-focused |
| `geography` | Geography | Distances, populations, heights, areas |
| `tv-film` | TV & Film | Viewing figures, release years, runtimes, budgets |
| `mixed` | Shot in the Dark | Classic mixed deck — spread across all topics, SITD style |

---

## Scoring Rules
- Host manually awards points using +/− buttons on each player card
- Closest guess = +1 point
- Ties: both players get +1 (host taps + on both)
- No automatic scoring — all manual to avoid disputes
- Scores persist until End Game or browser refresh

---

## Question Format (JSON)
Stored in `data/<category>.json` as a flat array:
```json
[
  {
    "id": 1,
    "q": "In what year did the Battle of Hastings take place?",
    "a": 1066,
    "unit": ""
  },
  {
    "id": 2,
    "q": "How many metres tall is Mount Everest?",
    "a": 8849,
    "unit": "metres"
  }
]
```
- `q` — question string (UK English)
- `a` — numerical answer (integer or float)
- `unit` — display string shown after the answer (empty string if none)

---

## Tech Stack
- **Vanilla HTML, CSS, JavaScript** — no frameworks
- **Static site** — no backend, no build step
- **Data:** JSON files per category in `data/`
- **Persistence:** localStorage for player names only
- **Hosting:** GitHub Pages

---

## File Structure
```
shot-in-the-dark/
├── index.html
├── game.html
├── css/
│   └── style.css
├── js/
│   ├── app.js       # Home screen logic
│   └── game.js      # Game screen logic
└── data/
    ├── history.json
    ├── science.json
    ├── sport.json
    ├── music.json
    ├── food.json
    ├── geography.json
    ├── tv-film.json
    └── mixed.json
```

---

## Question Bank
- **Launch target:** ~500 questions (~60 per category, ~80 for Mixed)
- **Expansion:** added in batches via code — no admin UI needed
- **Language:** UK English throughout (holiday not vacation, metre not meter, etc.)
- **Quality bar:** all answers must be verifiable integers or simple decimals

---

## HTML Element Spec (shared across HTML/CSS/JS)

### `index.html`
- `#player-list` — player cards container
- `.player-card` — individual player row
- `.player-name-input` — editable name input
- `.remove-player-btn` — remove a player
- `#add-player-btn` — add new player
- `#category-grid` — category selection grid
- `.category-card[data-category]` — individual category tile
- `.category-card.active` — currently selected category
- `#start-btn` — start game

### `game.html`
- `#category-badge` — category name display
- `#question-counter` — "Question N"
- `#question-text` — question body
- `#reveal-btn` — reveal answer
- `#answer-display` — hidden until revealed
- `#player-scores` — score cards container
- `.score-card[data-player]` — per-player score card
- `.player-label` — player name in score card
- `.score-value` — score number
- `.score-minus` — decrement button
- `.score-plus` — increment button
- `#next-btn` — next question (hidden until reveal)
- `#end-btn` — end game

---

## Future Roadmap
1. Pass-the-phone mode — each player types their guess, phone passed around
2. Timer — optional countdown for guesses
3. Difficulty tiers — easy / medium / hard within each category
4. Online multiplayer — players join via room code on their own devices
5. Question packs — themed seasonal or special editions
