// The cards that the player tries to match.
const cards = document.querySelectorAll('.card');
let openCard = null;
let moves;

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
        moves = 0;
    } else {
        moves++;
    }
    document.querySelector('.moves').innerHTML = moves;
}

function cardName(card) {
    return card.querySelector('i').classList[1];
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

function clearState(card) {
    // Note: this effectively makes a card hidden, since that's the default state.
    card.classList.remove('match');
    card.classList.remove('open');
}

function setOpen(card) {
    clearState(card);
    card.classList.add('open');
}
function setMatched(card) {
    clearState(card);
    card.classList.add('match');
}

function cardClick(e) {
    let card = e.target;
    if (isOpen(card) || isMatched(card)) {
        // Card is already revealed, do nothing.
        return;
    }
    makeMove();
    // Card is hidden, flip it over.
    setOpen(card);
    if (!openCard) {
        openCard = card;
    } else {
        clearState(openCard);
        clearState(card);
        // There is another open card; check for a match.
        if (matches(card, openCard)) {
            // Success! Keep both cards flipped.
            setMatched(card);
            setMatched(openCard);
        }
        openCard = null;
    }
}
cards.forEach(card => card.addEventListener('click', cardClick));

function restartGame() {
    // Use the Flexbox 'order' property to shuffle display order.
    const flexOrder = shuffle([...Array(16).keys()]);
    for (index in flexOrder) {
        clearState(cards[index]);
        cards[index].style.order = flexOrder[index];
    }
    makeMove(zero = true);
    openCard = null;
}
document.querySelector('.restart').addEventListener('click', restartGame);

// Shuffle and hide cards on start.
restartGame();