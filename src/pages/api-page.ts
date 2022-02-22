import { IWord, ApiPageNameType, IFilter } from '../common/types';
import { NUMBER_OF_WORDS_API } from '../common/constants';
import State from '../state/state';
import Api from '../api/api';

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected state: State;

  protected userId: string | null;

  protected api: Api;

  constructor(protected readonly name: ApiPageNameType) {
    this.name = name;
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
    this.state = new State(this.name);
  }

  protected getWordsItems = async (group: string, page: string): Promise<IWord[]> => {
    let words: IWord[] = [];
    if (this.userId && localStorage.getItem('isTextbook')) {
      if (group === '6') {
        words = await this.api.getDifficultUserWords(this.userId);
      } else {
        const filter: IFilter = {
          $or: [{ userWord: null }, { 'userWord.optional': null }, { 'userWord.optional.learned': false }],
        };
        await this.api
          .getUserAggregatedWords(this.userId, this.textbookGroup, '0', String(NUMBER_OF_WORDS_API), filter)
          .then((results) => results[0].paginatedResults.forEach((result: IWord) => words.push(result)));
        words = words.filter((e) => e.page === +page);
      }
    } else {
      await this.api.getWords(group, page).then((results) => results.forEach((result: IWord) => words.push(result)));
    }
    return words;
  };
}

export default ApiPage;
