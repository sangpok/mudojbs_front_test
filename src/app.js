import Header from './components/header/header';
import Router from './js/router';

const myHeader = new Header();
const myRouter = new Router();

import CustomEvents from './js/events';

import './styles/common.scss';

class App {
    constructor() {}

    init = () => {
        window.addEventListener('popstate', (event) => {
            myRouter.route();
        });

        window.addEventListener('DOMContentLoaded', async (event) => {
            console.log('DOMContentLoaded');

            const root = document.querySelector('main#app');
            const body = document.body;

            const config = { attributes: true, childList: true, subtree: true };
            const observer = new MutationObserver((mutation, observer) => {
                observer.disconnect();
                window.dispatchEvent(CustomEvents.ATTACHED_COMPONENT('header'));
            });

            observer.observe(root, config);

            body.insertBefore(await myHeader.getComponent(), root);
            myRouter.route();
        });
    };
}

const myApp = new App();
myApp.init();
