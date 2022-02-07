import Api from '../api/api';
import { IWord, PageNameType } from '../common/types';

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected api: Api;

  constructor(protected readonly name: PageNameType) {
    this.name = 'textbook';
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.api = new Api();
  }

  protected getTextbookWordsItems = async (): Promise<IWord[]> => {
    const words: IWord[] = [];

    await this.api
      .getWords(this.textbookGroup, this.textbookPage)
      .then((results) => results.forEach((result: IWord) => words.push(result)));

    return words;
  };
}

export default ApiPage;
