import Api from '../api/api';
import { IWord, ApiPageNameType, IFilter } from '../common/types';
import { WORDS_PER_PAGE } from '../common/constants';

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected userId: string | null;

  protected api: Api;

  constructor(protected readonly name: ApiPageNameType) {
    this.name = name;
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
  }

  protected getWordsItems = async (group: string, page: string): Promise<IWord[]> => {
    let words: IWord[] = [];
    if (this.userId && localStorage.getItem('isTextbook')) {
      const filter: IFilter = {
        $or: [{ userWord: null }, { 'userWord.optional': null }, { 'userWord.optional.learned': false }],
      };
      await this.api
        .getAggregatedWords(
          this.userId,
          this.textbookGroup,
          '0',
          String((+this.textbookPage + 1) * WORDS_PER_PAGE),
          filter
        )
        .then((results) => results[0].paginatedResults.forEach((result: IWord) => words.push(result)));
      words = words.filter((e) => e.page === +page);
    } else {
      // console.log('last');
      await this.api.getWords(group, page).then((results) => results.forEach((result: IWord) => words.push(result)));
    }
    return words;
  };
}

export default ApiPage;
