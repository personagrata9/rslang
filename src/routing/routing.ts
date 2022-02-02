/* eslint-disable prettier/prettier */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
import '../styles/style.scss';

type Classes = {
  [key: string]: Main | Minigames | Statistics | Textbook;
};
class Render {
  nameDiv: string;

  innerContent: string;

  constructor(nameDiv: string, innerContent: string) {
    this.nameDiv = nameDiv;
    this.innerContent = innerContent;
  }

  render() {
    const box = document.createElement('div');
    box.className = this.nameDiv;
    box.innerHTML = this.innerContent;
    return box;
  }
}
class Header extends Render {}

class Main extends Render {}
class Textbook extends Render {}
class Minigames extends Render {}
class Statistics extends Render {}

class Footer extends Render {}
class Aside extends Render {}
class Error404 extends Render {}

const mainInstance = new Main('main', '<div>Main</div>');
const textbookInstance = new Textbook('textbook', '<div>Textbook</div>');
const minigamesInstance = new Minigames('minigames', '<div>Minigames</div>');
const statisticsInstance = new Statistics('statistics', '<div>Statistics</div>');

const footerInstance = new Footer('footer', '<div>Footer</div>');
const asideInstance = new Aside('aside', '<div>Aside</div>');
const error404Instance = new Error404('error404', '<div>Error404</div>');
const headerInstance = new Header('header', '<div>Header</div>');

const routes: Classes = {
  '/': mainInstance,
  '/minigames': minigamesInstance,
  '/textbook': textbookInstance,
  '/statistics': statisticsInstance,
};

const checkHash = () => location.hash;
const router = async () => {
  const header = null || document.querySelector('header');
  const content = null || document.querySelector('content');
  const footer = null || document.querySelector('footer');
  const aside = null || document.querySelector('aside');

  header?.append(headerInstance.render());

  footer?.append(footerInstance.render());

  aside?.append(asideInstance.render());

  const parsedURL = checkHash();

  const page = routes[parsedURL] ? routes[parsedURL] : error404Instance;

  content?.append(page.render());
};

window.addEventListener('hashchange', () => router);
window.addEventListener('load', () => router);
