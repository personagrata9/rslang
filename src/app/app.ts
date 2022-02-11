import Header from '../components/header/header';
import Aside from '../components/aside-bar/aside-bar';
import Footer from '../components/footer/footer';
import { createElement, checkHash } from '../common/utils';
import { BODY } from '../common/constants';
import Error404 from '../pages/errorPage/error404';
import Textbook from '../pages/textbook/textbook';
import Main from '../pages/main/main';
import Statistics from '../pages/statistics/statistics';
import ApiPage from '../pages/api-page';
import Sprint from '../pages/sprint/sprint';
import AudioChallenge from '../pages/audio-challenge/audio-challenge';

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
    // this.header.addListeners();
    this.aside.addListeners();
    // this.footer.addListeners();
  };

  start = (): void => {
    BODY.append(this.header.render(), this.renderWrapper(), this.footer.render());

    this.addComponentsListeners();
  };

  route = async (): Promise<void> => {
    const main = new Main();
    const textbook = new Textbook();
    const sprint = new Sprint();
    const audioChallenge = new AudioChallenge();
    const statistics = new Statistics();

    type RoutesType = {
      [key: string]: Main | Statistics | Textbook | Sprint | AudioChallenge;
    };

    const routes: RoutesType = {
      '': main,
      '#audio-challenge': audioChallenge,
      '#sprint': sprint,
      '#textbook': textbook,
      '#statistics': statistics,
    };

    const contentContainer = document.querySelector('.content-container') as HTMLElement;
    const parsedURL = checkHash();
    const page = routes[parsedURL] || new Error404();
    contentContainer.innerHTML = '';
    if (page instanceof ApiPage) {
      await page.render();
      // page.addListeners();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      page.render();
    }
  };
}

export default App;
