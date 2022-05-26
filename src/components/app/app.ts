import AppController from '../controller/controller';
import Sound from '../modules/sound-maker';

class App {
    private controller: AppController;
    public sound: Sound;

    constructor() {
        this.sound = new Sound();
        this.controller = new AppController(this.sound);
    }

    public start(): void {
        window.addEventListener('popstate', (): void =>
            this.controller.getPage(location.hash.slice(1, location.hash.length))
        );

        this.controller.getPage('homePage');
        this.controller.onResize();

        document.body.addEventListener(
            'click',
            () => {
                this.sound.setIsMuted();
                this.sound.play();
            },
            { once: true }
        );
    }
}

export default App;
