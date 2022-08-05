import AbstractView from '../AbstractView';
import HomeView from './HomeView.html';
import './HomeView.scss';

import ImageList from '../../components/imagelist/imagelist';
const popularComponent = new ImageList();
const recentComponent = new ImageList();

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const myDOM = new DOMParser().parseFromString(HomeView, 'text/html');

const $ = (param, defaultDOM = myDOM) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = myDOM) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    pos = { top: 0, left: 0, x: 0, y: 0 };

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        await this.attachComponent();
        // await this.loadPopularContent(true);
        // await this.loadRecentContent(true);
        // await this.loadRandomContent(true);
        // this.$$('.container-wrapper').forEach((item) => {
        //     item.addEventListener('mousedown', this.mouseDownHandler);
        // });
    };

    attachComponent = async () => {
        const root = $('.page-inside');
        root.appendChild(await popularComponent.getComponent());
        // root.appendChild(recentComponent);
    };

    loadPopularContent = async (onlyDev = false) => {
        let imageList = null;

        if (onlyDev) {
            imageList = await imageAPI.getImage('임시', 1, 10, onlyDev);
        } else {
            imageList = await imageAPI.getImagePopular();
        }

        for (let imageItem of imageList) {
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('class', 'image-item');
            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);

            if (onlyDev) {
                newImg.setAttribute('src', `../../images/test_asset/${imageItem.imageUrl}`);
            } else {
                newImg.setAttribute('src', imageItem.imageUrl);
            }

            newA.appendChild(newImg);

            this.$('#popular-group .image-list-container').appendChild(newA);
        }
    };

    loadRecentContent = async (onlyDev = false) => {
        let imageList = null;

        if (onlyDev) {
            imageList = await imageAPI.getImage('임시', 1, 10, onlyDev);
        } else {
            imageList = await imageAPI.getImageNew();
        }

        for (let imageItem of imageList) {
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('class', 'image-item');
            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);

            if (onlyDev) {
                newImg.setAttribute('src', `../../images/test_asset/${imageItem.imageUrl}`);
            } else {
                newImg.setAttribute('src', imageItem.imageUrl);
            }

            newA.appendChild(newImg);

            this.$('#recent-group .image-list-container').appendChild(newA);
        }
    };

    loadRandomContent = async (onlyDev = false) => {
        let imageList = null;

        if (onlyDev) {
            imageList = await imageAPI.getImage('임시', 1, 10, onlyDev);
        } else {
            imageList = await imageAPI.getImageRandom();
        }

        for (let imageItem of imageList) {
            let newFigure = this.myDOM.createElement('figure');
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);
            newFigure.setAttribute('class', 'image-item');
            newImg.setAttribute('src', `../../images/test_asset/${imageItem.imageUrl}`);
            newA.appendChild(newImg);
            newFigure.appendChild(newA);

            this.$('#new-group .tiled-list-container').appendChild(newFigure);
        }
    };

    container = null;

    mouseDownHandler = (e) => {
        this.container = e.target.closest('.container-wrapper');

        this.pos = {
            left: this.container.scrollLeft,
            top: this.container.scrollTop,

            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('mouseup', this.mouseUpHandler);
    };

    mouseMoveHandler = (e) => {
        const dx = e.clientX - this.pos.x;
        const dy = e.clientY - this.pos.y;

        let nowMedia = getComputedStyle(document.documentElement)
            .getPropertyValue('--now-media')
            .trim();

        let isDesktop = nowMedia == `desktop`;

        if (!isDesktop) {
            this.container.scrollTop = this.pos.top - dy;
            this.container.scrollLeft = this.pos.left - dx;
        }
    };

    mouseUpHandler = () => {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);

        this.container.style.removeProperty('user-select');
    };

    async getView() {
        return myDOM.body.childNodes[0];
    }
}
