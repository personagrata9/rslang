import Header from '../components/header/header';
import Aside from '../components/aside-bar/aside-bar';
import Footer from '../components/footer/footer';
import { createElement, checkHash } from '../common/utils';
import { BODY } from '../common/constants';
import Error404 from '../pages/errorPage/error404';
import Textbook, { pauseAudios } from '../pages/textbook/textbook';
import Main from '../pages/main/main';
import Statistics from '../pages/statistics/statistics';
import ApiPage from '../pages/api-page';
import Sprint from '../pages/sprint/sprint';
import AudioChallenge from '../pages/audio-challenge/audio-challenge';
import Api from '../api/api';

class App {
  private header: Header;

  private aside: Aside;

  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.aside = new Aside();
    this.footer = new Footer();
  }

  private renderWrapper = (): HTMLElement => {
    const wrapperElement = createElement('div', ['wrapper']);
    const aside = this.aside.render();

    wrapperElement.append(aside, createElement('div', ['content-container', 'container-fluid']));

    return wrapperElement;
  };

  private addComponentsListeners = (): void => {
    this.header.addListeners();
    this.aside.addListeners();
  };

  start = (): void => {
    BODY.append(this.header.render(), this.renderWrapper(), this.footer.render());

    this.addComponentsListeners();
  };

  route = async (): Promise<void> => {
    const api = new Api();
    if (localStorage.getItem('UserId')) {
      await api.getUser(<string>localStorage.getItem('UserId'));
    }
    const main = new Main();
    const textbook = new Textbook();
    const sprint = new Sprint();
    const audioChallenge = new AudioChallenge();
    const statistics = new Statistics();

    type RoutesType = {
      [key: string]: Main | Statistics | Textbook | Sprint | AudioChallenge;
    };

    const routes: RoutesType = {
      '#main': main,
      '': main,
      '#audio-challenge': audioChallenge,
      '#sprint': sprint,
      '#textbook': textbook,
      '#statistics': statistics,
    };
    const contentContainer = document.querySelector('.content-container') as HTMLElement;
    const parsedURL = checkHash();
    const page = routes[parsedURL] || new Error404();
    const footer = <HTMLElement>document.querySelector('footer');
    const aside = <HTMLElement>document.querySelector('.navbar-aside');
    if (page instanceof Sprint || page instanceof AudioChallenge) {
      footer.classList.remove('show-footer');
      footer.classList.add('hide-footer');
      aside.classList.add('without-footer');
      aside.classList.remove('with-footer');
    } else {
      footer.classList.remove('hide-footer');
      footer.classList.add('show-footer');
      aside.classList.remove('without-footer');
      aside.classList.add('with-footer');
    }
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.firstChild);
    }
    contentContainer.classList.add('preloader');
    if (page instanceof ApiPage || page instanceof Statistics) {
      await page.render();
    } else {
      page.render();
    }
    contentContainer.classList.remove('preloader');

    pauseAudios();
  };
}

export default App;
