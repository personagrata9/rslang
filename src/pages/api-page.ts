import Api from '../api/api';
import { IWord, PageNameType } from '../common/types';

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected lastPage: string;

  protected api: Api;

  constructor(protected readonly name: PageNameType) {
    this.name = name;
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.lastPage = localStorage.getItem('lastPage') || '';
    this.api = new Api();
  }

  protected getTextbookWordsItems = async (): Promise<IWord[]> => {
    const words: IWord[] = [];

    await this.api
      .getWords(this.textbookGroup, this.textbookPage)
      .then((results) => results.forEach((result: IWord) => words.push(result)));

    return words;
  };

  protected getWordsItems = async (group?: string, page?: string): Promise<IWord[]> => {
    const words: IWord[] = [];

    if (!group || !page) {
      await this.api
        .getWords(this.textbookGroup, this.textbookPage)
        .then((results) => results.forEach((result: IWord) => words.push(result)));
    } else {
      await this.api.getWords(group, page).then((results) => results.forEach((result: IWord) => words.push(result)));
    }
    return words;
  };
}

export default ApiPage;
