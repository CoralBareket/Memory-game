$(document).ready(function() {
    let playerName, numPairs, cards, firstCard, secondCard, matchedPairs, startTime, timerInterval;
    const emojis = ["😊", "🌈", "⚡", "❄️", "🔥", "🍀", "🍁", "🌹", "🍉", "🍇", "🍊", "🍓", "🍒", "🥑",
        "🥦", "🍕", "🍔", "🍟", "🍿", "🥤", "🎨", "🎸", "🎮", "🎯", "🎲", "🏅", "✈️", "🚀", "⚽", "🌺"];

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
        let selectedEmojis = shuffle(emojis.slice()).slice(0, numPairs); // Shuffle the emojis array and pick the first numPairs elements
        cards = [];
        selectedEmojis.forEach((emoji, index) => {
            cards.push({ value: emoji, class: `card${index + 1}` });
            cards.push({ value: emoji, class: `card${index + 1}` });
        });
        shuffle(cards);
        console.log(`Generated Cards: ${cards}`);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayCards() {
        const gameBoard = $('#gameBoard');
        gameBoard.empty();
        const totalCards = cards.length;
        const { columns, rows } = calculateGrid(totalCards);

        gameBoard.css('grid-template-rows', `repeat(${rows}, 100px)`);
        gameBoard.css('grid-template-columns', `repeat(${columns}, 100px)`);
        cards.forEach(card => {
            const cardElement = $('<div></div>').addClass(`card hidden ${card.class}`).data('value', card.value).click(cardClickHandler);
            gameBoard.append(cardElement);
        });
        console.log(`Displayed Cards on Board`);
    }

    function calculateGrid(totalCards) {
        const maxContainerWidth = Math.min($(window).width(), 1000); // Maximum width of the viewport width, but not more than 1000px
        const cardWidth = 110; // Width of each card including margin
        const columns = Math.floor(maxContainerWidth / cardWidth);
        const rows = Math.ceil(totalCards / columns);
        return { columns, rows };
    }

    function cardClickHandler() {
        if ($(this).hasClass('hidden') && (!firstCard || !secondCard)) {
            $(this).removeClass('hidden').addClass('flipped');
            $(this).text($(this).data('value'));  // This line ensures the emoji is displayed
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
            firstCard.addClass('matched').removeClass('flipped');
            secondCard.addClass('matched').removeClass('flipped');
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
        firstCard.addClass('hidden').removeClass('flipped').text('');
        secondCard.addClass('hidden').removeClass('flipped').text('');
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
