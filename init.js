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

const $ghostField = document.querySelector('.ghost__field');

let ghost = new Ghost();

const $startButton = document.querySelector('.start-button');
const $heroWrap = document.querySelector('.hero__wrap');
const $gameOverBanner = document.querySelector('.gameover-banner');
const $levelUpBanner = document.querySelector('.levelup-banner');
const $gameWinBanner = document.querySelector('.gamewin-banner');
const $button = document.querySelector('.button');

const gameStartSound = new Audio('audio/start.ogg');
const dyingSound = new Audio('audio/dying.wav');
const gameWinSound = new Audio('audio/gameWin.wav');
const gameOverSound = new Audio('audio/gameOver.wav');
const levelUpSound = new Audio('audio/levelup.mp3');
const backgroundSound = new Audio('audio/background.wav');

gameStartSound.volume = 0.4;
backgroundSound.volume = 0.05;

$button.addEventListener('click', handleButtonClick);
$startButton.addEventListener('click', startGame);
let LIFE_COUNT = 5;

function handleButtonClick(e) {
    let targetClass = e.target.getAttribute('class');
    if(targetClass !== 'play-again__img') {
        return;
    }
    restartGame();
}


async function startGame() {
    level = 0;
    backgroundSound.play();
    $startButton.classList.add('remove');
    $heroWrap.classList.remove('hide');
    $lifeContainer.classList.remove('hide');
    gameStartSound.play();
    setTimeout(() => {
        backgroundSound.play();
    }, 2000);
    await ghost.createRandomGhost(level);
    await ghost.moveGhost();
    await getElementSize();
    await createLife(LIFE_COUNT);
}

function stopGame() {
    started = false;
    displayLife();
    clearInterval(ghost.move);
}

function restartGame() {
    clearInterval(ghost.move);
    $gameWinBanner.classList.add('remove');
    LIFE_COUNT = 5;
    ghost.movedCount = 0;
    $ghostField.style.transform = `translate(0px, 0px)`;
    $gameOverBanner.classList.add('remove');
    started = true;
    ghost.leftCount = 0;
    ghost.downCount = 0;
    startGame();

}

function handleGameWin() {
    $gameWinBanner.classList.remove('remove');
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    gameWinSound.play();
}

function handleGameOver() {
    $heroWrap.classList.add('hide');
    $gameOverBanner.classList.remove('remove');
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    gameOverSound.play()
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
    levelUpSound.play();
        ghost.willMoveCount = ghost.willMoveCount+ level * 10;
        ghost.speed = ghost.speed - level * 5;
        $levelUpBanner.classList.remove('remove');
        setTimeout(() => {
            $levelUpBanner.classList.add('remove');
            handleNextGame();
        }, 2000);
    } else {
        handleGameWin();
    }
}


function handleNextGame() {

    ghost.movedCount = 0;

    $heroWrap.classList.remove('hide');
    $ghostField.style.transform = `translate(0px, 0px)`;

    ghost.createRandomGhost(level);
    started = true;
    ghost.started = true;
    ghost.leftCount = 0;
    ghost.downCount = 0;
    ghost.moveGhost();
}

$ghostField.addEventListener('transitionend', handlePassedGhost);


function handlePassedGhost() {
    if(!started) return;
    const $ghostFieldLocation = $ghostField.getBoundingClientRect().top;
    if($ghostFieldLocation > 800) {
        stopGame()
    }
    const aliveGhost = ghost.countAliveGhost();
    if(aliveGhost === 0) {
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
        } else if(ghostX - 30 < bulletX && bulletX <  ghostX + 30
            &&ghostY - 10 < bulletY && bulletY < ghostY + 10){
                clearInterval(moveBullet)
                BULLET_MOVED_COUNT = 0;
                $bullet.style.transform = `translateY(0px)`
                ghostImg.classList.add('ghost__img--dead');
                ALIVE_GHOST_COUNT--;
                dyingSound.currentTime = 0;
                dyingSound.play();
        }
    })
}
