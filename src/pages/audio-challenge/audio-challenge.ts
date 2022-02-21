/* eslint-disable no-underscore-dangle */
import {
  createAnchorElement,
  createButtonElement,
  createElement,
  createInputElement,
  createSelect,
  playAudio,
  random,
  shuffle,
} from '../../common/utils';
import { NUMBER_OF_PAGES, WORDS_PER_PAGE, NUMBER_OF_GROUPS, BASE_URL } from '../../common/constants';
import { IWord } from '../../common/types';
import svgAudio from './audio';
import ApiPage from '../api-page';

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

  private onceClick: boolean;

  private maxWinstreak: number;

  private winstreak: number;

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
    this.onceClick = true;
    this.winstreak = 0;
    this.maxWinstreak = 0;
  }

  async render(): Promise<void> {
    const state = localStorage.getItem('isTextbook');
    this.contentContainer.innerHTML = '';
    this.contentContainer.classList.add('preloader');
    const audioChallengePage = createElement('div', ['audio-challenge-container']);
    const structurePage = createElement('div', ['audio-challenge-structure']);
    if (state || this.gameWords.length > 0) {
      structurePage.append(await this.createGamePage());
      if (this.audioLink) {
        await playAudio(this.audioLink);
      }
      this.addKeyboardAnswers();
    } else if (this.level) {
      structurePage.append(await this.createGamePage(this.level));
      if (this.audioLink) {
        await playAudio(this.audioLink);
      }
      this.addKeyboardAnswers();
    } else {
      structurePage.append(await this.createRulesPage());
    }
    audioChallengePage.append(structurePage);
    this.contentContainer.append(audioChallengePage);
    this.contentContainer.classList.remove('preloader');
    this.onceClick = true;
  }

  async createGamePage(level?: string): Promise<HTMLElement> {
    if (this.gameWords.length === 0 && !this.page && level) {
      this.page = random(NUMBER_OF_PAGES);
      this.gameWords = await this.getWordsItems(level, String(this.page));
    } else if (this.gameWords.length === 0 && !this.page && !level) {
      this.page = Number(this.textbookPage);
      this.gameWords = await this.getWordsItems(this.textbookGroup, String(this.page));
      if (this.gameWords.length < 20) {
        await this.loaderWords();
      }
      this.gameWords = shuffle(this.gameWords);
      localStorage.removeItem('isTextbook');
    }
    const gamePage = createElement('div', ['audio-game-container']);
    if (this.gameWords.length > 0) {
      this.audioLink = `${BASE_URL}/${this.gameWords[this.currentIndexWord].audio}`;
      this.currentWordRus = this.gameWords[this.currentIndexWord].wordTranslate;
      this.currentWordEn = this.gameWords[this.currentIndexWord].word;
      this.wordImage = this.gameWords[this.currentIndexWord].image;
      const repeatButton = createElement('button', ['box-audio-button']);
      repeatButton.innerHTML = `<img class="repeat-audio-button" src="https://www.svgrepo.com/show/210514/music-player-audio.svg">`;
      repeatButton.onclick = async () => {
        await playAudio(this.audioLink);
      };
      gamePage.append(repeatButton);
      gamePage.append(await this.createAnswersBox(this.currentWordRus));
      const buttonUnknowWord = createElement(
        'button',
        ['answer-button', 'button-unknow-word', 'btn', 'btn-outline-light', 'btn-sg', 'px-3'],
        `Don't know`
      );
      buttonUnknowWord.setAttribute('key', 'Enter');
      buttonUnknowWord.onclick = async () => {
        this.winstreak = 0;
        this.inCorrectAnswers.push(this.currentIndexWord);
        await playAudio(`../../static/audio/bad_answer.mp3`);
        this.createCorrectAnswerPage();
        this.answered(this.currentWordRus);
        this.onceClick = false;
      };
      gamePage.append(buttonUnknowWord);
    } else {
      const title = createElement('h1', ['title-all-words-learned'], 'All words on the current page have been learned');
      gamePage.append(title);
      const closeButton = createElement('button', ['close-popup-button'], 'Сlose game');
      closeButton.onclick = async () => {
        localStorage.removeItem('isTextbook');
        this.level = '';
        this.currentIndexWord = 0;
        this.correctAnswers = [];
        this.inCorrectAnswers = [];
        this.page = false;
        this.gameWords = [];
        await this.render();
      };
      gamePage.append(closeButton);
    }
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
    const buttonChoiseLevel = createElement(
      'button',
      ['choise-audio-level-button', 'btn', 'btn-outline-light'],
      'Start'
    );
    buttonChoiseLevel.setAttribute('disabled', 'true');
    buttonChoiseLevel.onclick = async (): Promise<void> => {
      const select = document.querySelector('.select-audio-rules-page') as HTMLSelectElement;
      this.level = String(Number(select.value) - 1);
      await this.render();
    };
    selectLevel.addEventListener('input', () => {
      buttonChoiseLevel.removeAttribute('disabled');
    });
    controlBoxAudio.append(selectLevel);
    controlBoxAudio.append(buttonChoiseLevel);
    frontContainer.append(controlBoxAudio);
    rulesPage.append(frontContainer);
    return rulesPage;
  }

  createRandomWords = async (): Promise<IWord[]> => {
    const randomPage = `${random(NUMBER_OF_PAGES)}`;
    const randomGroup = `${random(NUMBER_OF_GROUPS - 1)}`;
    const randomWord = await this.getWordsItems(randomGroup, randomPage);
    return randomWord;
  };

  answered(currentWord: string) {
    const buttonUnknowWord = document.querySelector('.next-button-word');
    if (buttonUnknowWord) {
      buttonUnknowWord.setAttribute('disabled', 'true');
    }
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
    const answers: Array<string> = [];
    const randomWords = await this.createRandomWords();
    for (let i = 0; i < 5; i += 1) {
      const randomIndexWord = random(WORDS_PER_PAGE);
      const word = randomWords[randomIndexWord].wordTranslate;
      if (indexCurrentPlace === i) {
        answers.push(currentWord);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (answers.indexOf(word) === -1) {
          answers.push(word);
        } else {
          i -= 1;
        }
      }
    }
    answers.forEach((answer, i) => {
      const answerButton = createElement('button', ['answer-button']);
      answerButton.innerHTML = `<p class="word-text"><span>${i + 1}.</span> ${answer}</p>`;
      answerButton.setAttribute('current-word', answer);
      answerButton.onclick = async () => {
        if (answerButton.getAttribute('current-word') === currentWord) {
          this.winstreak += 1;
          if (this.winstreak > this.maxWinstreak) {
            this.maxWinstreak = this.winstreak;
          }
          await playAudio(`../../static/audio/correct-answer.mp3`);
          this.correctAnswers.push(this.currentIndexWord);
        } else {
          this.winstreak = 0;
          await playAudio(`../../static/audio/bad_answer.mp3`);
          this.inCorrectAnswers.push(this.currentIndexWord);
          answerButton.classList.add('incorect-answer');
        }
        this.createCorrectAnswerPage();
        this.answered(currentWord);
        this.onceClick = false;
      };
      answerButton.setAttribute('key', `Digit${i + 1}`);
      answersBox.append(answerButton);
    });
    return answersBox;
  }

  createCorrectAnswerPage() {
    if (this.onceClick) {
      this.onceClick = false;
      const audioChallengePage = document.querySelector('.audio-challenge-structure') as HTMLElement;
      document?.querySelector('.box-audio-button')?.remove();
      document?.querySelector('.button-unknow-word')?.remove();
      const answersBox = document.querySelector('.answers-box') as HTMLElement;
      const exampleImage = createElement('div', ['example-image']);
      exampleImage.style.backgroundSize = `cover`;
      exampleImage.style.background = `url(${BASE_URL}/${this.wordImage}) no-repeat center`;
      audioChallengePage?.append(exampleImage);
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
        ['button-next-word', 'btn-sg', 'px-3', 'btn', 'btn-outline-light'],
        '→'
      );
      buttonNextWord.onclick = async () => {
        if (this.currentIndexWord < this.gameWords.length) {
          audioChallengePage.innerHTML = '';
          await this.render();
        } else {
          await this.resultWindow();
        }
      };
      audioChallengePage?.append(buttonNextWord);
    }
  }

  addKeyboardAnswers() {
    const digitArr = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Enter'];
    const event = new Event('click');
    window.addEventListener(
      'keydown',
      (e) => {
        const evCode = e.code;
        if (digitArr.indexOf(evCode) === -1) {
          this.addKeyboardAnswers();
        } else {
          const answersButtons = document.querySelectorAll('.answer-button');
          answersButtons.forEach((button) => {
            if (button.getAttribute('key') === evCode) {
              button.dispatchEvent(event);
            }
          });
        }
      },
      { once: true }
    );
  }

  private resultWindow = async (): Promise<void> => {
    await this.state.initStatistics();
    this.state.setMaxWinstreak(this.maxWinstreak);
    this.gameWords.forEach((word) => {
      const wordId = word.id || word._id;
      if (wordId) this.state.setNewWords(wordId);
    });
    const audioChallengePage = document.querySelector('.audio-challenge-container') as HTMLElement;
    audioChallengePage.innerHTML = '';
    const resultWrapper = createElement('div', ['container', 'result-wrapper']);
    const resultHeader = createElement('div', ['result-header']);
    const switchBlock = createInputElement('checkbox', 'switch', '', 'switch-block');
    const switchBlockLabel = createElement('label', ['switch-block-label']);
    switchBlockLabel.innerHTML = `Results Words`;
    switchBlockLabel.setAttribute('for', 'switch');
    switchBlockLabel.onclick = this.resultToggle;
    resultHeader.append(switchBlock, switchBlockLabel);
    const blockWrapper = createElement('div', ['block-wrapper']);
    const resultBlock = createElement('div', ['result-block']);
    const wordsBlock = createElement('div', ['words-block', 'hide']);
    blockWrapper.append(resultBlock, wordsBlock);
    resultBlock.append(this.createResultCircle());
    const rightAnswerCount = createElement('span', ['right-answer-count']);
    const wrongAnswerCount = createElement('span', ['wrong-answer-count']);
    const correctAnswerBlock = createElement('div', ['correct-answer-block']);
    const inCorrectAnswerBlock = createElement('div', ['correct-answer-block']);
    rightAnswerCount.innerHTML = `Right answers: <span>${this.correctAnswers.length}</span>`;
    wrongAnswerCount.innerHTML = `Wrong answers: <span>${this.inCorrectAnswers.length}</span>`;
    correctAnswerBlock.append(rightAnswerCount);
    inCorrectAnswerBlock.append(wrongAnswerCount);
    this.correctAnswers.forEach((e) => {
      const word = this.gameWords[e];
      correctAnswerBlock.append(this.addBoxResults(word));
      const currentWordId = word.id || word._id;
      if (currentWordId) this.state.setCorrectWords(currentWordId);
    });
    this.inCorrectAnswers.forEach((e) => {
      const word = this.gameWords[e];
      inCorrectAnswerBlock.append(this.addBoxResults(word));
      const currentWordId = word.id || word._id;
      if (currentWordId) this.state.setWrongWords(currentWordId);
    });
    const footerBtns = createElement('div', ['footer-btns']);
    const rulesBtn = createButtonElement('button', 'to start', 'btn', 'to-rules-btn', 'disabled');
    const textbookBtn = createAnchorElement('#textbook', 'to textbook', 'btn', 'to-textbook-btn', 'disabled');
    setTimeout(() => {
      rulesBtn.classList.remove('disabled');
      textbookBtn.classList.remove('disabled');
    }, 3000);
    footerBtns.append(rulesBtn, textbookBtn);
    rulesBtn.onclick = async () => {
      localStorage.removeItem('isTextbook');
      this.level = '';
      this.currentIndexWord = 0;
      this.correctAnswers = [];
      this.inCorrectAnswers = [];
      this.page = false;
      this.gameWords = [];
      await this.render();
    };
    wordsBlock.append(correctAnswerBlock, inCorrectAnswerBlock);
    resultWrapper.append(resultHeader, blockWrapper, footerBtns);
    audioChallengePage.append(resultWrapper);
    localStorage.removeItem('isTextbook');
    await this.state.updateStatistics();
  };

  private createResultCircle = (): HTMLElement => {
    const circleWrapper = createElement('div', ['circle-wrapper']);
    const circleContainer = createElement('div', ['circle-container']);
    const circleBody = createElement('div', ['circle-body']);
    const circleCounter = createElement('div', ['circle-counter']);
    const bestStreak = createElement('span', []);
    const winrate = createElement('span', []);
    const winrateNum =
      Math.ceil((this.correctAnswers.length / (this.inCorrectAnswers.length + this.correctAnswers.length)) * 100) || 0;
    const root = <HTMLElement>document.querySelector(':root');
    root.style.setProperty('--height', `${winrateNum}%`);
    winrate.innerHTML = `Winrate: ${winrateNum}%`;
    bestStreak.innerHTML = `Best winstreak: ${this.maxWinstreak}`;
    circleCounter.append(bestStreak, winrate);
    circleBody.append(circleCounter);
    circleContainer.append(circleBody);
    circleWrapper.append(circleContainer);
    return circleWrapper;
  };

  private addBoxResults = (word: IWord): HTMLElement => {
    const boxWordInfo = createElement('div', ['box-word-info']);
    const repeatButton = createElement('button', ['popup-button-repeat']);
    repeatButton.innerHTML = svgAudio;
    const fullAudioLink = `${BASE_URL}/${word.audio}`;
    repeatButton.onclick = async () => {
      await playAudio(fullAudioLink);
    };
    boxWordInfo.append(repeatButton);
    const wordEn = createElement('span', ['popup-english-word']);
    wordEn.innerHTML = `&#160 ${word.word} &#160`;
    const wordRu = createElement('span', ['popup-russian-word']);
    wordRu.innerHTML = `— &#160 ${word.wordTranslate}`;
    boxWordInfo.append(wordEn);
    boxWordInfo.append(wordRu);
    return boxWordInfo;
  };

  private resultToggle = (): void => {
    const resultBlock = <HTMLElement>document.querySelector('.result-block');
    const wordsBlock = <HTMLElement>document.querySelector('.words-block');
    if (resultBlock.classList.contains('hide')) {
      resultBlock.classList.remove('hide');
      resultBlock.classList.add('visible');
      wordsBlock.classList.remove('visible');
      wordsBlock.classList.add('hide');
    } else {
      wordsBlock.classList.remove('hide');
      wordsBlock.classList.add('visible');
      resultBlock.classList.remove('visible');
      resultBlock.classList.add('hide');
    }
  };

  async loaderWords() {
    if (this.page > 0 && typeof this.page === 'number') {
      this.page -= 1;
      const loadWords = await this.getWordsItems(this.textbookGroup, String(this.page));
      this.gameWords = this.gameWords.concat(loadWords);
      if (this.gameWords.length < 20) {
        await this.loaderWords();
      } else if (this.gameWords.length > 20) {
        this.gameWords.splice(20);
      }
    }
  }
}
// window.addEventListener('beforeunload', () => localStorage.removeItem('isTextbook'));
export default AudioChallenge;
