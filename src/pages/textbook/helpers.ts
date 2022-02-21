import Api from '../../api/api';
import { NUMBER_OF_WORDS_API, WORDS_PER_PAGE } from '../../common/constants';
import { Colors, IFilter, IWord } from '../../common/types';

const disableMiniGamesLinks = (color: string): void => {
  const container = <HTMLDivElement>document.querySelector('.textbook-minigames-links');
  container.innerHTML = 'You have no words to learn on this page.';
  container.style.color = color;
  container.style.textAlign = 'center';
};

const checkFullyLearnedPage = async (color: Colors): Promise<void> => {
  const api = new Api();
  const userId = localStorage.getItem('UserId');
  const group = localStorage.getItem('group');
  const page = localStorage.getItem('page');
  if (userId && group && group !== '6') {
    const words: IWord[] = [];
    const filter: IFilter = {
      $or: [{ 'userWord.difficulty': 'hard' }, { 'userWord.optional.learned': true }],
    };
    await api
      .getUserAggregatedWords(userId, group, '0', String(NUMBER_OF_WORDS_API), filter)
      .then((results) => results[0].paginatedResults.forEach((result: IWord) => words.push(result)));

    if (page && words.filter((word) => word.page === +page).length === WORDS_PER_PAGE) {
      const cardsList = <HTMLDivElement>document.querySelector('.words-cards-list-container');
      cardsList.style.backgroundColor = color;

      const activePageItem = <HTMLLIElement>document.querySelector('.page-item.active');
      activePageItem.style.backgroundColor = color;
      activePageItem.style.color = Colors.White;

      disableMiniGamesLinks(color);
    }
  }
};

export default checkFullyLearnedPage;
