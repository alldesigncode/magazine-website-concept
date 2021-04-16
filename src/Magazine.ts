import { isArray } from "lodash";
import { data } from "./utils/data";
import { domUtils } from "./utils/utils";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scrollbar from 'smooth-scrollbar';
import { HorizontalScrollPlugin, ModalPlugin } from "./utils/scrollPlugins";
import { ScrollService } from "./utils/scrollService";
import { Detail } from "./Detail";

gsap.registerPlugin(ScrollTrigger);

class MagazineView {
   private scrollService = new ScrollService();

  private elements = new Map<string, HTMLElement>([
      ['articles', domUtils.get('.articles')],
      ['main', domUtils.get('.main')]
  ]);

  constructor() {
      this.init()
  }
    init() {
      // scrolltrigger setup
      gsap.registerPlugin(ScrollTrigger);
      const scrollbar = document.querySelector(".main") as HTMLElement;
      // smooth scroll setup
      Scrollbar.use(HorizontalScrollPlugin, ModalPlugin); // add plugins
      const horizontalScrollBar = Scrollbar.init(scrollbar);
      horizontalScrollBar.setPosition(0, 0);
      horizontalScrollBar.track.xAxis.element.remove(); // remove trackbar
      horizontalScrollBar.track.yAxis.element.remove(); // remove trackbar
      // sync smooth scroller with scrolltrigger
      ScrollTrigger.scrollerProxy(scrollbar, {
        scrollLeft(value) {
          if (arguments.length) {
            horizontalScrollBar.scrollLeft = value;
          }
          return horizontalScrollBar.scrollLeft;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          };
        }
      });
      horizontalScrollBar.addListener(ScrollTrigger.update);
      this.scrollService.horizontalScrollRef = horizontalScrollBar;
      // render data
      this.renderArticles(data);

      gsap.to('progress', {
        value: 100,
        scrollTrigger: {
          scrub: 0.3,
          horizontal: true,
          scroller: scrollbar,
        }
      });
    }
    public get articles(): HTMLElement[] {
        const { get, toArray } = domUtils;
        const articles = toArray(get(".articles").children);

        return isArray(articles) && articles.length && articles;
      }
    
    renderArticles(data: { imageSrc: string; title: string }[]) { 
        const elementWidthWithMargin = 800; 
        this.elements.get('articles').style.width = `${elementWidthWithMargin * data.length}px`;    
        data.map((d, i) => this.generateArticle(d, this.elements.get('articles')));

        this.articles.forEach((article: HTMLElement) => article.addEventListener('click', (e: PointerEvent) => this.onClick(article)))
    }

    private onClick(article: HTMLElement): void {
        Scrollbar.get(domUtils.get('.main')).scrollIntoView(article, { offsetLeft: 500 });

        // pause horizontal scrollbar
        this.scrollService.horizontalScrollRef.updatePluginOptions('modal', { open: true });
        this.scrollService.horizontalScrollDisabled = true;

        // prevent image to be clicked multiple times
        this.articles.forEach(a => a.style.pointerEvents = 'none');

        // blur all unselected elements
        const filtered = this.articles.filter(d => d !== article);

        // after blur finished call select method.
        gsap.to(filtered, {filter: 'blur(13px)', opacity: 0.6, duration: 1}).then(() => this.select(article));
    }

    private select(article: HTMLElement) {
       // hide selected element
       gsap.to(article, {autoAlpha:0, duration: 0});

        // display details web-component  
       this.elements.get('main').insertAdjacentElement('afterend', new Detail({article: article, id: Number(article.dataset.id)}));
    }

    private generateArticle(d, articles: HTMLElement) {
       const article = domUtils.create('article'), image = domUtils.create('img') as HTMLImageElement, h3 = domUtils.create('h3');

       article.setAttribute('data-id', d.id);
       article.classList.add('article'), image.classList.add('article__img'), h3.classList.add('article__title');
       image.src = d.imageSrc;
       h3.textContent = d.title;
       article.appendChild(h3);
       article.appendChild(image);
       articles.appendChild(article);
    }
}

export default new MagazineView();
