import masonryListDOM from './masonrylist.html';
import './masonrylist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(masonryListDOM, 'text/html');
    isAttached = false;

    constructor(title) {
        this.init(title);
    }

    init = async (title) => {
        $('p.title', this.myDOM).textContent = title;
        window.addEventListener('ATTACHED_COMPONENT', this.attached);
        window.addEventListener('resize', this.debounce(this.resizeEvent, 5));
    };

    debounce = (func, duration) => {
        let timeout = null;

        return (argument) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                func(argument);
                timeout = null;
            }, duration);
        };
    };

    resizeEvent = (event) => {
        // if ($('.page-inside').clientWidth === 1440) return;
        this.masonryLayout();
    };

    masonryLayout = () => {
        const masonryContainerStyle = getComputedStyle($('.masonry-container'));

        const columnGap = parseInt(masonryContainerStyle.getPropertyValue('column-gap'));
        const autoRows = parseInt(masonryContainerStyle.getPropertyValue('grid-auto-rows'));

        $$('.masonry-item').forEach((elt) => {
            elt.style.gridRowEnd = `span ${Math.ceil(
                $('img', elt).scrollHeight / autoRows + columnGap / autoRows
            )}`;
        });
    };

    appendImages = async (imageList, initial = false) => {
        for (let imageItem of imageList) {
            let newDiv = initial ? this.myDOM.createElement('div') : document.createElement('div');
            let newA = initial ? this.myDOM.createElement('a') : document.createElement('a');
            let newImg = initial ? this.myDOM.createElement('img') : document.createElement('img');

            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newDiv.setAttribute('class', 'masonry-item');
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newImg.addEventListener('load', (event) => {
                this.masonryLayout();
                console.log('이것 때문에 되는 거 아니였어?');
            });
            newA.appendChild(newImg);
            newDiv.appendChild(newA);

            if (initial) {
                $('.masonry-container', this.myDOM).appendChild(newDiv);
            } else {
                $('.masonry-container').appendChild(newDiv);
            }
        }
    };

    attached = (event) => {
        if (event.detail.type === 'masonrylist') {
            console.log(`Attached masonrylist(${event.detail.target}) component`);
            this.masonryLayout();

            let $contentItem = $('.masonry-item:last-child');

            const io = new IntersectionObserver(
                async (entry, observer) => {
                    const ioTarget = entry[0].target;

                    if (entry[0].isIntersecting) {
                        io.unobserve($contentItem);
                        this.appendImages(await imageAPI.getImage('임시', 1, 30, true));

                        $contentItem = $('.masonry-item:last-child');
                        io.observe($contentItem);
                    }
                },
                {
                    threshold: 0.5,
                }
            );

            io.observe($contentItem);
            window.removeEventListener('ATTACHED_COMPONENT', this.attached);
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
