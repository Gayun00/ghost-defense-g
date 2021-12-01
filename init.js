'use strict';

const $heroContainer = document.querySelector('.hero__container');
const $heroImg = document.querySelector('.hero__img');

window.addEventListener('keydown', handleHero);


function handleHero(e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
        handleHeroAngle('left');
    } else if (key === 'ArrowRight') {
        handleHeroAngle('right');
    } else if (key === 'ArrowUp') {
        handleHeroAngle('back');
    } else {
        handleHeroAngle ('front')
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
