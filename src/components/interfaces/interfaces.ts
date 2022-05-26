type Keys = string | number[] | boolean | undefined | string[] | number | ArrayBuffer;

export interface ToyDescription {
    [key: string]: Keys;
    color: string;
    count: string | number;
    favorite: boolean;
    name: string;
    num: string;
    shape: string;
    size: string;
    year: string;
    img?: string | ArrayBuffer;
    select?: boolean;
}

export interface SortSelections {
    [key: string]: Keys;
    searchValue: string;
    sortValue: string;
    count: number[];
    asqYear: number[];
    shapes: string[];
    colors: string[];
    sizes: string[];
    isOnlyFavorite: boolean;
}

export type FavInfo = {
    num: string;
    select: boolean;
};

export interface Coordinates {
    x: number;
    y: number;
}

export interface TreesToyInfo {
    num: string;
    location: Coordinates;
}
export interface GameProcess {
    isMutedVolume: boolean;
    snow: boolean;
    bgNum: string;
    treeNum: string;
}

export interface SavedGame extends GameProcess {
    id: string;
    selectedToys: ToyDescription[];
    toysLocation: TreesToyInfo[];
}
