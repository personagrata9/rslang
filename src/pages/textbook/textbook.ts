import { createDivElement, createLiElement, createUlElement } from '../../common/utils';

class Textbook {
  private container: HTMLDivElement;

  constructor() {
    this.container = createDivElement('container textbook-container');
  }

  private createNavigationBar = (): HTMLDivElement => {
    const navigationContainerElement = createDivElement('textbook-navigation-container');
    const navElement = createDivElement('nav-bar');
    const listElement = createUlElement('navbar-nav');

    navElement.append(listElement);

    const unitsIds: number[] = Array(7)
      .fill('')
      .map((_, i) => i);

    unitsIds.forEach((_, i) => {
      const unitElement = createLiElement('nav-item navbar-text');
      unitElement.id = `textbook-unit-${i}`;
      unitElement.textContent = `Unit ${i + 1}`;

      listElement.append(unitElement);
    });

    navigationContainerElement.append(navElement);

    return navigationContainerElement;
  };

  render = (): HTMLDivElement => {
    this.container.append(this.createNavigationBar());

    return this.container;
  };
}

export default Textbook;
