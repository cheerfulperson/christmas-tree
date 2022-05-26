import { GameProcess } from '../interfaces/interfaces';

class Sound {
    private player: HTMLAudioElement;
    public isMuted: boolean;

    constructor() {
        this.player = new Audio('./assets/audio/audio.mp3');
        this.isMuted = true;
    }

    public setIsMuted() {
        const item = localStorage.getItem('gameProcess');
        const gameProcess = item ? (JSON.parse(item) as GameProcess) : null;
        if (gameProcess) this.isMuted = gameProcess.isMutedVolume;
    }

    public play() {
        if (!this.isMuted) {
            this.player.setAttribute('allow', 'autoplay');
            this.player.play().catch((err) => {
                console.error(err);
            });
        }
    }

    public pause() {
        this.player.pause();
    }
}

export default Sound;
