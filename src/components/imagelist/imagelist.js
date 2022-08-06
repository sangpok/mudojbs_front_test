import imageListDOM from './imagelist.html';
import './imagelist.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    isOpened = false;
    containerName = null;
    myDOM = new DOMParser().parseFromString(imageListDOM, 'text/html');

    constructor(containerName, title) {
        this.containerName = containerName;
        this.init(title);
    }

    init = async (title) => {
        $('div.image-list-container', this.myDOM).dataset.container = this.containerName;
        $('p.title', this.myDOM).textContent = title;
        $('button.load-more', this.myDOM).addEventListener('click', this.clickEvent);
    };

    clickEvent = (event) => {
        if (!this.isOpened) {
            $$(`[data-container=${this.containerName}] li.image-item.hide`).forEach((item) => {
                item.classList.remove('hide');
            });

            this.isOpened = true;
            $(`[data-container=${this.containerName}] button.load-more`).classList.add('hide');
        }
    };

    createEleFromImages = (imageList, onlyDev = false) => {
        // <li class="image-item">
        //     <a href="#">
        //         <img src="../../assets/images/test_asset/10.jpg" alt="" />
        //     </a>
        // </li>;

        for (let [index, imageItem] of imageList.entries()) {
            let newLi = this.myDOM.createElement('li');
            let newA = this.myDOM.createElement('a');
            let newImg = this.myDOM.createElement('img');

            newA.setAttribute('href', `/view/${imageItem.imageUrl.split('.')[0]}`);

            if (onlyDev) {
                newImg.setAttribute('src', `/images/test_asset/${imageItem.imageUrl}`);
            } else {
                newImg.setAttribute('src', imageItem.imageUrl);
            }

            newLi.setAttribute('class', 'image-item');

            if (index > 4) {
                newLi.classList.add('hide');
            }

            newA.appendChild(newImg);
            newLi.appendChild(newA);

            $('ul.image-list', this.myDOM).appendChild(newLi);
        }
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0];
    }
}
