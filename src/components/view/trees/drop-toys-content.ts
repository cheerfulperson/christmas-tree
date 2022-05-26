import TreesContentHandler from './trees-events';

export function makeDraggble(tree: TreesContentHandler) {
    const draggable = document.querySelectorAll('.tree__item-box-toy img');
    draggable.forEach((el) => {
        (<HTMLImageElement>el).addEventListener('dragstart', (e: DragEvent) => {
            tree.handleDragStart(e);
        });
    });
}

export function getDropToysContent(tree: TreesContentHandler) {
    const targetDrop = <HTMLMapElement>document.querySelector('[name="tree-map"] area');

    targetDrop.addEventListener('dragover', (e: DragEvent) => {
        tree.handleOverDrop(e);
    });
    targetDrop.addEventListener('drop', (e: DragEvent) => {
        tree.handleOverDrop(e);
    });
    targetDrop.addEventListener('dragenter', (e: DragEvent) => {
        e.preventDefault();
    });
    targetDrop.addEventListener('dragleave', (e: DragEvent) => {
        e.preventDefault();
    });
}
