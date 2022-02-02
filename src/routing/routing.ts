/* eslint-disable prettier/prettier */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-globals */
import '../styles/style.scss';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Aside from '../components/aside-bar/aside-bar';
import Main from '../pages/main/main';
import Textbook from '../pages/textbook/textbook';
import Minigames from '../pages/minigames/minigames';
import Statistics from '../pages/statistics/statistics';
import Error404 from '../pages/errorPage/error404';

type Classes = {
  [key: string]: Main | Minigames | Statistics | Textbook;
};

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
