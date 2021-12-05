'use strict';

// hero

import {Ghost} from './ghost.js';
import {Hero} from './hero.js';

let LEFT_COUNT = 0;
let UP_COUNT = 0;
let SPEED = 10;

window.addEventListener('keydown', handleHeroAndBullet);

function handleHeroAndBullet(e) {
    handleHero(e)
    handleBullet(e)
}

function handleHero(e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
        hero.handleHeroAngle('left');
        hero.moveHero('left');
    } else if (key === 'ArrowRight') {
        hero.handleHeroAngle('right');
        hero.moveHero('right');
    } else if (key === 'ArrowUp') {
        hero.handleHeroAngle('back');
        hero.moveHero('up');
    } else if (key === 'ArrowDown') {
        hero.handleHeroAngle ('front');
        hero.moveHero('down');
    }
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

let hero = new Hero(LEFT_COUNT, UP_COUNT, SPEED, $bullet, BULLET_MOVED_COUNT, BULLET_SPEED)


// ghost

let started = true;

let GHOST_DOWN_COUNT = 0;
let GHOST_LEFT_COUNT = 0;

let MOVED_COUNT = 0;
let WILL_MOVE_COUNT = 15;
let GHOST_MOVE_WIDTH = 1;

let GHOST_SPEED =  20;
let GHOST_COUNT = 5;

const $ghostField = document.querySelector('.ghost__field');

let ghost = new Ghost(
    GHOST_COUNT, GHOST_MOVE_WIDTH, WILL_MOVE_COUNT
);

const $startButton = document.querySelector('.start-button');
const $heroWrap = document.querySelector('.hero__wrap');
const $gameOverBanner = document.querySelector('.gameover-banner');
const $levelUpBanner = document.querySelector('.levelup-banner');
const $gameWinBanner = document.querySelector('.gamewin-banner');
const $button = document.querySelector('.button');
$button.addEventListener('click', handleButtonClick);
$startButton.addEventListener('click', startGame);
let LIFE_COUNT = 20;

function handleButtonClick(e) {
    let targetClass = e.target.getAttribute('class');
    if(targetClass !== 'play-again__img') {
        return;
    }
    restartGame();
}


async function startGame() {
    ALIVE_GHOST_COUNT = GHOST_COUNT;
    $startButton.classList.add('remove');
    $heroWrap.classList.remove('hide');
    $lifeContainer.classList.remove('hide');
    await ghost.createRandomGhost(GHOST_COUNT);
    await moveGhost(WILL_MOVE_COUNT, GHOST_SPEED);
    await getElementSize();
    await createLife(LIFE_COUNT);
}

function stopGame() {
    started = false;
    displayLife();
    clearInterval(move);
}

function restartGame() {
    $gameWinBanner.classList.add('remove');
    console.log(LIFE_COUNT, GHOST_COUNT, MOVED_COUNT, WILL_MOVE_COUNT, GHOST_SPEED)
    //need to initialize : lifeCount, movedCount, ghostSpeed
}

function handleGameWin() {

}

function handleGameOver() {
    $heroWrap.classList.add('hide');
    $gameOverBanner.classList.remove('remove');
}

const $lifeContainer = document.querySelector('.life-container');

function createLife(num) {
    for(let i = 0; i < num; i++) {
        const $lifeImgContainer = document.createElement('span');
        $lifeImgContainer.classList.add('life__img-contianer');
        $lifeImgContainer.innerHTML = `<img class="life__img" src="images/life.png" alt="life__img" >`
        $lifeContainer.appendChild($lifeImgContainer);
    }
}

function displayLife() {
    ALIVE_GHOST_COUNT = ghost.countAliveGhost();
    const $lifes = document.querySelectorAll('.life__img');
    $lifes.forEach((life) => {
        if(ALIVE_GHOST_COUNT === 0) {
            return;
        }
        if(!life.classList.contains('hide')) {
            life.classList.add('hide');
            ALIVE_GHOST_COUNT--;
            LIFE_COUNT--;
        }
    })
    if(LIFE_COUNT <= 0) {
        handleGameOver();
    } else {
        handleLevelUp();
        return;
    }
}

let level = 0;

function handleLevelUp() {
    level++;
    $heroWrap.classList.add('hide');
    if(level < 3) {
        let willMoveCount = WILL_MOVE_COUNT + level * 10;
        let speed = GHOST_SPEED - level * 5;
        $levelUpBanner.classList.remove('remove');
        setTimeout(() => {
            $levelUpBanner.classList.add('remove');
            handleNextGame(willMoveCount, speed);
        }, 2000);
    } else {
        $gameWinBanner.classList.remove('remove');
    }
}


function handleNextGame(willMoveCount, speed) {

    MOVED_COUNT = 0;

    $heroWrap.classList.remove('hide');
    $ghostField.style.transform = `translate(0px, 0px)`;
    displayGhosts();
    ghost.createRandomGhost(GHOST_COUNT);
    started = true;
    GHOST_LEFT_COUNT = 0;
    GHOST_DOWN_COUNT = 0;
    moveGhost(willMoveCount, speed);
}

let move;
let isLeft = true;
$ghostField.addEventListener('transitionend', handlePassedGhost);

function moveGhost(willMoveCount, speed) {
     move = setInterval(() => {
        console.log('move interval is running...')
        if(!started) {return;}
        MOVED_COUNT++;
        moveGhostTo(isLeft);


        if(MOVED_COUNT === willMoveCount) {
            clearInterval(move);
            isLeft = !isLeft;
            MOVED_COUNT = 0;
            moveGhost(willMoveCount, speed);
        }

    }, speed);
    move;

}

function moveGhostTo(isLeft) {
    if (isLeft === true) {
        GHOST_LEFT_COUNT--;
        GHOST_DOWN_COUNT++;

    } else  {
        GHOST_LEFT_COUNT++;
        GHOST_DOWN_COUNT++;

    }
    $ghostField.style.transform =`
        translate(${GHOST_LEFT_COUNT * GHOST_MOVE_WIDTH}px, ${GHOST_DOWN_COUNT * GHOST_MOVE_WIDTH}px)`;
    }

function displayGhosts() {
    const $ghosts = document.querySelectorAll('.ghost__img');
    $ghosts.forEach((ghost) => {
        if(ghost.classList.contains('ghost__img--dead')) {
            ghost.classList.remove('ghost__img--dead');
            ghost.classList.remove('hide');
        }
    })
}

function handlePassedGhost() {
    if(!started) return;
    const $ghostFieldLocation = $ghostField.getBoundingClientRect().top;
    if($ghostFieldLocation > 800) {
        stopGame()
    }
}

// shooting

let GHOST_WIDTH;
let GHOST_HEIGHT;
let BULLET_WIDTH;
let BULLET_HEIGHT;

let ALIVE_GHOST_COUNT;


function getElementSize() {
    const $ghost = document.querySelector('.ghost__container');
    GHOST_WIDTH = $ghost.getBoundingClientRect().width;
    GHOST_HEIGHT = $ghost.getBoundingClientRect().height;

    BULLET_WIDTH = $bullet.getBoundingClientRect().width;
    BULLET_HEIGHT = $bullet.getBoundingClientRect().height;
}


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
                ghostImg.classList.add('hide');
            }, 400);
        } else if(ghostX - 30 < bulletX && bulletX<  ghostX + 30
            &&ghostY - 10 <bulletY && bulletY < ghostY + 10){
                clearInterval(moveBullet)
                BULLET_MOVED_COUNT = 0;
                $bullet.style.transform = `translateY(0px)`
                ghostImg.classList.add('ghost__img--dead');
                ALIVE_GHOST_COUNT--;
        }
    })
}
