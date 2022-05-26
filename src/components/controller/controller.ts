import AppView from '../view/appView';
import Sound from '../modules/sound-maker';

function hideSections(id: string): void {
    const main: NodeListOf<HTMLElement> = document.body.querySelectorAll('main > section');

    main.forEach((el: HTMLElement): void => {
        if (!el.classList.contains('main__item-hide') && el.id != id) el.classList.add('main__item-hide');
        else if (el.id == id && el.classList.contains('main__item-hide')) el.classList.remove('main__item-hide');
    });
}

function addActiveLink(id: string): void {
    const links: NodeListOf<HTMLElement> = document.body.querySelectorAll('header .title-link');

    links.forEach((el: HTMLElement): void => {
        const dataLink: string | null = el.getAttribute('data-link');
        if (dataLink == id) el.classList.add('link-active');
        else el.classList.remove('link-active');
    });
}

class AppController {
    private view: AppView;

    constructor(sound: Sound) {
        this.view = new AppView(sound);
    }

    public getPage(pageId: string): void {
        hideSections(pageId);
        addActiveLink(pageId);

        if (pageId == 'homePage') this.view.getHomePage();
        else if (pageId == 'toysPage') this.view.getToysPage();
        else if (pageId == 'treePage') this.view.getTreesPage();
    }

    public onResize(): void {
        const maxWidth = 815;
        const maxHeight = 865;

        this.view.setAvailableWindow(window.innerWidth > maxWidth && window.innerHeight > maxHeight);

        window.addEventListener('resize', () => {
            console.log(window.innerWidth > maxWidth && window.innerHeight > maxHeight);
            this.view.setAvailableWindow(window.innerWidth > maxWidth && window.innerHeight > maxHeight);
        });
    }
}

export default AppController;
