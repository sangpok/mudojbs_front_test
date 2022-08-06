import AbstractView from '../AbstractView';
import HomeView from './HomeView.html';
import './HomeView.scss';

import ImageList from '../../components/imagelist/imagelist';
const popularComponent = new ImageList('popular', '#최근_가장_인기있는_짤');
const recentComponent = new ImageList('recent', '#최근_추가된_짤');

import MasonryList from '../../components/masonrylist/masonrylist';
const masonryComponent = new MasonryList();

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
    };

    attachComponent = async () => {
        const root = $('.page-inside');

        popularComponent.createEleFromImages(await imageAPI.getImage('임시', 1, 10, true), true);
        recentComponent.createEleFromImages(await imageAPI.getImage('임시', 1, 10, true), true);
        masonryComponent.createEleFromImages(await imageAPI.getImage('임시', 1, 10, true), true);

        root.appendChild(await popularComponent.getComponent());
        root.appendChild(await recentComponent.getComponent());
        root.appendChild(await masonryComponent.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0];
    }
}
