class HTMLConverter {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext('2d');
        this.width = 1000;
        this.height = 720;
    }

    public drawImage(src: string, x: number, y: number, w: number, h: number, cb = () => console.error('err')) {
        const img = new Image();
        img.src = src;
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(img, x, y, w, h);
            cb();
        };
    }

    public getRenderdImage(cb = (url: string) => console.error('err', url)) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.id = 'canvasImg';
        const treeContainer = <HTMLElement>document.querySelector('.tree__content');
        const bgUrl = treeContainer.getAttribute('data-background');
        this.drawImage(bgUrl || '', 0, 0, this.width, this.height, () => {
            const imageC = <HTMLImageElement>document.querySelector('.tree__container-image');
            this.drawImage(imageC.src, 250, 720 - 714, 500, 714, () => {
                const treeToysContainer = <HTMLElement>document.querySelector('.tree__toys-container');
                for (const el of treeToysContainer.children) {
                    const image = <HTMLImageElement>el;
                    const styles = getComputedStyle(image);
                    this.ctx.drawImage(image, 250 + parseInt(styles.left), parseInt(styles.top), 72, 72);
                }
                cb(this.canvas.toDataURL('image/png'));
            });
        });
    }
}

export default HTMLConverter;
