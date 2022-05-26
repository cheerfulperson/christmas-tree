import ToysSelector from './toyes-selector';
import { ToyDescription, FavInfo, SortSelections } from '../../interfaces/interfaces';

class ToyStorage extends ToysSelector {
    public store: Storage;
    public isRestored: boolean;

    constructor() {
        super();
        this.store = localStorage;
        this.isRestored = false;
    }

    public async getItem<T>(itemName: string): Promise<T | null> {
        const value: T | null = this.store.getItem(itemName)
            ? (JSON.parse(this.store.getItem(itemName) || '') as T)
            : null;
        await Promise.all([value]);
        return value;
    }

    public async setItem<T>(itemName: string, value: T): Promise<void> {
        await Promise.all([this.store.setItem(itemName, JSON.stringify(value))]);
    }

    public restoreToysInfo(cb = (): void => console.error('Not a cb')): void {
        if (this.isRestored) return;

        this.getItem<SortSelections>('filters')
            .then((filter) => {
                if (filter) {
                    this.sortSelections = filter;
                    this.restoreFiltersInputs(filter);
                }

                this.getItem<ToyDescription[]>('addedToys')
                    .then((addedToys) => {
                        this.toysData = this.toysData.concat(addedToys || []);
                        this.getItem<FavInfo[]>('toysInfo')
                            .then((toys): void => {
                                if (toys) {
                                    this.toysData = this.toysData.map<ToyDescription>(
                                        (toy, i): ToyDescription => {
                                            if (toy.num == toys[i]?.num) toy.select = <boolean>toys[i]?.select;
                                            return toy;
                                        }
                                    );
                                }

                                cb();
                                this.processSelection();
                                this.isRestored = true;
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public addToy(toy: ToyDescription): void {
        this.toysData.push(toy);
    }

    public async saveFavorites(): Promise<void> {
        const favoriteArray: FavInfo[] = [];

        this.toysData.forEach((value) => {
            favoriteArray.push({ num: value.num, select: value.select || false });
        });

        await Promise.all([favoriteArray]);

        this.setItem<FavInfo[]>('toysInfo', favoriteArray).catch((err) => {
            console.error(err);
        });
    }

    public restoreGameToysData(selectedToys: ToyDescription[]): void {
        this.clearSelcetedToys();
        this.toysData = this.toysData.map<ToyDescription>(
            (toy): ToyDescription => {
                for (const selectedToy of selectedToys) {
                    if (toy.num == selectedToy.num) {
                        toy.select = selectedToy.select;
                        toy.count = selectedToy.count;
                    }
                }
                return toy;
            }
        );
        this.setFavoriteAmount(this.selectedAmount);
    }

    public async saveFilters(): Promise<void> {
        this.sortSelections.searchValue = '';
        await Promise.resolve([this.sortSelections]);
        this.setItem<SortSelections>('filters', this.sortSelections).catch((err) => {
            console.error(err);
        });
    }

    public async clearStore(): Promise<void> {
        localStorage.clear();
        (<HTMLSelectElement>document.getElementById('sortSelectionForm')).value = 'default';
        this.sortSelections.sortValue = 'default';
        await Promise.resolve([this.sortSelections]);
        this.setDefault();
        this.clearSelcetedToys();
        this.processSelection();
        this.setFavoriteAmount(this.selectedAmount);
    }
}

export default ToyStorage;
