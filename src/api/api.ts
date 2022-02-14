import { BASE_URL } from '../common/constants';
import {
  IFilter,
  INewUser,
  IUserNewWord,
  IUserWordNewData,
  ISignUser,
  ISignUserData,
  IStatistics,
  IUser,
  IUserWord,
  IUserWordData,
  IWord,
  Methods,
  IAggregatedResult,
  IAggregatedFilter,
} from '../common/types';

class Api {
  private readonly url: string;

  public token: string;

  constructor() {
    this.url = BASE_URL;
    this.token = localStorage.getItem('UserToken') || '';
  }

  getWords = async (group: string, page: string): Promise<IWord[]> => {
    const res = await fetch(`${this.url}/words?group=${group}&page=${page}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  getWordById = async (wordId: string): Promise<IWord> => {
    const res = await fetch(`${this.url}/words/${wordId}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  loginUser = async (user: ISignUser): Promise<ISignUserData> => {
    const res = await fetch(`${this.url}/signin`, {
      method: Methods.Post,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await res.json().then((result: ISignUserData) => result);
    localStorage.setItem('UserToken', data.token);
    localStorage.setItem('UserId', data.userId);
    localStorage.setItem('UserName', data.name);
    return data;
  };

  createUser = async (user: INewUser): Promise<IUser> => {
    const res = await fetch(`${this.url}/users`, {
      method: Methods.Post,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return res.json().then();
  };

  getUser = async (id: string): Promise<IUser> => {
    const res = await fetch(`${this.url}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res.json().then();
  };

  deleteUser = async (id: string): Promise<void> => {
    await fetch(`${this.url}/users/${id}`, {
      method: Methods.Delete,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  };

  refreshUserToken = async (id: string): Promise<ISignUserData> => {
    const res = await fetch(`${this.url}/users/${id}/tokens`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  getUserWords = async (userId: string): Promise<IUserWordData[]> => {
    const res = await fetch(`${this.url}/users/${userId}/words`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  createUserWord = async ({ userId, wordId, wordData }: IUserNewWord): Promise<void> => {
    await fetch(`${this.url}/users/${userId}/words/${wordId}`, {
      method: Methods.Post,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    });
  };

  getUserWordById = async ({ userId, wordId }: IUserWord): Promise<IUserWordNewData> => {
    const res = await fetch(`${this.url}/users/${userId}/words/${wordId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  updateUserWord = async ({ userId, wordId, wordData }: IUserNewWord): Promise<void> => {
    await fetch(`${this.url}/users/${userId}/words/${wordId}`, {
      method: Methods.Put,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    });
  };

  delUserWordById = async ({ userId, wordId }: IUserWord): Promise<void> => {
    await fetch(`${this.url}/users/${userId}/words/${wordId}`, {
      method: Methods.Delete,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
  };

  getStatistics = async (userId: string): Promise<IStatistics> => {
    const res = await fetch(`${this.url}/users/${userId}/statistics`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };

  updateStatistics = async (userId: string, options: IStatistics): Promise<void> => {
    await fetch(`${this.url}/users/${userId}/statistics`, {
      method: Methods.Put,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
  };

  getUserAggregatedWords = async (
    userId: string,
    group: string,
    page: string,
    wordsPerPage: string,
    filter: IFilter | IAggregatedFilter
  ): Promise<IAggregatedResult[]> => {
    const res = await fetch(
      `${
        this.url
      }/users/${userId}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${JSON.stringify(
        filter
      )}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      }
    );
    return res.json().then();
  };

  getUserAggregetedWord = async ({ userId, wordId }: IUserWord): Promise<IWord> => {
    const res = await fetch(`${this.url}/users/${userId}/aggregatedWords/${wordId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    return res.json().then();
  };
}

export default Api;
