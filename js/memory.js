/*
 *The javaScript for the memory game.
 * 1. It shuffles the array of cards.
 * 2. Adds them to the deck
 * 3. Keeps tack of which cards are still face down
 * 4. Counts the Moves
 * 5. Reduces stars as time passes
 * 6. Ends the game when all are flipped
*/

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//  Shuffle function from http:// stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * creates the card for the deck
 */


const createCard = function(card) {
  // create a new card
  const div = document.createElement('div');
  div.classList.toggle('card');
  // create the card type and add it to the card
  const i = document.createElement('i');
  i.classList.add(...card);
  div.appendChild(i);
  return div;
}


/*
 * Adds the newly flipped card to the list of flipped cards
 */

const addToList = function(card) {
  flippedCards.push(card);
}

/*
 * removes however many classes
 */

 const removeClass = function(card, ...clas) {
   card.classList.remove(...clas)
 }


/*
 * adds however many classes
 */

const addClass = function(card, ...clas) {
  card.classList.add(...clas);
}


/*
 * Checks if the two recently drawn cards match
 * If they do it will trigger a blue animation
 * If they don't it will trigger the red animation
*/

const checkCard = function() {
  const index = flippedCards.length - 1;
  // get the card just flipped and its type.
  const lastCard = flippedCards[index];
  const lastType = lastCard.firstChild.classList[1];
  // get the card drawn before and its type
  const next2LastCard = flippedCards[index - 1];
  const next2LastType = next2LastCard.firstChild.classList[1];

  // Check if they match
  if (lastType === next2LastType) {

    //toggle the match
    addClass(lastCard, 'match');
    addClass(next2LastCard, 'match');

    setTimeout(function() {
      addClass(lastCard, 'return');
      addClass(next2LastCard, 'return')
    }, 300)

  } else {
    addClass(lastCard, 'wrong');
    addClass(next2LastCard, 'wrong');

    setTimeout(function() {
      addClass(lastCard, 'back');
      addClass(next2LastCard, 'back');
    }, 200)
    setTimeout(function(){
      lastCard.classList.remove('open','show','wrong', 'back');
      next2LastCard.classList.remove('open','show','wrong', 'back');
      flippedCards.splice(index-1,2);
    }, 1000)


  }
  incMoveCount();
}


/*
 * increments the move count and updates the document
 */

const incMoveCount = function() {
  moveCount += 1;
  moves.innerHTML = moveCount;

}

/*
 * Keeps the time and resets when the game is reset.
 */
const timeKeeper = function() {
  if (!gameWon) {
    if (!hasRestart){
      time = performance.now() - lastTime;
    } else {
      lastTime = performance.now();
      hasRestart = false;
      time = performance.now() - lastTime;
    }
    minutes = Math.floor((time % (1000 * 60 * 60)) / (1000* 60));
    seconds = Math.floor((time % (1000 * 60)) / 1000);
    if (seconds > 9) {
      document.querySelector('.timer').innerHTML = `${minutes}:${seconds}`;
    } else {
      document.querySelector('.timer').innerHTML = `${minutes}:0${seconds}`;
    }
    const firstStar = document.querySelectorAll('i');

    if (time >= 60000 && time < 80000) {
      addClass(firstStar[0], 'remove')
    } else if (time >= 120000) {
      addClass(firstStar[1], 'remove')
    }
  }
}
/*
 * Restarts the game: reshuffling the deck
 * and resetting the move counter
 */

 const gameRestart = function() {
   while (playArea.hasChildNodes()) {
     playArea.removeChild(playArea.lastChild);
   }
   moveCount = -1;
   gameWon = false;
   hasRestart = true;
   flippedCards = [];
   const firstStar = document.querySelectorAll('i');
   removeClass(firstStar[0], 'remove');
   removeClass(firstStar[1], 'remove');
   removeClass(playArea, 'won');
   removeClass(document.querySelector('.game-won'), 'won');
   incMoveCount();
   gameStart();
 }


/*
 * If all the cards are in the list the game is over.
 * The screen changes to a game won heading with the stats and an option to play again
 */

const gameOver = function() {
  if (flippedCards.length === 16) {
    gameWon = true;
    setTimeout(function(){
      playArea.classList.toggle('won');
      addClass(document.querySelector('.game-won'), 'won');
    }, 1000);
  }
}
/*
 * Starts the process after a card is flipped
 * Calls functions addToList, checkCard, moveCounter, and gameOver;
 */


 const flipCard = function(evt) {
   // get the card that was clicked
   const card = evt.target;
   if (!card.classList.contains('row')) {
     //open it
     addClass(card, 'open','show')

     //add to open list
     addToList(card);

     //checks if the card matches another
     if (flippedCards.length % 2 == 0) {
       checkCard();
     }

     gameOver();
   }
 }


const gameStart = function() {
  // the complete deck
  const deck = [["fa", "fa-diamond"],["fa", "fa-paper-plane-o"],
              ["fa", "fa-anchor"],["fa", "fa-bolt"],["fa", "fa-cube"],["fa", "fa-anchor"],
              ["fa", "fa-leaf"],["fa", "fa-bicycle"],["fa", "fa-diamond"],["fa", "fa-bomb"],
              ["fa", "fa-leaf"],["fa", "fa-bomb"],["fa", "fa-bolt"],["fa", "fa-bicycle"],
              ["fa", "fa-paper-plane-o"],["fa", "fa-cube"]];
  // shuffled deck
  const shuffledDeck = shuffle(deck);



  // add the deck to the document
  let myDocFrag = document.createDocumentFragment();
  for (const card of shuffledDeck) {
    const div = createCard(card);

    // add the card to the doc frag
    myDocFrag.append(div);
  }
  playArea.appendChild(myDocFrag);

}


let flippedCards = [];

const playArea = document.querySelector('.row')

// initializes the move count and selects the element
// to change
let moveCount = 0;
const moves = document.querySelector('span');

// starts the game
gameStart();
let gameWon = false;

// adds the event listener to the cards
playArea.addEventListener('click', flipCard);

// selects the restart button
const restart = document.querySelector('.fa-repeat');
let hasRestart = false;
restart.addEventListener('click', gameRestart);

// sets the timer
let time = 0;
let lastTime = 0;

let setTime = setInterval(timeKeeper, 1000)
