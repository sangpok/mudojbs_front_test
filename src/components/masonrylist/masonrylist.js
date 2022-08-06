import masonryListDOM from './masonrylist.html';
import './masonrylist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(masonryListDOM, 'text/html');

    constructor() {
        this.init();
    }

    init = async () => {
        window.addEventListener('resize', this.masonryLayout);
    };

    masonryLayout = () => {
        const masonryContainerStyle = getComputedStyle(
            document.querySelector('.masonry-container')
        );

        const columnGap = parseInt(masonryContainerStyle.getPropertyValue('column-gap'));
        const autoRows = parseInt(masonryContainerStyle.getPropertyValue('grid-auto-rows'));

        document.querySelectorAll('.masonry-item').forEach((elt) => {
            elt.style.gridRowEnd = `span ${Math.ceil(
                elt.querySelector('.pseudo-img').scrollHeight / autoRows + columnGap / autoRows
            )}`;
        });
    };

    createEleFromImages = async (imageList) => {
        for (let imageItem of imageList) {
            let newDiv = this.myDOM.createElement('div');
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newDiv.setAttribute('class', 'masonry-item');
            newImg.setAttribute('src', `../images/test_asset/${imageItem.imageUrl}`);
            newA.appendChild(newImg);
            newDiv.appendChild(newA);

            $('.masonry-container', this.myDOM).appendChild(newDiv);
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0];
    }
}
