export class Ghost {
    constructor() {
        this.started = true;
        this.left = true;
        this.width;
        this.height;

        this.ghostCount = 5;
        this.aliveGhostCount = 0;

        this.moveWidth = 1;
        this.movedCount = 0;
        this.move;
        this.leftCount = 0;
        this.downCount = 0;
        this.willMoveCount = 15;
        this.ghostSpeed = 20;

        this.x;
        this.y;
        this.$ghost;
        this.$ghostField = document.querySelector('.ghost__field');
        this.$ghostFieldWidth = this.$ghostField.getBoundingClientRect().width;
        this.$ghostFieldHeight = this.$ghostField.getBoundingClientRect().height;
    }

    getSize() {
        this.$ghost = document.querySelector('.ghost__container');
        this.width = this.$ghost.getBoundingClientRect().width;
        this.height = this.$ghost.getBoundingClientRect().height;
    }

    createRandomGhost(level) {
        console.log('level'+level);
        this.$ghostField.innerHTML = '';
        for(let i = 0; i < (level + 1) * this.ghostCount; i++) {
            const $ghostEl = document.createElement('div');
            $ghostEl.classList.add('ghost__container')
            $ghostEl.innerHTML = `
                <img class="ghost__img" src="images/enemy.png">`
            this.$ghostField.appendChild($ghostEl);
            const $ghostElWidth = $ghostEl.getBoundingClientRect().width;

            const x = this.createRandomNumber(
                (this.willMoveCount * this.moveWidth) + $ghostElWidth / 2,
                this.$ghostFieldWidth - (this.willMoveCount * this.moveWidth + $ghostElWidth / 2));
            const y = this.createRandomNumber(0, this.$ghostFieldHeight);
            $ghostEl.style.left = `${x}px`;
            $ghostEl.style.top = `${y}px`;
        }
    }

    createRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    moveGhost() {
        this.move = setInterval(() => {
            if(!this.started) {return;}
            this.movedCount++;
            this.moveGhostTo(this.isLeft);

            if(this.movedCount === this.willMoveCount) {
                clearInterval(this.move);
                this.isLeft = !this.isLeft;
                this.movedCount= 0;
                this.moveGhost(this.willMoveCount, this.speed);
            }
        }, this.speed);
        this.move;
    }

    moveGhostTo(isLeft) {
        if (isLeft === true) {
            this.leftCount--;
            this.downCount++;
        } else  {
            this.leftCount++;
            this.downCount++;
        }
        this.$ghostField.style.transform =`
            translate(${this.leftCount * this.moveWidth}px, ${this.downCount * this.moveWidth}px)`;
        }

    countAliveGhost() {
        this.aliveGhostCount = 0;
        const $ghosts = document.querySelectorAll('.ghost__img');

        $ghosts.forEach((ghost) => {
            if(!ghost.classList.contains('ghost__img--dead')) {
                this.aliveGhostCount++;
            }
        })
        return this.aliveGhostCount;
    }
}
