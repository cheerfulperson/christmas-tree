import ToysStorage from './toys/toys-storage';
import sliders from '../modules/slider';
import initDropInput from './toys/new-toys-content/add-toys-window';
import { ToyDescription, GameProcess } from '../interfaces/interfaces';
import TreesContentHandler from './trees/trees-events';
import Sound from '../modules/sound-maker';
import { getDropToysContent, makeDraggble } from './trees/drop-toys-content';
import HTMLConverter from '../modules/html-converter';

const audioBtn = <HTMLElement>document.getElementById('audioBtn');
const snowBtn = <HTMLElement>document.getElementById('snowBtn');
const addPageBtn = <HTMLElement>document.getElementById('addPageBtn');
const savePictureBtn = <HTMLButtonElement>document.getElementById('savePictureBtn');
const clearStoreBtn = <HTMLButtonElement>document.getElementById('clearStoreBtn');
const bgContentBox = <HTMLElement>document.getElementById('bgContentBox');
const treesBoxContent = <HTMLElement>document.getElementById('treesBoxContent');
const boxesOfGarlands = document.querySelectorAll('input.tree__item-input-radio');
const garlandKey = <HTMLInputElement>document.getElementById('garlandKey');
const savedTreesBoxes = <HTMLElement>document.getElementById('savedTreesBoxes');

const searchFormInput = <HTMLInputElement>document.getElementById('searchInput');
const searchFormButton = <HTMLButtonElement>document.querySelector('.search-form button');
const toysMenu = <HTMLElement>document.querySelector('.toys-content__menu');
const toysList = <HTMLElement>document.querySelector('.toys-content__list');
const addWindowBtn = <HTMLButtonElement>document.getElementById('openToysAddWindow');
const toysWindowContent = <HTMLElement>document.querySelector('.toys-content__window');
const closeAddContentBtn = <HTMLElement>document.querySelector('.form-zone__button-x');
const newConverter = new HTMLConverter();

function saveUrlAsFile(url: string): void {
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'tree.png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function addListenerToSavedTrees(toys: ToysStorage, tree: TreesContentHandler): void {
    function restoreTreeContent(e: MouseEvent): void {
        tree.restoreGame((<HTMLElement>e.target).id, (selectedToys: ToyDescription[]) => {
            tree.restoreSavedPageContent(); // firstly add gameProcess
            toys.restoreGameToysData(selectedToys); // secondly change selectedToys
            setTimeout(() => {
                makeDraggble(tree);
            }, 0);
        });
    }
    savedTreesBoxes.addEventListener('click', restoreTreeContent, false);
}

export class AppView {
    private toys: ToysStorage;
    private isToysPageOpened: boolean;
    private isTreesPageOpened: boolean;
    private tree: TreesContentHandler;

    constructor(sound: Sound) {
        this.toys = new ToysStorage();
        this.tree = new TreesContentHandler(sound, this.toys.toysData);
        this.isToysPageOpened = false;
        this.isTreesPageOpened = false;
    }

    public getHomePage(): void {
        this.toys.restoreToysInfo((): void => {
            this.toys.setFavoriteAmount(this.toys.selectedAmount);
        });
    }

    public getTreesPage(): void {
        this.tree.restoreInfo((gameProcess: GameProcess | null) => {
            if (gameProcess) {
                this.tree.setBg(gameProcess.bgNum || '1');
                this.tree.setTree(gameProcess.treeNum || '1');
            }

            if (!this.isTreesPageOpened) {
                this.tree.playMusic(true);
                this.tree.dropSnow(true);
                this.tree.restoreSavedPageContent();
                this.isTreesPageOpened = true;
                addListenerToSavedTrees(this.toys, this.tree);

                audioBtn.addEventListener('click', () => {
                    this.tree.playMusic();
                });
                snowBtn.addEventListener('click', () => {
                    this.tree.dropSnow();
                });

                addPageBtn.addEventListener('click', () => {
                    this.tree.insertNewGameProcess();
                });

                savePictureBtn.addEventListener('click', () => {
                    newConverter.getRenderdImage((url: string) => {
                        saveUrlAsFile(url);
                    });
                });

                clearStoreBtn.addEventListener('click', () => {
                    this.toys.clearStore().catch((err) => {
                        console.error(err);
                    });
                    this.tree.clearBoxWithSavedTrees();
                    this.tree.setBg('1');
                    this.tree.setTree('1');
                    this.tree.stopSnow();
                    this.tree.stopMusic();
                    setTimeout(() => {
                        this.tree.loadElements(this.toys.selectedToys);
                        makeDraggble(this.tree);
                    }, 0);
                });

                bgContentBox.addEventListener('click', (e) => {
                    const num = (<Element>e.target).getAttribute('data-image-num');
                    if (num) this.tree.setBg(num);
                });

                treesBoxContent.addEventListener('click', (e) => {
                    const num = (<Element>e.target).getAttribute('data-image-num');
                    if (num) this.tree.setTree(num);
                });

                boxesOfGarlands.forEach((el: Element) => {
                    el.addEventListener('change', () => {
                        if (!garlandKey.checked) garlandKey.checked = true;
                        this.tree.changeGarland(el.id.slice(0, el.id.length - 1));
                    });
                });

                garlandKey.addEventListener('change', () => {
                    if (garlandKey.checked) this.tree.changeGarland();
                    else this.tree.deleteGarland();
                });

                getDropToysContent(this.tree);
            }

            this.tree.loadElements(this.toys.selectedToys);
            makeDraggble(this.tree);
        });
    }

    public getToysPage(): void {
        if (!this.isToysPageOpened) {
            this.isToysPageOpened = true;

            const insertSearchStr = (e: Event): void => {
                e.preventDefault();
                this.toys.sortSelections.searchValue = searchFormInput.value;
                this.toys.processSelection();
                this.toys.saveFilters().catch((err) => {
                    console.error(err);
                });
            };

            searchFormInput.addEventListener('change', insertSearchStr);
            searchFormInput.addEventListener('input', (e) => {
                if (searchFormInput.value == '') insertSearchStr(e);
            });

            searchFormButton.addEventListener('click', insertSearchStr);

            sliders.sliderAcquisitionYear?.noUiSlider.on('change.one', (res) => {
                this.toys.sortSelections.asqYear = [Number(res[0]), Number([res[1]])];
                this.toys.processSelection();
                this.toys.saveFilters().catch((err) => {
                    console.error(err);
                });
            });

            sliders.sliderNumberOfCopies?.noUiSlider.on('change.one', (res) => {
                this.toys.sortSelections.count = [Number(res[0]), Number([res[1]])];
                this.toys.processSelection();
                this.toys.saveFilters().catch((err) => {
                    console.error(err);
                });
            });

            toysMenu.addEventListener('click', (e): void => {
                const target = <HTMLElement>e.target;
                const dataKey: string | null | undefined = Object.keys(target.dataset)[0];
                if (dataKey) {
                    const value: string | undefined = target.dataset[dataKey];
                    const element = <HTMLInputElement>target;

                    if (dataKey == 'color' || dataKey == 'shape' || dataKey == 'size')
                        this.toys.setChoice(dataKey, value);
                    else if (dataKey == 'favorite') this.toys.sortSelections.isOnlyFavorite = element.checked;
                }

                if (target.id == 'sortSelectionForm') {
                    const selector = <HTMLSelectElement>target;
                    this.toys.sortSelections.sortValue = selector.value;
                } else if (target.id == 'clearSelection') {
                    this.toys.setDefault();
                } else if (target.id == 'clearSettings') {
                    this.toys.clearStore().catch((err) => {
                        console.error(err);
                    });
                }

                this.toys.processSelection();
                this.toys.saveFilters().catch((err) => {
                    console.error(err);
                });
            });

            toysList.addEventListener('click', (e) => {
                const target = <HTMLElement>e.target;

                if (target.classList.contains('toy__favorite__button')) {
                    const parent = <HTMLElement>target.parentNode?.parentNode;
                    this.toys.changeFavoriteToy(parent.getAttribute('data-toy-num') || '');
                    this.toys.saveFavorites().catch((err) => {
                        console.error(err);
                    });
                }
            });

            const toggleWindow = (): void => {
                toysWindowContent.classList.toggle('main__item-hide');
            };

            addWindowBtn.addEventListener('click', toggleWindow);
            closeAddContentBtn.addEventListener('click', toggleWindow);

            initDropInput((toy: ToyDescription) => {
                this.toys.showNotification('Toy added!');
                this.toys.addToy(toy);
            });
        }

        setTimeout(() => {
            searchFormInput.focus();
            searchFormInput.select();
        }, 0);

        this.toys.processSelection();

        this.toys.restoreToysInfo((): void => {
            this.toys.drawToysContent();
            this.toys.setFavoriteAmount(this.toys.selectedAmount);
        });
    }

    public setAvailableWindow(isToClose: boolean): void {
        const windowFragment = <HTMLTemplateElement>document.getElementById('screenSize');

        if (isToClose) {
            document.querySelector('[data-article="screenWindow"]')?.remove();
            this.setHiddenToBodyChildren(false);
        } else if (!document.querySelector('[data-article="screenWindow"]')) {
            document.body.append(<HTMLElement>windowFragment.content.cloneNode(true));

            this.setHiddenToBodyChildren(true);
        }
    }

    private setHiddenToBodyChildren(hide: boolean): void {
        ['header', 'main', 'footer'].forEach((selector) => {
            const elem = <HTMLElement | undefined>document.querySelector(selector);
            if (elem) {
                elem.style.display = hide ? 'none' : '';
            }
        });
    }
}

export default AppView;
