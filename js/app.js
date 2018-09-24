/*
 * Global Variables 
 */

let cards = $('.card');
let deckDOM = $('.deck');
let cardsArray = [...cards];

let matchedCards = [];
let oCards = [];
let clicks = 0;
let moveSpan = document.querySelector('.moves');

let second = 0;
let timer = document.querySelector(".timer");
let setTime;

let modal = $('#modal');
let modalContainer = $('.modal-container');

const stars = document.querySelector('.stars');
const icons = [
    "fa-diamond",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-anchor",
    "fa-bolt",
    "fa-bolt",
    "fa-cube",
    "fa-cube",
    "fa-leaf",
    "fa-leaf",
    "fa-bomb",
    "fa-bomb",
    "fa-bicycle",
    "fa-bicycle",
];


/*
 * Game shuffles on document load using the function shuffleCards
 */

$(document).ready(function () {
    shuffleCards();
});

/*
 * For loop iterates through the icon length and adds click funtion to cards
 * Click a card and it calls the functions gameLogic and addClass
 */

for (let i = 0; i < icons.length; i++) {
    $(cards[i]).on('click', gameLogic);
    $(cards[i]).on('click', addClass);
}

/*
 * Click the restart icon: 
 * resets the stars back to 3
 * removes classes from cards
 * clears cards back to 0
 * resets clock back to 0
 * resets moves back to 0
 */

$('.restart').on('click', function () {
    starReset();
    shuffleCards();
    $(cards).removeClass('open none');
    $(cards).removeClass('show match');
    $(cards).removeClass('noMatch none');
    //match cards
    matchedCards.innerHTML = [];
    //number of moves
    clicks = 0;
    moveSpan.innerHTML = 0;
    // clock 

    clearInterval(setTime);
    second = 0;
    timer.innerHTML = 0;

});


function addClass() {
    $(this).addClass('open');
    $(this).addClass('show');
    $(this).addClass('none');
}

function shuffleCards() {
    let letShuffle = shuffle(cardsArray);
    for (let i = 0; i < letShuffle.length; i++) {
        deckDOM.append(letShuffle[i]);
    }
};

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/*
 * For loop loops through the Icons array
 * If two cards are click, game logic will decided if that match or not
 * if the cards match the function yesMatch is called
 * else the no match function is called
 */


function gameLogic() {

    clock();

    for (let i = 15; i < icons.length; i++) {
        oCards.push(this);
        oCards.innerHTML = `<i class="${icons[i]}"></i>`;
        if (oCards.length === 2) {
            if (oCards[0].innerHTML === oCards[1].innerHTML) {
                matchedCards.push(this, oCards[0]);
                yesMatch();
                gameOver();
            } else {
                noMatch();

            }
        } else {
            clickCounter();
            starMoves();
        }
    }
}

/*
 * Compares cards and adds/ remove class depending on icon
 * SetTimeout function slows down class style when clicked
 */

function yesMatch() {
    for (let i = 15; i < icons.length; i++) {
        setTimeout(() => {
            $(oCards[0]).addClass("open show match none");
            $(oCards[1]).addClass("open show match none");
            disable();
        }, 350);
    }
    setTimeout(() => {
        $(oCards[0]).removeClass("none");
        $(oCards[1]).removeClass("none");
        enable();
        oCards = [];
    }, 700);
}

function noMatch() {
    for (let i = 15; i < icons.length; i++) {
        setTimeout(() => {
            $(oCards[0]).addClass("noMatch");
            $(oCards[1]).addClass("noMatch");
            disable();
        }, 350);
    }
    setTimeout(() => {
        $(oCards[0]).removeClass("show open noMatch");
        $(oCards[1]).removeClass("show open noMatch");
        enable();
        oCards = [];
    }, 700);
}

/*
 * enable cards and disable matched cards 
 * Filtered cards using jQuery $.grep() method 
 */

function disable() {
    $.grep(cards, function (cards) {
        $(cards).addClass('none');
    });
}

function enable() {
    $.grep(cards, function (cards) {
        $(cards).removeClass('none');
        for (var i = 0; i < matchedCards.length; i++) {
            $(matchedCards[i]).addClass('none');
        }
    });
}

/*
 * Counts moves (one move is when 2 cards are clicked)
 */

function clickCounter() {
    clicks++;
    moveSpan.innerHTML = clicks;
}

/*
 *  If statement comparing number of moves 
 *  8 moves gives 3 stars
 *  9-13 moves give 2 stars
 *  14+ moves give 1 star
 * 
 * jQuery li:eq selects the stars from the list using li number value
 * When numbers of moves are reached is displays the css style to hiddeh
 */

function starMoves() {
    if (clicks > 8 && clicks < 12) {
        $('ul.stars li:eq(3)').css('visibility', 'hidden');
    }
    if (clicks > 8 && clicks < 12) {
        $('ul.stars li:eq(2)').css('visibility', 'hidden');
    } else if (clicks > 13) {
        $('ul.stars li:eq(1)').css('visibility', 'hidden');
    }
}

function starReset() {
    $('ul.stars li').css('visibility', 'visible');
};

/*
 *  Function starts timer at 0
 *  Time stops when modal pops up / restart is clicked
 */

function clock() {
    clearInterval(setTime);
    setTime = setInterval(function () {
        timer.innerHTML = second;
        second++;
    }, 1000);
}

/*
 *  When all cards = 16 
 *  Modal pops up
 *  The clock stops
 * 
 *  Displays: # of Moves, Star Rating, Time completed
 *  Calls function closeModal
 */

function gameOver() {
    if (matchedCards.length == 16) {
        $(modalContainer).css('display', 'block');
        clearInterval(setTime);

        let starRating = document.querySelector(".stars").innerHTML;
        const stars = document.querySelector('.stars');
        let fTime = timer.innerHTML = second;

        $("#finalMove").html('Moves: ' + clicks);
        $("#starsContent").html('Rating: ' + starRating);
        $("#timeContent").html('Seconds: ' + fTime);

        closeModal();
    }
}

function closeModal() {
    $('.close-btn').on('click', function () {
        setTimeout(() => {
            $(modalContainer).css('display', 'none');
        }, 40);
    })
}

/*
 * Modal button click: resets timer, moves, star rating, clears and shuffles cards
 */

$('.play-again').on('click', function () {
    starReset();
    shuffleCards();
    $(modalContainer).css('display', 'none');
    $(cards).removeClass('open none');
    $(cards).removeClass('show match');
    $(cards).removeClass('noMatch none');
    //match cards
    matchedCards.innerHTML = [];
    //number of moves
    clicks = 0;
    moveSpan.innerHTML = 0;
    // clock 
    clearInterval(setTime);
    second = 0;
    timer.innerHTML = 0;

});