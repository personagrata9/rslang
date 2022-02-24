export interface ISignUser {
  email: string;
  password: string;
}

export interface INewUser extends ISignUser {
  name: string;
}

export interface IUser extends ISignUser {
  id: string;
}

export interface ISignUserData {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  _id?: string;
  userWord?: IUserWordNewData;
}

export interface IUserWord {
  userId: string;
  wordId: string;
}

export type DifficultyType = 'hard' | 'easy';

export interface IUserWordNewData {
  difficulty: DifficultyType;
  optional: IOptional;
}

export interface IUserWordData extends IUserWordNewData {
  wordId: string;
}

export interface IUserNewWord extends IUserWord {
  wordData: IUserWordNewData;
}

export interface IOptional {
  learned?: boolean;
  repeat?: number;
}

export interface IStatistics {
  id?: string;
  learnedWords: string;
  optional?: IOptional;
}

export enum Methods {
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum Colors {
  TurquoiseDark = '#005365',
  Turquoise = '#44929f',
  TurquoiseLight = '#c8e8ed',
  GrayDark = '#949597',
  Gray = '#c1bdb4',
  GrayLight = '#e2e2e2',
  YellowDark = '#c29400',
  Yellow = '#ebd567',
  YellowLight = '#fbf0a7',
  Orange = '#e17719',
  White = '#ffffff',
  Black = '#000000',
  Green = '#61b6aa',
}

export type ApiPageNameType = 'textbook' | 'audio-challenge' | 'sprint';

export type FilterType = {
  userWord?: null;
  'userWord.difficulty'?: DifficultyType;
  'userWord.optional'?: IOptional | null;
  'userWord.optional.learned'?: boolean;
};

export interface IFilter {
  $and?: FilterType[];
  $or?: FilterType[];
}

export interface IAggregatedFilter {
  $or: [IFilter, FilterType];
}

type TotalCountType = {
  count: number;
};

export interface IAggregatedResult {
  paginatedResults: IWord[];
  totalCount: TotalCountType[];
}

export interface IGameStatistics {
  new: Set<string>;
  correct: StringObjectType;
  wrong: StringObjectType;
  bestSeries: number;
}

export interface IGameStatisticsTotal {
  date: string;
  totalGameWords: Set<string>;
  totalNew: Set<string>;
  totalCorrect: StringObjectType;
  totalWrong: StringObjectType;
  totalLearned: Set<string>;
  totalRepeats: StringObjectType;
  audioChallenge: IGameStatistics;
  sprint: IGameStatistics;
}

export type StringObjectType = {
  [key: string]: string;
};

export interface ILongTermStatisticsItem {
  newPerDay: number;
  correctPerDay: number;
  wrongPerDay: number;
  learnedPerDay: number;
}

export interface ILongTermStatistics {
  [key: string]: ILongTermStatisticsItem;
}
