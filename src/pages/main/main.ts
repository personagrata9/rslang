import { createElement } from '../../common/utils';

class Main {
  render(): void {
    const main = createElement('div', ['main-container']);
    const title = createElement('h1', ['main-title'], 'rs-lang');
    const quote = createElement('h2', ['main-quote'], 'Your assistant in learning English');
    main.append(title);
    main.append(quote);
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.append(main);
  }
}
export default Main;
