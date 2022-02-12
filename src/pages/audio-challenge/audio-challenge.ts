import { createElement, createSelect, playAudio, random } from '../../common/utils';
import { NUMBER_OF_PAGES, WORDS_PER_PAGE, NUMBER_OF_GROUPS } from '../../common/constants';
import { IWord } from '../../common/types';
import svgAudio from './audio';
import ApiPage from '../api-page';

function addBoxResults(word: string, translate: string, audioLink: string) {
  const boxWordInfo = createElement('div', ['box-word-info']);
  const repeatButton = createElement('button', ['popup-button-repeat']);
  repeatButton.innerHTML = svgAudio;
  const fullAudioLink = `http://localhost:3000/${audioLink}`;
  repeatButton.onclick = () => playAudio(fullAudioLink);
  boxWordInfo.append(repeatButton);
  const wordEn = createElement('span', ['popup-english-word']);
  wordEn.innerHTML = `&#160 ${word} &#160`;
  const wordRu = createElement('span', ['popup-russian-word']);
  wordRu.innerHTML = `— &#160 ${translate}`;
  boxWordInfo.append(wordEn);
  boxWordInfo.append(wordRu);
  return boxWordInfo;
}
class AudioChallenge extends ApiPage {
  private currentIndexWord: number;

  private level: string;

  private currentWordRus: string;

  private currentWordEn: string;

  private page: number | boolean;

  private gameWords: IWord[];

  private audioLink: string;

  private correctAnswers: Array<number>;

  private inCorrectAnswers: Array<number>;

  private wordImage: string;

  constructor() {
    super('audio-challenge');
    this.currentIndexWord = 0;
    this.currentWordRus = '';
    this.currentWordEn = '';
    this.page = false;
    this.gameWords = [];
    this.audioLink = '';
    this.level = '';
    this.wordImage = '';
    this.correctAnswers = [];
    this.inCorrectAnswers = [];
  }

  async render(): Promise<void> {
    const state = localStorage.getItem('isTextbook');
    const contentContainer = <HTMLDivElement>document.querySelector('.content-container');
    contentContainer.innerHTML = '';
    const audioChallengePage = createElement('div', ['audio-challenge-container']);
    const structurePage = createElement('div', ['audio-challenge-structure']);
    if (state) {
      if (state === 'Textbook') {
        structurePage.append(await this.createGamePage());
      } else {
        this.level = state;
        structurePage.append(await this.createGamePage(state));
      }
      await playAudio(this.audioLink);
    } else {
      structurePage.append(await this.createRulesPage());
    }
    audioChallengePage.append(structurePage);
    contentContainer.append(audioChallengePage);
    this.addKeyboardAnswers();
  }

  async createGamePage(state?: string): Promise<HTMLElement> {
    if (this.gameWords.length === 0 && !this.page && state) {
      this.page = random(NUMBER_OF_PAGES);
      this.gameWords = await this.getWordsItems(state, String(this.page));
    } else if (this.gameWords.length === 0 && !this.page && !state) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getWordsItems(this.textbookGroup, String(this.page));
    }
    const gamePage = createElement('div', ['audio-game-container']);
    if (typeof this.gameWords !== 'boolean') {
      this.audioLink = `http://localhost:3000/${this.gameWords[this.currentIndexWord].audio}`;
      this.currentWordRus = this.gameWords[this.currentIndexWord].wordTranslate;
      this.currentWordEn = this.gameWords[this.currentIndexWord].word;
      this.wordImage = this.gameWords[this.currentIndexWord].image;
    }
    const repeatButton = createElement('button', ['box-audio-button']);
    repeatButton.innerHTML = `<img class="repeat-audio-button" src="https://www.svgrepo.com/show/210514/music-player-audio.svg">`;
    repeatButton.onclick = async () => {
      await playAudio(this.audioLink);
    };
    gamePage.append(repeatButton);
    gamePage.append(await this.createAnswersBox(this.currentWordRus));
    const buttonUnknowWord = createElement(
      'button',
      ['next-button-word', 'btn', 'btn-outline-light', 'btn-sg', 'px-3'],
      `Don't know`
    );
    buttonUnknowWord.onclick = async () => {
      this.inCorrectAnswers.push(this.currentIndexWord);
      await playAudio(`../../static/audio/bad_answer.mp3`);
      this.answered(this.currentWordRus);
      this.createCorrectAnswerPage();
    };
    gamePage.append(buttonUnknowWord);
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
    buttonChoiseLevel.onclick = async (): Promise<void> => {
      const select = document.querySelector('.select-audio-rules-page') as HTMLSelectElement;
      this.level = String(Number(select.value) - 1);
      localStorage.setItem('isTextbook', `${this.level}`);
      await this.render();
    };
    controlBoxAudio.append(buttonChoiseLevel);
    frontContainer.append(controlBoxAudio);
    rulesPage.append(frontContainer);
    return rulesPage;
  }

  createRandomWord = async (): Promise<string> => {
    const randomPage = `${random(NUMBER_OF_PAGES)}`;
    const randomGroup = `${random(NUMBER_OF_GROUPS - 1)}`;
    const randomIndexWord = random(WORDS_PER_PAGE);
    const randomWord = await this.getWordsItems(randomGroup, randomPage);
    return randomWord[randomIndexWord].wordTranslate;
  };

  answered(currentWord: string) {
    const buttons = document.querySelectorAll('.answer-button');
    buttons.forEach((button) => {
      button.setAttribute('disabled', 'true');
      if (button.getAttribute('current-word') === currentWord) {
        button.classList.add('correct-answer');
      } else {
        button.classList.add('answered');
      }
    });
    this.currentIndexWord += 1;
  }

  async createAnswersBox(currentWord: string): Promise<HTMLElement> {
    const answersBox = createElement('div', ['answers-box']);
    const indexCurrentPlace = random(5);
    for (let i = 0; i < 5; i += 1) {
      const answerButton = createElement('button', ['answer-button']);
      if (indexCurrentPlace === i) {
        answerButton.setAttribute('current-word', currentWord);
        answerButton.innerHTML = `<p class="word-text">${currentWord}</p>`;
      } else {
        const randomWord = this.createRandomWord();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        randomWord.then((res): void => {
          answerButton.innerHTML = `<p class="word-text">${res}</p>`;
        });
      }
      answerButton.onclick = async () => {
        if (answerButton.getAttribute('current-word') === currentWord) {
          await playAudio(`../../static/audio/correct-answer.mp3`);
          this.correctAnswers.push(this.currentIndexWord);
        } else {
          await playAudio(`../../static/audio/bad_answer.mp3`);
          this.inCorrectAnswers.push(this.currentIndexWord);
          answerButton.classList.add('incorect-answer');
        }
        this.createCorrectAnswerPage();
        localStorage.setItem('isTextbook', `${this.level}`);
        this.answered(currentWord);
      };
      answerButton.setAttribute('key', `Digit${i + 1}`);
      answersBox.append(answerButton);
    }
    return answersBox;
  }

  createCorrectAnswerPage() {
    const audioChallengePage = document.querySelector('.audio-challenge-structure') as HTMLElement;
    document?.querySelector('.box-audio-button')?.remove();
    document?.querySelector('.next-button-word')?.remove();
    const answersBox = document.querySelector('.answers-box') as HTMLElement;
    const exampleBoxImage = createElement('div', ['example-image-box']);
    const exampleImage = createElement('img', ['example-image']);
    exampleImage.setAttribute('src', `http://localhost:3000/${this.wordImage}`);
    exampleBoxImage.append(exampleImage);
    audioChallengePage?.append(exampleBoxImage);
    const containerInfo = createElement('div', ['container-info-correct-word']);
    const repeatButton = createElement('div', ['box-audio-button-small']);
    repeatButton.innerHTML = `<img class="repeat-audio-button-small" src="https://www.svgrepo.com/show/210514/music-player-audio.svg">`;
    repeatButton.onclick = async () => playAudio(this.audioLink);
    containerInfo.append(repeatButton);
    const wordContainer = createElement('p', ['correct-word-container'], `${this.currentWordEn}`);
    containerInfo.append(wordContainer);
    audioChallengePage?.append(containerInfo);
    containerInfo.after(answersBox);
    const buttonNextWord = createElement(
      'button',
      ['button-nex-word', 'btn-sg', 'px-3', 'btn', 'btn-outline-light'],
      '→'
    );
    buttonNextWord.onclick = async () => {
      if (this.currentIndexWord < this.gameWords.length) {
        audioChallengePage.innerHTML = '';
        await this.render();
      } else {
        this.openResultPage();
      }
    };
    audioChallengePage?.append(buttonNextWord);
  }

  addKeyboardAnswers() {
    const event = new Event('click');
    window.addEventListener(
      'keydown',
      (e) => {
        const evCode = e.code;
        const answersButtons = document.querySelectorAll('.answer-button');
        answersButtons.forEach((button) => {
          if (button.getAttribute('key') === evCode) {
            button.dispatchEvent(event);
          }
        });
      },
      { once: true }
    );
  }

  openResultPage() {
    const audioChallengeContainer = document.querySelector('.audio-challenge-container');
    if (audioChallengeContainer) {
      audioChallengeContainer.innerHTML = '';
      const popupResults = createElement('div', ['popup-results']);
      const countIncorectAnswers = `<span class="incorrect-counter">${this.inCorrectAnswers.length}</span>`;
      const incorectAnswers = createElement('p', ['popup-incorrect']);
      incorectAnswers.innerHTML = `Errors ${countIncorectAnswers}`;
      popupResults.append(incorectAnswers);
      this.inCorrectAnswers.forEach((el) => {
        const currentWordEn = this.gameWords[el].word;
        const currentAudio = this.gameWords[el].audio;
        const currentWordRu = this.gameWords[el].wordTranslate;
        popupResults.append(addBoxResults(currentWordEn, currentWordRu, currentAudio));
      });
      const correctAnswers = createElement('p', ['popup-correct']);
      const countCorrectAnswers = `<span class="correct-counter">${this.correctAnswers.length}</span>`;
      correctAnswers.innerHTML = `Know ${countCorrectAnswers}`;
      popupResults.append(correctAnswers);
      this.correctAnswers.forEach((el) => {
        const currentWordEn = this.gameWords[el].word;
        const currentAudio = this.gameWords[el].audio;
        const currentWordRu = this.gameWords[el].wordTranslate;
        popupResults.append(addBoxResults(currentWordEn, currentWordRu, currentAudio));
      });
      const closeButton = createElement('button', ['close-popup-button'], 'Сlose game');
      closeButton.onclick = async () => {
        localStorage.removeItem('isTextbook');
        await this.render();
      };
      popupResults.append(closeButton);
      audioChallengeContainer.append(popupResults);
    }
    this.currentIndexWord = 0;
  }
}
export default AudioChallenge;
