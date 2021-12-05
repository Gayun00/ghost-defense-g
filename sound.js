export class Sound{
    constructor() {
        this.gameStartSound = new Audio('audio/start.ogg');
        this.dyingSound = new Audio('audio/dying.wav');
        this.gameWinSound = new Audio('audio/gameWin.wav');
        this.gameOverSound = new Audio('audio/gameOver.wav');
        this.levelUpSound = new Audio('audio/levelup.mp3');
        this.backgroundSound = new Audio('audio/background.wav');
    }

    playDying() {
        this.dyingSound.currentTime = 0;
        this.dyingSound.play();
    }

    playStart() {
        this.gameStartSound.volume = 0.4;
        this.gameStartSound.play();
    }

    playLevelUp() {
        this.levelUpSound.play();
    }

    playWin() {
        this.gameWinSound.play();
    }

    playGameOver() {
        this.gameOverSound.play();
    }

    playBGM() {
        this.backgroundSound.volume = 0.05;
        this.backgroundSound.play();
    }

    stopBGM() {
        this.backgroundSound.pause();
        this.backgroundSound.currentTime = 0;
    }
}