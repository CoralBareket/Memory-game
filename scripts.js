$(document).ready(function() {
    let playerName, numPairs, cards, firstCard, secondCard, matchedPairs, startTime, timerInterval;
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥳']; // Add more emojis if needed

    $('#gameForm').submit(function(event) {
        event.preventDefault();
        playerName = $('#playerName').val();
        numPairs = parseInt($('#numPairs').val());
        if (numPairs > emojis.length) {
            alert(`Maximum number of pairs is ${emojis.length}`);
            return;
        }
        startGame();
    });

    function startGame() {
        $('#gameForm').hide();
        $('#gameInfo').show();
        $('#playerGreeting').text(`Hello, ${playerName}!`);
        startTime = new Date();
        matchedPairs = 0;
        $('#timeElapsed').text(0);
        clearInterval(timerInterval); // Ensure any previous timer is cleared
        timerInterval = setInterval(updateTimer, 1000); // Start a new timer
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
        for (let i = 0; i < numPairs; i++) {
            cards.push(emojis[i]);
            cards.push(emojis[i]);
        }
        shuffle(cards);
        console.log(`Generated Cards: ${cards}`);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        console.log(`Shuffled Cards: ${array}`);
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
        console.log(`Displayed Cards on Board`);
    }

    function cardClickHandler() {
        if ($(this).hasClass('hidden') && (!firstCard || !secondCard)) {
            $(this).removeClass('hidden').text($(this).data('value'));
            console.log(`Card Clicked: ${$(this).data('value')}`);

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
            firstCard.addClass('matched').removeClass('hidden');
            secondCard.addClass('matched').removeClass('hidden');
            matchedPairs++;
            firstCard = secondCard = null;
            console.log(`Matched Pairs: ${matchedPairs}`);
            if (matchedPairs === numPairs) {
                console.log("All pairs matched");
                setTimeout(function() {
                    clearInterval(timerInterval);
                    console.log("Timer stopped");
                    endGame();
                }, 500);
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
