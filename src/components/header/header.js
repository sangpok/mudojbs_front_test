import headerDOM from './header.html';
import './header.scss';

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class {
    myDOM = new DOMParser().parseFromString(headerDOM, 'text/html');

    constructor() {
        this.init();
    }

    init = async () => {
        window.addEventListener('click', this.windowClickEvent);
        window.addEventListener('ATTACHED_COMPONENT', this.attached);
    };

    attached = (event) => {
        if (event.detail.type === 'header') {
            console.log('Attached Header Component');
        }
    };

    windowClickEvent = (event) => {
        let container = event.target.closest('[data-search-container]');

        if (!container) {
            $(`#related-box`).classList.remove('show');
            $(`#search-box`).classList.remove('focus');
        } else {
            let nowMedia = getComputedStyle(document.documentElement)
                .getPropertyValue('--now-media')
                .trim();

            let isMobile = nowMedia == `mobile`;

            if (isMobile && container) {
                if (event.target.closest('.mobile-back')) {
                    $(`#related-box`).classList.remove('show');
                    $(`#search-box`).classList.remove('focus');
                    $('.search-container').classList.remove('mobile');
                    this.setSearchQuery('');
                } else {
                    $('.search-container').classList.add('mobile');
                    $(`#related-box`).classList.add('show');
                    $(`#search-box`).classList.add('focus');
                }
            } else {
                $(`#related-box`).classList.add('show');
                $(`#search-box`).classList.add('focus');
            }
        }
    };

    updateMenuState = () => {
        [...$$('header #menu-list li')].forEach((item) => item.classList.remove('now'));

        let path = `/${location.pathname.split('/')[1]}`;

        if (['/', '/search', '/view'].includes(path)) {
            $(`header li a[href='/']`).parentNode.classList.add('now');
        } else {
            $(`header li a[href='${path}']`).parentNode.classList.add('now');
        }
    };

    setSearchQuery = (searchQuery) => {
        let searchBox = $('#search-query') || $('#search-query', this.myDOM);
        searchBox.value = searchQuery;
    };

    async getComponent() {
        return this.myDOM.body.childNodes[0].cloneNode(true);
    }
}
