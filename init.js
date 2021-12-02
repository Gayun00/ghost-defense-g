'use strict';
const $heroWithBullet = document.querySelector('.hero__wrap');
const $heroContainer = document.querySelector('.hero__container');
const $heroImg = document.querySelector('.hero__img');

window.addEventListener('keydown', handleHeroAndBullet);

function handleHeroAndBullet(e) {
    handleHero(e)
    handleBullet(e)
}

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
    } else if (key === 'ArrowDown') {
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
    $heroWithBullet.style.transform =` translate(${LEFT_COUNT * SPEED}px, ${UP_COUNT * SPEED}px)`;

}

// bullet

let BULLET_MOVED_COUNT = 0;
const BULLET_SPEED = 8;
let moveBullet;

const $bullet = document.querySelector('.bullet');
$bullet.addEventListener('transitionend', handleShooting);

function handleBullet(e) {
    if(e.keyCode === 32) {
        clearInterval(moveBullet);
        moveBullet = setInterval(() => {
            BULLET_MOVED_COUNT--;
            $bullet.style.transform = `translateY(${BULLET_MOVED_COUNT*10}px)`
            if(BULLET_MOVED_COUNT === -50) {
                clearInterval(moveBullet)
                BULLET_MOVED_COUNT = 0;
                $bullet.style.transform = `translateY(0px)`
            }
        }, BULLET_SPEED);
    }

}

function reloadBullet(setIntervalName) {
    clearInterval(setIntervalName)
    BULLET_MOVED_COUNT = 0;
    $bullet.style.transform = `translateY(0px)`
}


// ghost

let started = true;

let GHOST_DOWN_COUNT = 0;
let GHOST_LEFT_COUNT = 0;

let MOVED_COUNT = 0;
let WILL_MOVE_COUNT = 7;
let GHOST_MOVE_WIDTH = 1;

let GHOST_SPEED =  20;

const GHOST_COUNT = 10;

const $ghostField = document.querySelector('.ghost__field');
const $ghostFieldWidth = $ghostField.getBoundingClientRect().width;
const $ghostFieldHeight = $ghostField.getBoundingClientRect().height;

async function startGame() {
    await createRandomGhost(GHOST_COUNT)
    await moveGhost();
    await getElementSize();
}

let GHOST_WIDTH;
let GHOST_HEIGHT;

let BULLET_WIDTH;
let BULLET_HEIGHT;

function getElementSize() {
    const $ghost = document.querySelector('.ghost__container');
    GHOST_WIDTH = $ghost.getBoundingClientRect().width;
    GHOST_HEIGHT = $ghost.getBoundingClientRect().height;

    BULLET_WIDTH = $bullet.getBoundingClientRect().width;
    BULLET_HEIGHT = $bullet.getBoundingClientRect().height;
    console.log(GHOST_WIDTH, GHOST_HEIGHT)
}

startGame();

function handleShooting(e) {
    const bulletX = $bullet.getBoundingClientRect().left;
    const bulletY = $bullet.getBoundingClientRect().top;

    const $ghosts = document.querySelectorAll('.ghost__container');
    $ghosts.forEach((ghost) => {

        const ghostImg = ghost.querySelector('.ghost__img')
        const ghostX = ghost.getBoundingClientRect().left;
        const ghostY = ghost.getBoundingClientRect().top;

        if(ghostImg.classList.contains('ghost__img--dead')) {
            setTimeout(() => {
                ghostImg.classList.add('ghost__img--hide');
            }, 400);
        } else if(ghostX - 30 < bulletX && bulletX<  ghostX + 30
            &&ghostY - 10 <bulletY && bulletY < ghostY + 10){
                clearInterval(moveBullet)
                BULLET_MOVED_COUNT = 0;
                $bullet.style.transform = `translateY(0px)`
                ghostImg.classList.add('ghost__img--dead');
        }

        console.log(ghost)
    })

}


function moveGhost() {
    handleMoveToDownLeft()
}


function handleMoveToDownLeft() {
    if(started === false) return;
    const moveDownLeft = setInterval(() => {
        moveGhostTo('left')
        MOVED_COUNT++;
        handlePassedGhost();
        if(MOVED_COUNT === WILL_MOVE_COUNT) {
            clearInterval(moveDownLeft)
            MOVED_COUNT = 0;
            handleMoveToDownRight();
        }
    }, GHOST_SPEED)
}

function handleMoveToDownRight() {
    if(started === false) return;
    const moveDownRight = setInterval(() => {
        moveGhostTo('right')
        MOVED_COUNT++;

        if(MOVED_COUNT === WILL_MOVE_COUNT) {
            clearInterval(moveDownRight)
            MOVED_COUNT = 0;
            handleMoveToDownLeft();
        }
    }, GHOST_SPEED)
}

function handlePassedGhost() {
    const $ghostFieldLocation = $ghostField.getBoundingClientRect().top;

    if($ghostFieldLocation === 800) {
        started = false;
    }
}

function moveGhostTo(direction) {
    if (direction === 'left') {
        GHOST_LEFT_COUNT--;
        GHOST_DOWN_COUNT++;
    } else  {
        GHOST_LEFT_COUNT++;
        GHOST_DOWN_COUNT++;
    }
    $ghostField.style.transform =`translate(${GHOST_LEFT_COUNT *GHOST_MOVE_WIDTH}px, ${GHOST_DOWN_COUNT *GHOST_MOVE_WIDTH}px)`;
}

// random ghost
function createRandomGhost(count) {
    for(let i = 0; i < count; i++) {
        const $ghostEl = document.createElement('div');
        $ghostEl.classList.add('ghost__container')
        $ghostEl.innerHTML = `
            <img class="ghost__img" src="images/enemy.png" data-direction=${isStartedFromLeft()}>`
        $ghostField.appendChild($ghostEl);
        const $ghostImgEl = document.querySelector('.ghost__img');

        const $ghostElWidth = $ghostEl.getBoundingClientRect().width;

        const x = createRandomNumber(
            (WILL_MOVE_COUNT * GHOST_MOVE_WIDTH) + $ghostElWidth / 2,
            $ghostFieldWidth - (WILL_MOVE_COUNT * GHOST_MOVE_WIDTH + $ghostElWidth / 2));
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

