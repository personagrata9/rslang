import Header from '../components/header/header';
import Aside from '../components/aside-bar/aside-bar';
import Footer from '../components/footer/footer';
import { createDivElement, checkHash } from '../common/utils';
import BODY from '../common/constants';
import routes from '../routing/routing';
import Error404 from '../pages/errorPage/error404';

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

    wrapperElement.append(aside, createDivElement('content-container container-fluid'));

    return wrapperElement;
  };

  private addComponentsListeners = (): void => {
    // this.header.addListeners();
    // this.sidebar.addListeners();
    // this.footer.addListeners();
  };

  start = (): void => {
    BODY.append(this.header.render(), this.renderWrapper(), this.footer.render());

    this.addComponentsListeners();
  };

  route = (): void => {
    const contentContainer = document.querySelector('.content-container') as HTMLElement;
    const parsedURL = checkHash();
    console.log(parsedURL);
    const page = routes[parsedURL] || new Error404();
    contentContainer.innerHTML = '';
    contentContainer.append(page.render());
    // page.addListeners
  };
}

export default App;
