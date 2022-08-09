import AbstractView from '../AbstractView';
import HomeView from './HomeView.html';
import './HomeView.scss';

import ImageList from '../../components/imagelist/imagelist';
let popularComponent = null; // new ImageList('popular', '#최근_가장_인기있는_짤');
let recentComponent = null; // new ImageList('recent', '#최근_추가된_짤');

import MasonryList from '../../components/masonrylist/masonrylist';
let masonryComponent = null; // new MasonryList('새로운 짤을 발견해보세요!');

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

import CustomEvents from '../../js/events';

const myDOM = new DOMParser().parseFromString(HomeView, 'text/html');

const $ = (param, defaultDOM = myDOM) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = myDOM) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        window.addEventListener('ATTACHED_VIEW', this.attached, { once: true });
        window.addEventListener('DEATTACHED_VIEW', this.deattached, { once: true });
        await this.attachComponent();
    };

    attached = (event) => {
        if (event.detail.target === 'home') {
            console.log('Attached Home View');
            // TODO Spread the event to components
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('imagelist', 'popular'));
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('imagelist', 'recent'));
            window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('masonrylist', 'new'));
        }
    };

    deattached = (event) => {
        if (event.detail.target === 'home') {
            console.log('Deattached Home View');
            // TODO Spread the event to components
            window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('imagelist', 'popular'));
            window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('imagelist', 'recent'));
            window.dispatchEvent(CustomEvents.DEATTACHED_COMPONENT('masonrylist', 'new'));
        }
    };

    attachComponent = async () => {
        popularComponent = new ImageList('popular', '#최근_가장_인기있는_짤');
        recentComponent = new ImageList('recent', '#최근_추가된_짤');
        masonryComponent = new MasonryList('new', '새로운 짤을 발견해보세요!');

        const root = $('.page-inside');
        root.innerHTML = '';

        popularComponent.createEleFromImages(await imageAPI.getImage('임시', 1, 10, true), true);
        recentComponent.createEleFromImages(await imageAPI.getImage('임시', 1, 10, true), true);
        masonryComponent.appendImages(await imageAPI.getImage('임시', 1, 30, true), true);

        root.appendChild(await popularComponent.getComponent());
        root.appendChild(await recentComponent.getComponent());
        root.appendChild(await masonryComponent.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
