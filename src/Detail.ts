import { data } from "./utils/data";
import { domUtils } from "./utils/utils";
import { gsap, Expo } from 'gsap';
import { ScrollService } from "./utils/scrollService";

export class Detail extends HTMLElement {
    private scrollService = new ScrollService();

    constructor(public data: { article: HTMLElement, id: number } = null) {
        super();
        this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
            *,
            *::before,
            *::after {
                margin: 0;
                padding: 0;
            }

            :host {
                bottom: 0;
                position: absolute !important;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                width: 100%;
                overflow: hidden;
                height: 100%;
                background-color: rgba(18, 16, 19, 0);
                transition: all .5s;
            }

            :host(.overlay) {
                background-color: rgba(18, 16, 19, 1);
                overflow: scroll;
            }

             .article {
                position: absolute

              }

              .article__close {
                position: absolute;
                font-size: 50px;
                font-weight: 200;
                font-family: sans-serif;
                color: #f5f5f5;
                right: 5%;
                cursor: pointer;
                top: 5%;
                opacity: 0;
                visibility: hidden;
              }

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
              }
          
              p {
                color: #ccc;
                padding: 20px;
                line-height: 1.6;
                font-family: helvetica;
                font-weight: 200;
                opacity: 0;
                visibility: hidden;
              }
                
             .article__title {
                position: absolute;
                color: #ececec;
                font-family: inherit;
                font-weight: 500;
                font-size: 50px;
                top: 10%;
                left: 10%;
            }
        
        `;
        this.shadowRoot.appendChild(style);
    }


    connectedCallback() {
        const { id, article } = this.data;
        this.createDetail(article, id);
        setTimeout(() => {
            this.shadowRoot.host.classList.add('overlay');
            gsap.to(this.shadowRoot.querySelectorAll('.article__paragraph'), {autoAlpha: 1, stagger: 0.15, delay: 0.3, duration: 0.5});
            gsap.to(this.shadowRoot.querySelectorAll('.article__close'), {autoAlpha: 1, delay: 0.3});
        }, 500);
        this.shadowRoot.querySelector('.article__close').addEventListener('click', () => this.onClose())
    }

    private onClose(): void {
        const { height, width, y, x } = this.data.article.getBoundingClientRect();
        const activeArticle = this.shadowRoot.querySelector('.article') as HTMLDivElement;

        gsap.to(this.shadowRoot.querySelectorAll('.article__paragraph'), {autoAlpha: 0, stagger: 0.15, duration: 0.2}).then(() => {
            this.shadowRoot.host.classList.remove('overlay');
            gsap.to(this.shadowRoot.querySelector('.article__title'), {
                duration: 0.6,
                // ease: Expo.easeInOut as any,
                scale: 1,
                top: '10%',
                left: '10%',
            });
            gsap.to(domUtils.get('.articles').children, {
                filter: 'blur(0)', 
                opacity: 1,
                duration: 0.3
            });
            gsap.to(activeArticle, {
                height: `${height}px`,
                width: `${width}px`,
                top: `${y + window.pageYOffset}px`,
                left: `${x + window.pageXOffset}px`,
                duration: 0.6,
                // ease: Expo.easeInOut as any,
            }).then(() => {
                document.querySelector('article-detail').remove(); // remove detail from the DOM.
                gsap.to(this.data.article, { visibility: 'visible', duration: 0 });
                gsap.to(domUtils.get('.articles').children, { pointerEvents: 'initial', duration: 0});
                 // resume horizontal scroll
                this.scrollService.horizontalScrollRef.updatePluginOptions('modal', { open: false });
                this.scrollService.horizontalScrollDisabled = false;        
            })
        });
        gsap.to(this.shadowRoot.querySelectorAll('.article__close'), {autoAlpha: 0, duration: 0.2});
    }

    createDetail(selectedElement, id: number) {
        const selected = data.find(d => d.id === id);
        const selectedImg = domUtils.toArray(selectedElement.children).find(elem => elem.localName === 'img') as HTMLImageElement; 
        const detailContainer = domUtils.create('div'), img = domUtils.create('img') as HTMLImageElement, article = domUtils.create('article'), h3 = domUtils.create('h3'), p = domUtils.create('p'), p1 = domUtils.create('p'), close = domUtils.create('div');
      
        close.innerHTML = `&times;`;
        close.classList.add('article__close')
        article.classList.add('article');
        h3.classList.add('article__title');
        p.classList.add('article__paragraph');
        p1.classList.add('article__paragraph');
        detailContainer.classList.add('article-detail');
        p.textContent = selected.text;
        p1.textContent = selected.text;
        img.src = selected.imageSrc;
        h3.textContent = selected.title;
        const { height, width, y, x } = selectedImg.getBoundingClientRect();
        article.style.height = `${height}px`;
        article.style.width = `${width}px`;
        article.style.top = `${y + window.pageYOffset}px`;
        article.style.left =  `${x + window.pageXOffset}px`;

        gsap.to(article, {
            width: '100%',
            delay: 0.5,
            duration: 0.6,
            height: '650px',
            ease: Expo.easeInOut as any,
            top: '0',
            left: '0',
            right: '0'
        });
        gsap.to(h3, {
            delay: 0.5,
            duration: 0.6,
            ease: Expo.easeInOut as any,
            scale: 2.5,
            top: '20%',
            left: '20%',
        });
        article.appendChild(close);
        article.appendChild(h3);
        article.appendChild(img);
        article.appendChild(p);
        article.appendChild(p1);

        this.shadowRoot.appendChild(article);
    }

    
}

