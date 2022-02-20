import { IGameStatistics, IGameStatisticsTotal, StringObjectType } from '../common/types';

export const setFromString = (value: string): Set<string> => {
  if (value.length) {
    const arr = value.split(',');
    return new Set(arr);
  }
  return new Set([]);
};

export const convertDate = (date: Date): string =>
  `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;

export const stringifyGameStatistics = (obj: IGameStatistics): string => {
  const stringifiedValues: StringObjectType = {
    new: Array.from(obj.new).toString(),
    correct: JSON.stringify(obj.correct),
    wrong: JSON.stringify(obj.wrong),
    bestSeries: obj.bestSeries.toString(),
  };
  return JSON.stringify(stringifiedValues);
};

export const stringifyTotalStatistics = (obj: IGameStatisticsTotal): string => {
  const stringifiedValues: StringObjectType = {
    date: obj.date.toString(),
    totalGameWords: Array.from(obj.totalGameWords).toString(),
    totalNew: Array.from(obj.totalNew).toString(),
    totalCorrect: JSON.stringify(obj.totalCorrect),
    totalWrong: JSON.stringify(obj.totalWrong),
    totalLearned: Array.from(obj.totalLearned).toString(),
    totalRepeats: JSON.stringify(obj.totalRepeats),
    audioChallenge: stringifyGameStatistics(obj.audioChallenge),
    sprint: stringifyGameStatistics(obj.sprint),
  };
  return JSON.stringify(stringifiedValues);
};

export const parseGameStatistics = (storage: string): IGameStatistics => {
  const parsedStorage = JSON.parse(storage) as StringObjectType;

  return {
    new: setFromString(parsedStorage.new),
    correct: JSON.parse(parsedStorage.correct) as StringObjectType,
    wrong: JSON.parse(parsedStorage.wrong) as StringObjectType,
    bestSeries: +parsedStorage.bestSeries,
  };
};

export const parseTotalStatistics = (storage: string): IGameStatisticsTotal => {
  const parsedStorage = JSON.parse(storage) as StringObjectType;

  return {
    date: parsedStorage.date,
    totalGameWords: setFromString(parsedStorage.totalGameWords),
    totalNew: setFromString(parsedStorage.totalNew),
    totalCorrect: JSON.parse(parsedStorage.totalCorrect) as StringObjectType,
    totalWrong: JSON.parse(parsedStorage.totalWrong) as StringObjectType,
    totalLearned: setFromString(parsedStorage.totalLearned),
    totalRepeats: JSON.parse(parsedStorage.totalRepeats) as StringObjectType,
    audioChallenge: parseGameStatistics(parsedStorage.audioChallenge),
    sprint: parseGameStatistics(parsedStorage.sprint),
  };
};
