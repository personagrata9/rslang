import { GROUP_COLORS, ICON_SIZE, NUMBER_OF_GROUPS, NUMBER_OF_PAGES } from '../../common/constants';
import { Colors, DifficultyType, IUserWordData, IWord } from '../../common/types';
import { createAnchorElement, createElement } from '../../common/utils';
import WordCard from '../../components/word-card/word-card';
import ApiPage from '../api-page';

class Textbook extends ApiPage {
  private color: string;

  private readonly numberOfPagesInPaginationBar = 9;

  constructor() {
    super('textbook');
    this.color = GROUP_COLORS[+this.textbookGroup];
  }

  protected getTextbookWordsItems = async (): Promise<IWord[]> => {
    const words: IWord[] = [];

    await this.api
      .getWords(this.textbookGroup, this.textbookPage)
      .then((results) => results.forEach((result: IWord) => words.push(result)));

    return words;
  };

  private createNavigationBar = (): HTMLElement => {
    const navElement: HTMLElement = createElement('nav', [
      `${this.name}-group-navigation`,
      'shadow',
      'rounded-3',
      'overflow-hidden',
    ]);

    const listElement: HTMLElement = createElement('ul', ['navbar-nav', 'flex-row', 'justify-content-around']);

    navElement.append(listElement);

    const groupsNums: string[] = Array(NUMBER_OF_GROUPS)
      .fill('')
      .map((_, i) => i.toString());

    groupsNums.forEach((groupNum: string) => {
      const groupItemElement: HTMLElement = createElement('li', ['nav-item', 'navbar-text', 'rounded-3']);
      groupItemElement.dataset.groupNum = groupNum;
      groupItemElement.textContent = `Unit ${+groupNum + 1}`;
      groupItemElement.style.backgroundColor = GROUP_COLORS[+groupNum];

      listElement.append(groupItemElement);

      groupItemElement.onclick = async (): Promise<void> => {
        this.color = GROUP_COLORS[+groupNum];
        await this.onChangeGroupNum(groupNum);
      };
    });

    return navElement;
  };

  private styleGroupsItems = (): void => {
    const groupsItems: NodeListOf<HTMLElement> = document.querySelectorAll(`.${this.name}-group-navigation .nav-item`);
    groupsItems.forEach((item) => item.classList.remove('active'));

    const activeGroupItem = <HTMLElement>document.querySelector(`li[data-group-num = "${this.textbookGroup}"]`);
    activeGroupItem.classList.add('active');
  };

  private createPaginationBarList = (): HTMLElement => {
    const listElement: HTMLElement = createElement('ul', ['pagination']);
    const middleNum = Math.floor(this.numberOfPagesInPaginationBar / 2);

    const pagesNums: string[] = Array(this.numberOfPagesInPaginationBar)
      .fill('')
      .map((_, i) => {
        let pageNum = i;
        if (+this.textbookPage >= middleNum) {
          pageNum = +this.textbookPage + i - middleNum;
        }
        if (+this.textbookPage >= NUMBER_OF_PAGES - middleNum) {
          pageNum = NUMBER_OF_PAGES - this.numberOfPagesInPaginationBar + i;
        }
        return pageNum.toString();
      });

    pagesNums.forEach((pageNum) => {
      const pageItemElement: HTMLElement = createElement('li', ['page-item']);
      pageItemElement.textContent = `${+pageNum + 1}`;

      if (pageNum === this.textbookPage) {
        pageItemElement.style.borderColor = this.color;
        pageItemElement.classList.add('active');
      }

      listElement.append(pageItemElement);

      pageItemElement.onclick = async (): Promise<void> => {
        await this.onChangePageNum(pageNum);
      };
    });

    return listElement;
  };

  private createPaginationBar = (): HTMLElement => {
    const navElement: HTMLElement = createElement('div', [`${this.name}-page-navigation`, 'd-flex']);
    const listElement: HTMLElement = this.createPaginationBarList();
    const prevPageControl: HTMLElement = createElement('div', ['control', 'prev-page']);
    prevPageControl.onclick = async (): Promise<void> => {
      const pageNum = `${+this.textbookPage - 1}`;
      await this.onChangePageNum(pageNum);
    };

    const nextPageControl: HTMLElement = createElement('div', ['control', 'next-page']);
    nextPageControl.onclick = async (): Promise<void> => {
      const pageNum = `${+this.textbookPage + 1}`;
      await this.onChangePageNum(pageNum);
    };

    navElement.append(prevPageControl, listElement, nextPageControl);

    return navElement;
  };

  private stylePaginationControls = (): void => {
    const prevPageControl = <HTMLElement>document.querySelector(`.${this.name}-page-navigation .prev-page`);
    const nextPageControl = <HTMLElement>document.querySelector(`.${this.name}-page-navigation .next-page`);

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

  private togglePaginationBar = (): void => {
    const paginationBar = <HTMLElement>document.querySelector(`.${this.name}-page-navigation`);
    if (this.textbookGroup === '6') {
      paginationBar.style.visibility = 'hidden';
    } else {
      paginationBar.style.visibility = 'visible';
    }
  };

  private createMinigamesLinks = (): HTMLElement => {
    const minigamesContainer: HTMLElement = createElement('div', [
      `${this.name}-minigames-links-container`,
      'shadow',
      'd-flex',
      'flex-wrap',
    ]);
    minigamesContainer.style.backgroundColor = this.color;

    const titleContainer = createElement('div', ['minigames-title-container', 'd-flex', 'justify-content-between']);

    const textElement = createElement('p', ['minigames-text', 'ps-3', 'pb-0'], 'Minigames');
    const chevronElement: HTMLElement = createElement('div', ['minigames-chevron-icon', 'pe-3']);
    chevronElement.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>';
    titleContainer.append(textElement, chevronElement);

    const linksContainer: HTMLElement = createElement('div', [
      `${this.name}-minigames-links`,
      'rounded-bottom',
      'justify-content-between',
      'p-3',
    ]);
    linksContainer.style.borderColor = this.color;

    const audioChallengeLink: HTMLAnchorElement = createAnchorElement(
      '#audio-challenge',
      `Audio Challenge`,
      `${this.name}-minigames-link`,
      'shadow'
    );
    audioChallengeLink.style.color = this.color;
    linksContainer.addEventListener('click', () => localStorage.setItem('isTextbook', 'true'));

    const sprintLink: HTMLAnchorElement = createAnchorElement(
      '#sprint',
      'Sprint',
      `${this.name}-minigames-link`,
      'shadow'
    );
    sprintLink.style.color = this.color;
    sprintLink.addEventListener('click', () => localStorage.setItem('isTextbook', 'true'));

    linksContainer.append(audioChallengeLink, sprintLink);
    minigamesContainer.append(titleContainer, linksContainer);

    titleContainer.onclick = (): void => {
      minigamesContainer.classList.toggle('active');
      if (minigamesContainer.classList.contains('active')) {
        chevronElement.style.transform = 'rotateX(180deg)';
        linksContainer.style.display = 'flex';
      } else {
        chevronElement.style.transform = 'rotateX(0deg)';
        linksContainer.style.display = 'none';
      }
    };

    return minigamesContainer;
  };

  private createWordsCardsList = async (): Promise<HTMLElement> => {
    const listContainerElement: HTMLElement = createElement('div', [
      'container',
      'words-cards-list-container',
      'd-flex',
      'flex-wrap',
      'shadow',
      'rounded-3',
    ]);

    let words: IWord[] = await this.getTextbookWordsItems();
    const userWords: IUserWordData[] = this.userId
      ? await this.api.getUserWords(this.userId).then((result) => result)
      : [];

    if (this.userId && this.textbookGroup === '6') {
      words = await this.api.getDifficultUserWords(this.userId);

      if (words.length === 0) {
        listContainerElement.innerHTML = `You don't have difficult words! You are able to mark word as difficult in Unit 1-6.`;
        listContainerElement.classList.add('empty');
      } else {
        listContainerElement.classList.remove('empty');
      }
    }

    words.forEach((word: IWord) => {
      const Difficulty: DifficultyType | undefined = userWords?.find((data) => data.wordId === word.id)?.difficulty;
      const isLearned: boolean | undefined = userWords?.find((data) => data.wordId === word.id)?.optional?.learned;

      const wordCard: WordCard = new WordCard(word, this.color, Difficulty, isLearned);
      listContainerElement.append(wordCard.render());
    });

    if (!this.userId && this.textbookGroup === '6') {
      listContainerElement.innerHTML =
        'Only authorized users are able to see unit with difficult words. Please Sign in!';
      listContainerElement.classList.add('authorized');
    } else {
      listContainerElement.classList.remove('authorized');
    }

    return listContainerElement;
  };

  private toggleMinigamesLinks = (): void => {
    const minigamesLinks = <HTMLElement>document.querySelector(`.${this.name}-minigames-links-container`);
    if (!this.userId && this.textbookGroup === '6') {
      minigamesLinks.style.visibility = 'hidden';
    } else {
      minigamesLinks.style.visibility = 'visible';
    }
  };

  private onChangeGroupNum = async (groupNum: string) => {
    if (this.textbookGroup !== groupNum) {
      this.textbookGroup = groupNum;
      localStorage.setItem('group', groupNum);
      this.textbookPage = '0';
      localStorage.setItem('page', this.textbookPage);
      this.styleGroupsItems();
      await this.updateContent();
    }
  };

  private onChangePageNum = async (pageNum: string) => {
    this.textbookPage = pageNum;
    localStorage.setItem('page', pageNum);
    await this.updateContent();
  };

  private updateContent = async (): Promise<void> => {
    const paginationBarList = <HTMLElement>document.querySelector(`.${this.name}-page-navigation .pagination`);
    const newPaginationBarList: HTMLElement = this.createPaginationBarList();
    paginationBarList.replaceWith(newPaginationBarList);
    this.stylePaginationControls();
    this.togglePaginationBar();

    const cardsListContainer = <HTMLElement>document.querySelector('.words-cards-list-container');
    const newCardsListContainer: HTMLElement = await this.createWordsCardsList();
    cardsListContainer.replaceWith(newCardsListContainer);

    const minigamesLinks = <HTMLElement>document.querySelector(`.${this.name}-minigames-links-container`);
    const newMinigamesLinks: HTMLElement = this.createMinigamesLinks();
    minigamesLinks.replaceWith(newMinigamesLinks);
    this.toggleMinigamesLinks();
  };

  render = async (): Promise<void> => {
    const container: HTMLElement = createElement('div', [
      'container',
      `${this.name}-container`,
      'd-flex',
      'flex-wrap',
      'justify-content-between',
      'py-3',
    ]);
    container.append(
      this.createNavigationBar(),
      this.createPaginationBar(),
      this.createMinigamesLinks(),
      await this.createWordsCardsList()
    );

    this.contentContainer.append(container);

    this.styleGroupsItems();
    this.stylePaginationControls();
    this.togglePaginationBar();
    this.toggleMinigamesLinks();
  };
}

export default Textbook;
