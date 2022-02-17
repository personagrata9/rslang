import Api from '../api/api';
import {
  ApiPageNameType,
  IGameStatistics,
  IGameStatisticsStr,
  IGameStatisticsTotal,
  IUserWordData,
  IUserWordNewData,
  IWord,
} from '../common/types';
import { convertDate, mapFromString, setFromString } from '../common/utils';

class State {
  private api: Api;

  private userId: string | null;

  private statisticsState: IGameStatisticsTotal | null;

  private initStatistics: IGameStatisticsTotal = {
    date: convertDate(new Date()),
    totalGameWords: new Set([]),
    totalNew: new Set([]),
    totalCorrect: new Map([]),
    totalWrong: new Map([]),
    totalLearned: new Set([]),
    totalRepeats: new Map([]),
    audioChallenge: {
      gameWords: new Set([]),
      new: new Set([]),
      correct: new Map([]),
      wrong: new Map([]),
      bestSeries: 0,
    },
    sprint: {
      gameWords: new Set([]),
      new: new Set([]),
      correct: new Map([]),
      wrong: new Map([]),
      bestSeries: 0,
    },
  };

  constructor(private readonly name: ApiPageNameType) {
    this.name = name;
    this.statisticsState = null;
    this.userId = localStorage.getItem('UserId');
    this.api = new Api();
  }

  private stringifyGameState = (obj: IGameStatistics): string => {
    const stringifiedValues: IGameStatisticsStr = {
      gameWords: Array.from(obj.gameWords).toString(),
      new: Array.from(obj.gameWords).toString(),
      correct: Array.from(obj.correct.entries()).toString(),
      wrong: Array.from(obj.wrong.entries()).toString(),
      bestSeries: obj.bestSeries.toString(),
    };
    return JSON.stringify(stringifiedValues);
  };

  private stringifyTotalState = (obj: IGameStatisticsTotal): string => {
    const stringifiedValues: IGameStatisticsStr = {
      date: obj.date.toString(),
      totalGameWords: Array.from(obj.totalGameWords).toString(),
      totalNew: Array.from(obj.totalGameWords).toString(),
      totalCorrect: Array.from(obj.totalCorrect.entries()).toString(),
      totalWrong: Array.from(obj.totalWrong.entries()).toString(),
      totalLearned: Array.from(obj.totalLearned).toString(),
      totalRepeats: Array.from(obj.totalRepeats.entries()).toString(),
      audioChallenge: this.stringifyGameState(obj.audioChallenge),
      sprint: this.stringifyGameState(obj.sprint),
    };
    return JSON.stringify(stringifiedValues);
  };

  private parseGameState = (storage: string): IGameStatistics => {
    const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

    return {
      gameWords: setFromString(parsedStorage.gameWords),
      new: setFromString(parsedStorage.new),
      correct: mapFromString(parsedStorage.correct),
      wrong: mapFromString(parsedStorage.wrong),
      bestSeries: +parsedStorage.bestSeries,
    };
  };

  private parseTotalState = (storage: string): IGameStatisticsTotal => {
    const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

    return {
      date: parsedStorage.date,
      totalGameWords: setFromString(parsedStorage.totalGameWords),
      totalNew: setFromString(parsedStorage.totalNew),
      totalCorrect: mapFromString(parsedStorage.totalCorrect),
      totalWrong: mapFromString(parsedStorage.totalWrong),
      totalLearned: setFromString(parsedStorage.totalLearned),
      totalRepeats: mapFromString(parsedStorage.totalRepeats),
      audioChallenge: this.parseGameState(parsedStorage.audioChallenge),
      sprint: this.parseGameState(parsedStorage.sprint),
    };
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

  setGameWords = (wordId: string): void => {
    if (this.statisticsState) {
      this.statisticsState.totalGameWords.add(wordId);
      if (this.name === 'sprint') {
        this.statisticsState.sprint.gameWords.add(wordId);
      }
      if (this.name === 'audio-challenge') {
        this.statisticsState.audioChallenge.gameWords.add(wordId);
      }
    }
  };

  setCorrectWords = (wordId: string): void => {
    if (this.statisticsState) {
      if (this.statisticsState.totalCorrect.has(wordId)) {
        const totalValue = this.statisticsState.totalCorrect.get(wordId);
        if (typeof totalValue === 'number') this.statisticsState.totalCorrect.set(wordId, totalValue + 1);
        if (this.name === 'sprint') {
          const value = this.statisticsState.sprint.correct.get(wordId);
          if (typeof value === 'number') this.statisticsState.sprint.correct.set(wordId, value + 1);
        }
        if (this.name === 'audio-challenge') {
          const value = this.statisticsState.audioChallenge.correct.get(wordId);
          if (typeof value === 'number') this.statisticsState.audioChallenge.correct.set(wordId, value + 1);
        }
      } else {
        this.statisticsState.totalCorrect.set(wordId, 1);
        if (this.name === 'sprint') {
          this.statisticsState.sprint.correct.set(wordId, 1);
        }
        if (this.name === 'audio-challenge') {
          this.statisticsState.audioChallenge.correct.set(wordId, 1);
        }
      }
    }
  };

  setWrongWords = (wordId: string): void => {
    if (this.statisticsState) {
      if (this.statisticsState.totalWrong.has(wordId)) {
        const totalValue = this.statisticsState.totalWrong.get(wordId);
        if (typeof totalValue === 'number') this.statisticsState.totalWrong.set(wordId, totalValue + 1);
        if (this.name === 'sprint') {
          const value = this.statisticsState.sprint.wrong.get(wordId);
          if (typeof value === 'number') this.statisticsState.sprint.wrong.set(wordId, value + 1);
        }
        if (this.name === 'audio-challenge') {
          const value = this.statisticsState.audioChallenge.wrong.get(wordId);
          if (typeof value === 'number') this.statisticsState.audioChallenge.wrong.set(wordId, value + 1);
        }
      } else {
        this.statisticsState.totalWrong.set(wordId, 1);
        if (this.name === 'sprint') {
          this.statisticsState.sprint.wrong.set(wordId, 1);
        }
        if (this.name === 'audio-challenge') {
          this.statisticsState.audioChallenge.wrong.set(wordId, 1);
        }
      }
    }
  };

  setMaxWinstreak = (maxWinstreak: number): void => {
    if (this.name === 'sprint') {
      if (this.statisticsState && this.statisticsState.sprint.bestSeries < maxWinstreak)
        this.statisticsState.sprint.bestSeries = maxWinstreak;
    }
    if (this.name === 'audio-challenge') {
      if (this.statisticsState && this.statisticsState.audioChallenge.bestSeries < maxWinstreak)
        this.statisticsState.audioChallenge.bestSeries = maxWinstreak;
    }
  };

  private setGameState = (): void => {
    if (this.statisticsState) {
      localStorage.setItem('statistics', this.stringifyTotalState(this.statisticsState));
    }
    console.log('set', this.statisticsState);
  };

  initGameState = (): void => {
    const storage: string | null = localStorage.getItem('statistics');
    if (!storage) {
      this.statisticsState = this.initStatistics;
    } else {
      this.statisticsState = this.parseTotalState(storage);
    }
    this.setGameState();
    // console.log('init', this.statisticsState);
  };

  updateGameState = async (): Promise<void> => {
    const storage: string | null = localStorage.getItem('statistics');
    const userWords: IUserWordData[] = this.userId
      ? await this.api.getUserWords(this.userId).then((result) => result)
      : [];
    const difficultWords = await this.getDifficultUserWords();

    if (storage && this.statisticsState) {
      const prevStatistics: IGameStatisticsTotal = this.parseTotalState(storage);
      console.log('prev', prevStatistics);

      const newWrong: string[] = [];
      this.statisticsState.totalWrong.forEach((value, wordId) => {
        if (prevStatistics.totalWrong.has(wordId)) {
          const oldValue = prevStatistics.totalWrong.get(wordId);
          if (oldValue && value > oldValue) newWrong.push(wordId);
        } else {
          newWrong.push(wordId);
        }
      });
      newWrong.forEach((wordId) => {
        if (this.statisticsState) {
          this.statisticsState.totalLearned.delete(wordId);
          this.statisticsState.totalRepeats.set(wordId, 0);
        }
      });

      const newCorrect: string[] = [];
      this.statisticsState.totalCorrect.forEach((value, wordId) => {
        if (prevStatistics.totalCorrect.has(wordId)) {
          const oldValue = prevStatistics.totalCorrect.get(wordId);
          if (oldValue && value > oldValue) newCorrect.push(wordId);
        } else {
          newCorrect.push(wordId);
        }
      });

      newCorrect.forEach((wordId) => {
        if (this.statisticsState) {
          if (this.statisticsState.totalRepeats.has(wordId)) {
            const value = this.statisticsState.totalRepeats.get(wordId);
            if (typeof value === 'number') {
              this.statisticsState.totalRepeats.set(wordId, value + 1);
            }
          } else {
            this.statisticsState.totalRepeats.set(wordId, 1);
          }
        }
      });

      if (this.userId) {
        const entries = Object.entries(Object.fromEntries(this.statisticsState.totalRepeats));

        entries.map(async (entry: [string, number]) => {
          const wordId: string = entry[0];
          const repeat: number = entry[1];

          if (this.userId && this.statisticsState) {
            if (
              (difficultWords.find((word) => word.id === wordId) && repeat === 5) ||
              (!difficultWords.find((word) => word.id === wordId) && repeat === 3)
            ) {
              this.statisticsState.totalLearned.add(wordId);
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
        this.statisticsState.totalRepeats.forEach((value, wordId) => {
          if (this.statisticsState && value === 3) {
            this.statisticsState.totalLearned.add(wordId);
          }
        });
      }
    }

    this.setGameState();
  };

  // updateApiStatistics = (): void => {
  // }
}

export default State;
