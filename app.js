// User authentication keys (you'll need to distribute these to your friends)
const USER_KEYS = {
    'FRIEND1_KEY': { name: 'Friend 1', id: 'friend1' },
    'FRIEND2_KEY': { name: 'Friend 2', id: 'friend2' },
    'FRIEND3_KEY': { name: 'Friend 3', id: 'friend3' },
    'FRIEND4_KEY': { name: 'Friend 4', id: 'friend4' }
};

// App state
let currentUser = null;
let messages = [];
let chessGame = null;

// Chess piece Unicode symbols
const CHESS_PIECES = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

// Initial chess board setup
const INITIAL_BOARD = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Authentication functions
function authenticate() {
    const keyInput = document.getElementById('userKey').value.trim();
    const authError = document.getElementById('authError');
    
    if (USER_KEYS[keyInput]) {
        currentUser = USER_KEYS[keyInput];
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('currentUser').textContent = `Logged in as: ${currentUser.name}`;
        initializeApp();
    } else {
        authError.classList.remove('hidden');
        setTimeout(() => authError.classList.add('hidden'), 3000);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('userKey').value = '';
}

// Initialize app after authentication
function initializeApp() {
    initializeChat();
    initializeChess();
    updateGameInfo();
}

// Chat functions
function initializeChat() {
    // Add welcome message
    addMessage('System', `${currentUser.name} joined the chat!`, 'system');
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message) {
        addMessage(currentUser.name, message, 'user');
        messageInput.value = '';
        
        // Simulate other friends responding (in a real app, this would be handled by a backend)
        simulateFriendResponses(message);
    }
}

function addMessage(sender, message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (type === 'system') {
        messageDiv.className = 'text-center text-gray-500 text-sm mb-2';
        messageDiv.innerHTML = `<em>${message}</em>`;
    } else {
        messageDiv.className = 'mb-3';
        messageDiv.innerHTML = `
            <div class="flex items-start space-x-2">
                <div class="bg-blue-100 rounded-lg px-3 py-2 max-w-xs">
                    <div class="font-semibold text-sm text-blue-800">${sender}</div>
                    <div class="text-gray-800">${message}</div>
                    <div class="text-xs text-gray-500 mt-1">${timestamp}</div>
                </div>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messages.push({ sender, message, type, timestamp });
}

function simulateFriendResponses(userMessage) {
    // Simple simulation of friends responding (in real app, this would be handled by WebSocket/backend)
    const responses = [
        "That's cool!",
        "I agree!",
        "Nice one!",
        "Haha, good point!",
        "Interesting!",
        "Tell me more!"
    ];
    
    if (Math.random() > 0.5) { // 50% chance of getting a response
        setTimeout(() => {
            const friends = Object.values(USER_KEYS).filter(f => f.id !== currentUser.id);
            const randomFriend = friends[Math.floor(Math.random() * friends.length)];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomFriend.name, randomResponse, 'user');
        }, 1000 + Math.random() * 2000);
    }
}

// Chess game functions
function initializeChess() {
    chessGame = {
        board: JSON.parse(JSON.stringify(INITIAL_BOARD)),
        currentPlayer: 'white',
        selectedPiece: null,
        selectedPosition: null,
        gameStatus: 'waiting',
        whitePlayer: null,
        blackPlayer: null,
        spectators: []
    };
    
    renderChessBoard();
}

function renderChessBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = chessGame.board[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.className = 'chess-piece';
                pieceElement.textContent = CHESS_PIECES[piece];
                square.appendChild(pieceElement);
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (chessGame.gameStatus === 'waiting') {
        // First player to click becomes white
        if (!chessGame.whitePlayer) {
            chessGame.whitePlayer = currentUser.id;
            chessGame.gameStatus = 'playing';
            addMessage('System', `${currentUser.name} joined as White player!`, 'system');
        } else if (!chessGame.blackPlayer && currentUser.id !== chessGame.whitePlayer) {
            chessGame.blackPlayer = currentUser.id;
            addMessage('System', `${currentUser.name} joined as Black player!`, 'system');
        } else if (currentUser.id !== chessGame.whitePlayer && currentUser.id !== chessGame.blackPlayer) {
            if (!chessGame.spectators.includes(currentUser.id)) {
                chessGame.spectators.push(currentUser.id);
                addMessage('System', `${currentUser.name} is now watching the game!`, 'system');
            }
        }
        updateGameInfo();
        return;
    }
    
    // Check if current user is a player
    const isWhitePlayer = currentUser.id === chessGame.whitePlayer;
    const isBlackPlayer = currentUser.id === chessGame.blackPlayer;
    const isCurrentPlayerTurn = (chessGame.currentPlayer === 'white' && isWhitePlayer) || 
                              (chessGame.currentPlayer === 'black' && isBlackPlayer);
    
    if (!isCurrentPlayerTurn) {
        return; // Not this player's turn
    }
    
    const piece = chessGame.board[row][col];
    
    if (chessGame.selectedPiece) {
        // Try to move the selected piece
        if (isValidMove(chessGame.selectedPosition, { row, col })) {
            makeMove(chessGame.selectedPosition, { row, col });
        } else {
            // Deselect if clicking on invalid square
            clearSelection();
            if (piece && isPieceOwnedByCurrentPlayer(piece)) {
                selectPiece(row, col);
            }
        }
    } else if (piece && isPieceOwnedByCurrentPlayer(piece)) {
        // Select a piece
        selectPiece(row, col);
    }
}

function isPieceOwnedByCurrentPlayer(piece) {
    const isWhitePiece = piece === piece.toUpperCase();
    return (chessGame.currentPlayer === 'white' && isWhitePiece) || 
           (chessGame.currentPlayer === 'black' && !isWhitePiece);
}

function selectPiece(row, col) {
    clearSelection();
    chessGame.selectedPiece = chessGame.board[row][col];
    chessGame.selectedPosition = { row, col };
    
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('selected');
    
    // Show valid moves
    showValidMoves(row, col);
}

function clearSelection() {
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.valid-move').forEach(el => el.classList.remove('valid-move'));
    chessGame.selectedPiece = null;
    chessGame.selectedPosition = null;
}

function showValidMoves(fromRow, fromCol) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove({ row: fromRow, col: fromCol }, { row, col })) {
                const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                square.classList.add('valid-move');
            }
        }
    }
}

function isValidMove(from, to) {
    const piece = chessGame.board[from.row][from.col];
    const targetPiece = chessGame.board[to.row][to.col];
    
    // Can't capture own piece
    if (targetPiece && isPieceOwnedByCurrentPlayer(targetPiece)) {
        return false;
    }
    
    // Simplified movement rules (basic implementation)
    const pieceType = piece.toLowerCase();
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);
    
    switch (pieceType) {
        case 'p': // Pawn
            const direction = piece === piece.toUpperCase() ? -1 : 1;
            const startRow = piece === piece.toUpperCase() ? 6 : 1;
            
            if (colDiff === 0 && !targetPiece) {
                // Move forward
                if (rowDiff === direction) return true;
                if (from.row === startRow && rowDiff === 2 * direction && !chessBoard[from.row + direction][from.col]) return true;
            }
            // Capture diagonally
            if (absColDiff === 1 && rowDiff === direction && targetPiece) return true;
            return false;
            
        case 'n': // Knight
            return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
            
        case 'b': // Bishop
            return absRowDiff === absColDiff && isPathClear(from, to);
            
        case 'r': // Rook
            return (rowDiff === 0 || colDiff === 0) && isPathClear(from, to);
            
        case 'q': // Queen
            return ((rowDiff === 0 || colDiff === 0) || (absRowDiff === absColDiff)) && isPathClear(from, to);
            
        case 'k': // King
            return absRowDiff <= 1 && absColDiff <= 1;
            
        default:
            return false;
    }
}

function isPathClear(from, to) {
    const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0;
    const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0;
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
        if (chessGame.board[currentRow][currentCol]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

function makeMove(from, to) {
    const piece = chessGame.board[from.row][from.col];
    const capturedPiece = chessGame.board[to.row][to.col];
    
    chessGame.board[to.row][to.col] = piece;
    chessGame.board[from.row][from.col] = null;
    
    // Announce move in chat
    const moveNotation = `${piece}${String.fromCharCode(97 + from.col)}${8 - from.row} → ${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    const playerName = currentUser.id === chessGame.whitePlayer ? 'White' : 'Black';
    addMessage('Chess Game', `${playerName}: ${moveNotation}${capturedPiece ? ' (capture)' : ''}`, 'system');
    
    // Switch turns
    chessGame.currentPlayer = chessGame.currentPlayer === 'white' ? 'black' : 'white';
    clearSelection();
    renderChessBoard();
    updateGameInfo();
}

function startNewGame() {
    initializeChess();
    addMessage('System', 'New chess game started! First to click joins as White.', 'system');
}

function resetGame() {
    chessGame.board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    chessGame.currentPlayer = 'white';
    chessGame.selectedPiece = null;
    chessGame.selectedPosition = null;
    clearSelection();
    renderChessBoard();
    addMessage('System', 'Chess board has been reset.', 'system');
}

function updateGameInfo() {
    const gameInfo = document.getElementById('gameInfo');
    const gameStatus = document.getElementById('gameStatus');
    
    let statusText = '';
    let infoText = '';
    
    if (chessGame.gameStatus === 'waiting') {
        statusText = 'Waiting for players...';
        infoText = 'Click the board to join as White or Black';
    } else {
        const whitePlayer = Object.values(USER_KEYS).find(u => u.id === chessGame.whitePlayer)?.name || 'White';
        const blackPlayer = Object.values(USER_KEYS).find(u => u.id === chessGame.blackPlayer)?.name || 'Waiting...';
        const currentTurn = chessGame.currentPlayer === 'white' ? whitePlayer : blackPlayer;
        
        statusText = `${currentTurn}'s turn`;
        infoText = `White: ${whitePlayer} | Black: ${blackPlayer}`;
        
        if (chessGame.spectators.length > 0) {
            const spectatorNames = chessGame.spectators.map(id => 
                Object.values(USER_KEYS).find(u => u.id === id)?.name
            ).filter(name => name).join(', ');
            infoText += ` | Watching: ${spectatorNames}`;
        }
    }
    
    gameStatus.textContent = statusText;
    gameInfo.textContent = infoText;
}

// Handle Enter key in authentication
document.getElementById('userKey').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        authenticate();
    }
});
