import Api from '../../api/api';
import { Colors, IWord } from '../../common/types';
import {
  createButtonElement,
  createDivElement,
  createLiElement,
  createNavElement,
  createUlElement,
} from '../../common/utils';
import WordCard from '../../components/word-card/word-card';

class Textbook {
  private container: HTMLDivElement;

  private group: string;

  private page: string;

  private api: Api;

  private words: IWord[];

  private colors: string[];

  constructor() {
    this.container = createDivElement('container', 'textbook-container');
    this.group = localStorage.getItem('group') || '0';
    this.page = localStorage.getItem('page') || '0';
    this.api = new Api();
    this.words = [];
    this.colors = [
      Colors.Turquoise,
      Colors.TurquoiseDark,
      Colors.Gray,
      Colors.GrayDark,
      Colors.Yellow,
      Colors.YellowDark,
      Colors.Orange,
    ];
  }

  private createNavigationBar = (): HTMLElement => {
    const navElement: HTMLElement = createNavElement(
      'textbook-group-navigation',
      'shadow',
      'rounded-3',
      'overflow-hidden'
    );

    const listElement: HTMLUListElement = createUlElement('navbar-nav', 'flex-row', 'justify-content-around');

    navElement.append(listElement);

    const unitsIds: number[] = Array(7)
      .fill('')
      .map((_, i) => i);

    unitsIds.forEach((_, i) => {
      const unitElement: HTMLLIElement = createLiElement('nav-item', 'navbar-text', 'rounded-3');
      unitElement.id = `textbook-unit-${i}`;
      unitElement.textContent = `Unit ${i + 1}`;
      unitElement.style.backgroundColor = this.colors[i];
      if (i === +this.group) {
        unitElement.classList.add('active');
      }

      listElement.append(unitElement);
    });

    return navElement;
  };

  private getWordsItems = async (): Promise<void> => {
    await this.api
      .getWords(this.group, this.page)
      .then((results) => results.forEach((result: IWord) => this.words.push(result)));
  };

  private createWordsCardsList = (): HTMLDivElement => {
    const listContainerElement: HTMLDivElement = createDivElement(
      'container',
      'words-cards-list-container',
      'd-flex',
      'flex-wrap',
      'shadow',
      'rounded-3'
    );

    this.words.forEach((word: IWord) => {
      const color: string = this.colors[+this.group];
      const wordCard: WordCard = new WordCard(word, color);
      listContainerElement.append(wordCard.render());
    });

    return listContainerElement;
  };

  render = async (): Promise<HTMLDivElement> => {
    await this.getWordsItems();
    this.container.append(
      this.createNavigationBar(),
      this.createWordsCardsList(),
      createButtonElement('submit', '11', 'btn')
    );

    return this.container;
  };
}

export default Textbook;
