import Api from '../api/api';
import {
  ApiPageNameType,
  IGameStatisticsTotal,
  ILongTermStatistics,
  IDayStatistics,
  IUserWordData,
  IUserStatistics,
  IUserWordNewData,
  IWord,
} from '../common/types';
import { convertDate, parseTotalStatistics, stringifyTotalStatistics } from './helpers';

class State {
  private api: Api;

  private userId: string | null;

  private statistics: IGameStatisticsTotal;

  private longTermStatistics: ILongTermStatistics;

  private learnedWords: string;

  private userWords: IUserWordData[];

  private difficultWords: IWord[];

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
    this.learnedWords = '0';
    this.userWords = [];
    this.difficultWords = [];
  }

  private setStatisticsToLS = (): void => {
    if (this.userId) {
      localStorage.setItem(`statistics${this.userId}`, stringifyTotalStatistics(this.statistics));
    } else {
      localStorage.setItem('statistics', stringifyTotalStatistics(this.statistics));
      localStorage.setItem('longTermStatistics', JSON.stringify(this.longTermStatistics));
    }
  };

  private checkDate = (): void => {
    const stateDate = this.statistics.date;
    const todayDate = convertDate(new Date());

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

  initStatistics = async (): Promise<void> => {
    const statisticsStorage: string | null = this.userId
      ? localStorage.getItem(`statistics${this.userId}`)
      : localStorage.getItem('statistics');
    if (statisticsStorage) {
      this.statistics = parseTotalStatistics(statisticsStorage);
    }

    if (this.userId) {
      this.userWords = await this.api.getUserWords(this.userId);
      this.difficultWords = await this.api.getDifficultUserWords(this.userId);
      const gameWords = this.userWords.filter((word) => word.optional.game === true).map((word) => word.wordId);
      this.statistics.totalGameWords = new Set(gameWords);

      const corrects = this.userWords.filter((word) => word.optional.correct);
      corrects.forEach((word) => {
        const { wordId } = word;
        const { correct } = word.optional;
        if (wordId && correct) this.statistics.totalCorrect[wordId] = correct;
      });

      const wrongs = this.userWords.filter((word) => word.optional.wrong);
      wrongs.forEach((word) => {
        const { wordId } = word;
        const { wrong } = word.optional;
        if (wordId && wrong) this.statistics.totalCorrect[wordId] = wrong;
      });

      const repeats = this.userWords.filter((word) => word.optional.repeat);
      repeats.forEach((word) => {
        const { wordId } = word;
        const { repeat } = word.optional;
        if (wordId && repeat) this.statistics.totalRepeats[wordId] = repeat;
      });

      await this.api
        .getStatistics(this.userId)
        .then((result) => {
          this.learnedWords = result.learnedWords;
          this.longTermStatistics = result.optional.longTerm;
        })
        .catch((response: Response) => {
          if (response) {
            this.learnedWords = '0';
            this.longTermStatistics = {};
          }
        });
    } else {
      const longTermStatisticsStorage: string | null = localStorage.getItem('longTermStatistics');
      if (longTermStatisticsStorage) {
        this.longTermStatistics = JSON.parse(longTermStatisticsStorage) as ILongTermStatistics;
      }
    }

    this.setStatisticsToLS();
    this.checkDate();
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
    const repeat = prevRepeat ? `${+prevRepeat + 1}` : '1';
    this.statistics.totalRepeats[wordId] = repeat;
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

  private updateGameWords = async (): Promise<void> => {
    if (this.userId) {
      const entriesGameWords = Array.from(this.statistics.totalGameWords);
      entriesGameWords.map(async (wordId) => {
        if (this.userId) {
          if (this.userWords.find((word) => word.wordId === wordId)) {
            const userWord: IUserWordNewData = await this.api.getUserWordById({
              userId: this.userId,
              wordId,
            });

            const { optional } = userWord;
            optional.game = true;

            const wordData: IUserWordNewData = {
              difficulty: userWord.difficulty,
              optional,
            };
            await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
          } else {
            const wordData: IUserWordNewData = {
              difficulty: 'easy',
              optional: { learned: false, repeat: '0', game: true },
            };
            await this.api.createUserWord({ userId: this.userId, wordId, wordData });
          }
        }
      });
    }
  };

  private updateCorrectWords = async (): Promise<void> => {
    const entriesCorrect = Object.entries(this.statistics.totalCorrect);
    entriesCorrect.map(async (entry: [string, string]) => {
      const wordId: string = entry[0];
      const correctNum: string = entry[1];

      if (this.userId) {
        const userWord: IUserWordNewData = await this.api.getUserWordById({
          userId: this.userId,
          wordId,
        });

        const { optional } = userWord;
        optional.correct = correctNum;

        const wordData: IUserWordNewData = {
          difficulty: userWord.difficulty,
          optional,
        };
        await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
      }
    });
  };

  private updateWrongWords = async (): Promise<void> => {
    const entriesWrong = Object.entries(this.statistics.totalWrong);
    entriesWrong.map(async (entry: [string, string]) => {
      const wordId: string = entry[0];
      const wrongNum: string = entry[1];

      if (this.userId) {
        const userWord: IUserWordNewData = await this.api.getUserWordById({
          userId: this.userId,
          wordId,
        });

        const { optional } = userWord;
        optional.wrong = wrongNum;

        const wordData: IUserWordNewData = {
          difficulty: userWord.difficulty,
          optional,
        };
        await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
      }
    });
  };

  private updateRepeates = async (): Promise<void> => {
    const entriesRepeat = Object.entries(this.statistics.totalRepeats);
    if (this.userId) {
      entriesRepeat.map(async (entry: [string, string]) => {
        const wordId: string = entry[0];
        const repeat: string = entry[1];

        if (this.userId) {
          if (
            (this.difficultWords.find((word) => word.id === wordId) && repeat === '5') ||
            (!this.difficultWords.find((word) => word.id === wordId) && repeat === '3')
          ) {
            this.statistics.totalLearned.add(wordId);
            const userWord: IUserWordNewData = await this.api.getUserWordById({
              userId: this.userId,
              wordId,
            });

            const { optional } = userWord;
            optional.learned = true;
            optional.repeat = '0';

            const wordData: IUserWordNewData = {
              difficulty: 'easy',
              optional,
            };
            await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
          } else {
            const userWord: IUserWordNewData = await this.api.getUserWordById({
              userId: this.userId,
              wordId,
            });

            const { optional } = userWord;
            optional.repeat = repeat;

            const wordData: IUserWordNewData = {
              difficulty: userWord.difficulty,
              optional,
            };
            await this.api.updateUserWord({ userId: this.userId, wordId, wordData });
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

  private updateCurrentStatistics = async (): Promise<void> => {
    if (this.userId) {
      this.userWords = await this.api.getUserWords(this.userId);
      this.difficultWords = await this.api.getDifficultUserWords(this.userId);
    }
    await this.updateGameWords();
    await this.updateCorrectWords();
    await this.updateWrongWords();
    await this.updateRepeates();
  };

  private updateLongTermStatistics = async (): Promise<void> => {
    const currentItem: IDayStatistics = {
      new: this.statistics.totalNew.size,
      correct:
        Object.values(this.statistics.audioChallenge.correct)
          .map(Number)
          .reduce((a, b) => a + b, 0) +
        Object.values(this.statistics.sprint.correct)
          .map(Number)
          .reduce((a, b) => a + b, 0),
      wrong:
        Object.values(this.statistics.audioChallenge.wrong)
          .map(Number)
          .reduce((a, b) => a + b, 0) +
        Object.values(this.statistics.sprint.wrong)
          .map(Number)
          .reduce((a, b) => a + b, 0),
      learned: this.statistics.totalLearned.size,
    };

    this.longTermStatistics[this.statistics.date] = currentItem;
  };

  updateStatistics = async (): Promise<void> => {
    await this.updateCurrentStatistics()
      .then(async () => {
        await this.updateLongTermStatistics();
      })
      .then(async () => {
        if (this.userId) {
          const userStatistics: IUserStatistics = {
            learnedWords: this.learnedWords,
            optional: {
              longTerm: this.longTermStatistics,
            },
          };
          await this.api.updateStatistics(this.userId, userStatistics);
        }
        this.setStatisticsToLS();
      });
  };
}

export default State;
