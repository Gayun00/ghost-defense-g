export class Ghost {
    constructor(ghostCount, moveWidth, willMoveCount) {
        this.ghostCount = ghostCount;
        this.aliveGhostCount;

        this.moveWidth = moveWidth;
        this.willMoveCount = willMoveCount;

        // this.leftCount = leftCount;
        // this.downCount = downCount;

        this.$ghostField = document.querySelector('.ghost__field');
        this.$ghostFieldWidth = this.$ghostField.getBoundingClientRect().width;
        this.$ghostFieldHeight = this.$ghostField.getBoundingClientRect().height;
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
