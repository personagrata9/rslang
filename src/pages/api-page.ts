<<<<<<< HEAD
import { IWord, ApiPageNameType, IFilter, IUserWordData, IGameStatisticsTotal } from '../common/types';
import { WORDS_PER_PAGE } from '../common/constants';
import State from '../state/state';
import Api from '../api/api';
=======
import Api from '../api/api';
import { IWord, ApiPageNameType, IFilter, IUserWordData, IGameStatisticsTotal } from '../common/types';
import { WORDS_PER_PAGE } from '../common/constants';
import { convertDate } from '../common/utils';
import { stringifyGameStatisticsTotal, getParsedGameStatisticsTotal } from './statistics/state';
>>>>>>> 3d73784 (feat: add statistics state for interaction wirh localStorage)

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected state = new State(this.name);

  protected userId: string | null;

  protected api: Api;

  protected statistics: IGameStatisticsTotal | null;

  constructor(protected readonly name: ApiPageNameType) {
    this.name = name;
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
    this.statistics = null;
  }

  protected getWordsItems = async (group: string, page: string): Promise<IWord[]> => {
    let words: IWord[] = [];

    if (this.userId && localStorage.getItem('isTextbook')) {
      if (group === '6') {
        words = await this.getDifficultUserWords();
      } else {
        const filter: IFilter = {
          $or: [{ userWord: null }, { 'userWord.optional': {} || null }, { 'userWord.optional.learned': false }],
        };
        await this.api
          .getUserAggregatedWords(this.userId, this.textbookGroup, '0', String((+page + 1) * WORDS_PER_PAGE), filter)
          .then((results) => results[0].paginatedResults.forEach((result: IWord) => words.push(result)));
        words = words.filter((e) => e.page === +page);
      }
    } else {
      await this.api.getWords(group, page).then((results) => results.forEach((result: IWord) => words.push(result)));
    }
    return words;
  };

<<<<<<< HEAD
  protected getDifficultUserWords = async (): Promise<IWord[]> => {
    const userWords: IUserWordData[] = this.userId
      ? await this.api.getUserWords(this.userId).then((result) => result)
      : [];
    const difficultWordsData: IUserWordData[] = userWords.filter((data) => data.difficulty === 'hard');
    return Promise.all(
      difficultWordsData.map((data: IUserWordData): Promise<IWord> => this.api.getWordById(data.wordId))
    );
=======
  protected setStatistics = (): void => {
    if (this.statistics) localStorage.setItem('statistics', stringifyGameStatisticsTotal(this.statistics));
  };

  protected initStatistics = (): void => {
    const storage: string | null = localStorage.getItem('statistics');
    if (!storage) {
      const initStatistics: IGameStatisticsTotal = {
        date: convertDate(new Date()),
        totalNewWords: new Set([]),
        totalCorrect: new Map([]),
        totalWrong: new Map([]),
        totalLearnedWords: new Set([]),
        audioChallenge: {
          newWords: new Set([]),
          correct: new Map([]),
          wrong: new Map([]),
          bestSeries: 0,
        },
        sprint: {
          newWords: new Set([]),
          correct: new Map([]),
          wrong: new Map([]),
          bestSeries: 0,
        },
      };
      this.statistics = initStatistics;
      console.log('no-storage', this.statistics);
    } else {
      this.statistics = getParsedGameStatisticsTotal(storage);
      console.log('storage', this.statistics);
    }
>>>>>>> 3d73784 (feat: add statistics state for interaction wirh localStorage)
  };
}

export default ApiPage;
