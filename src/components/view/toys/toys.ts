import { ToyDescription, SortSelections } from '../../interfaces/interfaces';
import slider from '../../modules/slider';
import updateFilters from '../../modules/gsap-animate';
import toysData from './data/toys-data.json';

const toyContent = <HTMLElement>document.querySelector('#toysPage');
const favButton = <HTMLInputElement>document.getElementById('isLiked');
const sortForm = <HTMLSelectElement>document.getElementById('sortSelectionForm');

let timeOut: ReturnType<typeof setTimeout>;

function restoreInputs(arr: string[], dataType: string): void {
    if (arr.length == 0) return;

    arr.forEach((str) => {
        const input = <HTMLInputElement>(
            document.querySelector(`.toys-content__menu__item input[data-${dataType}="${str}"]`)
        );
        input.checked = true;
    });
}

function hasNumber(arr: ToyDescription[], num: string): boolean {
    for (const toyOld of arr) {
        if (toyOld.num == num) return true;
    }
    return false;
}

function getToysNumbersToDelete(oldArr: ToyDescription[], currentArr: ToyDescription[]): string[] {
    const newArr: string[] = [];

    for (const toy of oldArr) {
        if (!hasNumber(currentArr, toy.num)) newArr.push(toy.num);
    }

    return newArr;
}

class ToysContent {
    protected currentToysData: ToyDescription[];
    public toysData: ToyDescription[];
    public parentNode: HTMLElement;
    public isOpened: boolean;

    constructor() {
        this.toysData = toysData;
        this.currentToysData = this.toysData;
        this.parentNode = toyContent;
        this.isOpened = false;
    }

    public resetFilters(): void {
        this.parentNode.querySelectorAll('input[type="checkbox"]').forEach((elem: Element) => {
            (<HTMLInputElement>elem).checked = false;
        });

        slider.sliderNumberOfCopies.noUiSlider.reset();
        slider.sliderAcquisitionYear.noUiSlider.reset();
    }

    public restoreFiltersInputs(filter: SortSelections): void {
        slider.sliderNumberOfCopies.noUiSlider.set(filter.count);
        slider.sliderAcquisitionYear.noUiSlider.set(filter.asqYear);
        restoreInputs(filter.sizes, 'size');
        restoreInputs(filter.shapes, 'shape');
        restoreInputs(filter.colors, 'color');
        sortForm.value = filter.sortValue;
        favButton.checked = filter.isOnlyFavorite;
    }

    public showNotification(str?: string): void {
        clearTimeout(timeOut);
        this.parentNode.querySelector('.notification-window')?.remove();
        const notificationWindow = (<HTMLTemplateElement>document.getElementById('notification')).content.cloneNode(
            true
        ) as HTMLElement;

        if (str) {
            (<HTMLElement>notificationWindow.querySelector('.notification-window__text')).textContent = str;
        }

        this.parentNode.append(notificationWindow);

        timeOut = setTimeout(() => {
            this.parentNode.querySelector('.notification-window')?.remove();
        }, 3000);
    }

    public setFavoriteAmount(amount: number): void {
        (<HTMLElement>document.querySelector('.favorites-toys .favorites-toys__data')).textContent = amount.toString();
    }

    public drawToysContent(): void {
        const toyNode = <HTMLTemplateElement>document.getElementById('toyContent');
        const fragment = document.createDocumentFragment();
        const toysList = <HTMLElement>this.parentNode.querySelector('.toys-content__list');

        this.currentToysData.forEach((el: ToyDescription): void => {
            const toyClone = <HTMLElement>toyNode.content.cloneNode(true);
            const name = <HTMLElement>toyClone.querySelector('.toys-content__list__toy__name');
            const img = <HTMLImageElement>toyClone.querySelector('.toys-content__list__toy__img');

            (<HTMLElement>toyClone.querySelector('.toys-content__list__toy')).setAttribute('data-toy-num', el.num);

            img.src = el.img ? <string>el.img : `./assets/toys/${el.num}.png`;

            name.setAttribute('data-toy-name', el.name);
            name.textContent = el.name;

            for (const key in el) {
                if (key != 'num' && key != 'name' && key != 'img' && key != 'select') {
                    let value: string;
                    if (key == 'favorite') {
                        value = el[key] ? 'yes' : 'no';
                    } else {
                        value = el[key]?.toString() || '';
                    }

                    const descriptionElem = <HTMLElement>(
                        toyClone.querySelector(`.toy__description__item[data-toy-${key}]`)
                    );

                    descriptionElem.setAttribute(`data-toy-${key}`, value);
                    (<HTMLElement>descriptionElem.querySelector('.data')).textContent = value;
                } else if (key == 'select') {
                    if (el[key]) {
                        (<HTMLElement>toyClone.querySelector('.toys-content__list__toy__favorite')).classList.add(
                            'favorite-active'
                        );
                    }
                }
            }

            fragment.append(toyClone);
        });

        const collection = <HTMLElement>fragment.cloneNode(true);
        updateFilters(toysList, getToysNumbersToDelete(this.toysData, this.currentToysData), collection, () => {
            toysList.innerHTML = '';
            toysList.append(fragment);

            if (this.currentToysData.length == 0) {
                toysList.append((<HTMLTemplateElement>document.getElementById('message')).content.cloneNode(true));
            }
        });
    }
}

export default ToysContent;
