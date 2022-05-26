import { ToyDescription } from '../../../interfaces/interfaces';

const dropZoneInput = <HTMLInputElement>document.querySelector('.drop-zone__input');
const uploadToyBtn = <HTMLButtonElement>document.getElementById('uploadToyBtn');
const toyParams = <HTMLElement>document.querySelector('.toys-content__form-zone');

const getName = (): string => 'Bell-' + (60 + Math.round(Math.random() * 10000)).toString();

function initDropInput(cb = (toy: ToyDescription): void => console.error('Not cb!', toy)): void {
    const dropZoneElement = <HTMLElement>dropZoneInput.closest('.toys-content__drop-zone');

    const toysdescription: ToyDescription = {
        num: '',
        name: '',
        year: '2020',
        count: 2,
        size: 'large',
        color: 'white',
        shape: 'bell',
        favorite: false,
    };

    dropZoneElement.addEventListener('click', () => {
        dropZoneInput.click();
    });

    dropZoneInput.addEventListener('change', () => {
        if (dropZoneInput.files?.length) {
            updateThumbnail(dropZoneElement, dropZoneInput.files[0]);
        }
    });

    dropZoneElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZoneElement.classList.add('drop-zone--over');
    });

    ['dragleave', 'dragend'].forEach((type) => {
        dropZoneElement.addEventListener(type, () => {
            dropZoneElement.classList.remove('drop-zone--over');
        });
    });

    dropZoneElement.addEventListener('drop', (e) => {
        e.preventDefault();

        if (e.dataTransfer?.files.length) {
            dropZoneInput.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove('drop-zone--over');
    });

    uploadToyBtn.addEventListener('click', () => {
        const addedToysStr: string | null = localStorage.getItem('addedToys');
        toysdescription.num = (60 + Math.round(Math.random() * 10000)).toString();
        if (toysdescription.name == '') toysdescription.name = getName();

        if (!toysdescription.img) {
            dropZoneElement.classList.add('drop-zone--err');
        } else if (toysdescription.img) {
            dropZoneElement.classList.remove('drop-zone--err');
            const addedToy: ToyDescription[] = addedToysStr ? (JSON.parse(addedToysStr) as ToyDescription[]) : [];
            addedToy.push(toysdescription);

            localStorage.setItem('addedToys', JSON.stringify(addedToy));
            cb(toysdescription);
            toysdescription.name = '';
        }
    });

    toyParams.querySelectorAll('.form-zone__input').forEach((el: Element) => {
        const elId: string = el.id;

        el.addEventListener('input', (e) => {
            const element = <HTMLInputElement | HTMLSelectElement>e.target;
            const value = element.value;

            if (elId == 'formZoneName') {
                toysdescription.name = !value ? getName() : value;
            } else if (elId == 'formZoneCount') {
                toysdescription.count = +value < 0 || +value > 12 ? '1' : value;
            } else if (elId == 'formZoneYear') {
                toysdescription.year = +value < 1940 || +value > 2021 ? '1940' : value;
            } else if (elId == 'formZoneShape') {
                toysdescription.shape = value;
            } else if (elId == 'formZoneColor') {
                toysdescription.color = value;
            } else if (elId == 'formZoneSize') {
                toysdescription.size = value;
            }
        });
    });

    function updateThumbnail(dropZoneElement: HTMLElement, file: File | undefined) {
        let thumbnailElement = <HTMLElement>dropZoneElement.querySelector('.drop-zone__thumb');

        if (dropZoneElement.querySelector('.drop-zone__prompt')) {
            (<HTMLElement>dropZoneElement.querySelector('.drop-zone__prompt')).remove();
        }

        if (!thumbnailElement) {
            thumbnailElement = document.createElement('div');
            thumbnailElement.classList.add('drop-zone__thumb');
            dropZoneElement.appendChild(thumbnailElement);
        }

        if (file) {
            thumbnailElement.setAttribute('data-label', file.name);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.readAsDataURL(file);
                reader.onload = () => {
                    thumbnailElement.style.backgroundImage = `url('${reader.result?.toString() || ''}')`;
                    toysdescription.img = reader.result || '';
                };
            } else {
                thumbnailElement.style.backgroundImage = '';
            }
        }
    }
}

export default initDropInput;
