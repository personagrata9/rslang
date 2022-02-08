import { GROUP_COLORS, ICON_SIZE, NUMBER_OF_GROUPS, NUMBER_OF_PAGES } from '../../common/constants';
import { Colors, IWord } from '../../common/types';
import { createElement } from '../../common/utils';
import WordCard from '../../components/word-card/word-card';
import ApiPage from '../api-page';

class Textbook extends ApiPage {
  private readonly color: string;

  private readonly numberOfPagesInPaginationBar = 9;

  constructor() {
    super('textbook');
    this.color = GROUP_COLORS[+this.textbookGroup];
  }

  private createNavigationBar = (): HTMLElement => {
    const navElement: HTMLElement = createElement('nav', [
      `${this.name}-group-navigation`,
      'shadow',
      'rounded-3',
      'overflow-hidden',
    ]);

    const listElement: HTMLElement = createElement('ul', ['navbar-nav', 'flex-row', 'justify-content-around']);

    navElement.append(listElement);

    const unitsIds: number[] = Array(NUMBER_OF_GROUPS)
      .fill('')
      .map((_, i) => i);

    unitsIds.forEach((_, i) => {
      const unitElement: HTMLElement = createElement('li', ['nav-item', 'navbar-text', 'rounded-3']);
      unitElement.id = `${this.name}-unit-${i}`;
      unitElement.textContent = `Unit ${i + 1}`;
      unitElement.style.backgroundColor = GROUP_COLORS[i];
      if (i === +this.textbookGroup) {
        unitElement.classList.add('active');
      }

      listElement.append(unitElement);
    });

    return navElement;
  };

  private createPaginationBarList = (): HTMLElement => {
    const listElement: HTMLElement = createElement('ul', ['pagination']);
    const middleNum = Math.floor(this.numberOfPagesInPaginationBar / 2);

    const pagesNums: number[] = Array(this.numberOfPagesInPaginationBar)
      .fill('')
      .map((_, i) => {
        let pageNum = i;
        if (+this.textbookPage >= middleNum) {
          pageNum = +this.textbookPage + i - middleNum;
        }
        if (+this.textbookPage >= NUMBER_OF_PAGES - middleNum) {
          pageNum = NUMBER_OF_PAGES - this.numberOfPagesInPaginationBar + i;
        }
        return pageNum;
      });

    pagesNums.forEach((pageNum) => {
      const pageItemElement: HTMLElement = createElement('li', ['page-item']);
      pageItemElement.dataset.pageNum = `${pageNum}`;
      pageItemElement.textContent = `${pageNum + 1}`;

      if (pageNum === +this.textbookPage) {
        pageItemElement.style.backgroundColor = this.color;
        pageItemElement.classList.add('active');
      }

      listElement.append(pageItemElement);
    });

    return listElement;
  };

  private createPaginationBar = (): HTMLElement => {
    const navElement: HTMLElement = createElement('div', [`${this.name}-page-navigation`, 'd-flex']);
    const listElement: HTMLElement = this.createPaginationBarList();
    const prevPageControl: HTMLElement = createElement('div', ['control', 'prev-page']);
    const nextPageControl: HTMLElement = createElement('div', ['control', 'next-page']);

    navElement.append(prevPageControl, listElement, nextPageControl);

    return navElement;
  };

  private stylePaginationControls = (): void => {
    const prevPageControl = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .prev-page`);
    const nextPageControl = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .next-page`);

    const prevPageControlColor = this.textbookPage === '0' ? Colors.GrayLight : this.color;
    prevPageControl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width=${ICON_SIZE} height=${ICON_SIZE} fill=${prevPageControlColor} class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
    </svg>`;
    prevPageControl.style.pointerEvents = this.textbookPage === '0' ? 'none' : 'auto';

    const nextPageControlColor = +this.textbookPage === NUMBER_OF_PAGES - 1 ? Colors.GrayLight : this.color;
    nextPageControl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width=${ICON_SIZE} height=${ICON_SIZE} fill=${nextPageControlColor} class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg>`;
    nextPageControl.style.pointerEvents = +this.textbookPage === NUMBER_OF_PAGES - 1 ? 'none' : 'auto';
  };

  private uodateContentOnPageChange = async (pageNum: string): Promise<void> => {
    this.textbookPage = pageNum;
    localStorage.setItem('page', pageNum);

    const paginationBarList = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .pagination`);
    const newPaginationBarList = this.createPaginationBarList();
    paginationBarList.replaceWith(newPaginationBarList);
    this.addPaginationBarListeners();

    const cardsListContainer = <HTMLDivElement>document.querySelector('.words-cards-list-container');
    const newCardsListContainer = await this.createWordsCardsList();
    cardsListContainer.replaceWith(newCardsListContainer);

    this.stylePaginationControls();
  };

  private addPaginationBarListeners = (): void => {
    const removePageItemsStyle = () => {
      const pageItems: NodeListOf<HTMLLIElement> = document.querySelectorAll(
        `.${this.name}-page-navigation .page-item`
      );
      pageItems.forEach((item) => {
        item.removeAttribute('style');
        item.classList.remove('active');
      });
    };

    const paginationBarList = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .pagination`);
    paginationBarList.onclick = async (event: MouseEvent): Promise<void> => {
      const { target } = event;

      if (target && (target as HTMLLIElement).classList.contains('page-item')) {
        removePageItemsStyle();
        const { pageNum } = (target as HTMLLIElement).dataset || null;

        if (pageNum) {
          (target as HTMLLIElement).classList.add('active');
          (target as HTMLLIElement).style.backgroundColor = this.color;

          await this.uodateContentOnPageChange(pageNum);
        }
      }
    };

    const prevPageControl = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .prev-page`);

    prevPageControl.onclick = async (): Promise<void> => {
      const pageNum = `${+this.textbookPage - 1}`;
      await this.uodateContentOnPageChange(pageNum);
    };

    const nextPageControl = <HTMLDivElement>document.querySelector(`.${this.name}-page-navigation .next-page`);

    nextPageControl.onclick = async (): Promise<void> => {
      const pageNum = `${+this.textbookPage + 1}`;
      await this.uodateContentOnPageChange(pageNum);
    };
  };

  private createWordsCardsList = async (): Promise<HTMLElement> => {
    const words = await this.getTextbookWordsItems();

    const listContainerElement: HTMLElement = createElement('div', [
      'container',
      'words-cards-list-container',
      'd-flex',
      'flex-wrap',
      'shadow',
      'rounded-3',
    ]);

    words.forEach((word: IWord) => {
      const wordCard: WordCard = new WordCard(word, this.color);
      listContainerElement.append(wordCard.render());
    });

    return listContainerElement;
  };

  render = async (): Promise<void> => {
    const container: HTMLElement = createElement('div', [
      'container',
      `${this.name}-container`,
      'd-flex',
      'flex-column',
    ]);
    container.append(this.createNavigationBar(), this.createPaginationBar(), await this.createWordsCardsList());

    this.contentContainer.append(container);
    this.stylePaginationControls();
  };

  addListeners = (): void => {
    this.addPaginationBarListeners();
  };
}

export default Textbook;
