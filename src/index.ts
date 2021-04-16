import "../sass/main.scss";
import MagazineView from './Magazine';
import { Detail } from './Detail';

const init = () => {
  window.addEventListener("load", () => MagazineView);
};

init();

customElements.define("article-detail", Detail)