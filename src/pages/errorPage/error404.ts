import { createElement } from '../../common/utils';

class Error404 {
  render(): void {
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    const error404 = createElement('div', ['error-page']);
    const error404Inner = createElement('div', ['error-page-inner']);
    const error404InnerText = createElement('div', ['error-page-inner-text'], '404');
    error404Inner.append(error404InnerText);
    const errorNotFound = createElement('p', ['error-page-text'], 'OOOPS... PAGE NOT FOUND');
    error404.append(error404Inner);
    error404.append(errorNotFound);
    contentContainer.append(error404);
  }
}
export default Error404;
