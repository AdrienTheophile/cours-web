//CONST ET VAR

const colors = ['green', 'red', 'yellow', 'blue']

let playing = false
let level = 0
let clicks = 0
let pattern = []

let record = 0

//FONCTIONS

const restart = (() => {
    playing = false;
    level = 0;
    pattern = [];
    $('p').text('SIMON')
    $('#start-msg').show()
})


const checkSequence = ( color => {
    if( pattern[clicks] != color ) {
        alert('Game Over ! Vous avez perdu !')
        restart()
    }
})

const animateClick = ( (color, clickClass ) => {
    $('#' + color).addClass(clickClass)
    setTimeout( () => {
        $('#' + color).removeClass(clickClass)
    }, 150)
})

const animateSequence = ( idx => {
    let color = pattern[idx]
    setTimeout( () => {
        $('#' + color).fadeOut(200).fadeIn(200)
        if( ++idx < pattern.length ) {
            animateSequence(idx)
        }
    }, 500)
})

const nextSequence = ( () => {
    let idx = Math.floor(Math.random() * 4)
    let newColor = colors[idx]
    pattern.push(newColor)
    $('p').text(++level)

    if (level > record) {
        record = level - 1;
        $('#record').text(record);
    }
})

//ACTIONS 

$('.color-btn').click( e => {
    let color = e.target.id;
    let clickClass = color + '-click';
    if(playing) {
        animateClick(color, clickClass);
        checkSequence(color);
        if(++clicks === level) {
            clicks = 0;
            nextSequence();
            animateSequence(0);
        }
    }
})

$('.play-click').click( () => {
    if (!playing) {
        clicks = 0
        nextSequence()
        animateSequence(0)
        playing = true
        $('#start-msg').hide()
    }
})