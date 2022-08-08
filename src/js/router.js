import HomeView from '../views/Home/HomeView';
import SearchView from '../views/Search/SearchView';
import ExploreView from '../views/Explore/ExploreView';
import DetailView from '../views/Detail/DetailView';
import CreateView from '../views/Create/CreateView';

import CustomEvents from './events';

const $ = (param) => document.querySelector(param);
const $$ = (param) => document.querySelectorAll(param);

const routes = [
    {
        path: '/',
        view: HomeView,
    },
    {
        path: '/search',
        view: SearchView,
    },
    {
        path: '/explore',
        view: ExploreView,
    },
    {
        path: '/view',
        view: DetailView,
    },
    {
        path: '/create',
        view: CreateView,
    },
];

export default class {
    constructor() {
        console.log('Created Router');
        window.addEventListener('click', this.clickEvent);
    }

    clickEvent = (event) => {
        let linkElem = event.target.closest('a');

        if (linkElem) {
            console.log('clicked link');
            event.stopPropagation();
            event.preventDefault();

            this.navigate(linkElem.href);
        }
    };

    route = async () => {
        let match = null;

        if (location.pathname.startsWith('/view/')) {
            match = routes.find((route) => route.path === '/view');
        } else {
            match = routes.find((route) => location.pathname === route.path) || routes[0];
        }

        let urlParams = location.pathname.split('/').splice(2);
        let queryParams = location.search.split('?')[1]?.split('&');

        const view = new match.view(urlParams, queryParams);
        await view.init();

        let pageName = match.path.substring(1);
        if (pageName === '') pageName = 'home';

        const root = $('#app');
        root.innerHTML = '';
        console.log(root.innerHTML);
        root.className = pageName;

        const config = { attributes: true, childList: true, subtree: true };
        const observer = new MutationObserver((mutation, observer) => {
            observer.disconnect();
            window.dispatchEvent(CustomEvents.ATTACHED_VIEW(pageName));
        });

        observer.observe(root, config);

        root.appendChild(await view.getView());

        if (location.pathname.startsWith('/view/')) {
            window.scrollTo(0, 0);
        } else if (location.pathname.startsWith('/create')) {
        }
    };

    navigate = (url) => {
        history.pushState(null, null, url);
        this.route();
    };
}
