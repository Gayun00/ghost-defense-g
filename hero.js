export class Hero {
  constructor() {
    this.bulletX;
    this.bulletY;
    this.bulletWidth;
    this.bulletHeight;
    this.moveBullet;
    this.bulletMovedCount = 0;
    this.bulletSpeed = 8
    this.$bullet = document.querySelector('.bullet');

    this.leftCount = 0;
    this.upCount = 0;;
    this.speed = 10;
    this.$heroWithBullet = document.querySelector('.hero__wrap');
    this.$heroContainer = document.querySelector('.hero__container');
    this.$heroImg = document.querySelector('.hero__img');
  }

  getBulletSize() {
    this.bulletWidth = this.$bullet.getBoundingClientRect().width;
    this.bulletHeight = this.$bullet.getBoundingClientRect().height;
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

  handleHeroAndBullet(e) {
    this.handleHero(e);
    this.handleBullet(e);
}

    handleHero(e) {
        const key = e.key;

        if (key === 'ArrowLeft') {
            this.handleHeroAngle('left');
            this.moveHero('left');
        } else if (key === 'ArrowRight') {
            this.handleHeroAngle('right');
            this.moveHero('right');
        } else if (key === 'ArrowUp') {
            this.handleHeroAngle('back');
            this.moveHero('up');
        } else if (key === 'ArrowDown') {
            this.handleHeroAngle ('front');
            this.moveHero('down');
        }
    }

    handleBullet(e) {
        if(e.keyCode === 32) {
            clearInterval(this.moveBullet);
            this.moveBullet = setInterval(() => {
                this.bulletMovedCount--;
                this.$bullet.style.transform = `translateY(${this.bulletMovedCount * 10}px)`
                if(this.bulletMovedCount === -50) {
                    clearInterval(this.moveBullet)
                    this.bulletMovedCount = 0;
                    this.$bullet.style.transform = `translateY(0px)`
                }
            }, this.bulletSpeed);
        }
    }

    getBulletPos() {
        this.bulletX = this.$bullet.getBoundingClientRect().left;
        this.bulletY = this.$bullet.getBoundingClientRect().top;
    }
}
