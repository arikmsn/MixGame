(() => {
  const PLAYER = 'X';
  const COMPUTER = 'O';
  const EMPTY = '';
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const cells = Array.from(document.querySelectorAll('.cell'));

  let board = Array(9).fill(EMPTY);
  let gameOver = false;
  let currentTurn = PLAYER;

  // Light-weight generated tones to avoid external sound files.
  function playTone({ frequency, duration = 0.1, type = 'sine', volume = 0.05 }) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);

    oscillator.onended = () => context.close();
  }

  const sounds = {
    click: () => playTone({ frequency: 480, duration: 0.07, type: 'triangle', volume: 0.04 }),
    win: () => {
      playTone({ frequency: 720, duration: 0.12, type: 'sawtooth', volume: 0.06 });
      setTimeout(() => playTone({ frequency: 920, duration: 0.16, type: 'sawtooth', volume: 0.06 }), 90);
    },
    draw: () => playTone({ frequency: 260, duration: 0.22, type: 'square', volume: 0.05 }),
  };

  function setStatus(text, variant) {
    statusEl.textContent = text;
    statusEl.className = `status ${variant}`;
  }

  function renderBoard() {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.disabled = gameOver || board[index] !== EMPTY || currentTurn === COMPUTER;
      cell.classList.remove('cell--x', 'cell--o');

      if (board[index] === PLAYER) cell.classList.add('cell--x');
      if (board[index] === COMPUTER) cell.classList.add('cell--o');
    });
  }

  function findWinner(state) {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], combo };
      }
    }

    if (state.every((cell) => cell !== EMPTY)) {
      return { winner: 'DRAW', combo: [] };
    }

    return null;
  }

  function finalizeGame(result) {
    gameOver = true;
    cells.forEach((cell) => (cell.disabled = true));

    if (result.winner === PLAYER) {
      setStatus('You Win', 'status status--result');
      sounds.win();
    } else if (result.winner === COMPUTER) {
      setStatus('Computer Wins', 'status status--result');
      sounds.win();
    } else {
      setStatus('Draw', 'status status--result');
      sounds.draw();
    }

    result.combo.forEach((index) => cells[index].classList.add('cell--winner'));
  }

  function getAvailableMoves(state) {
    return state.reduce((moves, cell, index) => {
      if (cell === EMPTY) moves.push(index);
      return moves;
    }, []);
  }

  // Minimax gives each potential board a score so the AI can choose the optimal move.
  function minimax(state, depth, isMaximizing) {
    const result = findWinner(state);
    if (result) {
      if (result.winner === COMPUTER) return 10 - depth;
      if (result.winner === PLAYER) return depth - 10;
      return 0;
    }

    const availableMoves = getAvailableMoves(state);

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (const move of availableMoves) {
        state[move] = COMPUTER;
        const score = minimax(state, depth + 1, false);
        state[move] = EMPTY;
        bestScore = Math.max(score, bestScore);
      }

      return bestScore;
    }

    let bestScore = Infinity;

    for (const move of availableMoves) {
      state[move] = PLAYER;
      const score = minimax(state, depth + 1, true);
      state[move] = EMPTY;
      bestScore = Math.min(score, bestScore);
    }

    return bestScore;
  }

  // Choose the move that maximizes AI outcome and never allows a losing line.
  function getBestComputerMove(state) {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (const move of getAvailableMoves(state)) {
      state[move] = COMPUTER;
      const score = minimax(state, 0, false);
      state[move] = EMPTY;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  function clearWinnerStyles() {
    cells.forEach((cell) => cell.classList.remove('cell--winner'));
  }

  function processTurnEnd() {
    const result = findWinner(board);
    if (result) {
      finalizeGame(result);
      return;
    }

    currentTurn = currentTurn === PLAYER ? COMPUTER : PLAYER;

    if (currentTurn === PLAYER) {
      setStatus('Player Turn', 'status status--player-turn');
      renderBoard();
      return;
    }

    setStatus('Computer Thinking...', 'status status--computer-turn');
    renderBoard();

    setTimeout(() => {
      if (gameOver) return;

      const move = getBestComputerMove([...board]);
      if (move >= 0) {
        board[move] = COMPUTER;
        sounds.click();
      }

      currentTurn = PLAYER;
      renderBoard();
      processTurnEnd();
    }, 380);
  }

  function handlePlayerMove(event) {
    const target = event.target.closest('.cell');
    if (!target || gameOver || currentTurn !== PLAYER) return;

    const index = Number(target.dataset.index);
    if (board[index] !== EMPTY) return;

    board[index] = PLAYER;
    sounds.click();
    renderBoard();
    processTurnEnd();
  }

  function resetGame() {
    board = Array(9).fill(EMPTY);
    gameOver = false;
    currentTurn = PLAYER;
    clearWinnerStyles();
    setStatus('Player Turn', 'status status--player-turn');
    renderBoard();
  }

  boardEl.addEventListener('click', handlePlayerMove);
  restartBtn.addEventListener('click', resetGame);

  resetGame();
})();
