// Flashcard System - localStorage-based
// Stores decks and cards with full functionality

class FlashcardSystem {
  constructor() {
    this.decks = this.loadDecks();
    this.currentDeck = null;
    this.quizStats = {
      correct: 0,
      incorrect: 0,
      skipped: 0
    };
  }

  loadDecks() {
    const stored = localStorage.getItem('flashcardDecks');
    return stored ? JSON.parse(stored) : this.getDefaultDecks();
  }

  getDefaultDecks() {
    return {
      cge: {
        id: 'cge',
        name: 'CGE - Corporate Governance',
        description: 'Key terms and frameworks',
        cards: [
          { id: 1, front: 'Governance vs Management', back: 'Management runs day-to-day operations. Governance ensures the business is run correctly, ethically, and in the right direction (oversight).', subject: 'CGE', difficulty: 'easy' },
          { id: 2, front: 'TAFR Pillars', back: 'Transparency (clear disclosure), Accountability (responsibility for decisions), Fairness (equal treatment), Responsibility (legal & ethical obligations)', subject: 'CGE', difficulty: 'medium' },
          { id: 3, front: 'Three-Ring Model', back: 'Tagiuri & Davis model: 3 overlapping circles (Family, Ownership, Business) creating 7 possible seats. Used to understand role conflicts in family firms.', subject: 'CGE', difficulty: 'hard' },
          { id: 4, front: 'Agency Theory', back: 'Managers (agents) may drift from owners\' (principals\') interests. Solution: monitor through board oversight, audits, and performance-linked pay.', subject: 'CGE', difficulty: 'medium' },
          { id: 5, front: 'Stewardship Theory', back: 'Managers identify with firm goals and don\'t need close monitoring. Solution: empower them and let them act as stewards of the company.', subject: 'CGE', difficulty: 'medium' }
        ],
        created: new Date().toISOString()
      },
      sbg: {
        id: 'sbg',
        name: 'SBG - Strategic Business Growth',
        description: 'Strategy frameworks and tools',
        cards: [
          { id: 1, front: 'SWOT Analysis', back: 'Strengths (internal positive), Weaknesses (internal negative), Opportunities (external positive), Threats (external negative). Used for strategic planning.', subject: 'SBG', difficulty: 'easy' },
          { id: 2, front: 'Porter\'s Five Forces', back: '1) Threat of new entrants, 2) Bargaining power of suppliers, 3) Bargaining power of buyers, 4) Threat of substitutes, 5) Competitive rivalry', subject: 'SBG', difficulty: 'medium' },
          { id: 3, front: 'Ansoff Matrix', back: 'Market Penetration (existing product, existing market), Product Development (new product, existing market), Market Development (existing product, new market), Diversification (new product, new market)', subject: 'SBG', difficulty: 'medium' },
          { id: 4, front: 'Value Chain', back: 'Primary activities: Inbound logistics, Operations, Outbound logistics, Marketing/Sales, Service. Support activities: Procurement, HR, Technology, Infrastructure.', subject: 'SBG', difficulty: 'hard' },
          { id: 5, front: 'BCG Matrix', back: 'Cash Cows (high share, low growth), Dogs (low share, low growth), Stars (high share, high growth), Question Marks (low share, high growth)', subject: 'SBG', difficulty: 'medium' }
        ],
        created: new Date().toISOString()
      }
    };
  }

  saveDecks() {
    localStorage.setItem('flashcardDecks', JSON.stringify(this.decks));
  }

  createDeck(name, description = '') {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    if (this.decks[id]) {
      alert('Deck already exists!');
      return null;
    }
    this.decks[id] = {
      id,
      name,
      description,
      cards: [],
      created: new Date().toISOString()
    };
    this.saveDecks();
    return id;
  }

  addCard(deckId, front, back, subject = '', difficulty = 'medium') {
    if (!this.decks[deckId]) return null;
    const card = {
      id: Date.now(),
      front,
      back,
      subject,
      difficulty,
      created: new Date().toISOString()
    };
    this.decks[deckId].cards.push(card);
    this.saveDecks();
    return card.id;
  }

  deleteCard(deckId, cardId) {
    if (!this.decks[deckId]) return;
    this.decks[deckId].cards = this.decks[deckId].cards.filter(c => c.id !== cardId);
    this.saveDecks();
  }

  deleteDeck(deckId) {
    delete this.decks[deckId];
    this.saveDecks();
  }

  getDeck(deckId) {
    return this.decks[deckId];
  }

  getAllDecks() {
    return Object.values(this.decks);
  }
}

// Initialize system
const flashcardSystem = new FlashcardSystem();

// UI Functions
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');

  // Refresh content
  if (tabName === 'library') renderDeckLibrary();
  if (tabName === 'builder') renderBuilder();
}

function renderDeckLibrary() {
  const deckList = document.getElementById('deckList');
  const decks = flashcardSystem.getAllDecks();

  if (decks.length === 0) {
    deckList.innerHTML = '<div class="empty-state"><p>No decks yet. Create one in the "Create Cards" tab!</p></div>';
    return;
  }

  deckList.innerHTML = decks.map(deck => `
    <div class="deck-card">
      <h3>${deck.name}</h3>
      <p>${deck.description}</p>
      <div class="deck-stats">
        <span>${deck.cards.length} cards</span>
        <span>${new Date(deck.created).toLocaleDateString()}</span>
      </div>
      <div class="deck-actions">
        <button class="btn btn-secondary" onclick="startStudy('${deck.id}')">Study</button>
        <button class="btn btn-secondary" onclick="startQuiz('${deck.id}')">Quiz</button>
        <button class="btn btn-danger" onclick="confirmDelete('${deck.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderBuilder() {
  const deckSelect = document.getElementById('deckSelect');
  const decks = flashcardSystem.getAllDecks();

  deckSelect.innerHTML = '<option value="">-- Select or Create New --</option>' +
    decks.map(deck => `<option value="${deck.id}">${deck.name}</option>`).join('');
}

function addCard() {
  const deckSelect = document.getElementById('deckSelect').value;
  const newDeckName = document.getElementById('newDeckName').value;
  const front = document.getElementById('cardFront').value;
  const back = document.getElementById('cardBack').value;
  const subject = document.getElementById('cardSubject').value;
  const difficulty = document.getElementById('cardDifficulty').value;

  if (!front || !back) {
    alert('Please fill in both front and back!');
    return;
  }

  let deckId = deckSelect;
  
  if (!deckId && newDeckName) {
    deckId = flashcardSystem.createDeck(newDeckName, `Created ${new Date().toLocaleDateString()}`);
    renderBuilder();
  }

  if (!deckId) {
    alert('Select a deck or create a new one!');
    return;
  }

  flashcardSystem.addCard(deckId, front, back, subject, difficulty);
  alert('Card added successfully!');
  resetForm();
}

function resetForm() {
  document.getElementById('cardFront').value = '';
  document.getElementById('cardBack').value = '';
  document.getElementById('cardSubject').value = '';
  document.getElementById('newDeckName').value = '';
  document.getElementById('cardDifficulty').value = 'medium';
}

function startStudy(deckId) {
  flashcardSystem.currentDeck = deckId;
  const deck = flashcardSystem.getDeck(deckId);
  if (!deck || deck.cards.length === 0) {
    alert('This deck is empty!');
    return;
  }

  const studyContent = document.getElementById('studyContent');
  let currentCardIndex = 0;

  function renderCard() {
    const card = deck.cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / deck.cards.length * 100).toFixed(0);

    studyContent.innerHTML = `
      <div style="max-width: 700px; margin: 0 auto;">
        <div class="flashcard-nav">
          <button class="btn btn-secondary" onclick="switchTab('library')">Back to Decks</button>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-text">${currentCardIndex + 1}/${deck.cards.length}</div>
        </div>

        <div class="flashcard" id="studyCard">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front">
              <h3>Question</h3>
              <p>${card.front}</p>
              <div class="flashcard-hint">Click to reveal answer</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <h3>Answer</h3>
              <p>${card.back}</p>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <button class="btn btn-secondary" onclick="prevCard()"style="margin-right: 8px;">← Previous</button>
          <button class="btn btn-secondary" onclick="nextCard()">Next →</button>
        </div>
      </div>
    `;

    document.getElementById('studyCard').addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  }

  window.prevCard = function() {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      renderCard();
    }
  };

  window.nextCard = function() {
    if (currentCardIndex < deck.cards.length - 1) {
      currentCardIndex++;
      renderCard();
    }
  };

  switchTab('study');
  renderCard();
}

function startQuiz(deckId) {
  flashcardSystem.currentDeck = deckId;
  const deck = flashcardSystem.getDeck(deckId);
  if (!deck || deck.cards.length === 0) {
    alert('This deck is empty!');
    return;
  }

  flashcardSystem.quizStats = { correct: 0, incorrect: 0, skipped: 0 };
  
  let currentCardIndex = 0;
  const cards = [...deck.cards].sort(() => Math.random() - 0.5); // Shuffle

  function renderQuizCard() {
    const card = cards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / cards.length * 100).toFixed(0);

    const quizContent = document.getElementById('quizContent');

    quizContent.innerHTML = `
      <div style="max-width: 700px; margin: 0 auto;">
        <div class="quiz-stats">
          <div class="stat-card">
            <div class="label">Correct</div>
            <div class="value" style="color: var(--good);">${flashcardSystem.quizStats.correct}</div>
          </div>
          <div class="stat-card">
            <div class="label">Incorrect</div>
            <div class="value" style="color: var(--bad);">${flashcardSystem.quizStats.incorrect}</div>
          </div>
          <div class="stat-card">
            <div class="label">Skipped</div>
            <div class="value" style="color: var(--warn);">${flashcardSystem.quizStats.skipped}</div>
          </div>
        </div>

        <div class="flashcard-nav">
          <button class="btn btn-secondary" onclick="switchTab('library')">Exit Quiz</button>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-text">${currentCardIndex + 1}/${cards.length}</div>
        </div>

        <div class="flashcard" id="quizCard">
          <div class="flashcard-inner">
            <div class="flashcard-face flashcard-front">
              <h3>Question</h3>
              <p>${card.front}</p>
              <div class="flashcard-hint">Click to reveal answer</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <h3>Answer</h3>
              <p>${card.back}</p>
            </div>
          </div>
        </div>

        <div class="quiz-controls">
          <button class="btn btn-result btn-incorrect" onclick="markIncorrect()">✗ Incorrect</button>
          <button class="btn btn-result btn-skip" onclick="skipCard()">⊘ Skip</button>
          <button class="btn btn-result btn-correct" onclick="markCorrect()">✓ Correct</button>
        </div>
      </div>
    `;

    document.getElementById('quizCard').addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  }

  window.markCorrect = function() {
    flashcardSystem.quizStats.correct++;
    nextQuizCard();
  };

  window.markIncorrect = function() {
    flashcardSystem.quizStats.incorrect++;
    nextQuizCard();
  };

  window.skipCard = function() {
    flashcardSystem.quizStats.skipped++;
    nextQuizCard();
  };

  function nextQuizCard() {
    currentCardIndex++;
    if (currentCardIndex < cards.length) {
      renderQuizCard();
    } else {
      showQuizResults();
    }
  }

  function showQuizResults() {
    const total = cards.length;
    const score = flashcardSystem.quizStats.correct;
    const percentage = ((score / total) * 100).toFixed(1);

    const quizContent = document.getElementById('quizContent');
    quizContent.innerHTML = `
      <div style="max-width: 600px; margin: 40px auto; text-align: center;">
        <h2 style="color: var(--accent); font-family: 'Segoe Print', cursive; margin-bottom: 24px;">Quiz Complete!</h2>
        
        <div class="quiz-stats">
          <div class="stat-card">
            <div class="label">Score</div>
            <div class="value">${percentage}%</div>
          </div>
        </div>

        <div class="quiz-stats">
          <div class="stat-card">
            <div class="label">Correct</div>
            <div class="value" style="color: var(--good);">${flashcardSystem.quizStats.correct}/${total}</div>
          </div>
          <div class="stat-card">
            <div class="label">Incorrect</div>
            <div class="value" style="color: var(--bad);">${flashcardSystem.quizStats.incorrect}/${total}</div>
          </div>
          <div class="stat-card">
            <div class="label">Skipped</div>
            <div class="value" style="color: var(--warn);">${flashcardSystem.quizStats.skipped}/${total}</div>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <button class="btn btn-primary" onclick="startQuiz('${deckId}')">Retry Quiz</button>
          <button class="btn btn-secondary" onclick="switchTab('library')" style="margin-left: 12px;">Back to Decks</button>
        </div>
      </div>
    `;
  }

  switchTab('quiz');
  renderQuizCard();
}

function confirmDelete(deckId) {
  if (confirm('Are you sure you want to delete this deck? This cannot be undone.')) {
    flashcardSystem.deleteDeck(deckId);
    renderDeckLibrary();
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', function() {
  renderDeckLibrary();
});
