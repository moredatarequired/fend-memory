// The cards that the player tries to match.
const cards = document.querySelectorAll('.card');
// Active / face up card, if any exists (there can only be one).
let openCard = null;
let moveCount;
let starCount;

// Modal that appears once a game has been won.
const modal = document.getElementById('win-game');

// The time in milliseconds that this game started, or null if no timer is running.
let startTime = null;

// Lock user interaction while waiting for animations to complete.
let inProgress = false;

// shuffle function from https://stackoverflow.com/questions/6274339
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function makeMove(zero = false) {
    if (zero) {
        moveCount = 0;
    } else {
        moveCount++;
    }
    for (moveCounter of document.querySelectorAll('.moves')) {
        moveCounter.innerHTML = moveCount;
    }
    assignStars();
}

function formatWithPluralOrNone(number, name) {
    if (!number) {
        return '';
    }
    return number + ' ' + name + (number > 1 ? 's' : '');
}

function setTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    const timerString = `${minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
    for (timer of document.querySelectorAll('.timer')) {
        timer.innerHTML = timerString;
    }
    const minuteString = formatWithPluralOrNone(minutes, 'minute');
    const secondsString = formatWithPluralOrNone(seconds, 'second');
    const conjunction = minuteString && secondsString ? ' and ' : '';
    const resultTime = `${minuteString}${conjunction}${secondsString}`;
    for (timer of document.querySelectorAll('.total-time')) {
        timer.innerHTML = resultTime;
    }
}

function cardName(card) {
    const tag = card.querySelector('.fa');
    return tag ? tag.classList[1] : undefined;
}

function isOpen(card) {
    return card.classList.contains('open');
}
function isMatched(card) {
    return card.classList.contains('match');
}

function matches(card1, card2) {
    return cardName(card1) === cardName(card2);
}

// Return true iff the current board is in a winning state.
function isWon() {
    return Array.prototype.map.call(cards, c => isMatched(c)).reduce((p, c) => p && c, true);
}

function clearState(...cards) {
    // Note: this effectively makes a card hidden, since that's the default state.
    for (card of cards) {
        card.classList.remove('match');
        card.classList.remove('open');
    }
}

function setOpen(...cards) {
    for (card of cards) {
        clearState(card);
        card.classList.add('open');
    }
}
function setMatched(...cards) {
    for (card of cards) {
        clearState(card);
        card.classList.add('match');
    }
}

function assignStars() {
    if (moveCount < 13) {
        setStars(3);
    } else if (moveCount < 17) {
        setStars(2);
    } else {
        setStars(1);
    }
}

// Turn on/off stars, display 1-3.
function setStars(n) {
    if (starCount === n) {
        return;
    }
    startCount = n;
    for (let i = 1; i <= 3; i++) {
        const on = n >= i ? 'fa-star' : 'fa-star-o';
        const off = n >= i ? 'fa-star-o' : 'fa-star';
        for (let starList of document.querySelectorAll(`.stars li:nth-child(${i}) i`)) {
            starList.classList.replace(off, on);
        }
    }
}

function cardClick(e) {
    let card = e.target;
    if (isOpen(card) || isMatched(card) || inProgress) {
        // Card is already revealed, do nothing.
        return;
    }
    // Start the timer if this is the first move.
    if (startTime === null) {
        startTime = Date.now();
    }
    // Card is hidden, flip it over.
    setOpen(card);
    if (!openCard) {
        openCard = card;
    } else {
        inProgress = true;
        window.setTimeout(checkMatch, 600, card);
    }
}
cards.forEach(card => card.addEventListener('click', cardClick));

function checkMatch(card) {
    makeMove();
    clearState(card, openCard);
    // There is another open card; check for a match.
    if (matches(card, openCard)) {
        // Success! Keep both cards flipped.
        setMatched(card, openCard);
    }
    openCard = null;
    if (isWon()) {
        // Stop timer.
        startTime = null;
        // Show winning modal.
        modal.style.display = 'block';
    }
    inProgress = false;
}

function restartGame() {
    // Use the Flexbox 'order' property to shuffle display order.
    const flexOrder = shuffle([...Array(16).keys()]);
    for (index in flexOrder) {
        clearState(cards[index]);
        cards[index].style.order = flexOrder[index];
    }
    makeMove(zero = true);
    openCard = null;
    inProgress = false;
    startTime = null;
    setTime(0);
    modal.style.display = 'none';
}
document.querySelectorAll('.restart').forEach(n => n.addEventListener('click', restartGame));

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function updateTimer() {
    if (startTime === null) {
        // No timer running, do nothing.
        return;
    }
    const elapsedMilliseconds = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    setTime(totalSeconds);
}
window.setInterval(updateTimer, 100);

// Shuffle and hide cards on start.
restartGame();