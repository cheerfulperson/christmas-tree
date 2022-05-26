import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';

interface Instance extends HTMLElement {
    noUiSlider: noUiSlider.API;
}

const sliderNumberOfCopies = <Instance>document.getElementById('numberOfCopies');
const sliderAcquisitionYear = <Instance>document.getElementById('toysAcquisitionYear');

const recieve = (value: number | string): number => +Number(value).toFixed(0);

const create = (elem: HTMLElement, range: number[]): void => {
    noUiSlider.create(elem, {
        start: range,
        step: 1,
        connect: true,
        tooltips: true,
        format: {
            to: recieve,
            from: recieve,
        },
        range: {
            min: range[0] ? range[0] : 0,
            max: range[1] ? range[1] : 100,
        },
    });
};

create(sliderAcquisitionYear, [1940, 2021]);
create(sliderNumberOfCopies, [0, 12]);

export default {
    sliderNumberOfCopies,
    sliderAcquisitionYear,
};
