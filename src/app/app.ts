import Header from '../components/header/header';
import Aside from '../components/aside-bar/aside-bar';
import Footer from '../components/footer/footer';
import { createDivElement, checkHash } from '../common/utils';
import { BODY } from '../common/constants';
import Error404 from '../pages/errorPage/error404';
import Textbook from '../pages/textbook/textbook';
import Main from '../pages/main/main';
import Minigames from '../pages/minigames/minigames';
import Statistics from '../pages/statistics/statistics';
import ApiPage from '../pages/api-page';

class App {
  private header: Header;

  private aside: Aside;

  private footer: Footer;

  constructor() {
    this.header = new Header();
    this.aside = new Aside();
    this.footer = new Footer();
  }

  private renderWrapper = (): HTMLDivElement => {
    const wrapperElement = createDivElement('wrapper');
    const aside = this.aside.render();

    wrapperElement.append(aside, createDivElement('content-container', 'container-fluid'));

    return wrapperElement;
  };

  private addComponentsListeners = (): void => {
    // this.header.addListeners();
    // this.aside.addListeners();
    // this.footer.addListeners();
  };

  start = (): void => {
    BODY.append(this.header.render(), this.renderWrapper(), this.footer.render());

    this.addComponentsListeners();
  };

  route = async (): Promise<void> => {
    const main = new Main();
    const textbook = new Textbook();
    const minigames = new Minigames();
    const statistics = new Statistics();

    type RoutesType = {
      [key: string]: Main | Minigames | Statistics | Textbook;
    };

    const routes: RoutesType = {
      '': main,
      '#minigames': minigames,
      '#textbook': textbook,
      '#statistics': statistics,
    };

    const contentContainer = document.querySelector('.content-container') as HTMLElement;
    const parsedURL = checkHash();
    const page = routes[parsedURL] || new Error404();
    contentContainer.innerHTML = '';
    if (page instanceof ApiPage) {
      await page.render();
      page.addListeners();
    } else {
      page.render();
    }
  };
}

export default App;
