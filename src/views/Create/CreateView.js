import AbstractView from '../AbstractView';
import CreateView from './CreateView.html';
import './CreateView.scss';

import ImageAPI from '../../js/api';
const imageAPI = new ImageAPI();

const myDOM = new DOMParser().parseFromString(CreateView, 'text/html');

const $ = (param, defaultDOM = document) => defaultDOM.querySelector(param);
const $$ = (param, defaultDOM = document) => defaultDOM.querySelectorAll(param);

export default class extends AbstractView {
    tagCount = 0;
    myTags = [];

    constructor(urlParams = null, queryParams = null) {
        super();
        this.setTitle('무도짤방소: 무한도전 짤방 검색기');
    }

    init = async () => {
        window.addEventListener(`ATTACHED_VIEW`, this.attached, { once: true });
        this.myTags = [];
        await this.attachComponent();
    };

    attached = (event) => {
        if (event.detail.target === 'create') {
            console.log('Attached Create View');

            $('input#tag-query').addEventListener('keyup', this.keyUpEvent);
            $('div.tag-input-container').addEventListener('click', this.clickEvent);

            $('.file-preview-container').addEventListener('dragenter', this.dragenterEvent);
            $('.file-preview-container').addEventListener('dragover', this.dragoverEvent);
            $('.file-preview-container').addEventListener('drop', this.dropEvent);
        }
    };

    attachComponent = async () => {
        const root = $('.page-inside');

        // masonryComponent.appendImages(await imageAPI.getImage('임시', 1, 30, true), true);

        // root.appendChild(await masonryComponent.getComponent());
    };

    keyUpEvent = (event) => {
        if (event.defaultPrevented) return;

        if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter') {
            const tagQuery = $('input#tag-query').value.trim();
            if (tagQuery !== '') this.appendTagItem(tagQuery);
        }

        event.preventDefault();
    };

    appendTagItem = (tagText) => {
        const existItem = this.myTags.filter((item) => item.text === tagText);

        if (existItem.length > 0) {
            const targetItem = $(`div.inputed-tag-item[data-id='${existItem[0].id}']`);
            targetItem.addEventListener('animationend', (event) => {
                targetItem.classList.remove('highlight');
            });
            targetItem.classList.add('highlight');
            $('input#tag-query').value = '';
            return;
        }

        this.myTags.push({
            id: this.tagCount++,
            text: tagText,
        });

        const newDiv = document.createElement('div');
        const newSpanClose = document.createElement('span');
        const newSpanText = document.createElement('span');

        newSpanClose.setAttribute('class', 'material-symbols-rounded');
        newSpanClose.textContent = 'close';

        newSpanText.setAttribute('class', 'tag-item');
        newSpanText.textContent = tagText;

        newDiv.setAttribute('class', 'inputed-tag-item');
        newDiv.dataset.id = this.tagCount - 1;
        newDiv.appendChild(newSpanClose);
        newDiv.appendChild(newSpanText);

        // $('div.tag-input-inside').appendChild(newDiv);
        $('div.tag-input-inside').insertBefore(newDiv, $('input#tag-query'));
        $('input#tag-query').value = '';
    };

    clickEvent = (event) => {
        const tagItem = event.target.closest('.inputed-tag-item');

        if (tagItem) {
            const tagItemId = +tagItem.dataset.id;
            this.myTags = this.myTags.filter((item) => item.id !== tagItemId);
            console.log(this.myTags);
            tagItem.parentNode.removeChild(tagItem);
        }

        $('input#tag-query').focus();
    };

    dragenterEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    dragoverEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();
    };

    dropEvent = (event) => {
        event.stopPropagation();
        event.preventDefault();

        const dt = event.dataTransfer;
        const files = dt.files;

        this.handleFiles(files);
    };

    handleFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (!file.type.startsWith('image/')) {
                continue;
            }

            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                $('#preview-image').src = event.target.result;
                $('.file-preview-container > .image-wrapper').classList.add('loaded');
                $('.file-preview-container > p').classList.add('hide');
            });

            reader.readAsDataURL(file);
        }
    };

    async getView() {
        return myDOM.body.childNodes[0].cloneNode(true);
    }
}
