$(document).ready(function() {
    let playerName, numPairs, cards, firstCard, secondCard, matchedPairs, startTime, timerInterval;

    $('#gameForm').submit(function(event) {
        event.preventDefault();
        playerName = $('#playerName').val();
        numPairs = $('#numPairs').val();
        startGame();
    });

    function startGame() {
        $('#gameForm').hide();
        $('#gameInfo').show();
        $('#playerGreeting').text(`Hello, ${playerName}!`);
        startTime = new Date();
        matchedPairs = 0;
        $('#timeElapsed').text(0);
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        generateCards();
        displayCards();
    }

    function updateTimer() {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        $('#timeElapsed').text(timeElapsed);
    }

    function generateCards() {
        cards = [];
        for (let i = 1; i <= numPairs; i++) {
            cards.push(i);
            cards.push(i);
        }
        shuffle(cards);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayCards() {
        const gameBoard = $('#gameBoard');
        gameBoard.empty();
        const totalCards = cards.length;
        const columns = Math.ceil(Math.sqrt(totalCards));
        const rows = Math.ceil(totalCards / columns);
        gameBoard.css('grid-template-columns', `repeat(${columns}, 100px)`);
        gameBoard.css('grid-template-rows', `repeat(${rows}, 100px)`);
        cards.forEach((value, index) => {
            const card = $('<div></div>').addClass('card hidden').data('value', value).click(cardClickHandler);
            gameBoard.append(card);
        });
    }

    function cardClickHandler() {
        if ($(this).hasClass('hidden') && (!firstCard || !secondCard)) {
            $(this).removeClass('hidden').text($(this).data('value'));

            if (!firstCard) {
                firstCard = $(this);
            } else {
                secondCard = $(this);
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        if (firstCard.data('value') === secondCard.data('value')) {
            firstCard.addClass('matched');
            secondCard.addClass('matched');
            matchedPairs++;
            firstCard = secondCard = null;
            if (matchedPairs === numPairs) {
                clearInterval(timerInterval);
                setTimeout(endGame, 500);
            }
        } else {
            setTimeout(hideCards, 1000);
        }
    }

    function hideCards() {
        firstCard.addClass('hidden').text('');
        secondCard.addClass('hidden').text('');
        firstCard = secondCard = null;
    }

    function endGame() {
        alert(`Congratulations, ${playerName}! You completed the game in ${$('#timeElapsed').text()} seconds.`);
        $('#playAgain').show();
    }

    $('#playAgain').click(function() {
        $('#playAgain').hide();
        $('#gameForm').show();
        $('#gameInfo').hide();
        $('#playerName').val('');
        $('#numPairs').val('');
    });
});
