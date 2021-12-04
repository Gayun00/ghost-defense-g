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
    GHOST_COUNT, GHOST_MOVE_WIDTH, WILL_MOVE_COUNT,
    GHOST_LEFT_COUNT, GHOST_DOWN_COUNT
);

const $startButton = document.querySelector('.start-button');
const $heroWrap = document.querySelector('.hero__wrap');
const $gameOverBanner = document.querySelector('.gameover-banner');
const $levelUpBanner = document.querySelector('.levelup-banner');
$startButton.addEventListener('click', startGame);


let LIFE_COUNT = 10;

async function startGame() {
    ALIVE_GHOST_COUNT = GHOST_COUNT;
    $startButton.classList.add('remove');
    $heroWrap.classList.remove('hide');
    $lifeContainer.classList.remove('hide');
    await ghost.createRandomGhost(GHOST_COUNT);
    await moveGhost(GHOST_MOVE_WIDTH);
    // await handleMoveToDownLeft();
    await getElementSize();
    await createLife(LIFE_COUNT);
}

function stopGame() {
    console.log('stop game');
    started = false;
    displayLife();
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
    console.log('display life')
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

function handleLevelUp() {
    console.log('levelup')
    $levelUpBanner.classList.remove('remove');
    $heroWrap.classList.add('hide');
    setTimeout(() => {
        $levelUpBanner.classList.add('remove');
        handleNextGame();
    }, 2000);
}

let ADD_GHOST_COUNT = 5;
let ADD_GHOST_MOVE_WIDTH = 5;

function handleNextGame() {
    ALIVE_GHOST_COUNT = GHOST_COUNT;
    GHOST_MOVE_WIDTH += ADD_GHOST_MOVE_WIDTH;
    console.log(ADD_GHOST_COUNT)
    console.log(ADD_GHOST_MOVE_WIDTH)
    console.log('next game')
    // MOVED_COUNT = 0;

    $heroWrap.classList.remove('hide');
    $ghostField.style.transform = `translate(0px, 0px)`;
    displayGhosts();
    ghost.createRandomGhost(GHOST_COUNT);
    started = true;
    moveGhost(GHOST_MOVE_WIDTH);
}

let isLeft = true;
$ghostField.addEventListener('transitionend', handlePassedGhost);

function moveGhost(moveWidth) {
    const move = setInterval(() => {
        if(!started) {return;}
        MOVED_COUNT++;
        ghost.moveGhostTo(isLeft, moveWidth);

        if(MOVED_COUNT === WILL_MOVE_COUNT) {
            clearInterval(move);
            isLeft = !isLeft;
            MOVED_COUNT = 0;
            moveGhost(moveWidth);
        }
    }, GHOST_SPEED);
}

function displayGhosts() {
    const $ghosts = document.querySelectorAll('.ghost__img');
    $ghosts.forEach((ghost) => {
        if(ghost.classList.contains('ghost__img--dead')) {
            ghost.classList.remove('ghost__img--dead');
            ghost.classList.remove('hide');
        }
    })
    //1. 돌면서 hide가 있으면 제거해 모두 나타내기
    //2. 추가 ghost 생성하기
}

function handlePassedGhost() {
    if(!started) return;
    console.log('handle passed ghost')
    const $ghostFieldLocation = $ghostField.getBoundingClientRect().top;
    if($ghostFieldLocation > 800) {
        console.log('reached 800')
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
