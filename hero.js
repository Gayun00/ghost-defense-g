export class Hero {
  constructor(leftCount, upCount, speed, $bullet, bulletMovedCount, bulletSpeed) {
    this.leftCount = leftCount;
    this.upCount = upCount;
    this.speed = speed;

    this.$bullet = $bullet;
    this.moveBullet;
    this.bulletMovedCount = bulletMovedCount;
    this.bulletSpeed = bulletSpeed;

    this.$heroWithBullet = document.querySelector('.hero__wrap');
    this.$heroContainer = document.querySelector('.hero__container');
    this.$heroImg = document.querySelector('.hero__img');
  }

  handleHeroAngle(direction) {
    if(this.$heroImg.classList.contains('hero--front')) {
        this.$heroImg.classList.remove('hero--front');
    } else if (this.$heroImg.classList.contains('hero--back')) {
        this.$heroImg.classList.remove('hero--back');
    } else if (this.$heroImg.classList.contains('hero--left')) {
        this.$heroImg.classList.remove('hero--left');
    } else if (this.$heroImg.classList.contains('hero--right')) {
        this.$heroImg.classList.remove('hero--right');
    }
        this.$heroImg.classList.add(`hero--${direction}`);
  }

  moveHero(direction) {
    if (direction === 'left') {
        this.leftCount--;
    } else if (direction === 'right') {
        this.leftCount++;
    } else if (direction === 'up') {
        this.upCount--;
    } else {
        this.upCount++;
    }
    this.$heroWithBullet.style.transform =` translate(${this.leftCount * this.speed}px, ${this.upCount * this.speed}px)`;
  }

}

