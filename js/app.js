// The cards that the player tries to match.
const cards = document.querySelectorAll('.card');

// Use the Flexbox 'order' property to shuffle display order.
let flexOrder = shuffle([...Array(16).keys()]);
cards.forEach((card, index) => card.style.order = flexOrder[index]);

// shuffle function from https://stackoverflow.com/questions/6274339
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function cardName(card) {
    return card.querySelector('i').classList[1];
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let openCard = null;
function cardClick(e) {
    let classes = e.target.classList;
    if (classes.contains('match') || classes.contains('open')) {
        // Card is already revealed, do nothing.
    } else {
        // Card is hidden, flip it over.
        classes.add('open');
        if (!openCard) {
            openCard = e.target;
        } else {
            // There is another open card; check for a match.
            if (cardName(openCard) === cardName(e.target)) {
                // Success! Keep both cards flipped.
                classes.remove('open');
                classes.add('match');
                openCard.classList.remove('open');
                openCard.classList.add('match');
                openCard = null;
            } else {
                // Wah-wah, try again. Flip both cards face down again.
                classes.remove('open');
                openCard.classList.remove('open');
                openCard = null;
            }
        }
    }
}
cards.forEach(card => card.addEventListener('click', cardClick));
