import { gsap } from 'gsap';
import Flip from 'gsap/Flip';

let interval: ReturnType<typeof setTimeout>;

function updateFilters(
    toysList: HTMLElement,
    deleteNumbers: string[],
    fragment: HTMLElement,
    cb = () => console.error('No')
) {
    const fragmentElements = fragment.children;
    if ((toysList.children.length, fragmentElements.length)) {
        Array.from(fragmentElements).forEach((el) => {
            const element = <HTMLElement>(
                toysList.querySelector(`[data-toy-num="${el.getAttribute('data-toy-num') || ''}"]`)
            );
            if (!element) toysList.prepend(el);
        });

        const items: HTMLElement[] = gsap.utils.toArray<HTMLElement>('.toys-content__list__toy');
        const state = Flip.getState(items);

        for (let i = 0; i < deleteNumbers.length; i++) {
            const element = <HTMLElement>toysList.querySelector(`[data-toy-num="${deleteNumbers[i] || ''}"]`);
            if (element) element.remove();
        }

        Flip.from(state, {
            duration: 0.4,
            scale: true,
            absolute: true,
            ease: 'power1.inOut',
            onEnter: (elements) =>
                gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4 }),
            onLeave: (elements) => gsap.to(elements, { opacity: 0, scale: 0, duration: 0.4 }),
        });
    }

    clearTimeout(interval);
    interval = setTimeout(() => {
        cb();
    }, 300);
}

export default updateFilters;
