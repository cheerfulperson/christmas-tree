import TreesStore from './trees-store';
import { TreesToyInfo, Coordinates, ToyDescription, SavedGame } from '../../interfaces/interfaces';
import Sound from '../../modules/sound-maker';
import uuid from '../../modules/uuid';

const treeImage = <HTMLImageElement>document.querySelector('.tree__container-image');
const treeToysContainer = <HTMLElement>document.querySelector('.tree__toys-container');

let snowInterval: ReturnType<typeof setInterval>;

function moveImage(e: DragEvent, x: number, y: number, shift: Coordinates, elem: HTMLElement): void {
    elem.style.left = `${e.pageX - x - shift.x}px`;
    elem.style.top = `${e.pageY - y - shift.y}px`;
}

function getToyByNum(arr: ToyDescription[], num: string): ToyDescription | undefined {
    for (const el of arr) {
        if (el.num == num) return el;
    }
}

function setCoordinats(e: DragEvent, target: HTMLElement): void {
    const coordinats: Coordinates = {
        x: e.pageX - target.getBoundingClientRect().x,
        y: e.pageY - target.getBoundingClientRect().y,
    };
    e.dataTransfer?.setData('coordinats', JSON.stringify(coordinats));
}

function getGameById(gameId: string, games: SavedGame[]): SavedGame | undefined {
    for (const el of games) if (el.id == gameId) return el;
}

class TreesContentHandler extends TreesStore {
    private sound: Sound;
    public garlandColor: string;
    private toysData: ToyDescription[];

    constructor(sound: Sound, toysData: ToyDescription[]) {
        super();
        this.sound = sound;
        this.garlandColor = 'gradient';
        this.toysData = toysData;
    }

    public stopMusic() {
        this.sound.isMuted = true;
        this.playMusic(true);
    }

    public playMusic(isLoad?: boolean) {
        const audioBtn = <HTMLElement>document.getElementById('audioBtn');
        const img = <HTMLImageElement>audioBtn.querySelector('img');
        if (!isLoad) {
            this.sound.isMuted = !this.sound.isMuted;
            this.gameProcess.isMutedVolume = this.sound.isMuted;
        }

        if (this.sound.isMuted) {
            img.src = './assets/svg/mute.svg';
            this.sound.pause();
        } else {
            img.src = './assets/svg/audio.svg';
            this.sound.play();
        }
        this.saveGameProcess();
    }

    public stopSnow() {
        this.gameProcess.snow = false;
        clearInterval(snowInterval);
    }

    public dropSnow(isLoad?: boolean) {
        if (!isLoad) this.gameProcess.snow = !this.gameProcess.snow;
        clearInterval(snowInterval);
        if (this.gameProcess.snow)
            snowInterval = setInterval(() => {
                this.createSnowFlake();
            }, 30);
        this.saveGameProcess();
    }

    public setBg(num: string) {
        this.gameProcess.bgNum = num;
        this.mediaElement.setAttribute('data-background', `./assets/bg/${num}.jpg`);
        this.mediaElement.style.backgroundImage = `url(./assets/bg/${num}.jpg)`;
        this.saveGameProcess();
    }

    public setTree(num: string) {
        this.gameProcess.treeNum = num;
        treeImage.src = `assets/tree/${num}.png`;
        this.saveGameProcess();
    }

    public changeGarland(color?: string): void {
        if (color) this.garlandColor = color;
        this.createGarland(this.garlandColor);
    }

    public handleDragStart(e: DragEvent): void {
        const target = <HTMLImageElement>e.target;
        const parentId = target.parentElement?.getAttribute('data-parent-id');

        setCoordinats(e, target);
        e.dataTransfer?.setData('parentId', parentId || '');
    }

    private imageElemAddEventListeners(newImg: HTMLImageElement, parentId: string) {
        const clientRect = treeToysContainer.getBoundingClientRect();
        let point: Coordinates = {
            x: 0,
            y: 0,
        };

        newImg.addEventListener('dragstart', (e: DragEvent) => {
            point = {
                x: e.pageX - (<HTMLElement>e.target).getBoundingClientRect().x,
                y: e.pageY - (<HTMLElement>e.target).getBoundingClientRect().y,
            };
        });

        newImg.addEventListener('dragend', (e) => {
            const elemBelow = <HTMLElement>document.elementFromPoint(e.clientX, e.clientY);
            if (elemBelow.tagName == 'AREA' || elemBelow == e.target)
                moveImage(e, clientRect.x, clientRect.y, point, newImg);
            else this.handleLeave(newImg, parentId);
        });

        newImg.setAttribute('data-parent-box-id', parentId);

        treeToysContainer.append(newImg);
    }

    public handleOverDrop(e: DragEvent): void {
        e.preventDefault();
        const parentId = e.dataTransfer?.getData('parentId');
        const shift = JSON.parse(e.dataTransfer?.getData('coordinats') || '{}') as Coordinates;

        if (e.type == 'dragover' || !parentId) return;

        const imgBoxElem = <HTMLElement>document.querySelector(`[data-parent-id="${parentId}"]`);
        const imagesAmount = imgBoxElem.getAttribute('data-amount') || '1';
        const newImg = <HTMLImageElement>imgBoxElem.querySelector('img')?.cloneNode(true);
        const clientRect = treeToysContainer.getBoundingClientRect();
        this.imageElemAddEventListeners(newImg, parentId);

        moveImage(e, clientRect.x, clientRect.y, shift, newImg);
        imgBoxElem.setAttribute('data-amount', (+imagesAmount - 1).toString());

        if (+imagesAmount == 1) imgBoxElem.innerHTML = '';

        const toy = getToyByNum(this.toysData, parentId);
        if (toy) toy.count = (+toy.count - 1).toString();
    }

    public handleLeave(img: HTMLImageElement, parentId: string): void {
        const imgBoxElem = <HTMLElement>document.querySelector(`[data-parent-id="${parentId}"]`);
        if (imgBoxElem) {
            const imagesAmount = imgBoxElem.getAttribute('data-amount') || '1';
            if (+imagesAmount == 0) {
                const newImg = <HTMLImageElement>img.cloneNode(true);
                newImg.style.cssText = '';
                newImg.addEventListener('dragstart', (e) => {
                    this.handleDragStart(e);
                });
                imgBoxElem.append(newImg);
            }
            imgBoxElem.setAttribute('data-amount', (+imagesAmount + 1).toString());
        }
        img.remove();
        const toy = getToyByNum(this.toysData, parentId);
        if (toy) toy.count = (+toy.count + 1).toString();
    }

    public restoreGame(gameId: string, cb = (selectedToys: ToyDescription[]) => console.error(selectedToys)): void {
        const game = getGameById(gameId, this.restoredGames);
        if (game) {
            cb(game.selectedToys);

            this.selectedToys = game.selectedToys;
            this.sound.isMuted = game.isMutedVolume;
            this.gameProcess.isMutedVolume = game.isMutedVolume;
            this.gameProcess.snow = game.snow;
            this.loadElements(game.selectedToys);

            treeToysContainer.innerHTML = '';
            this.setTree(game.treeNum);
            this.setBg(game.bgNum);
            this.playMusic(true);
            this.dropSnow(true);
            for (const info of game.toysLocation) {
                const img = new Image();
                img.style.left = `${info.location.x}px`;
                img.style.top = `${info.location.y}px`;
                img.setAttribute('draggable', 'true');
                img.alt = 'Toy';
                img.src = `assets/toys/${info.num}.png`;
                this.imageElemAddEventListeners(img, info.num);
            }
        }
    }

    public insertNewGameProcess(): void {
        const id = uuid(8);
        const toysInfo = this.getToysCoordinats();
        this.savePageContent(id, toysInfo);
        this.insertNewSavedPage(this.gameProcess.treeNum, this.gameProcess.bgNum, id, toysInfo);
    }

    public getToysCoordinats(): TreesToyInfo[] {
        const info: TreesToyInfo[] = [];
        for (const el of treeToysContainer.children) {
            info.push({
                num: el.getAttribute('data-parent-box-id') || '',
                location: {
                    x: parseInt(getComputedStyle(el).left),
                    y: parseInt(getComputedStyle(el).top),
                },
            });
        }
        return info;
    }
}

export default TreesContentHandler;
