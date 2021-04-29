const app = {};

// This is needed for the async stuff. The async only runs if this is true. Makes sure my game logic isn't staying on in the background.
app.gameOn = false;

// Could've probably done difficulty better, but it works. I don't know why, but when the app loads, app.difficulty.selected being 1 doesn't for some reason default the game to Easy? I don't get it. I dunno. I worked around it.
app.difficulty = [
    selected = 1,
    {
        name: `Easy`,
        scoreMultiplier: 1,
        boardSize: 7,
        time: 30
    },
    {
        name: `Medium`,
        scoreMultiplier: 1.5,
        boardSize: 9,
        time: 20
    },
    {
        name: `Hard`,
        scoreMultiplier: 2,
        boardSize: 11,
        time: 10
    }
];

// What's a game without trying to be better than everyone else?
app.score = 0;

app.pickPointSquares = function() {

    // I'm not 100% satisfied with this. I was hoping to make the interval semi-randomized, but it seems a bit more nuanced to do that than I anticipated. But otherwise, does the job; every .6 seconds, picks a square on the grid to make into a points square
    setInterval(function() {
        if (app.gameOn) {
            const x = Math.floor(Math.random() * 7);
            const y = Math.floor(Math.random() * 7);
    
            $(`.pos-${x}-${y}`).addClass(`point`).removeClass('normal');
        }
    }, 600);
}

app.endGame = function(timer) {
    // TURN OFF THE GAME!
    app.gameOn = false;
    // STOP THE CLOCK!
    $(`.timer-box`).css(`opacity`, `0`);
    $(`#timer`).text(``);
    clearInterval(timer);
    // CLEAR THE BOARD!
    $(`.board`).empty().css(`opacity`, `0`);
    // GET IT READY AGAIN! And notice that I didn't make the Start button invisible again like it is initially. This is 'cause I couldn't figure out how to make radios uncheck. I hid the start button in the first place to make sure you HAD to hit a radio to start.
    $(`.options`).css(`display`, `flex`).css(`pointer-events`, `auto`);
}

app.startTimer = function() {
    let time = app.difficulty[app.difficulty.selected].time;
    // Unhide the timer
    $(`.timer-box`).css(`opacity`, `1`);
    $(`#timer`).text(time);
    // Tick it down every second, displaying every second that goes down.
    let timer = setInterval(function() {
        if (time > 0 && app.gameOn) {
            time -= 1;
            $(`#timer`).text(time);
        } else {
            app.endGame(timer);
        }
    }, 1000);
};

app.startGame = function() {
    // Your selected difficulty is accounted for!
    $(`[type="radio"]`).on(`click`, function() {
        app.difficulty.selected = $(this).attr(`id`);
        // And because I didn't have a way to make the difficulty come pre-loaded for whatever reason (I dunno, I don't have time to figure it out), I have to Start button hide until difficulty is determined. Then it shows up to play.
        $(`#start`).css(`opacity`, `1`).css(`pointer-events`, `auto`);
    });

    // Press the start button, start the things. Fancy that.
    $(`#start`).on(`click`, function() {
        // Just in case! It only works if there's no game happening. You can never be too careful.
        if (!app.gameOn) {
            // Git dat but'n outta here.
            $(`.options`).css(`display`, `none`).css(`pointer-events`, `none`);
            // Wipe the score. Why here? So that you can stare at your score, really steep in it, stew on it, and decide for yourself "I can do better" before you slap that start button again
            app.changeScore(0, true);
            // Draw the grid
            app.makeGrid(app.difficulty[app.difficulty.selected].boardSize);
            // Start the game, in the technical sense.
            app.gameOn = true;
            // Enable the things! Also in the techncial sense.
            app.clickSquare();
            app.pickPointSquares();
            app.startTimer();
        }
    });
};

app.makeGrid = function(size) {
    // First and foremost, make the board appear as if from thin air!
    $(`.board`).css(`opacity`, `1`);
    // Draw dem rows
    for (let i = 0; i < size; i++) {
        $('.board').append(`<div class="row row-${i}"></div>`);
        // Draw dem squerrs
        for (let j = 0; j < size; j++) {
            const newSquare = `<div class="square pos-${j}-${i} normal"></div>`;

            $(`.row-${i}`).append(newSquare);
            // ...and make those squerrs RIGHT! They gotta fit the board no matter how many squares there are! I didn't pick 420 as a joke, 500 made the board jank and 400 seemed too small, I like the extra framing I get with 420.
            $(`.square`).css(`width`, `${420 / app.difficulty[app.difficulty.selected].boardSize}`).css(`height`, `${420 / app.difficulty[app.difficulty.selected].boardSize}`);
        }
    };
    
};

app.changeScore = function(pointChange, startOver) {
    // Change the score in the system, change it on the page
    app.score += pointChange * app.difficulty[app.difficulty.selected].scoreMultiplier;
    if (app.score < 0 || startOver) app.score = 0;
    // console.log(startOver, score);
    $(`#score`).text(Math.floor(app.score));
}

app.clickSquare = function() {

    $(`.square`).on(`click`, function() {
        const daSquare = $(this);
        // If the square is the points square, point, if not, nega-point. This is what makes it a game, because there's a risk-reward trade-off with going fast.
        if (daSquare.hasClass(`point`)) {
            app.changeScore(1);
            // remove point, add normal. I know Toggle exists, but why take a chance this If somehow triggers and toggles the wrong way?
            daSquare.removeClass(`point`);
            daSquare.addClass(`normal`);
        } else {
            app.changeScore(-2);
        }
    });
}

app.init = function() {
    // Innit a startGame() we got here?
    app.startGame();
};

$(document).ready(function() {
    // It's an app, innit?
    app.init();
});