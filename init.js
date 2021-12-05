'use strict';

// hero

import {Ghost} from './ghost.js';
import {Hero} from './hero.js';
import {Sound} from './sound.js';

const hero = new Hero();

window.addEventListener('keydown', handleHeroAndBullet);
hero.$bullet.addEventListener('transitionend', handleShooting);

function handleHeroAndBullet(e) {
    hero.handleHeroAndBullet(e);
}


// ghost
const ghost = new Ghost();

let started = true;

// const $ghostField = document.querySelector('.ghost__field');
const $startButton = document.querySelector('.start-button');
// const $heroWrap = document.querySelector('.hero__wrap');
const $gameOverBanner = document.querySelector('.gameover-banner');
const $levelUpBanner = document.querySelector('.levelup-banner');
const $gameWinBanner = document.querySelector('.gamewin-banner');
const $button = document.querySelector('.button');

const sound = new Sound();


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
    sound.playBGM();
    $startButton.classList.add('remove');
    hero.$heroWithBullet.classList.remove('hide');
    $lifeContainer.classList.remove('hide');
    sound.playStart();
    setTimeout(() => {
        sound.playBGM();
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
    ghost.$ghostField.style.transform = `translate(0px, 0px)`;
    $gameOverBanner.classList.add('remove');
    started = true;
    ghost.leftCount = 0;
    ghost.downCount = 0;
    startGame();

}

function handleGameWin() {
    $gameWinBanner.classList.remove('remove');
    sound.stopBGM();
    sound.playWin();
}

function handleGameOver() {
    hero.$heroWithBullet.classList.add('hide');
    $gameOverBanner.classList.remove('remove');
    sound.stopBGM();
    sound.playGameOver();
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
    ghost.aliveGhostCount = ghost.countAliveGhost();
    const $lifes = document.querySelectorAll('.life__img');
    $lifes.forEach((life) => {
        if(ghost.aliveGhostCount === 0) {
            return;
        }
        if(!life.classList.contains('hide')) {
            life.classList.add('hide');
            ghost.aliveGhostCount--;
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
    hero.$heroWithBullet.classList.add('hide');
    if(level < 3) {
    sound.playLevelUp();
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

    hero.$heroWithBullet.classList.remove('hide');
    ghost.$ghostField.style.transform = `translate(0px, 0px)`;

    ghost.createRandomGhost(level);
    started = true;
    ghost.started = true;
    ghost.leftCount = 0;
    ghost.downCount = 0;
    ghost.moveGhost();
}

ghost.$ghostField.addEventListener('transitionend', handlePassedGhost);


function handlePassedGhost() {
    if(!started) return;
    const $ghostFieldLocation = ghost.$ghostField.getBoundingClientRect().top;
    if($ghostFieldLocation > 800) {
        stopGame()
    }
    const aliveGhost = ghost.countAliveGhost();
    if(aliveGhost === 0) {
        stopGame()
    }
}


// shooting

function getElementSize() {
    ghost.getSize();
    hero.getBulletSize();
}

function handleShooting(e) {
    hero.getBulletPos();

    //getGhostPos
    const $ghosts = document.querySelectorAll('.ghost__container');
    $ghosts.forEach((ghost) => {

        const ghostImg = ghost.querySelector('.ghost__img')
        const ghostX = ghost.getBoundingClientRect().left;
        const ghostY = ghost.getBoundingClientRect().top;

        if(ghostImg.classList.contains('ghost__img--dead')) {
            setTimeout(() => {
                ghostImg.classList.add('hide');
            }, 400);
        } else if(ghostX - 30 < hero.bulletX && hero.bulletX <  ghostX + 30
            &&ghostY - 10 < hero.bulletY && hero.bulletY < ghostY + 10){
                clearInterval(hero.moveBullet)
                hero.bulletMovedCount = 0;
                hero.$bullet.style.transform = `translateY(0px)`
                ghostImg.classList.add('ghost__img--dead');
                ghost.aliveGhostCount--;
                sound.playDying();
        }
    })
}
