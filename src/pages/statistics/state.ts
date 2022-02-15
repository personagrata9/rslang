import { IGameStatistics, IGameStatisticsStr, IGameStatisticsTotal } from '../../common/types';
import { mapFromString } from '../../common/utils';

export const stringifyGameStatistics = (obj: IGameStatistics): string => {
  const stringifiedValues: IGameStatisticsStr = {
    newWords: Array.from(obj.newWords).toString(),
    correct: Array.from(obj.correct.entries()).toString(),
    wrong: Array.from(obj.wrong.entries()).toString(),
    bestSeries: obj.bestSeries.toString(),
  };
  return JSON.stringify(stringifiedValues);
};

export const stringifyGameStatisticsTotal = (obj: IGameStatisticsTotal): string => {
  const stringifiedValues: IGameStatisticsStr = {
    date: obj.date.toString(),
    totalNewWords: Array.from(obj.totalNewWords).toString(),
    totalCorrect: Array.from(obj.totalCorrect.entries()).toString(),
    totalWrong: Array.from(obj.totalWrong.entries()).toString(),
    totalLearnedWords: Array.from(obj.totalLearnedWords).toString(),
    audioChallenge: stringifyGameStatistics(obj.audioChallenge),
    sprint: stringifyGameStatistics(obj.sprint),
  };
  return JSON.stringify(stringifiedValues);
};

export const getParsedGameStatistics = (storage: string): IGameStatistics => {
  const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

  return {
    newWords: new Set(parsedStorage.newWords.split(',')),
    correct: mapFromString(parsedStorage.correct),
    wrong: mapFromString(parsedStorage.wrong),
    bestSeries: +parsedStorage.bestSeries,
  };
};

export const getParsedGameStatisticsTotal = (storage: string): IGameStatisticsTotal => {
  const parsedStorage = JSON.parse(storage) as IGameStatisticsStr;

  return {
    date: parsedStorage.date,
    totalNewWords: new Set(parsedStorage.totalNewWords.split(',')),
    totalCorrect: mapFromString(parsedStorage.totalCorrect),
    totalWrong: mapFromString(parsedStorage.totalWrong),
    totalLearnedWords: new Set(parsedStorage.totalLearnedWords.split(',')),
    audioChallenge: getParsedGameStatistics(parsedStorage.audioChallenge),
    sprint: getParsedGameStatistics(parsedStorage.sprint),
  };
};
