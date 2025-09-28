/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = 'POINT'//WordleWords.getRandomWord();  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    resetBoard();
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    hideModal();

    console.log('Game initialized!'); // Remove this line when implementing
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver) return;
    
    // TODO: Handle letter keys (A-Z)
    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter
    if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
            currentGuess += key;
            const tile = getTile(currentRow, currentGuess.length - 1);
            updateTileDisplay(tile, key);
        }
    }

    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    else if (key === 'ENTER') {
        if (isGuessComplete()) {
            submitGuess();
        } else {
            showMessage('Incomplete guess');
        }
    }

    // TODO: Handle BACKSPACE key
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    else if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            const tile = getTile(currentRow, currentGuess.length - 1);
            updateTileDisplay(tile, '');
            currentGuess = currentGuess.slice(0, -1);
        }
    }
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    if (!isGuessComplete()) return;
    
    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    if (!WordleWords.isValidWord(currentGuess)) {
        showMessage('Not a real word');
        shakeRow(currentRow);
        return;
    }
    
    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array
    const results = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        results.push(checkLetter(currentGuess[i], i, currentWord));
    }
    
    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = getTile(currentRow, i);
        setTileState(tile, results[i]);
    }
    
    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    updateKeyboardColors(currentGuess, results);
    
    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    if (currentGuess === currentWord) {
        updateGameState(true);
    }   
    // TODO: Update game state
    // HINT: Call updateGameState()
    
    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess
    if (!gameOver && currentRow < MAX_GUESSES - 1) {
        currentRow++;
        currentGuess = '';
    } else if (!gameOver) {
        updateGameState(false);
    }
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison
    guessLetter = guessLetter.toUpperCase();
    
    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter
    if (targetWord[position] === guessLetter) {
        return 'correct';
    }
    
    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()
    if (!targetWord.includes(guessLetter)) {
        return 'absent';
    }

    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word

    // count how many letters are in the target word
    let letterCount = 0;
    for (let char of targetWord) {
        if (char === guessLetter) letterCount++;
    }
    // calculate the kth letter in the current guess
    for (let i = 0; i <= position; i++) {
        if (currentGuess[i] === guessLetter) letterCount--;
        
    }
    // absent 
    if (letterCount < 0) {
        return 'absent';
    } else {
        return 'present';
    }
}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(true, currentWord);
    }

    // TODO: Handle lose condition
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    if (!isCorrect && currentRow >= MAX_GUESSES - 1) {
        gameOver = true;
        showEndGameModal(false, currentWord);
    }
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {
    // TODO: Loop through each letter in the guess
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const result = results[i];
    }
    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    const keyElement = document.querySelector(`[data-key="${letter}"]`);
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    const allCorrect = results.every(result => result === 'correct');
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    if (allCorrect) {
        celebrateRow(rowIndex);
    }
    
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    if (won) {
        showMessage('Congratulations! You guessed the word "${targetWord}" in ${currentRow + 1} guesses!');
    } else {
        showMessage('Game Over! The correct word was "${targetWord}".');
    }
    
    // TODO: Update statistics
    // HINT: Use updateStats() function
    updateStats(won, currentRow + 1);
    
    // TODO: Show the modal
    // HINT: Use showModal() function
    showModal();
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over
    if (gameOver) return false;
    
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH
    
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    
    console.log('Validating input:', key); // Remove this line
    return true; // Replace with actual validation logic
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================

// Uncomment these lines for debugging help:
// console.log('Current word:', currentWord);
// console.log('Current guess:', currentGuess);
// console.log('Current row:', currentRow);

console.log('Student implementation template loaded. Start implementing the functions above!'); 