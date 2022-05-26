import { GameProcess, SavedGame, TreesToyInfo } from '../../interfaces/interfaces';
import TreesContent from './tree';

class TreesStore extends TreesContent {
    public gameProcess: GameProcess;
    public restoredGames: SavedGame[];

    constructor() {
        super();
        this.gameProcess = {
            isMutedVolume: true,
            snow: false,
            bgNum: '1',
            treeNum: '1',
        };
        this.restoredGames = [];
    }

    public async getItem<T>(itemName: string): Promise<T | null> {
        const value: T | null = localStorage.getItem(itemName)
            ? (JSON.parse(localStorage.getItem(itemName) || '') as T)
            : null;
        await Promise.all([value]);
        return value;
    }

    public async setItem<T>(itemName: string, value: T): Promise<void> {
        await Promise.all([localStorage.setItem(itemName, JSON.stringify(value))]);
    }

    public restoreInfo(
        cb = (gameProcess: GameProcess | null): void => {
            console.error('No cb!', gameProcess);
        }
    ): void {
        this.getItem<GameProcess>('gameProcess')
            .then((gameProcess) => {
                if (gameProcess) this.gameProcess = gameProcess;
                cb(gameProcess);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public saveGameProcess(): void {
        this.setItem<GameProcess>('gameProcess', this.gameProcess).catch((err) => {
            console.error(err);
        });
    }

    public restoreSavedPageContent(): void {
        this.getItem<SavedGame[]>('savedTrees')
            .then((restoredGames) => {
                if (restoredGames) this.restoredGames = restoredGames;
                this.clearBoxWithSavedTrees();
                restoredGames?.forEach((game) => {
                    this.insertNewSavedPage(game.treeNum, game.bgNum, game.id, game.toysLocation);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public savePageContent(id: string, toysinfo: TreesToyInfo[]): void {
        const newSavedGames: SavedGame[] = [];
        this.getItem<SavedGame[]>('savedTrees')
            .then((restoredGames) => {
                const savedGame: SavedGame = {
                    id: id,
                    snow: this.gameProcess.snow,
                    isMutedVolume: this.gameProcess.isMutedVolume,
                    selectedToys: this.selectedToys,
                    toysLocation: toysinfo,
                    bgNum: this.gameProcess.bgNum,
                    treeNum: this.gameProcess.treeNum,
                };
                this.restoredGames.push(savedGame);

                if (restoredGames) restoredGames.push(savedGame);
                else newSavedGames.push(savedGame);
                this.setItem<SavedGame[]>('savedTrees', restoredGames || newSavedGames).catch((err) => {
                    console.error(err);
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
}

export default TreesStore;
