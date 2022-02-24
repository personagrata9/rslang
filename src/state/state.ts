import Api from '../api/api';
import {
  ApiPageNameType,
  IGameStatistics,
  IGameStatisticsTotal,
  ILongTermStatistics,
  ILongTermStatisticsItem,
  IUserWordData,
  IUserWordNewData,
  StringObjectType,
} from '../common/types';
import { convertDate, setFromString } from '../common/utils';

class State {
  private api: Api;

  private userId: string | null;

  private statistics: IGameStatisticsTotal;

  private longTermStatistics: ILongTermStatistics;

  private initialLongTermStatistics: ILongTermStatistics = {};

  constructor(private readonly name: ApiPageNameType) {
    this.name = name;
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
    this.statistics = {
      date: convertDate(new Date()),
      totalGameWords: new Set([]),
      totalNew: new Set([]),
      totalCorrect: {},
      totalWrong: {},
      totalLearned: new Set([]),
      totalRepeats: {},
      audioChallenge: {
        new: new Set([]),
        correct: {},
        wrong: {},
        bestSeries: 0,
      },
      sprint: {
        new: new Set([]),
        correct: {},
        wrong: {},
        bestSeries: 0,
      },
    };
    this.longTermStatistics = {};
  }

  private stringifyGameStatistics = (obj: IGameStatistics): string => {
    const stringifiedValues: StringObjectType = {
      new: Array.from(obj.new).toString(),
      correct: JSON.stringify(obj.correct),
      wrong: JSON.stringify(obj.wrong),
      bestSeries: obj.bestSeries.toString(),
    };
    return JSON.stringify(stringifiedValues);
  };

  private stringifyTotalStatistics = (obj: IGameStatisticsTotal): string => {
    const stringifiedValues: StringObjectType = {
      date: obj.date.toString(),
      totalGameWords: Array.from(obj.totalGameWords).toString(),
      totalNew: Array.from(obj.totalNew).toString(),
      totalCorrect: JSON.stringify(obj.totalCorrect),
      totalWrong: JSON.stringify(obj.totalWrong),
      totalLearned: Array.from(obj.totalLearned).toString(),
      totalRepeats: JSON.stringify(obj.totalRepeats),
      audioChallenge: this.stringifyGameStatistics(obj.audioChallenge),
      sprint: this.stringifyGameStatistics(obj.sprint),
    };
    return JSON.stringify(stringifiedValues);
  };

  private parseGameStatistics = (storage: string): IGameStatistics => {
    const parsedStorage = JSON.parse(storage) as StringObjectType;

    return {
      new: setFromString(parsedStorage.new),
      correct: JSON.parse(parsedStorage.correct) as StringObjectType,
      wrong: JSON.parse(parsedStorage.wrong) as StringObjectType,
      bestSeries: +parsedStorage.bestSeries,
    };
  };

  private parseTotalStatistics = (storage: string): IGameStatisticsTotal => {
    const parsedStorage = JSON.parse(storage) as StringObjectType;

    return {
      date: parsedStorage.date,
      totalGameWords: setFromString(parsedStorage.totalGameWords),
      totalNew: setFromString(parsedStorage.totalNew),
      totalCorrect: JSON.parse(parsedStorage.totalCorrect) as StringObjectType,
      totalWrong: JSON.parse(parsedStorage.totalWrong) as StringObjectType,
      totalLearned: setFromString(parsedStorage.totalLearned),
      totalRepeats: JSON.parse(parsedStorage.totalRepeats) as StringObjectType,
      audioChallenge: this.parseGameStatistics(parsedStorage.audioChallenge),
      sprint: this.parseGameStatistics(parsedStorage.sprint),
    };
  };

  private setStatistics = (): void => {
    localStorage.setItem('statistics', this.stringifyTotalStatistics(this.statistics));
    localStorage.setItem('longTermStatistics', JSON.stringify(this.longTermStatistics));
  };

  private initCurrentStatistics = (): void => {
    const storage: string | null = localStorage.getItem('statistics');
    if (storage) {
      this.statistics = this.parseTotalStatistics(storage);
    }

    const stateDate = this.statistics.date;
    const todayDate = convertDate(new Date());
    // console.log('dates', stateDate === todayDate);

    if (stateDate !== todayDate) {
      this.statistics.date = todayDate;
      this.statistics.totalNew = new Set([]);
      this.statistics.totalLearned = new Set([]);
      this.statistics.audioChallenge = {
        new: new Set([]),
        correct: {},
        wrong: {},
        bestSeries: 0,
      };
      this.statistics.sprint = {
        new: new Set([]),
        correct: {},
        wrong: {},
        bestSeries: 0,
      };
    }
  };

  private initLongTermStatistics = (): void => {
    const storage: string | null = localStorage.getItem('longTermStatistics');
    if (storage) {
      this.longTermStatistics = JSON.parse(storage) as ILongTermStatistics;
    }
  };

  initStatistics = (): void => {
    this.initCurrentStatistics();
    this.initLongTermStatistics();
    this.setStatistics();
    // console.log('init', this.statistics, this.longTermStatistics);
  };

  setNewWords = (wordId: string): void => {
    if (this.name === 'audio-challenge') {
      if (!this.statistics.totalGameWords.has(wordId)) {
        this.statistics.audioChallenge.new.add(wordId);
        this.statistics.totalNew.add(wordId);
      }
      this.statistics.totalGameWords.add(wordId);
    }
    if (this.name === 'sprint') {
      if (!this.statistics.totalGameWords.has(wordId)) {
        this.statistics.sprint.new.add(wordId);
        this.statistics.totalNew.add(wordId);
      }
      this.statistics.totalGameWords.add(wordId);
    }
  };

  setCorrectWords = (wordId: string): void => {
    if (this.statistics.totalCorrect[wordId]) {
      this.statistics.totalCorrect[wordId] = `${+this.statistics.totalCorrect[wordId] + 1}`;
      if (this.name === 'audio-challenge') {
        const value = this.statistics.audioChallenge.correct[wordId];
        this.statistics.audioChallenge.correct[wordId] = value ? `${+value + 1}` : '1';
      }
      if (this.name === 'sprint') {
        const value = this.statistics.sprint.correct[wordId];
        this.statistics.sprint.correct[wordId] = value ? `${+value + 1}` : '1';
      }
    } else {
      this.statistics.totalCorrect[wordId] = '1';
      if (this.name === 'audio-challenge') {
        this.statistics.audioChallenge.correct[wordId] = '1';
      }
      if (this.name === 'sprint') {
        this.statistics.sprint.correct[wordId] = '1';
      }
    }
    const prevRepeat = this.statistics.totalRepeats[wordId];
    this.statistics.totalRepeats[wordId] = prevRepeat ? `${+prevRepeat + 1}` : '1';
  };

  setWrongWords = (wordId: string): void => {
    if (this.statistics.totalWrong[wordId]) {
      this.statistics.totalWrong[wordId] = `${+this.statistics.totalWrong[wordId] + 1}`;
      if (this.name === 'audio-challenge') {
        const value = this.statistics.audioChallenge.wrong[wordId];
        this.statistics.audioChallenge.wrong[wordId] = value ? `${+value + 1}` : '1';
      }
      if (this.name === 'sprint') {
        const value = this.statistics.sprint.wrong[wordId];
        this.statistics.sprint.wrong[wordId] = value ? `${+value + 1}` : '1';
      }
    } else {
      this.statistics.totalWrong[wordId] = '1';
      if (this.name === 'audio-challenge') {
        this.statistics.audioChallenge.wrong[wordId] = '1';
      }
      if (this.name === 'sprint') {
        this.statistics.sprint.wrong[wordId] = '1';
      }
    }
    this.statistics.totalRepeats[wordId] = '0';
    this.statistics.totalLearned.delete(wordId);
  };

  setMaxWinstreak = (maxWinstreak: number): void => {
    if (this.name === 'audio-challenge') {
      if (this.statistics.audioChallenge.bestSeries < maxWinstreak)
        this.statistics.audioChallenge.bestSeries = maxWinstreak;
    }
    if (this.name === 'sprint') {
      if (this.statistics.sprint.bestSeries < maxWinstreak) this.statistics.sprint.bestSeries = maxWinstreak;
    }
  };

  private updateCurrentStatistics = async (): Promise<void> => {
    const entriesRepeat = Object.entries(this.statistics.totalRepeats);

    if (this.userId) {
      entriesRepeat.map(async (entry: [string, string]) => {
        const wordId: string = entry[0];
        const repeat: number = +entry[1];

        if (this.userId) {
          const userWords: IUserWordData[] = await this.api.getUserWords(this.userId).then((result) => result);
          const difficultWords = await this.api.getDifficultUserWords(this.userId);
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
      entriesRepeat.forEach((entry) => {
        if (entry[1] === '3') {
          this.statistics.totalLearned.add(entry[0]);
        }
      });
    }
  };

  private updateLongTermStatistics = async (): Promise<void> => {
    const currentItem: ILongTermStatisticsItem = {
      newPerDay: this.statistics.totalNew.size,
      correctPerDay:
        Object.values(this.statistics.audioChallenge.correct)
          .map(Number)
          .reduce((a, b) => a + b, 0) +
        Object.values(this.statistics.sprint.correct)
          .map(Number)
          .reduce((a, b) => a + b, 0),
      wrongPerDay:
        Object.values(this.statistics.audioChallenge.wrong)
          .map(Number)
          .reduce((a, b) => a + b, 0) +
        Object.values(this.statistics.sprint.wrong)
          .map(Number)
          .reduce((a, b) => a + b, 0),
      learnedPerDay: this.statistics.totalLearned.size,
    };

    this.longTermStatistics[this.statistics.date] = currentItem;
  };

  updateStatistics = async (): Promise<void> => {
    await this.updateCurrentStatistics()
      .then(async () => {
        await this.updateLongTermStatistics();
      })
      .then(() => this.setStatistics());
    // console.log('update', this.statistics, this.longTermStatistics);
  };
}

export default State;
