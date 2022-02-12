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
  message: 'string';
  token: 'string';
  refreshToken: 'string';
  userId: 'string';
  name: 'string';
}

export interface IWord {
  id: 'string';
  group: number;
  page: number;
  word: 'string';
  image: 'string';
  audio: 'string';
  audioMeaning: 'string';
  audioExample: 'string';
  textMeaning: 'string';
  textExample: 'string';
  transcription: 'string';
  wordTranslate: 'string';
  textMeaningTranslate: 'string';
  textExampleTranslate: 'string';
}

export interface IUserWord {
  userId: string;
  wordId: string;
}

export type DifficultyType = 'hard' | 'easy';

export interface INewUserWordData {
  wordId?: string;
  difficulty: DifficultyType;
  optional: IOptional;
}

export interface INewUserWord extends IUserWord {
  wordData?: INewUserWordData;
}

export interface IOptional {
  learned?: boolean;
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
}

export type PageNameType = 'textbook' | 'audio-challenge' | 'sprint';

export type FilterType = {
  [key: string]: string | boolean | null;
};

export interface IFilter {
  $and?: FilterType[];
  $or?: FilterType[];
}
