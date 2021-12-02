'use strict';

const $heroContainer = document.querySelector('.hero__container');
const $heroImg = document.querySelector('.hero__img');

window.addEventListener('keydown', handleHero);

let LEFT_COUNT = 0;
let UP_COUNT = 0;
let SPEED = 10;

function handleHero(e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
        handleHeroAngle('left');
        moveHero('left');
    } else if (key === 'ArrowRight') {
        handleHeroAngle('right');
        moveHero('right');
    } else if (key === 'ArrowUp') {
        handleHeroAngle('back');
        moveHero('up');
    } else {
        handleHeroAngle ('front');
        moveHero('down');
    }
}

function handleHeroAngle(direction) {
    if($heroImg.classList.contains('hero--front')) {
        $heroImg.classList.remove('hero--front');
    } else if ($heroImg.classList.contains('hero--back')) {
        $heroImg.classList.remove('hero--back');
    } else if ($heroImg.classList.contains('hero--left')) {
        $heroImg.classList.remove('hero--left');
    } else if ($heroImg.classList.contains('hero--right')) {
        $heroImg.classList.remove('hero--right');
    }
        $heroImg.classList.add(`hero--${direction}`);
}

function moveHero(direction) {
    if (direction === 'left') {
        LEFT_COUNT--;
    } else if (direction === 'right') {
        LEFT_COUNT++;
    } else if (direction === 'up') {
        UP_COUNT--;
    } else {
        UP_COUNT++;
    }
    $heroContainer.style.transform =` translate(${LEFT_COUNT * SPEED}px, ${UP_COUNT * SPEED}px)`;
}

// ghost


const $ghostField = document.querySelector('.ghost__field');
const $ghostFieldWidth = $ghostField.getBoundingClientRect().width;
const $ghostFieldHeight = $ghostField.getBoundingClientRect().height;



function stopGhostMove(e) {
    const ghostTop = e.target.getBoundingClientRect().top;
    if (ghostTop === 700) {
        console.log('here stop it there');
    }
}



let GHOST_DOWN_COUNT = 0;
let GHOST_LEFT_COUNT = 0;

let MOVED_COUNT = 0;
let WILL_MOVE_COUNT = 2;
let GHOST_MOVE_WIDTH = 2

let GHOST_SPEED_ONCE = 1000;
let GHOST_SPEED =  GHOST_SPEED_ONCE * 2;

const GHOST_COUNT = 2;


async function startGame() {
    await createRandomGhost(GHOST_COUNT)
    const $ghostContainers = await document.querySelectorAll('.ghost__container');
    // await console.log($ghostContainers)
    await $ghostContainers.forEach(($ghostContainer) => {
        $ghostContainer.addEventListener('transitionend', stopGhostMove)
    })
    // await moveGhost($ghostContainers);

}

startGame();

function moveGhost($ghostContainers) {
    $ghostContainers.forEach((ghost) => {
        handleMoveToDownRight(ghost)

    })
    // await $ghostContainers.forEach(($ghostContainer) => {
    //     console.log('d')
    //     console.log($ghostContainer)
    //     if($ghostContainer.dataset.direction === 'left') {
    //         handleMoveToDownLeft();
    //     } else {
    //         handleMoveToDownRight();
    //     }
    // })
}

function handleMoveToDownLeft(ghost) {
    const moveToDownLeft = setInterval(() => {
        moveGhostDownAndLeft(ghost);
        MOVED_COUNT++;
        if (MOVED_COUNT === WILL_MOVE_COUNT) {
            MOVED_COUNT = 0;
            clearInterval(moveToDownLeft);
            handleMoveToDownRight(ghost);
        }
    }, GHOST_SPEED)
}

// handleMoveToDownLeft();

function handleMoveToDownRight(ghost) {
    const moveToDownRight = setInterval(() => {
        moveGhostDownAndRight(ghost);
        MOVED_COUNT++;
        if (MOVED_COUNT === WILL_MOVE_COUNT) {
            MOVED_COUNT = 0;
            clearInterval(moveToDownRight);
            handleMoveToDownLeft(ghost);
        }
    }, GHOST_SPEED)
}



function moveGhostDownAndLeft(ghost) {
    moveGhostTo(ghost, 'down');
    setTimeout(() => {
        moveGhostTo(ghost, 'left')
    }, GHOST_SPEED_ONCE)
}

function moveGhostDownAndRight(ghost) {
    moveGhostTo(ghost, 'down');
    setTimeout(() => {
        moveGhostTo(ghost, 'right')
    }, GHOST_SPEED_ONCE)
}


function moveGhostTo(ghost, direction) {
    if (direction === 'left') {
        GHOST_LEFT_COUNT--;
    } else if (direction === 'right') {
        GHOST_LEFT_COUNT++;
    } else {
        GHOST_DOWN_COUNT++;
    }
    ghost.style.transform =` translate(${GHOST_LEFT_COUNT *GHOST_MOVE_WIDTH}px, ${GHOST_DOWN_COUNT *GHOST_MOVE_WIDTH}px)`;

}

// random ghost
function createRandomGhost(count) {
    for(let i = 0; i < count; i++) {
        const $ghostEl = document.createElement('div');
        $ghostEl.classList.add('ghost__container')
        $ghostEl.innerHTML = `
            <img class="ghost__img" src="images/enemy.png" data-direction=${isStartedFromLeft()}>`
        $ghostField.appendChild($ghostEl);

        const x = createRandomNumber(0, $ghostFieldWidth);
        const y = createRandomNumber(0, $ghostFieldHeight);
        $ghostEl.style.left = `${x}px`;
        $ghostEl.style.top = `${y}px`;


    }

}

function isStartedFromLeft() {
    if (Math.round(createRandomNumber(1,2)) === 1) {
        return 'left';
    } else {
        return 'right';
    }
}


function createRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

