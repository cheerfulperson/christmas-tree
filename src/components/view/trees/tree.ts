import { ToyDescription, TreesToyInfo } from '../../interfaces/interfaces';

const treesMediaContent = <HTMLElement>document.querySelector('.tree__content');
const treeGranlandContainer = <HTMLElement>document.querySelector('.tree__garland-container');
const savedTree = <HTMLTemplateElement>document.getElementById('savedTree');
const savedTreesBox = <HTMLElement>document.getElementById('savedTreesBoxes');

function inserElements(parent: HTMLElement, classSelector: string, amount: number, path: string, ext: string): void {
    const fragment = new DocumentFragment();

    for (let i = 1; i <= amount; i++) {
        const div = <HTMLElement>document.createElement('div');
        div.className = 'tree__item-box ' + classSelector;
        div.style.backgroundImage = `url(${path + i.toString() + '.' + ext})`;
        div.setAttribute('data-image-num', i.toString());
        fragment.append(div);
    }

    parent.innerHTML = '';
    parent.append(fragment);
}

class TreesContent {
    public selectedToys: ToyDescription[];
    public mediaElement: HTMLElement;

    constructor() {
        this.selectedToys = [];
        this.mediaElement = treesMediaContent;
    }

    loadElements(selectedToys: ToyDescription[]): void {
        const treesBoxContent = <HTMLElement>document.getElementById('treesBoxContent');
        const bgContentBox = <HTMLElement>document.getElementById('bgContentBox');
        const toysContentBox = <HTMLElement>document.getElementById('toysContentBox');
        const toyFragment = <HTMLTemplateElement>document.getElementById('toysBox');
        const fragment = new DocumentFragment();
        this.selectedToys = selectedToys;

        inserElements(treesBoxContent, 'tree__item-box-tree', 6, './assets/tree/', 'png');
        inserElements(bgContentBox, 'tree__item-box-bg', 10, './assets/bg/', 'jpg');

        this.selectedToys.forEach((el) => {
            const toyBox = <HTMLElement>toyFragment.content.cloneNode(true);
            const toyElement = <HTMLElement>toyBox.querySelector('.tree__item-box-toy');
            const img = <HTMLImageElement>toyBox.querySelector('img');
            toyElement.setAttribute('data-parent-id', el.num);
            toyElement.setAttribute('data-amount', el.count.toString());

            if (+el.count != 0) {
                img.alt = el.name;
                img.src = el.img ? el.img.toString() : `./assets/toys/${el.num}.png`;
            } else {
                img.remove();
            }
            fragment.append(toyBox);
        });

        toysContentBox.innerHTML = '';
        toysContentBox.append(fragment);
    }

    public createSnowFlake(): void {
        const snow_flake = document.createElement('i');
        const size: string = (Math.random() * 25 + 5).toString() + 'px';
        snow_flake.classList.add('fas');
        snow_flake.classList.add('fa-snowflake');
        snow_flake.style.width = size;
        snow_flake.style.height = size;
        snow_flake.style.left = (Math.random() * window.innerWidth).toString() + 'px';
        snow_flake.style.animationDuration = (Math.random() * 3 + 2).toString() + 's'; // between 2 - 5 seconds
        snow_flake.style.opacity = Math.random().toString();
        snow_flake.style.fontSize = (Math.random() * 10 + 10).toString();
        +'px';

        treesMediaContent.appendChild(snow_flake);

        setTimeout(() => {
            snow_flake.remove();
        }, 3500);
    }

    public deleteGarland() {
        treeGranlandContainer.innerHTML = '';
    }

    public createGarland(color: string): void {
        let padding = 0;
        treeGranlandContainer.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const amount: number = i * 6 + 5;
            const ul = <HTMLElement>document.createElement('ul');
            ul.className = 'lightrope light-' + color;
            for (let j = 0; j < amount; j++) {
                const li = <HTMLElement>document.createElement('li');
                li.style.transform = `translateY(${padding.toString()}px)`;
                ul.append(li);
                if (amount / 2 - 0.5 > j) padding += 1;
                else padding -= 1;
            }
            treeGranlandContainer.append(ul);
        }
    }

    public clearBoxWithSavedTrees() {
        savedTreesBox.innerHTML = '';
    }

    public insertNewSavedPage(treeNum: string, bgNum: string, id: string, toysInfo: TreesToyInfo[]) {
        const newSavedTree = <HTMLElement>savedTree.content.cloneNode(true);
        const box = <HTMLElement>newSavedTree.querySelector('.tree__item-box');
        const treeToysContainer = <HTMLElement>newSavedTree.querySelector('.tree__saved-toys');
        const treeImage = <HTMLImageElement>newSavedTree.querySelector('.tree__saved-tree');
        // TODO: Static coefficients. If necessary, make it responsive
        const kx = 150 / 500,
            ky = 150 / 714;
        box.id = id;
        box.style.backgroundImage = `url(assets/bg/${bgNum}.jpg)`;
        treeImage.src = `assets/tree/${treeNum}.png`;
        toysInfo.forEach((el) => {
            const img = new Image();
            img.src = `assets/toys/${el.num}.png`;
            img.style.left = `${el.location.x * kx}px`;
            img.style.top = `${el.location.y * ky}px`;
            treeToysContainer.append(img);
        });
        savedTreesBox.prepend(newSavedTree);
    }
}

export default TreesContent;
