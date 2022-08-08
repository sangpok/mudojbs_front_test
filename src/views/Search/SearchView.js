import AbstractView from '../AbstractView';
import SearchView from './SearchView.html';
import './SearchView.scss';

import MasonryList from '../../components/masonrylist/masonrylist';
const masonryComponent = null;

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const myDOM = new DOMParser().parseFromString(SearchView, 'text/html');

const $ = (param, defaultDOM = myDOM) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = myDOM) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        await this.attachComponent();
    };

    attachComponent = async () => {
        masonryComponent = new MasonryList();
        const root = $('.page-inside');

        masonryComponent.appendImages(await imageAPI.getImage('임시', 1, 30, true), true);

        root.appendChild(await masonryComponent.getComponent());
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
