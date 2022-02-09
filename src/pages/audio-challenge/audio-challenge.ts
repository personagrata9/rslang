import { createElement, createSelect, playAudio, random } from '../../common/utils';
import { NUMBER_OF_PAGES, WORDS_PER_PAGE, NUMBER_OF_GROUPS } from '../../common/constants';
import { IWord } from '../../common/types';
// import svgAudio from './audio';
import ApiPage from '../api-page';

class AudioChallenge extends ApiPage {
  private currentIndexWord: number;

  private currentWord: string;

  private page: number | boolean;

  private gameWords: IWord[] | boolean;

  private audioLink: string;

  constructor() {
    super('audio-challenge');
    this.currentIndexWord = 0;
    this.currentWord = '';
    this.page = false;
    this.gameWords = false;
    this.audioLink = '';
  }

  async render(): Promise<void> {
    const state = localStorage.getItem('isTextbook');
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.innerHTML = '';
    const audioChallengePage = createElement('div', ['audio-challenge-container']);
    const structurePage = createElement('div', ['audio-challenge-structure']);
    if (state) {
      if (state === 'textbook') {
        structurePage.append(await this.createGamePage());
      } else {
        structurePage.append(await this.createGamePage(state));
      }
    } else {
      structurePage.append(await this.createRulesPage());
    }
    audioChallengePage.append(structurePage);
    contentContainer.append(audioChallengePage);
  }

  async createGamePage(state?: string): Promise<HTMLElement> {
    if (!this.gameWords && !this.page && state) {
      this.page = random(NUMBER_OF_PAGES);
      this.gameWords = await this.getTextbookWordsItems(state, String(this.page));
    } else if (!this.gameWords && !this.page && !state) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getTextbookWordsItems(this.textbookGroup, String(this.page));
    }
    console.log(this.gameWords);
    const gamePage = createElement('div', ['audio-game-container']);
    const repeatButton = createElement('div', ['box-audio-button']);
    repeatButton.innerHTML = `<img class="repeat-audio-button" src="https://www.svgrepo.com/show/210514/music-player-audio.svg">`;
    if (typeof this.gameWords !== 'boolean') {
      this.audioLink = `http://localhost:3000/${this.gameWords[this.currentIndexWord].audio}`;
      this.currentWord = this.gameWords[this.currentIndexWord].wordTranslate;
      // console.log(this.currentWord);
      // this.currentIndexWord += 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    repeatButton.addEventListener('click', async () => playAudio(this.audioLink));
    gamePage.append(repeatButton);
    gamePage.append(await this.createAnswersBox(this.currentWord));
    const buttonNextWord = createElement(
      'button',
      ['next-button-word', 'btn', 'btn-outline-light', 'btn-sg', 'px-3'],
      `Don't know`
    );
    gamePage.append(buttonNextWord);
    localStorage.setItem('isTextbook', '');
    return gamePage;
  }

  async createRulesPage(): Promise<HTMLElement> {
    const listClass = 'list-rules-item';
    const rulesPage = createElement('div', ['audio-rules-container']);
    rulesPage.append(createElement('div', ['audio-rules-container-back']));
    const frontContainer = createElement('div', ['audio-rules-container-front']);
    frontContainer.append(createElement('h2', ['audio-rules-title'], 'Audio Challenge'));
    frontContainer.append(
      createElement('p', ['audio-rules-text'], `"Audio Challenge" is a workout that improves listening comprehension.`)
    );
    const ulRules = createElement('ul', ['list-rules']);
    ulRules.append(createElement('li', [listClass], 'Use the mouse to select.'));
    ulRules.append(createElement('li', [listClass], 'Use number keys from 1 to 5 to select an answer'));
    ulRules.append(createElement('li', [listClass], 'Use the mouse to select.'));
    ulRules.append(createElement('li', [listClass], `Use a "space" to repeat a word`));
    ulRules.append(createElement('li', [listClass], `Use the "Enter" key for a hint or to move to the next word`));
    frontContainer.append(ulRules);
    const controlBoxAudio = createElement('div', ['control-box-audio-page']);
    const selectLevel = createSelect(['1', '2', '3', '4', '5', '6']);
    controlBoxAudio.append(selectLevel);
    const buttonChoiseLevel = createElement(
      'button',
      ['choise-audio-level-button', 'btn', 'btn-outline-light'],
      'Start'
    );
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    buttonChoiseLevel.addEventListener('click', async (): Promise<void> => {
      const select = document.querySelector('.select-audio-rules-page') as HTMLSelectElement;
      const level = select.value;
      localStorage.setItem('isTextbook', `${level}`);
      await this.render();
    });
    controlBoxAudio.append(buttonChoiseLevel);
    frontContainer.append(controlBoxAudio);
    rulesPage.append(frontContainer);
    return rulesPage;
  }

  createRandomWord = async (): Promise<string> => {
    const randomPage = `${random(NUMBER_OF_PAGES)}`;
    const randomGroup = `${random(NUMBER_OF_GROUPS - 1)}`;
    const randomIndexWord = random(WORDS_PER_PAGE);
    console.log(randomPage, randomGroup, NUMBER_OF_GROUPS - 1);
    const randomWord = await this.getTextbookWordsItems(randomGroup, randomPage);
    return randomWord[randomIndexWord].wordTranslate;
  };

  async createAnswersBox(currentWord: string): Promise<HTMLElement> {
    const answersBox = createElement('div', ['answers-box']);
    const indexCurrentPlace = random(5);
    for (let i = 0; i < 5; i += 1) {
      const answerBox = createElement('div', ['answer-box']);
      answerBox.addEventListener('click', () => {
        if (answerBox.getAttribute('current-word') === currentWord) {
          console.log(currentWord);
        } else {
          console.log('x');
        }
      });
      if (indexCurrentPlace === i) {
        answerBox.setAttribute('current-word', currentWord);
        answerBox.innerHTML = `<div class="back-answer-box"></div><p class="word-text">${currentWord}</p>`;
      } else {
        const randomWord = this.createRandomWord();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        randomWord.then((res): void => {
          answerBox.innerHTML = `<div class="back-answer-box"></div><p class="word-text">${res}</p>`;
        });
      }
      answersBox.append(answerBox);
    }
    return answersBox;
  }
}
export default AudioChallenge;
