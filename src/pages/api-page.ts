import Api from '../api/api';
import { IWord, PageNameType } from '../common/types';

abstract class ApiPage {
  protected contentContainer = <HTMLDivElement>document.querySelector('.content-container');

  protected textbookGroup: string;

  protected textbookPage: string;

  protected api: Api;

  constructor(protected readonly name: PageNameType) {
    this.name = name;
    this.textbookGroup = localStorage.getItem('group') || '0';
    this.textbookPage = localStorage.getItem('page') || '0';
    this.api = new Api();
  }

  protected getTextbookWordsItems = async (group?: string, page?: string): Promise<IWord[]> => {
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
