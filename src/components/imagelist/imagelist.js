import headerDOM from './imagelist.html';
import './imagelist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const myDOM = new DOMParser().parseFromString(headerDOM, 'text/html');

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    constructor() {
        this.init();
    }

    init = async () => {
        $('button.load-more', myDOM).addEventListener('click', this.clickEvent);
        window.addEventListener('resize', this.resizeEvent);
    };

    clickEvent = (event) => {
        $('.image-list-wrapper').style.height = 'auto';
        $('button.load-more').classList.add('hide');
    };

    resizeEvent = (event) => {
        let nowMedia = getComputedStyle(document.documentElement)
            .getPropertyValue('--now-media')
            .trim();

        let isDesktop = nowMedia == `desktop`;

        this.updateWrapperHeight(document, !isDesktop);
    };

    updateWrapperHeight = (defaultDOM = document, isAuto = false) => {
        if (isAuto) {
            $('.image-list-wrapper', defaultDOM).style.height = 'auto';
        } else {
            let fixedHeight = $('.image-item', defaultDOM).clientHeight;
            let curHeight = $('.image-list-wrapper', defaultDOM).clientHeight;

            if (fixedHeight !== curHeight) {
                $('.image-list-wrapper', defaultDOM).style.height = `${fixedHeight}px`;
            }
        }
    };

    async getComponent() {
        return myDOM.body.childNodes[0];
    }
}
