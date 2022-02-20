import Api from '../api/api';
import {
  ApiPageNameType,
  IGameStatistics,
  IGameStatisticsStr,
  IGameStatisticsTotal,
  ILongTermStatistics,
  ILongTermStatisticsItem,
  IUserWordData,
  IUserWordNewData,
  IWord,
} from '../common/types';
import { convertDate, mapFromString, setFromString } from '../common/utils';

class State {
  private api: Api;

  private userId: string | null;

  private statistics: IGameStatisticsTotal | null;

  private longTermStatistics: ILongTermStatistics;

  private initialStatistics: IGameStatisticsTotal = {
    date: convertDate(new Date()),
    totalGameWords: new Set([]),
    totalNew: new Set([]),
    totalCorrect: new Map([]),
    totalWrong: new Map([]),
    totalLearned: new Set([]),
    totalRepeats: new Map([]),
    audioChallenge: {
      new: new Set([]),
      correct: new Map([]),
      wrong: new Map([]),
      bestSeries: 0,
    },
    sprint: {
      new: new Set([]),
      correct: new Map([]),
      wrong: new Map([]),
      bestSeries: 0,
    },
  };

  private initialLongTermStatistics: ILongTermStatistics = {};

  constructor(private readonly name: ApiPageNameType) {
    this.name = name;
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
    this.statistics = null;
    this.longTermStatistics = {};
  }

  private stringifyGameStatistics = (obj: IGameStatistics): string => {
    const stringifiedValues: IGameStatisticsStr = {
      new: Array.from(obj.new).toString(),
      correct: Array.from(obj.correct.entries()).toString(),
      wrong: Array.from(obj.wrong.entries()).toString(),
      bestSeries: obj.bestSeries.toString(),
    };
    return JSON.stringify(stringifiedValues);
  };

  private stringifyTotalStatistics = (obj: IGameStatisticsTotal): string => {
    const stringifiedValues: IGameStatisticsStr = {
      date: obj.date.toString(),
      totalGameWords: Array.from(obj.totalGameWords).toString(),
      totalNew: Array.from(obj.totalNew).toString(),
      totalCorrect: Array.from(obj.totalCorrect.entries()).toString(),
      totalWrong: Array.from(obj.totalWrong.entries()).toString(),
      totalLearned: Array.from(obj.totalLearned).toString(),
      totalRepeats: Array.from(obj.totalRepeats.entries()).toString(),
      audioChallenge: this.stringifyGameStatistics(obj.audioChallenge),
      sprint: this.stringifyGameStatistics(obj.sprint),
    };
    return JSON.stringify(stringifiedValues);
  };

  private parseGameStatistics = (storage: string): IGameStatistics => {
    const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

    return {
      new: setFromString(parsedStorage.new),
      correct: mapFromString(parsedStorage.correct),
      wrong: mapFromString(parsedStorage.wrong),
      bestSeries: +parsedStorage.bestSeries,
    };
  };

  private parseTotalStatistics = (storage: string): IGameStatisticsTotal => {
    const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

    return {
      date: parsedStorage.date,
      totalGameWords: setFromString(parsedStorage.totalGameWords),
      totalNew: setFromString(parsedStorage.totalNew),
      totalCorrect: mapFromString(parsedStorage.totalCorrect),
      totalWrong: mapFromString(parsedStorage.totalWrong),
      totalLearned: setFromString(parsedStorage.totalLearned),
      totalRepeats: mapFromString(parsedStorage.totalRepeats),
      audioChallenge: this.parseGameStatistics(parsedStorage.audioChallenge),
      sprint: this.parseGameStatistics(parsedStorage.sprint),
    };
  };

  private setStatistics = (): void => {
    if (this.longTermStatistics) {
      localStorage.setItem('longTermStatistics', JSON.stringify(this.longTermStatistics));
    }
    if (this.statistics) {
      localStorage.setItem('statistics', this.stringifyTotalStatistics(this.statistics));
    }
    console.log('set', this.statistics);
  };

  private initLongTermStatistics = (): void => {
    const storage: string | null = localStorage.getItem('longTermStatistics');
    if (!storage) {
      this.longTermStatistics = this.initialLongTermStatistics;
    } else {
      this.longTermStatistics = JSON.parse(storage) as ILongTermStatistics;
    }
  };

  private initCurrentStatistics = (): void => {
    const storage: string | null = localStorage.getItem('statistics');
    if (!storage) {
      this.statistics = this.initialStatistics;
    } else {
      this.statistics = this.parseTotalStatistics(storage);
      const stateDate = this.statistics.date;
      const todayDate = convertDate(new Date());

      console.log('state', stateDate, 'today', todayDate);
      if (stateDate !== todayDate) {
        const prevStatistics: ILongTermStatisticsItem = {
          newPerDay: this.statistics.totalNew.size,
          learnedPerDay: this.statistics.totalLearned.size,
        };

        this.longTermStatistics[stateDate] = prevStatistics;
        // this.statistics.date = todayDate;
        // this.statistics.totalNew = new Set([]);
      }

      //       date: convertDate(new Date()),
      // totalGameWords: new Set([]),
      // totalNew: new Set([]),
      // totalCorrect: new Map([]),
      // totalWrong: new Map([]),
      // totalLearned: new Set([]),
      // totalRepeats: new Map([]),
      // audioChallenge: {
      //   new: new Set([]),
      //   correct: new Map([]),
      //   wrong: new Map([]),
      //   bestSeries: 0,
      // },
      // sprint: {
      //   new: new Set([]),
      //   correct: new Map([]),
      //   wrong: new Map([]),
      //   bestSeries: 0,
      // },
    }
  };

  initStatistics = (): void => {
    this.initLongTermStatistics();
    this.initCurrentStatistics();
    this.setStatistics();
    console.log('init', this.longTermStatistics, this.statistics);
  };

  protected getDifficultUserWords = async (): Promise<IWord[]> => {
    const userWords: IUserWordData[] = this.userId
      ? await this.api.getUserWords(this.userId).then((result) => result)
      : [];
    const difficultWordsData: IUserWordData[] = userWords.filter((data) => data.difficulty === 'hard');
    return Promise.all(
      difficultWordsData.map((data: IUserWordData): Promise<IWord> => this.api.getWordById(data.wordId))
    );
  };

  // check
  setNewWords = (wordId: string): void => {
    if (this.statistics) {
      if (this.name === 'sprint') {
        if (!this.statistics.totalGameWords.has(wordId)) {
          this.statistics.sprint.new.add(wordId);
          this.statistics.totalNew.add(wordId);
        }
        this.statistics.totalGameWords.add(wordId);
      }
      if (this.name === 'audio-challenge') {
        if (!this.statistics.totalGameWords.has(wordId)) {
          this.statistics.audioChallenge.new.add(wordId);
          this.statistics.totalNew.add(wordId);
        }
        this.statistics.totalGameWords.add(wordId);
      }
    }
  };

  setCorrectWords = (wordId: string): void => {
    if (this.statistics) {
      if (this.statistics.totalCorrect.has(wordId)) {
        const totalValue = this.statistics.totalCorrect.get(wordId);
        if (typeof totalValue === 'number') this.statistics.totalCorrect.set(wordId, totalValue + 1);
        if (this.name === 'sprint') {
          const value = this.statistics.sprint.correct.get(wordId);
          if (typeof value === 'number') this.statistics.sprint.correct.set(wordId, value + 1);
        }
        if (this.name === 'audio-challenge') {
          const value = this.statistics.audioChallenge.correct.get(wordId);
          if (typeof value === 'number') this.statistics.audioChallenge.correct.set(wordId, value + 1);
        }
      } else {
        this.statistics.totalCorrect.set(wordId, 1);
        if (this.name === 'sprint') {
          this.statistics.sprint.correct.set(wordId, 1);
        }
        if (this.name === 'audio-challenge') {
          this.statistics.audioChallenge.correct.set(wordId, 1);
        }
      }
    }
  };

  setWrongWords = (wordId: string): void => {
    if (this.statistics) {
      if (this.statistics.totalWrong.has(wordId)) {
        const totalValue = this.statistics.totalWrong.get(wordId);
        if (typeof totalValue === 'number') this.statistics.totalWrong.set(wordId, totalValue + 1);
        if (this.name === 'sprint') {
          const value = this.statistics.sprint.wrong.get(wordId);
          if (typeof value === 'number') this.statistics.sprint.wrong.set(wordId, value + 1);
        }
        if (this.name === 'audio-challenge') {
          const value = this.statistics.audioChallenge.wrong.get(wordId);
          if (typeof value === 'number') this.statistics.audioChallenge.wrong.set(wordId, value + 1);
        }
      } else {
        this.statistics.totalWrong.set(wordId, 1);
        if (this.name === 'sprint') {
          this.statistics.sprint.wrong.set(wordId, 1);
        }
        if (this.name === 'audio-challenge') {
          this.statistics.audioChallenge.wrong.set(wordId, 1);
        }
      }
    }
  };

  setMaxWinstreak = (maxWinstreak: number): void => {
    if (this.name === 'sprint') {
      if (this.statistics && this.statistics.sprint.bestSeries < maxWinstreak)
        this.statistics.sprint.bestSeries = maxWinstreak;
    }
    if (this.name === 'audio-challenge') {
      if (this.statistics && this.statistics.audioChallenge.bestSeries < maxWinstreak)
        this.statistics.audioChallenge.bestSeries = maxWinstreak;
    }
  };

  updateGameState = async (): Promise<void> => {
    const storage: string | null = localStorage.getItem('statistics');
    const userWords: IUserWordData[] = this.userId
      ? await this.api.getUserWords(this.userId).then((result) => result)
      : [];
    const difficultWords = await this.getDifficultUserWords();

    if (storage && this.statistics) {
      const prevStatistics: IGameStatisticsTotal = this.parseTotalStatistics(storage);
      console.log('prev', prevStatistics);

      const newWrong: string[] = [];
      this.statistics.totalWrong.forEach((value, wordId) => {
        if (prevStatistics.totalWrong.has(wordId)) {
          const oldValue = prevStatistics.totalWrong.get(wordId);
          if (oldValue && value > oldValue) newWrong.push(wordId);
        } else {
          newWrong.push(wordId);
        }
      });
      newWrong.forEach((wordId) => {
        if (this.statistics) {
          this.statistics.totalLearned.delete(wordId);
          this.statistics.totalRepeats.set(wordId, 0);
        }
      });

      const newCorrect: string[] = [];
      this.statistics.totalCorrect.forEach((value, wordId) => {
        if (prevStatistics.totalCorrect.has(wordId)) {
          const oldValue = prevStatistics.totalCorrect.get(wordId);
          if (oldValue && value > oldValue) newCorrect.push(wordId);
        } else {
          newCorrect.push(wordId);
        }
      });

      newCorrect.forEach((wordId) => {
        if (this.statistics) {
          if (this.statistics.totalRepeats.has(wordId)) {
            const value = this.statistics.totalRepeats.get(wordId);
            if (typeof value === 'number') {
              this.statistics.totalRepeats.set(wordId, value + 1);
            }
          } else {
            this.statistics.totalRepeats.set(wordId, 1);
          }
        }
      });

      if (this.userId) {
        const entries = Object.entries(Object.fromEntries(this.statistics.totalRepeats));

        entries.map(async (entry: [string, number]) => {
          const wordId: string = entry[0];
          const repeat: number = entry[1];

          if (this.userId && this.statistics) {
            if (
              (difficultWords.find((word) => word.id === wordId) && repeat === 5) ||
              (!difficultWords.find((word) => word.id === wordId) && repeat === 3)
            ) {
              this.statistics.totalLearned.add(wordId);
              const wordData: IUserWordNewData = { difficulty: 'easy', optional: { learned: true, repeat } };
              await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
            } else if (userWords.find((word) => word.wordId === wordId)) {
              const userWord: IUserWordNewData = await this.api.getUserWordById({
                userId: this.userId,
                wordId,
              });

              const wordData: IUserWordNewData = {
                difficulty: userWord.difficulty,
                optional: { learned: false, repeat },
              };
              await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
            } else {
              const wordData: IUserWordNewData = { difficulty: 'easy', optional: { learned: false, repeat } };
              await this.api.createUserWord({ userId: this.userId, wordId, wordData });
            }
          }
        });
      } else {
        this.statistics.totalRepeats.forEach((value, wordId) => {
          if (this.statistics && value === 3) {
            this.statistics.totalLearned.add(wordId);
          }
        });
      }
    }

    this.setStatistics();
  };

  // updateApiStatistics = (): void => {
  // }
}

export default State;
