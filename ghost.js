export class Ghost {
    constructor(ghostCount, willMoveCount, moveWidth) {
        this.ghostCount = ghostCount;
        this.willMoveCount = willMoveCount;
        this.moveWidth = moveWidth;
        this.$ghostField = document.querySelector('.ghost__field');
        this.$ghostFieldWidth = this.$ghostField.getBoundingClientRect().width;
        this.$ghostFieldHeight = this.$ghostField.getBoundingClientRect().height;
    }

    printCount() {
        console.log(this.ghostCount);
    }

    createRandomGhost() {
        for(let i = 0; i < this.ghostCount; i++) {
            const $ghostEl = document.createElement('div');
            $ghostEl.classList.add('ghost__container')
            $ghostEl.innerHTML = `
                <img class="ghost__img" src="images/enemy.png">`
            this.$ghostField.appendChild($ghostEl);
            const $ghostImgEl = document.querySelector('.ghost__img');
            const $ghostElWidth = $ghostEl.getBoundingClientRect().width;

            const x = this.createRandomNumber(
                (this.willMoveCount * this.moveWidth) + $ghostElWidth / 2,
                this.$ghostFieldWidth - (this.willMoveCount * this.moveWidth + $ghostElWidth / 2));
            const y = this.createRandomNumber(0, this.$ghostFieldHeight);
            $ghostEl.style.left = `${x}px`;
            $ghostEl.style.top = `${y}px`;
            console.log(x,y)
        }
    }

    createRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }
}
