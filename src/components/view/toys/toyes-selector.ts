import ToysContent from './toys';
import { SortSelections, ToyDescription } from '../../interfaces/interfaces';

const sortSelections: SortSelections = {
    searchValue: '',
    sortValue: 'default',
    count: [0, 12],
    asqYear: [1940, 2021],
    shapes: [],
    colors: [],
    sizes: [],
    isOnlyFavorite: false,
};

function checkRange(num: string | number, arr: number[]): boolean {
    if (arr[0] !== undefined && arr[1]) return Number(num) >= arr[0] && Number(num) <= arr[1] ? true : false;
    else return false;
}

function checkForms(value: string, arr: string[]): boolean {
    return arr.length === 0 ? true : arr.includes(value);
}

function checkFavorite(value: boolean, isOnlyFavor: boolean): boolean {
    return isOnlyFavor ? value : true;
}

function getSelectedAmount(arr: ToyDescription[]): number {
    let sum = 0;
    for (const toy of arr) if (toy.select) sum++;
    return sum;
}

function getSelectedToys(arr: ToyDescription[], selectedAmount: number): ToyDescription[] {
    const newArr: ToyDescription[] = [];
    if (selectedAmount == 0) {
        for (let i = 0; i < 20; i++) newArr.push(<ToyDescription>arr[i]);
    } else {
        for (const toy of arr) if (toy.select) newArr.push(toy);
    }
    return newArr;
}

class ToysSelector extends ToysContent {
    public sortSelections: SortSelections;
    protected _favAmount: number;

    constructor() {
        super();
        this.sortSelections = sortSelections;
        this._favAmount = getSelectedAmount(this.toysData);
    }

    get selectedAmount(): number {
        return getSelectedAmount(this.toysData);
    }

    get selectedToys(): ToyDescription[] {
        return getSelectedToys(this.toysData, this.selectedAmount);
    }

    private sort(arr: ToyDescription[]): ToyDescription[] {
        const { sortValue } = this.sortSelections;

        if (sortValue == 'a-z') arr.sort((f, s) => ('' + f.name).localeCompare(s.name));
        else if (sortValue == 'z-a') arr.sort((f, s) => ('' + s.name).localeCompare(f.name));
        else if (sortValue == '0-2') arr.sort((f, s) => +f.year - +s.year);
        else if (sortValue == '2-0') arr.sort((f, s) => +s.year - +f.year);

        return arr;
    }

    public processSelection(): void {
        const { searchValue, count, asqYear, shapes, colors, sizes, isOnlyFavorite } = this.sortSelections;

        const regExp = new RegExp(`${searchValue}`, 'i');
        let newToys: ToyDescription[] = [];

        for (const toy of this.toysData) {
            if (
                regExp.test(toy.name) &&
                checkRange(toy.count, count) &&
                checkRange(toy.year, asqYear) &&
                checkForms(toy.shape, shapes) &&
                checkForms(toy.size, sizes) &&
                checkForms(toy.color, colors) &&
                checkFavorite(toy.favorite, isOnlyFavorite)
            ) {
                newToys.push(toy);
            }
        }

        newToys = this.sort(newToys);

        this.currentToysData = newToys;
        this.drawToysContent();
    }

    public setChoice(dataKey: string, value = ''): void {
        value = value.toLowerCase();
        let arr = <string[]>this.sortSelections[(dataKey + 's') as keyof SortSelections];

        if (!arr?.includes(value)) arr.push(value);
        else arr = arr.filter((key) => key != value);

        (<string[]>this.sortSelections[(dataKey + 's') as keyof SortSelections]) = arr;
    }

    public changeFavoriteToy(num: string | number): void {
        for (const toy of this.toysData) {
            if (toy.num == num) {
                if (this.selectedAmount >= 20 && !toy.select) {
                    toy.select = false;
                    this.showNotification();
                } else toy.select = !toy.select;
                this._favAmount = getSelectedAmount(this.toysData);
                this.setFavoriteAmount(this.selectedAmount);
                this.processSelection();
                return;
            }
        }
    }

    public clearSelcetedToys() {
        for (const el of this.toysData) el.select = false;
    }

    public setDefault(): void {
        this.sortSelections = {
            searchValue: this.sortSelections.searchValue,
            sortValue: this.sortSelections.sortValue,
            count: [0, 12],
            asqYear: [1940, 2021],
            shapes: [],
            colors: [],
            sizes: [],
            isOnlyFavorite: false,
        };
        this.processSelection();
        this.resetFilters();
    }
}

export default ToysSelector;
